import { Component, OnInit, ViewChild } from '@angular/core';
import { Message } from 'src/services/models/message';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { ComposeComponent } from './components/compose/compose.component';

export interface Email {
  Name: string,
  Topic: string
  Content: string,
  Date: Date,
}

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})

export class EmailComponent implements OnInit {
  @ViewChild(ComposeComponent) child: ComposeComponent;
  public messageList: Message[];
  dataSource!: MatTableDataSource<Message>;
  public isSent: boolean;
  public isCompose: boolean;
  public isTrash: boolean;

  constructor(
    public datepipe: DatePipe) { }

  ngOnInit(): void {
    this.isSent = true;
  }

// Setting for view
  sentView() {
    this.isSent = true;
    this.isCompose = false;
    this.isTrash = false;
  }
  composeView() {
    this.isSent = false;
    this.isCompose = true;
    this.isTrash = false;
  }
  trashView() {
    this.isSent = false;
    this.isCompose = false;
    this.isTrash = true;
  }
}

