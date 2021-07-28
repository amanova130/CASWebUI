
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'src/services/models/message';
import { InboxComponent } from '../inbox/inbox.component';
@Component({
  selector: 'app-view-mail',
  templateUrl: './view-mail.component.html',
  styleUrls: ['./view-mail.component.scss']
})
export class ViewMailComponent implements OnInit {

  constructor(
    public datepipe: DatePipe,

  ) { }
  @Input()
  public message:Message;

  ngOnInit(): void {

  }

}
