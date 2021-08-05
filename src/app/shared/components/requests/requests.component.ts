import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { RequestService } from 'src/services/WebApiService/request.service';
import { Request } from 'src/services/models/request';
import { MessageService } from '../../../../services/WebApiService/message.service';
import { Message } from 'src/services/models/message';
import { StudentService } from '../../../../services/WebApiService/student.service';
import Swal from 'sweetalert2';
import { AddRequestComponent } from './add-request/add-request.component';
import { User } from 'src/services/models/user';
import { TokenStorageService } from '../../helperServices/token-storage.service';
import { Role } from '../../pipes-and-enum/roleEnum';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'CreatedDate',
    'UpdatedDate',
    'GroupNum',
    'SenderId',
    'Subject',
    'Reason',
  'StatusOfRequest',
  'action'
];
  dataSource!: MatTableDataSource<Request>;
  requestorEmail: string[]=[];
  requestList: Request[] = [];
  emailBody: Message;
  requestListSubscription!: Subscription;
  removeRequest!: Request;
  isLoading=true;
  isSelected=false;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  @ViewChild('myTable')
  myTable!: MatTable<any>;
  isStudent=true;
  loggedUser: User;
  selection = new SelectionModel<Request>(true, []);

  constructor(private requestService: RequestService, 
    private modalService: NgbModal, 
    public datepipe: DatePipe, 
    private alertService: AlertService,
    private messageService: MessageService, 
    private studentService: StudentService,
    private tokenStorage: TokenStorageService) {}

    
  ngOnInit(): void {
    this.loggedUser = this.tokenStorage.getUser();
    if(this.loggedUser.Role === Role.Student)
    {
      this.isStudent = !this.isStudent;
      this.getRequestByStudentId();
    }
    else
      this.getAllRequestData();
  }

 

  getAllRequestData(){
    this.requestListSubscription = timer(0, 60000).pipe(
      switchMap(()=> this.requestService.getAllRequests())
    ).subscribe((list: Request[])=>{
      this.requestList = list;
      this.dataSource = new MatTableDataSource(this.requestList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading=false;
      console.log("Get Request refreshed");
    });
  }

  getRequestByStudentId(){
    this.requestListSubscription = timer(0, 60000).pipe(
      switchMap(()=> this.requestService.getRequestsListBySenderId(this.loggedUser.UserName))
    ).subscribe((list: Request[])=>{
      this.requestList = list;
      this.dataSource = new MatTableDataSource(this.requestList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading=false;
      console.log("Get Request refreshed");
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  updateStatusOfRequest(status: string, request: Request){
    this.requestorEmail = [];
    if(request)
    {
      request.UpdatedDate = new Date().toLocaleDateString();
      request.StatusOfRequest = status;
      this.requestService.updateRequest(request).subscribe(data => 
        {
          if(data)
          {
            this.studentService.getStudentById(request.SenderId).subscribe(
              student => {
                if(student)
                {
                  this.requestorEmail.push(student.Email);
                  this.emailBody={
                    Description: 'Dear ' +student.First_name+' '+student.Last_name +', Your request has been '+request.StatusOfRequest,
                    Subject: 'Your request has been '+request.StatusOfRequest,
                    DateTime:new Date(),
                    Receiver:this.requestorEmail,
                    Status:true
                  }
                  this.showMessageBeforeSending();
                }
                  
              }
            )
          }
        })
    }
  }

showMessageBeforeSending(){
  Swal.fire({
    title: 'Do you want reply?',
    text: "Email will be send to student",
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, send it!'
  }).then((result) => {
    if (result.isConfirmed) {
     this.sendEmail(this.emailBody);
    }
  })
}

sendEmail(message:Message)
{
  this.messageService.create(message).subscribe(res=>{
     if(res)
       this.alertService.genericAlertMsg('success', 'Your email was sent successfully');
      else
      this.alertService.errorResponseFromDataBase();
  });
}



  openModal(request?: Request){
    const ref = this.modalService.open(AddRequestComponent, { centered: true });
    ref.result.then((result) => {
      if(result != 'Close click')
      {
        this.requestList.push(result);
        this.dataSource.data = this.requestList;
      }
    });
  }

  openDelete(request:Request){
    this.removeRequest={
      Id: request.Id,
      Reason: request.Reason,
      Subject: request.Subject,
    }
  }

  refresh(){
    if(this.requestListSubscription)
    this.requestListSubscription.unsubscribe();
    this.getAllRequestData();
  }
  
  ngOnDestroy()
  {
    if(this.requestListSubscription)
      this.requestListSubscription.unsubscribe();
  }
}


