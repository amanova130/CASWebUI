import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  Input
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { EventUtils } from 'src/services/utils/eventUtils';
import { EventsService } from 'src/services/WebApi/event.service';
import { FormBuilder } from '@angular/forms';
import { EventModalComponent } from './components/event-modal/event-modal.component';
import RRule from 'rrule';
import { DatePipe } from '@angular/common';
import { calendarFormat } from 'moment';
import { CalendarEventActionsComponent } from 'angular-calendar/modules/common/calendar-event-actions.component';



const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-time-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.scss']
})
export class TimeTableComponent  {
  @ViewChild('modalContent', { static: true })
  modalContent!: TemplateRef<any>;
  
  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;
  public event:CalendarEvent={
    start: startOfDay(new Date()),
    end:addDays(new Date(),0),
    title: 'Custom event',
    color: colors.yellow,
  }

  viewDate: Date = new Date();

  modalData!: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
    // {
    //   start: subDays(startOfDay(new Date()), 1),
    //   end: addDays(new Date(), 1),
    //   title: 'A 3 day event',
    //   color: colors.red,
    //   actions: this.actions,
    //   allDay: true,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true,
    //   },
    //   draggable: true,
    // },
    {
      start: startOfDay(new Date()),
      end:addDays(new Date(),0),
       title: 'Custom event',
       color: colors.yellow,
    }
    // },
    // {
    //   start: subDays(endOfMonth(new Date()), 3),
    //   end: addDays(endOfMonth(new Date()), 3),
    //   title: 'A long event that spans 2 months',
    //   color: colors.blue,
    //   allDay: true,
    // },
    // {
    //   start: addHours(startOfDay(new Date()), 2),
    //   end: addHours(new Date(), 2),
    //   title: 'A draggable and resizable event',
    //   color: colors.yellow,
    //   actions: this.actions,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true,
    //   },
    //   draggable: true,
    // },
   
      
  ];

  activeDayIsOpen: boolean = true;

  constructor(public datepipe: DatePipe,private modal: NgbModal,private eventUtils: EventUtils, private eventsService: EventsService,private modalService:NgbModal) {
    
  }
 

 
  dayClicked({ date}: { date: Date;  }): void {
   
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        this.events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }

 
    
    const ref=this.modalService.open(EventModalComponent,{centered:true});
    ref.componentInstance.date=this.datepipe.transform(date, 'yyyy-MM-ddThh:mm');
    ref.componentInstance.eventsList=this.events;
    ref.componentInstance.newEvent=this.event
  }

  
  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvents(): void {
    this.events = [
      ...this.events,
      {
        title: this.event.title,
        start: this.event.start,
        end: this.event.end,
        color: this.event.color,
      },
    ];
    // for(let event of this.events)
    // {
    //   this.eventsService.setEvents(event);
    // }
  
    
  }

addSingleEvent(eventToAdd:CalendarEvent):void
{
  this.eventsService.setEvents(eventToAdd);
}
  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}






























