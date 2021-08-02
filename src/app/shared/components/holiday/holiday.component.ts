import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { Holiday } from 'src/services/models/holiday';
import { HolidayService } from 'src/services/WebApiService/holiday.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { AddEditHolidayComponent } from './components/add-edit-holiday/add-edit-holiday.component';


@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.scss']
})
export class HolidayComponent implements  OnInit, OnDestroy {
  displayedColumns: string[] = [
    'select',
    'Title',
    'StartDate',
    'EndDate',
    'Type',
    'Details',
  'action'];
  dataSource!: MatTableDataSource<Holiday>;

  holidayList: Holiday[] = [];
  holidayListSubscription!: Subscription;
  removeHoliday!: Holiday;
  isLoading=true;
  isSelected=false;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  @ViewChild('myTable')
  myTable!: MatTable<any>;

  constructor(private holidayService: HolidayService, private modalService: NgbModal,public datepipe: DatePipe, private alertService: AlertService) {}
  ngOnInit(): void {
    this.getAllholidayData();
  }
  selection = new SelectionModel<Holiday>(true, []);

  getAllholidayData(){
    this.holidayListSubscription = timer(0, 60000).pipe(
      switchMap(()=> this.holidayService.getAllHolidays())
    ).subscribe((list: Holiday[])=>{
      this.holidayList = list;
      this.dataSource = new MatTableDataSource(this.holidayList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading=false;
      console.log("Get holiday refreshed");
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

  openModal(holiday?: Holiday){
    const ref = this.modalService.open(AddEditHolidayComponent, { centered: true });
    ref.componentInstance.holiday = holiday;
    ref.componentInstance.holidayList = this.holidayList;
    ref.result.then((result) => {
      if(result !== 'Close click')
      {
        this.dataSource.data = result;
      }
    });
  }

  openDelete(holiday:Holiday){
    this.removeHoliday={
      Id: holiday.Id,
      Title: holiday.Title,
    }
  }

  deleteSelectedHolidays()
  {
    if(this.selection.hasValue())
    {
      this.selection.selected.forEach(selected=>(this.deleteHoliday(selected.Id)));
      this.alertService.successResponseFromDataBase();
    }
    else
      this.alertService.errorFormField();
  }

  deleteHoliday(id: string){
    if(id!==null || id!==undefined){
      this.holidayService.deleteById(id).subscribe(res => {
        if(res)
        {
          this.holidayList = this.holidayList.filter(item => item.Id !== id);
          this.dataSource.data = this.holidayList;
         this.alertService.successResponseFromDataBase();
        }
        else
          this.alertService.errorResponseFromDataBase();
      });
    }
  }

  refresh(){
    if(this.holidayListSubscription)
    this.holidayListSubscription.unsubscribe();
    this.getAllholidayData();
  }
  
  ngOnDestroy()
  {
    if(this.holidayListSubscription)
      this.holidayListSubscription.unsubscribe();
  }
}

