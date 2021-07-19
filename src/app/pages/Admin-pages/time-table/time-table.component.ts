import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import RRule from 'rrule';

import {
  isSameDay,
  isSameMonth, 
} from 'date-fns';
import { Subject, Subscription, timer } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarDayViewBeforeRenderEvent,
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTitleFormatter,
  CalendarMonthViewBeforeRenderEvent,
  CalendarView,
  CalendarWeekViewBeforeRenderEvent,
} from 'angular-calendar';
import { EventUtils } from 'src/services/utils/eventUtils';
import { FormControl, Validators } from '@angular/forms';
import { EventModalComponent } from './components/event-modal/event-modal.component';
import { DatePipe } from '@angular/common';
import moment from 'moment-timezone';
import { ViewPeriod } from 'calendar-utils';
import { Schedule } from 'src/services/models/event';
import { TimeTableService } from 'src/services/WebApi/timeTable.service';
import { TimeTable } from 'src/services/models/timeTable';
import { switchMap } from 'rxjs/operators';
import { GroupService } from 'src/services/WebApi/group.service';
import { Group } from 'src/services/models/group';
import { ScheduleService } from 'src/services/WebApi/schedule.service';
import { AlertService } from 'src/services/helperServices/alert.service';
import { CustomEventTitleFormatter } from './custom-event-title-formatter';

moment.tz.setDefault('Utc');


@Component({
  selector: 'app-time-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.scss'],
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter,
    },
  ],
})
export class TimeTableComponent implements OnInit  {
  @ViewChild('modalContent', { static: true })
  modalContent!: TemplateRef<any>;
  groupControl = new FormControl('', Validators.required);
  view: CalendarView = CalendarView.Month;
  groupList: Group[] = [];
  groupListSubscription!: Subscription;

public dateString:string
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  
  public recurringEvent:Schedule={
    Start:this.viewDate,
    End:this.viewDate,
    Title: 'test',
    Color:
    {
      primary:"#ad2121",
      secondary:"#ad2121"
    },
    rrule: {
      freq: RRule.WEEKLY,
      byweekday: this.viewDate.getDay(),
  },
    LastDate:this.viewDate
}
  public timeTable:TimeTable;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.editEvent(event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        // weekDay=event.start.getDay() - 1 < 0 ? 6 : event.start.getDay() - 1; 
       // this.recurringEvents = this.recurringEvents.filter((iEvent) => iEvent.title !== event.title || iEvent.rrule.byweekday !== weekDay);
        this.deleteEvent(event);
      },
    },
  ];


  refresh: Subject<any> = new Subject();
  timeTableSubscription!:Subscription;
  recurringEvents: Schedule[] = [];
  calendarEvents: CalendarEvent[] = [];
  viewPeriod: ViewPeriod;
  chosenGroup : string;
  activeDayIsOpen: boolean = true;

  constructor(private timeTableService:TimeTableService,
    private cdr: ChangeDetectorRef,
    public datepipe: DatePipe,
    private modal: NgbModal,private eventUtils: EventUtils,
    private scheduleService:ScheduleService,
    private modalService:NgbModal, 
    private alertService: AlertService,
    private groupService: GroupService) {}
  
  
  ngOnInit(): void {
      this.getGroups();
      this.getTimeTable();  
      }

  private getTimeTable(){
    this.recurringEvents.length = 0;
    this.calendarEvents.length = 0;
    if(this.chosenGroup)
    {
    this.timeTableSubscription = timer(0).pipe(switchMap(()=> this.timeTableService.getTTByGroupNumber(this.chosenGroup))).subscribe((timeTable: TimeTable)=>
    {
      this.timeTable = timeTable;
      this.timeTable.GroupSchedule.forEach(lesson => {
        this.recurringEvent.Start=new Date(lesson.Start),
        this.recurringEvent.Title=lesson.Title,
        this.recurringEvent.End=new Date(lesson.End),
        this.recurringEvent.LastDate=new Date(lesson.LastDate);
        this.recurringEvent.Color.primary=lesson.Color,
        this.recurringEvent.Color.secondary=lesson.Color,
        this.recurringEvent.rrule.byweekday=new Date(lesson.Start).getDay();
        this.recurringEvent.EventId=lesson.EventId;
        this.recurringEvent.Teacher=lesson.Teacher;
        this.addEvent();
      });
      
    });
  }
  this.refresh.next();  
  }
  
  updateCalendarEvents(
    viewRender:
      | CalendarMonthViewBeforeRenderEvent
      | CalendarWeekViewBeforeRenderEvent
      | CalendarDayViewBeforeRenderEvent
  ): void {
    
    if (
      !this.viewPeriod ||
      !moment(this.viewPeriod.start).isSame(viewRender.period.start) ||
      !moment(this.viewPeriod.end).isSame(viewRender.period.end)
    ) {
      this.viewPeriod = viewRender.period;
      this.calendarEvents = [];

      this.recurringEvents.forEach((event) => {
        this.pushEvent(event);
      });
      
      this.cdr.detectChanges();
    }
  }

 
  dayClicked({ date}: { date: Date;  }): void {
   
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        this.recurringEvents.length === 0
      ) {
        this.activeDayIsOpen = false;

      } else {
        this.activeDayIsOpen = true;    
      }   
    }
    this.viewDate = date;
    this.recurringEvent.rrule.byweekday=this.viewDate.getDay();
  // this.openModal(true);     
  }

  openAddModal({ date}: { date: Date;  })
  {
    this.viewDate=date;
    const ref=this.modalService.open(EventModalComponent,{centered:true});
    ref.componentInstance.viewDate=this.viewDate;
    ref.componentInstance.isAddMode=true;
    ref.componentInstance.recurringEvent=this.recurringEvent;
    ref.componentInstance.timeTable=this.timeTable;
   ref.componentInstance.isAddMode=true;
    for(let group of this.groupList)
      {
      if(group.GroupNumber === this.chosenGroup)
      {
      ref.componentInstance.courses = group.courses;
      break;
      }
}
    ref.result.then((result) => {
      if (result) {
          this.addEvent();
      
      this.cdr.detectChanges();
      this.refresh.next();
      }
      });
  }
 

  handleEvent(action: string, event: CalendarEvent): void {
    // this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: 'lg' });
    this.editEvent(event);
  }

  addEvent(): void {
    const newEvent:Schedule={
      Start:this.recurringEvent.Start,
      End:this.recurringEvent.End,
      Title: this.recurringEvent.Title,
      Color:{
        primary:this.recurringEvent.Color.primary,
        secondary:this.recurringEvent.Color.primary
      },
      rrule: {
        freq: RRule.WEEKLY,
        byweekday: this.recurringEvent.rrule.byweekday -1 < 0 ? 6: this.recurringEvent.rrule.byweekday-1,
        
    },
    EventId:this.recurringEvent.EventId,
    LastDate:this.recurringEvent.LastDate,
    Teacher:this.recurringEvent.Teacher
  };
    
    this.recurringEvents = [
      ...this.recurringEvents,
      {
          Start:newEvent.Start,
          End:newEvent.End,
          Title: newEvent.Title,
          Color:{
            primary:newEvent.Color.primary,
            secondary:newEvent.Color.primary
          },
          rrule: {
            freq: RRule.WEEKLY,
            byweekday: newEvent.rrule.byweekday,
           
        },
        LastDate:newEvent.LastDate,
        EventId:newEvent.EventId,
        Teacher:newEvent.Teacher

      },
    ];
    
this.pushEvent(newEvent);
this.cdr.detectChanges();
this.refresh.next();
    

 }
 
 pushEvent(event:Schedule)
  {
    const rule: RRule = new RRule({
      ...event.rrule,
      dtstart: moment(event.Start).startOf('day').toDate(),
      until: moment(event.LastDate).endOf('day').toDate(),
      
    });
    const { Title: title } = event;

    rule.all().forEach((date) => {
      let startOfEvent=new Date(date);
      let endOfEvent=new Date(date);
      startOfEvent.setHours(event.Start.getHours());
      endOfEvent.setHours(event.End.getHours());

      startOfEvent.setMinutes(event.Start.getMinutes());
      endOfEvent.setMinutes(event.End.getMinutes());
      
        this.calendarEvents.push({
          title,
          actions:this.actions,
          color:{
            primary:event.Color.primary,
            secondary:event.Color.primary
          },
          start:moment(startOfEvent).toDate(),
          end:moment(endOfEvent).toDate(),
        });
      });
  }

