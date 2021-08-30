import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, Subject, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { Admin } from 'src/services/models/admin';
import { AdminService } from 'src/services/WebApiService/admin.service';
import { UploadFileService } from 'src/services/WebApiService/uploadFile.service';
import { AddEditStaffComponent } from './add-edit-staff/add-edit-staff.component';
import { TokenStorageService } from '../../helperServices/token-storage.service';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'Id',
    'First_name',
    'Last_name',
    'Image',
    'Email',
    'Phone',
    'Gender',
    'Birth_date',
    'Address',
    'action'];

  dataSource!: MatTableDataSource<Admin>;
  adminList: Admin[] = [];
  adminListSubscription!: Subscription;
  removeAdmin: Admin;
  refresh: Subject<any> = new Subject();
  isLoading = false;
  isSelected = false;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  @ViewChild('TABLE') table: ElementRef;
  role: string;

  constructor(private adminService: AdminService,
    private modalService: NgbModal,
    public datepipe: DatePipe,
    private uploadFileService: UploadFileService,
    private alertService: AlertService,
    private tokenStorage: TokenStorageService) {
    this.role = this.tokenStorage.getToken("role");
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.getAllAdminData();
  }
  selection = new SelectionModel<Admin>(true, []);

  // Get all Admin data
  getAllAdminData() {
    this.adminListSubscription = timer(0, 60000).pipe(
      switchMap(() => this.adminService.getAllAdmins())
    ).subscribe((list: Admin[]) => {
      this.adminList = list;
      this.dataSource = new MatTableDataSource(this.adminList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading = false;
    },
    error=>{
      this.alertService.genericAlertMsg("error", error);
      this.isLoading = false;
    });

  }

  // Open Modal window for Edit and Add a new Admin profile
  openModal(admin: Admin = { Id: "" }) {
    const ref = this.modalService.open(AddEditStaffComponent, { centered: true });
    ref.componentInstance.admin = admin;
    ref.componentInstance.admin.Birth_date = this.datepipe.transform(admin.Birth_date, 'yyyy-MM-dd');
    ref.componentInstance.adminList = this.adminList;
    ref.result.then((result) => {
      if (result !== 'Close click') {
        this.dataSource.data = result;
      }
    });
  }

  // Open Delete Modal
  openDelete(admin: Admin = { Id: "" }) {
    this.removeAdmin = {
      Id: admin.Id,
      First_name: admin.First_name,
      Last_name: admin.Last_name
    }
  }

  // Create image path
  public createImgPath = (serverPath: string) => {
    return `https://localhost:5001/${serverPath}`;
  }
// Check if all selected
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    if (numSelected !== 0)
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
  // filter by char
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Export File to Excel
  exportExcell() {
    this.uploadFileService.exportexcel(this.table.nativeElement, "Staff.xlsx")
  }

  // Delete Admin by Id
  deleteAdmin(id: string) {
    if (id !== null || id !== undefined) {
      this.adminService.deleteById(id).subscribe(res => {
        if (res) {
          this.adminList = this.adminList.filter(item => item.Id !== id);
          this.dataSource.data = this.adminList;
          this.alertService.successResponseFromDataBase();
        }
        else
          this.alertService.errorResponseFromDataBase();
      });
    }
  }

  // Delete selected Admins data
  deleteSelectedAdmins() {
    if (this.selection.hasValue()) {
      this.selection.selected.forEach(selected => (this.deleteAdmin(selected.Id)));
      this.refreshData();
    }
  }
// Refresh data
  refreshData() {
    if (this.adminListSubscription)
      this.adminListSubscription.unsubscribe();
    this.getAllAdminData();
  }

  // Destroy Subscription
  ngOnDestroy() {
    if (this.adminListSubscription)
      this.adminListSubscription.unsubscribe();
  }

}
