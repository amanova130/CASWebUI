import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Message } from 'src/services/models/message';
import { MessageService } from 'src/services/WebApiService/message.service';
import { ViewMailComponent } from '../view-mail/view-mail.component';
import { Pipe, PipeTransform } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-sent',
  templateUrl: './sent.component.html',
  styleUrls: ['./sent.component.scss']
})

export class SentComponent implements OnInit {
  displayedColumns: string[] = ['select', 'Receiver','Subject', 'DateTime',"action"];
  public messageList:Message[];
  public removeMessage:Message;
  messageListSubscription!: Subscription;

  dataSource!: MatTableDataSource<Message>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  isSelected=false;
  isLoading=true;
  selection = new SelectionModel<Message>(true, []);
  constructor(
    public datepipe: DatePipe,
    private modalService: NgbModal,
    private messageService:MessageService,
    private alertService:AlertService
  ) { }

  ngOnInit(): void {
    this.messageService.getMessagesBySenderId("Admin").subscribe((list: Message[])=>{
      this.messageList=list;
      this.dataSource=new MatTableDataSource(this.messageList);
      this.dataSource.paginator = this.paginator;
     this.sort.sort({ id: 'DateTime', start: 'desc', disableClear: false });
      this.dataSource.sort = this.sort;
      this.isLoading=false;
    });

}



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
    if(this.isAllSelected())
    {
      this.selection.clear();
      this.isSelected=false;
    }
      else
      {
        this.dataSource.data.forEach(row => this.selection.select(row));
        this.isSelected=true;
      }
        
  }
  openDelete(message:Message = {Id: ""} ){
    this.removeMessage=message;
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
    if(numSelected !== undefined)
      this.isSelected=true;
    else
      this.isSelected=false;
    return numSelected === numRows;
    
  }
  deleteSelectedMessages()
  {
    if(this.selection.hasValue())
    {
      this.selection.selected.forEach(selected=>(this.deleteMessage(selected.Id)));
    }
    this.alertService.errorFormField();
  }
  deleteMessage(id:string)
  {
    if(id!==null || id!==undefined){
      this.messageService.deleteById(id).subscribe(res => {
        if(res)
        {
          this.messageList = this.messageList.filter(item => item.Id !== id);
          this.dataSource.data = this.messageList;
          this.alertService.successResponseFromDataBase();
        }
        else
        this.alertService.errorResponseFromDataBase();
      });
    }
 }
 refresh(){
  this.messageService.getMessagesBySenderId("Admin").subscribe((list: Message[])=>{
    this.messageList=list;
    this.dataSource=new MatTableDataSource(this.messageList);
    this.dataSource.paginator = this.paginator;
  // this.sort.sort({ id: 'DateTime', start: 'desc', disableClear: false });
    this.dataSource.sort = this.sort;
    this.isLoading=false;

  });
}
}


