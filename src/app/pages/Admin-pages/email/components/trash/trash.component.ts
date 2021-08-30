import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Message } from 'src/services/models/message';
import { MessageService } from 'src/services/WebApiService/message.service';
import { Pipe, PipeTransform } from '@angular/core';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { ViewMailComponent } from '../view-mail/view-mail.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.scss']
})
export class TrashComponent implements OnInit {

  displayedColumns: string[] = ['Receiver', 'Subject', 'DateTime', "action"];
  public messageList: Message[];
  public removeMessage: Message;
  dataSource!: MatTableDataSource<Message>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  selection = new SelectionModel<Message>(true, []);
  constructor(
    public datepipe: DatePipe,
    private modalService: NgbModal,
    private messageService: MessageService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.messageService.GetAllDeletedBySender("Admin").subscribe((list: Message[]) => {
      if (list) {
        this.messageList = list;
        this.dataSource = new MatTableDataSource(this.messageList);
        this.dataSource.paginator = this.paginator;
        this.sort.sort({ id: 'DateTime', start: 'desc', disableClear: false });
        this.dataSource.sort = this.sort;
      }
    },
    error => {
      this.alertService.genericAlertMsg("error", error);
    });
  }
// Open view modal to Resend the email
  openViewModal(message: Message = { Id: "" }) {
    const ref = this.modalService.open(ViewMailComponent, { centered: true, size: 'lg' });
    ref.componentInstance.message = message;
    ref.result.then((result) => {
      if (result) {
      }
    });
  }
// filter by any char
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Open delete modal
  openDelete(message: Message = { Id: "" }) {
    this.removeMessage = message;
  }
// Delete Message
  deleteMessage(id: string) {
    if (id !== null || id !== undefined) {
      this.messageService.deleteById(id).subscribe(res => {
        if (res) {
          this.messageList = this.messageList.filter(item => item.Id !== id);
          this.dataSource.data = this.messageList;
          this.alertService.successResponseFromDataBase();
        }
        else
          this.alertService.errorResponseFromDataBase();
      });
    }
  }
}


