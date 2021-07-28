import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Message } from 'src/services/models/message';
import { MessageService } from 'src/services/WebApiService/message.service';
import { ViewMailComponent } from '../view-mail/view-mail.component';



export interface Email {	
  Name:string,
  Topic:string	
  Content:string,	
  Date:Date,
}
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {
  displayedColumns: string[] = ['select', 'Sender','Subject', 'DateTime'];
  public messageList:Message[];
  dataSource!: MatTableDataSource<Message>;

  constructor(
    public datepipe: DatePipe,
    private modalService: NgbModal,
    private messageService:MessageService
  ) { }

  ngOnInit(): void {
    this.messageService.getMessagesByReceiverId("Admin").subscribe((list: Message[])=>{
      this.messageList=list;
      this.dataSource=new MatTableDataSource(this.messageList);
    });
  }
  selection = new SelectionModel<Message>(true, []);

  openViewModal(message: Message = {Id: ""} ){
    const ref = this.modalService.open(ViewMailComponent, { centered: true,size:'lg' });
    ref.componentInstance.message = message;
  
    ref.result.then((result) => {
      if (result) {
     // this.refreshData();
      }
      });

    }
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

}