editEvent(eventToEdit:CalendarEvent)
{
  for(let recEvent of this.recurringEvents) {
    if(recEvent.Title == eventToEdit.title && recEvent.Start.getDay() == eventToEdit.start.getDay())
      {
        this.recurringEvent=recEvent;
        break;
      }
}
//this.openEditModal();

}
deleteEvent(eventToDelete: CalendarEvent) {
  for(let recEvent of this.recurringEvents) {
    if(recEvent.Title == eventToDelete.title && recEvent.Start.getDay() == eventToDelete.start.getDay())
      {
      this.scheduleService.deleteEvent(recEvent.EventId,this.timeTable.CalendarName)
      .subscribe(result => {
        if(result)
        {
          //this.alertService.success("Event deleted successfully!");

        this.calendarEvents = this.calendarEvents.filter((event) => event !== eventToDelete);
        this.recurringEvents=this.recurringEvents.filter((event) => event !== recEvent);
         this.cdr.detectChanges();
        this.refresh.next();   
        }      
  });
  break;
  }
}
}



  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  private getGroups(){
    this.groupListSubscription = timer(0).pipe(switchMap(()=> this.groupService.getAllGroups())).subscribe((list: Group[])=>
    {
      this.groupList = list;
      console.log(this.groupList);
    });
  }
  choosenGroup(event: string)
  {
    this.chosenGroup = event;
    this.getTimeTable();
  }



}






























