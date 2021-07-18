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
  CalendarMonthViewBeforeRenderEvent,
  CalendarView,
  CalendarWeekViewBeforeRenderEvent,
} from 'angular-calendar';
import { EventUtils } from 'src/services/utils/eventUtils';
import { EventsService } from 'src/services/WebApi/event.service';
import { FormControl, Validators } from '@angular/forms';
import { EventModalComponent } from './components/event-modal/event-modal.component';
import { DatePipe } from '@angular/common';
import moment from 'moment-timezone';
import { ViewPeriod } from 'calendar-utils';
import { Schedule } from 'src/services/models/recurringEvent';
import { TimeTableService } from 'src/services/WebApi/timeTable.service';
import { TimeTable } from 'src/services/models/timeTable';
import { switchMap } from 'rxjs/operators';
import { GroupService } from 'src/services/WebApi/group.service';
import { Group } from 'src/services/models/group';
import { ScheduleService } from 'src/services/WebApi/schedule.service';
import { AlertService } from 'src/services/helperServices/alert.service';

moment.tz.setDefault('Utc');


@Component({
  selector: 'app-time-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.scss'],
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
    start:this.viewDate,
    end:this.viewDate,
    title: 'test',
    color:
    {
      primary:"#ad2121",
      secondary:"#ad2121"
    },
    rrule: {
      freq: RRule.WEEKLY,
      byweekday: this.viewDate.getDay(),
  },
    lastDate:this.viewDate
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
        this.recurringEvent.start=new Date(lesson.start),
        this.recurringEvent.title=lesson.title,
        this.recurringEvent.end=new Date(lesson.end),
        this.recurringEvent.lastDate=new Date(lesson.lastDate);
        this.recurringEvent.color.primary=lesson.color,
        this.recurringEvent.color.secondary=lesson.color,
        this.recurringEvent.rrule.byweekday=new Date(lesson.start).getDay();
        this.recurringEvent.eventId=lesson.eventId;
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
      this.viewDate = date;
      
    }
 this.recurringEvent.rrule.byweekday=this.viewDate.getDay();
   this.openModal(true);     
  }

  openModal(isAddMode:boolean)
  {
    const ref=this.modalService.open(EventModalComponent,{centered:true});
    ref.componentInstance.viewDate=this.viewDate;
    ref.componentInstance.isAddMode=isAddMode;
    ref.componentInstance.recurringEvent=this.recurringEvent;
    ref.componentInstance.timeTable=this.timeTable;
    ref.result.then((result) => {
      if (result) {
        if(isAddMode)
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
      start:this.recurringEvent.start,
      end:this.recurringEvent.end,
      title: this.recurringEvent.title,
      color:{
        primary:this.recurringEvent.color.primary,
        secondary:this.recurringEvent.color.primary
      },
      rrule: {
        freq: RRule.WEEKLY,
        byweekday: this.recurringEvent.rrule.byweekday -1 < 0 ? 6: this.recurringEvent.rrule.byweekday-1,
        
    },
    eventId:this.recurringEvent.eventId,
    lastDate:this.recurringEvent.lastDate
  };
    
    this.recurringEvents = [
      ...this.recurringEvents,
      {
          start:newEvent.start,
          end:newEvent.end,
          title: newEvent.title,
          color:{
            primary:newEvent.color.primary,
            secondary:newEvent.color.primary
          },
          rrule: {
            freq: RRule.WEEKLY,
            byweekday: newEvent.rrule.byweekday,
           
        },
        lastDate:newEvent.lastDate,
        eventId:newEvent.eventId
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
      dtstart: moment(event.start).startOf('day').toDate(),
      until: moment(event.lastDate).endOf('day').toDate(),
      
    });
    const { title } = event;

    rule.all().forEach((date) => {
      let startOfEvent=new Date(date);
      let endOfEvent=new Date(date);
      startOfEvent.setHours(event.start.getHours());
      endOfEvent.setHours(event.end.getHours());

      startOfEvent.setMinutes(event.start.getMinutes());
      endOfEvent.setMinutes(event.end.getMinutes());
      
        this.calendarEvents.push({
          title,
          actions:this.actions,
          color:{
            primary:event.color.primary,
            secondary:event.color.primary
          },
          start:moment(startOfEvent).toDate(),
          end:moment(endOfEvent).toDate(),
        });
      });
  }

editEvent(eventToEdit:CalendarEvent)
{
  this.openModal(false);
}
deleteEvent(eventToDelete: CalendarEvent) {
  for(let recEvent of this.recurringEvents) {
    if(recEvent.title == eventToDelete.title && recEvent.start.getDay() == eventToDelete.start.getDay())
      {
      this.scheduleService.deleteEvent(recEvent.eventId,this.timeTable.CalendarName)
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






























