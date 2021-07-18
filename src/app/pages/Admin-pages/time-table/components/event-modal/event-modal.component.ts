import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent } from 'calendar-utils';
import { add, addDays, endOfDay, startOfDay } from 'date-fns';
import { TimeTableComponent } from '../../time-table.component';
import { Schedule } from 'src/services/models/recurringEvent';
import { EMPTY, Subject } from 'rxjs';
import { ScheduleService } from 'src/services/WebApi/schedule.service';
import { TimeTable } from 'src/services/models/timeTable';
import { AlertService } from 'src/services/helperServices/alert.service';

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.scss']
})
export class EventModalComponent implements OnInit {
public startDateString:string;
public endDateString:string;
public lastDateString:string;
public color:Date;
@Input()
public isAddMode:boolean
@Input()
 public viewDate: Date;
 
 @Output() 
 passEntry: EventEmitter<any> = new EventEmitter();

 @Input()
 public timeTable:TimeTable;
@Input()
public recurringEvent:Schedule;
@Input()
public eventToEdit:CalendarEvent;
refresh: Subject<any> = new Subject();
  
  constructor(      
    public activeModal: NgbActiveModal,
    private modalService:NgbModal,
    public datepipe: DatePipe,
    private scheduleService:ScheduleService,
    private alertService:AlertService
    
    ) { }

  ngOnInit(): void {
   
    if(this.isAddMode)
    {
    this.recurringEvent.title="";
    this.recurringEvent.start=this.viewDate;
    this.recurringEvent.end=this.viewDate;
    this.recurringEvent.color.primary="#ad2121";
    this.recurringEvent.color.secondary="#ad2121";
    this.startDateString=this.datepipe.transform(this.viewDate, 'yyyy-MM-ddThh:mm');
    this.endDateString=this.datepipe.transform(this.viewDate, 'yyyy-MM-ddThh:mm');
    this.lastDateString=this.datepipe.transform(addDays(this.viewDate,1), 'yyyy-MM-ddTHH:mm');
    }

    else
    {
      this.startDateString=this.datepipe.transform(this.recurringEvent.start, 'yyyy-MM-ddTHH:mm');
      this.endDateString=this.datepipe.transform(this.recurringEvent.end, 'yyyy-MM-ddTHH:mm');
    //this.lastDateString=this.datepipe.transform(addDays(this.viewDate,1), 'yyyy-MM-ddTHH:mm');
    }
    
    

    
    }

  
    
   
    
  
  onSubmit() {
      this.recurringEvent.start=new Date(this.startDateString);
      this.recurringEvent.end=new Date(this.endDateString);
      this.recurringEvent.lastDate=new Date(this.lastDateString);
      this.scheduleService.addEventToSchedule(this.recurringEvent,this.timeTable.CalendarName)
      .subscribe(result => {
          console.log(result);
          //this.alertService.success("Event Added successfully!");

          this.activeModal.close(true);

            
      })
}


//   private createEvent() {

//   //this.events.push(this.event);

//    this.events = [
//     ...this.events,
//     {
//       title: this.event.title,
//       start: this.event.start,
//       end: this.event.end,
//       color: this.event.color,
//     },
//   ];
//     this.activeModal.close();

     
         
      
     
      
// }



}
