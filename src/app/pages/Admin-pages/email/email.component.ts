import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'src/services/WebApiService/message.service';
import { Message } from 'src/services/models/message';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewMailComponent } from './components/view-mail/view-mail.component';
import { SelectionModel } from '@angular/cdk/collections';
import { InboxComponent } from './components/inbox/inbox.component';


export interface Email {	
  Name:string,
  Topic:string	
  Content:string,	
  Date:Date,
}


  



@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})

export class EmailComponent implements OnInit {
  @ViewChild(InboxComponent, {static: true})
  displayedColumns: string[] = ['select', 'Sender','Subject', 'DateTime'];
  public messageList:Message[];
  dataSource!: MatTableDataSource<Message>;
  public isInbox:boolean;
  public isSent:boolean;
  public isCompose:boolean;

 
  constructor(
    public datepipe: DatePipe,
    private modalService: NgbModal,
    private messageService:MessageService) { }

  ngOnInit(): void {
    this.isInbox=true;
  }
  selection = new SelectionModel<Message>(true, []);

    masterToggle() {
      this.isAllSelected() ?
          this.selection.clear() :
          this.dataSource.data.forEach(row => this.selection.select(row));
    }
  
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
    inboxView()
    {
      this.isInbox=true;
      this.isSent=false;
      this.isCompose=false;

    }
    sentView()
    {
      this.isSent=true;
      this.isInbox=false;
      this.isCompose=false;

    }
    composeView()
    {
      this.isSent=false;
      this.isInbox=false;
      this.isCompose=true;
    }
}

