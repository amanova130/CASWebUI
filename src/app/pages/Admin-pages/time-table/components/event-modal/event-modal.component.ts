import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent } from 'calendar-utils';
import { add, addDays, endOfDay, startOfDay } from 'date-fns';
import { TimeTableComponent } from '../../time-table.component';
import { Schedule } from 'src/services/models/event';
import { EMPTY, Subject, Subscription, timer } from 'rxjs';
import { ScheduleService } from 'src/services/WebApiService/schedule.service';
import { TimeTable } from 'src/services/models/timeTable';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { Course } from 'src/services/models/course';
import { Group } from 'src/services/models/group';
import { Teacher } from 'src/services/models/teacher';
import { TeacherService } from 'src/services/WebApiService/teacher.service';
import { switchMap } from 'rxjs/operators';
import RRule from 'rrule';

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.scss']
})
export class EventModalComponent implements OnInit {
public startDateString:string;
public endDateString:string;
public chosenTeacher:Teacher={
  Id:""
};
public lastDateString:string;
public date:string;
@Input()
public isAddMode:boolean
@Input()
 public viewDate: Date;
 @ViewChild('form') form!: any;


 teacherListSubcription!:Subscription;
 
 @Output() 
 passEntry: EventEmitter<any> = new EventEmitter();

@Input()
 public timeTable:TimeTable;
@Input()
public recurringEvent:Schedule;
@Input()
public event:Schedule={
  Title: "",
  Start:new Date(),
  End:new Date(),
  Color:{
    primary:"#ad2121",
    secondary:"#ad2121"
  },
  LastDate:new Date(),
  rrule: {
    freq: RRule.WEEKLY,
    byweekday: new Date().getDay(),
},
};
@Input()
public eventToEdit:Schedule;
@Input()
public group:Group;
public chosenCourse:string;
public loading=false;
public teachersList:Teacher[];
@Input()
public courses:string[];

refresh: Subject<any> = new Subject();
  
  constructor(      
    public activeModal: NgbActiveModal,
    private modalService:NgbModal,
    public datepipe: DatePipe,
    private scheduleService:ScheduleService,
    private alertService:AlertService,
    private teacherService:TeacherService
    
    ) { }

ngOnInit(): void {

if(this.isAddMode)
{
    this.event.Title="";
    this.event.Start=new Date(this.viewDate);
    this.event.End=new Date(this.viewDate);
    this.event.Color.primary="#ad2121";
    this.event.Color.secondary="#ad2121";
    this.date=this.datepipe.transform(this.viewDate,'yyyy-MM-dd');
    this.startDateString=this.datepipe.transform(this.viewDate, 'HH:mm');
    this.endDateString=this.datepipe.transform(this.viewDate, 'HH:mm');
    this.lastDateString=this.datepipe.transform(addDays(this.viewDate,1), 'yyyy-MM-ddTHH:mm');
    

}
else
{
  this.event.Title=this.eventToEdit.Title;
  this.event.Start=this.eventToEdit.Start;
  this.event.End=this.eventToEdit.End;
  this.chosenTeacher=this.eventToEdit.Teacher
  this.event.Color.primary=this.eventToEdit.Color.primary;
  this.event.Color.secondary=this.eventToEdit.Color.secondary;
  this.date=this.datepipe.transform(this.viewDate,'yyyy-MM-dd');
  this.startDateString=this.datepipe.transform(this.eventToEdit.Start, 'HH:mm');
  this.endDateString=this.datepipe.transform(this.eventToEdit.End, 'HH:mm');
  this.lastDateString=this.datepipe.transform(this.eventToEdit.LastDate, 'yyyy-MM-ddTHH:mm');
  this.choosenCourse(this.eventToEdit.Title);
  for(let course of this.courses)
  {
    if(course === this.eventToEdit.Title)
    {
    this.chosenCourse=course;
    break;
    }
  }

}
   
   }
     
  onSubmit() {
    if(this.form.valid)
    {
     this.loading = true;
      this.event.Start.setHours(Number(this.startDateString.split(':')[0]));
      this.event.Start.setMinutes(Number(this.startDateString.split(':')[1]));
      this.event.End.setHours(Number(this.endDateString.split(':')[0]));
      this.event.End.setMinutes(Number(this.endDateString.split(':')[1]));
      this.event.LastDate=new Date(this.lastDateString);
      this.event.Title=this.chosenCourse;
      this.event.Teacher=this.chosenTeacher;
      if(this.isAddMode)
      {
        this.recurringEvent={
          Start:new Date(this.event.Start),
          End:new Date(this.event.End),
          Title:this.event.Title,
          LastDate:new Date(this.event.LastDate),
          Color:{
            primary:this.event.Color.primary,
            secondary:this.event.Color.primary
          },
          rrule: {
            freq: RRule.WEEKLY,
            byweekday: this.event.Start.getDay(),
        },
        Teacher:this.event.Teacher


        }
      this.scheduleService.addEventToSchedule(this.recurringEvent,this.timeTable.CalendarName)
      .subscribe(result => {
        this.recurringEvent.EventId=result.EventId;
          console.log(result);
          this.activeModal.close(this.recurringEvent);

            
      }).add(() => this.loading = false);
    }
    else
    {
      this.event.EventId=this.eventToEdit.EventId;
      this.event.rrule.byweekday=new Date(this.event.Start).getDay(),
      this.eventToEdit=this.event;
      this.scheduleService.editEvent(this.eventToEdit,this.timeTable.CalendarName)
      .subscribe(result => {
        if(result)
        {
          console.log(result);
          this.activeModal.close(this.eventToEdit);
        }
    }).add(() => this.loading = false);
  }
}
}

choosenCourse(event: string)
{
this.event.Title=event;
this.teacherListSubcription = timer(0).pipe(switchMap(()=> this.teacherService.getTeachersByCourseName(this.chosenCourse))).subscribe((list: Teacher[])=>
{
this.teachersList = list;
console.log(this.teachersList);
});

}
choosenTeacher(event:string)
{
  if(event != undefined)
  {
  for(let teacher of this.teachersList)
  {
    if(teacher.Id === event){
      this.chosenTeacher=teacher;
      break;
    }
  }
}
}



}