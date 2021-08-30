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
import { Faculty } from 'src/services/models/faculty';
import { FacultyService } from 'src/services/WebApiService/faculty.service';
import { AddEditFacultyComponent } from './components/add-edit-faculty/add-edit-faculty.component';
import { UploadFileService } from '../../../../services/WebApiService/uploadFile.service';

@Component({
  selector: 'app-faculties',
  templateUrl: './faculties.component.html',
  styleUrls: ['./faculties.component.scss']
})
export class FacultiesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'select',
    'Id',
    'FacultyName',
    'Description',
    'Courses',
    'action'];
  dataSource!: MatTableDataSource<Faculty>;
  facultyList: Faculty[] = [];
  facultyListSubscription!: Subscription;
  removeFaculty!: Faculty;
  isLoading = true;
  isSelected = false;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  @ViewChild('TABLE') table: ElementRef;
  selection = new SelectionModel<Faculty>(true, []);

  constructor(private facultyService: FacultyService,
    private modalService: NgbModal, public datepipe: DatePipe,
    private alertService: AlertService, private fileHandlerService: UploadFileService) { }

  ngOnInit(): void {
    this.getAllfacultyData();
  }
  // Retrive all faculties
  getAllfacultyData() {
    this.facultyListSubscription = timer(0, 60000).pipe(
      switchMap(() => this.facultyService.getAllFaculties())
    ).subscribe((list: Faculty[]) => {
      this.facultyList = list;
      this.dataSource = new MatTableDataSource(this.facultyList);
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
  // Filter by any char
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  //Export to excel
  exportExcell() {
    this.fileHandlerService.exportexcel(this.table.nativeElement, "Faculties.xlsx")
  }

  // Open modal window to add or edit faculties
  openModal(faculty: Faculty = { Id: "" }) {
    const ref = this.modalService.open(AddEditFacultyComponent, { centered: true });
    ref.componentInstance.faculty = faculty;
    ref.componentInstance.facultyList = this.facultyList;
    ref.result.then((result) => {
      if (result !== 'Close click') {
        this.dataSource.data = result;
      }
    });
  }
  // Delete Modal
  openDelete(faculty: Faculty = { Id: "" }) {
    this.removeFaculty = {
      Id: faculty.Id,
      FacultyName: faculty.FacultyName
    }
  }

  //Delete selected Faculties
  deleteSelectedFaculties() {
    if (this.selection.hasValue()) {
      this.selection.selected.forEach(selected => (this.deleteFaculty(selected.Id)));
    }
    this.alertService.errorFormField();
  }
  // Delete Faculty
  deleteFaculty(id: string) {
    if (id !== null || id !== undefined) {
      this.facultyService.deleteById(id).subscribe(res => {
        if (res) {
          this.facultyList = this.facultyList.filter(item => item.Id !== id);
          this.dataSource.data = this.facultyList;
          this.alertService.successResponseFromDataBase();
        }
        else
          this.alertService.errorResponseFromDataBase();
      });
    }
  }
  // Refresh
  refresh() {
    if (this.facultyListSubscription)
      this.facultyListSubscription.unsubscribe();
    this.getAllfacultyData();
  }

  ngOnDestroy() {
    if (this.facultyListSubscription)
      this.facultyListSubscription.unsubscribe();
  }
}

