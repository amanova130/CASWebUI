import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { LoggedUser } from '../../../../services/models/loggedUser';
import { User } from 'src/services/models/user';
import { TokenStorageService } from '../../helperServices/token-storage.service';
import { Role } from '../../pipes-and-enum/roleEnum';
import { UploadFileService } from '../../../../services/WebApiService/uploadFile.service';


@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.scss']
})
export class HolidayComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'select',
    'Title',
    'StartDate',
    'EndDate',
    'Type',
    'Details',
    'action'];
  dataSource!: MatTableDataSource<Holiday>;
  loggedUser: User;
  holidayList: Holiday[] = [];
  holidayListSubscription!: Subscription;
  removeHoliday!: Holiday;
  isLoading = true;
  isSelected = false;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  @ViewChild('myTable')
  myTable!: MatTable<any>;
  @ViewChild('TABLE') table: ElementRef;
  isStudent = true;
  selection = new SelectionModel<Holiday>(true, []);

  constructor(private holidayService: HolidayService,
    private modalService: NgbModal,
    public datepipe: DatePipe,
    private alertService: AlertService,
    private tokenStorage: TokenStorageService,
    private fileHandlerService: UploadFileService) { }

  ngOnInit(): void {
    this.getAllholidayData();
    this.loggedUser = this.tokenStorage.getUser();
    if (this.loggedUser.Role === Role.Student)
      this.isStudent = !this.isStudent;
  }

  //Export to excel
  exportExcell() {
    this.fileHandlerService.exportexcel(this.table.nativeElement, "Holidays.xlsx")
  }
  // Get All Holidays
  getAllholidayData() {
    this.holidayListSubscription = timer(0, 60000).pipe(
      switchMap(() => this.holidayService.getAllHolidays())
    ).subscribe((list: Holiday[]) => {
      this.holidayList = list;
      this.dataSource = new MatTableDataSource(this.holidayList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading = false;
    },
      error => {
        this.alertService.genericAlertMsg("error", error);
        this.isLoading = false;
      });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    if (numSelected !== undefined)
      this.isSelected = true;
    else
      this.isSelected = false;
    return numSelected === numRows;

  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.isSelected = false;
    }
    else {
      this.dataSource.data.forEach(row => this.selection.select(row));
      this.isSelected = true;
    }

  }
  //Filter by Char
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  // Open Modal window to Add or Edit Holiday
  openModal(holiday?: Holiday) {
    const ref = this.modalService.open(AddEditHolidayComponent, { centered: true });
    ref.componentInstance.holiday = holiday;
    ref.componentInstance.holidayList = this.holidayList;
    ref.result.then((result) => {
      if (result !== 'Close click') {
        this.dataSource.data = result;
      }
    });
  }
  // Open Delete modal
  openDelete(holiday: Holiday) {
    this.removeHoliday = {
      Id: holiday.Id,
      Title: holiday.Title,
    }
  }
  // Delete Selected Holidays
  deleteSelectedHolidays() {
    if (this.selection.hasValue()) {
      this.selection.selected.forEach(selected => (this.deleteHoliday(selected.Id)));
      this.alertService.successResponseFromDataBase();
    }
    else
      this.alertService.errorFormField();
  }

  // Delete single Holiday object
  deleteHoliday(id: string) {
    if (id !== null || id !== undefined) {
      this.holidayService.deleteById(id).subscribe(res => {
        if (res) {
          this.holidayList = this.holidayList.filter(item => item.Id !== id);
          this.dataSource.data = this.holidayList;
          this.alertService.successResponseFromDataBase();
        }
        else
          this.alertService.errorResponseFromDataBase();
      });
    }
  }
  // Refresh
  refresh() {
    if (this.holidayListSubscription)
      this.holidayListSubscription.unsubscribe();
    this.getAllholidayData();
  }
  // Destroy subscription object
  ngOnDestroy() {
    if (this.holidayListSubscription)
      this.holidayListSubscription.unsubscribe();
  }
}

