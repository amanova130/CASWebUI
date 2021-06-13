import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent } from 'calendar-utils';
import { TimeTableComponent } from '../../time-table.component';

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.scss']
})
export class EventModalComponent implements OnInit {

  @Input()
 public date: Date;

  @Input()
  public eventsList: CalendarEvent[]
@Input()
public newEvent:CalendarEvent={
  start:new Date(),
  title:"", 
};
  constructor(      
    public activeModal: NgbActiveModal,
    private modalService:NgbModal,
    ) { }

  ngOnInit(): void {
    this.newEvent.start=this.date;
    console.log(this.date);
  }
  onSubmit() {
   this.createEvent()
}


  private createEvent() {

   this.eventsList.push(this.newEvent);

  //  this.eventsList = [
  //   ...this.eventsList,
  //   {
  //     title: this.newEvent.title,
  //     start: this.newEvent.start,
  //     end: this.newEvent.end,
  //     color: this.newEvent.color,
  //   },
  // ];
    this.activeModal.close();

     
         
      
     
      
}



}
