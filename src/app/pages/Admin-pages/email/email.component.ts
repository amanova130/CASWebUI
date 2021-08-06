import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'src/services/WebApiService/message.service';
import { Message } from 'src/services/models/message';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewMailComponent } from './components/view-mail/view-mail.component';
import { SelectionModel } from '@angular/cdk/collections';
import { InboxComponent } from './components/inbox/inbox.component';
import { ComposeComponent } from './components/compose/compose.component';


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
  @ViewChild(ComposeComponent)  child: ComposeComponent;
  public messageList:Message[];
  dataSource!: MatTableDataSource<Message>;
  public isSent:boolean;
  public isCompose:boolean;
  public isTrash:boolean;


 
  constructor(
    public datepipe: DatePipe,
    private modalService: NgbModal,
    private messageService:MessageService) { }

  ngOnInit(): void {
    this.isSent=true;
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
   
    sentView()
    {
      this.isSent=true;
      this.isCompose=false;
      this.isTrash=false;

    }
    composeView()
    {
      this.isSent=false;
      this.isCompose=true;
      this.isTrash=false;

    }
    trashView()
    {
      this.isSent=false;
      this.isCompose=false;
      this.isTrash=true;
    }
}

