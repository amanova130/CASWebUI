import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent } from 'calendar-utils';
import { add, addDays, endOfDay, startOfDay } from 'date-fns';
import { TimeTableComponent } from '../../time-table.component';
import { Schedule } from 'src/services/models/event';
import { EMPTY, Subject, Subscription, timer } from 'rxjs';
import { ScheduleService } from 'src/services/WebApiService/schedule.service';
import { TimeTable } from 'src/services/models/timeTable';
import { AlertService } from 'src/services/helperServices/alert.service';
import { Course } from 'src/services/models/course';
import { Group } from 'src/services/models/group';
import { Teacher } from 'src/services/models/teacher';
import { TeacherService } from 'src/services/WebApiService/teacher.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.scss']
})
export class EventModalComponent implements OnInit {
public startDateString:string;
public endDateString:string;
public chosenTeacher:Teacher;
public lastDateString:string;
public color:Date;
@Input()
public isAddMode:boolean
@Input()
 public viewDate: Date;
 public event: Schedule={
   Start:new Date(),
   End:new Date(),
   Title:"",
   LastDate:new Date(),
   Color:{
     primary:"",
     secondary:""
   }

 };

 teacherListSubcription!:Subscription;
 
 @Output() 
 passEntry: EventEmitter<any> = new EventEmitter();

@Input()
 public timeTable:TimeTable;
@Input()
public recurringEvent:Schedule;
@Input()
public eventToEdit:CalendarEvent;
@Input()
public group:Group;
public chosenCourse:string;
public teachersList:Teacher[];
@Input()
public courses:Course[];

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

    this.recurringEvent.Title="";
    this.recurringEvent.Start=this.viewDate;
    this.recurringEvent.End=this.viewDate;
    this.recurringEvent.Color.primary="#ad2121";
    this.recurringEvent.Color.secondary="#ad2121";
    this.startDateString=this.datepipe.transform(this.viewDate, 'yyyy-MM-ddThh:mm');
    this.endDateString=this.datepipe.transform(this.viewDate, 'yyyy-MM-ddThh:mm');
    this.lastDateString=this.datepipe.transform(addDays(this.viewDate,1), 'yyyy-MM-ddTHH:mm');

   }
     
  onSubmit() {
      this.recurringEvent.Start=new Date(this.startDateString);
      this.recurringEvent.End=new Date(this.endDateString);
      this.recurringEvent.LastDate=new Date(this.lastDateString);
      this.recurringEvent.Title=this.chosenCourse;
      this.recurringEvent.Teacher=this.chosenTeacher;
     
      this.scheduleService.addEventToSchedule(this.recurringEvent,this.timeTable.CalendarName)
      .subscribe(result => {
          console.log(result);
          //this.alertService.success("Event Added successfully!");

          this.activeModal.close(true);

            
      })
}

choosenCourse(event: string)
{
this.event.Title=event;
this.teacherListSubcription = timer(0).pipe(switchMap(()=> this.teacherService.getTeachersByCourseName(this.chosenCourse))).subscribe((list: Teacher[])=>
{
this.teachersList = list;
-
console.log(this.teachersList);
});

}

choosenTeacher(event: Teacher)
{
this.chosenTeacher= event;
}
}