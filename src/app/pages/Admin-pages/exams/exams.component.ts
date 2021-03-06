import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, timer } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { Exam } from 'src/services/models/exam';
import { Group } from 'src/services/models/group';
import { Teacher } from 'src/services/models/teacher';
import { ExamService } from 'src/services/WebApiService/exam.service';
import { GroupService } from 'src/services/WebApiService/group.service';
import { TeacherService } from '../../../../services/WebApiService/teacher.service';
import { AddEditExamComponent } from './components/add-edit-exam/add-edit-exam.component';
import { UploadFileService } from '../../../../services/WebApiService/uploadFile.service';

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.scss']
})
export class ExamsComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'Fac_name',
    'Group_num',
    'Course',
    'Teacher_id',
    'ExamDate',
    'Start_time',
    'End_time',
    'Room',
    'Semester',
    'Test_num',
    'action'];
  dataSource!: MatTableDataSource<Exam>;
  teacherList: Teacher[] = [];
  teacher: string;
  examList: Exam[] = [];
  groupList: Group[] = [];
  examListSubscription!: Subscription;
  removeExam!: Exam;
  isLoading = true;
  isSelected = false;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  @ViewChild('myTable')
  myTable!: MatTable<any>;
  @ViewChild('TABLE') table: ElementRef;
  selection = new SelectionModel<Exam>(true, []);

  constructor(private examService: ExamService,
    private teacherService: TeacherService,
    private modalService: NgbModal,
    public datepipe: DatePipe,
    private alertService: AlertService,
    private groupService: GroupService,
    private fileHandlerService: UploadFileService
  ) { }
  ngOnInit(): void {
    this.getAllExamData();
    this.getAllTeachers();
  }

  // Get All exam data
  getAllExamData() {
    this.examListSubscription = timer(0, 60000).pipe(
      switchMap(() => this.examService.getAllExams())
    ).subscribe((list: Exam[]) => {
      this.examList = list;
      this.dataSource = new MatTableDataSource(this.examList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading = false;
    },
      error => {
        this.alertService.genericAlertMsg("error", error);
        this.isLoading = false;
      });
  }
  // Get all teachers
  getAllTeachers() {
    this.teacherService.getAllTeachers().subscribe(res => {
      if (res)
        this.teacherList = res;
    });
  }
  // filter teacher by id
  getTeacherById(id: string) {
    if (id !== null && id !== undefined) {
      this.teacherList.forEach(teach => {
        if (teach.Id === id)
          this.teacher = teach.Last_name + ' ' + teach.First_name;
      });
      return this.teacher;
    }
    else
      return '';
  }

  // Export to excel
  exportExcell() {
    this.fileHandlerService.exportexcel(this.table.nativeElement, "Exams.xlsx")
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
  // filter by any char
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  // Open add or edit modal window
  openModal(exam?: Exam) {
    const ref = this.modalService.open(AddEditExamComponent, { centered: true });
    ref.componentInstance.exam = exam;
    ref.componentInstance.examList = this.examList;
    ref.result.then((result) => {
      if (result !== 'Close click') {
        this.dataSource.data = result;
      }
    });
  }
  // Open Delete modal
  openDelete(exam: Exam) {
    this.removeExam =
    {
      Id: exam.Id,
      Course: exam.Course
    }
  }
  // Delete selected Exams
  deleteSelectedExams() {
    if (this.selection.hasValue()) {
      this.selection.selected.forEach(selected => (this.deleteExam(selected.Id)));
    }
    this.alertService.errorFormField();
  }
  // Delete Exam
  deleteExam(id: string) {
    if (id !== null || id !== undefined) {
      this.examService.deleteById(id).subscribe(res => {
        if (res) {
          this.examList = this.examList.filter(item => item.Id !== id);
          this.dataSource.data = this.examList;
          this.alertService.successResponseFromDataBase();
        }
        else
          this.alertService.errorResponseFromDataBase();
      });
    }
  }
  // Refresh
  refresh() {
    if (this.examListSubscription)
      this.examListSubscription.unsubscribe();
    this.getAllExamData();
  }

  ngOnDestroy() {
    if (this.examListSubscription)
      this.examListSubscription.unsubscribe();
  }
}
