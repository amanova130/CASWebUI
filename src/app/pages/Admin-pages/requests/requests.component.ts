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

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'select',
    'CreatedDate',
    'GroupNum',
    'SenderId',
    'Subject',
    'Reason',
  'StatusOfRequest'];
  dataSource!: MatTableDataSource<Request>;

  requestList: Request[] = [];
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

  constructor(private requestService: RequestService, private modalService: NgbModal,public datepipe: DatePipe, private alertService: AlertService) {}
  ngOnInit(): void {
    this.getAllRequestData();
  }
  selection = new SelectionModel<Request>(true, []);

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

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    if(numSelected !== undefined)
      this.isSelected=true;
    else
      this.isSelected=false;
    return numSelected === numRows;
    
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openModal(request?: Request){
    // const ref = this.modalService.open(AddEditRequestComponent, { centered: true });
    // ref.componentInstance.request = request;
    // ref.componentInstance.requestList = this.requestList;
    // ref.result.then((result) => {
    //   if(result)
    //   {
    //     this.requestList.push(result);
    //     this.refresh();
    //   }
    // });
  }

  openDelete(request:Request){
    this.removeRequest={
      Id: request.Id,
      Reason: request.Reason,
      Subject: request.Subject,
    }
  }

  deleteSelectedRequests()
  {
    if(this.selection.hasValue())
    {
      this.selection.selected.forEach(selected=>(this.deleteRequest(selected.Id)));
      this.alertService.successResponseFromDataBase();
    }
    else
      this.alertService.errorFormField();
  }

  deleteRequest(id: string){
    if(id!==null || id!==undefined){
      this.requestService.deleteById(id).subscribe(res => {
        if(res)
        {
          this.requestList = this.requestList.filter(item => item.Id !== id);
          this.dataSource.data = this.requestList;
          this.alertService.successResponseFromDataBase();
        }
        else
        this.alertService.errorResponseFromDataBase();
      });
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


