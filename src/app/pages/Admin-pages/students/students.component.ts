import { Component, ElementRef, OnInit } from '@angular/core';
import {ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { Student } from 'src/services/models/student';
import { Subject, Subscription,timer } from 'rxjs';
import { StudentUtils } from 'src/services/utils/studentUtils';
import { StudentService} from 'src/services/WebApiService/student.service';
import { switchMap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEditStudentComponent } from './components/add-edit-student/add-edit-student.component';
import { DatePipe } from '@angular/common';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { UploadFileService } from 'src/services/WebApiService/uploadFile.service';
import { saveAs } from 'file-saver'
import { UploadExcelModalComponent } from 'src/app/shared/components/upload-excel-modal/upload-excel-modal.component';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit{
  displayedColumns: string[] = [
    'select',
    'Id' ,
    'First_name',
    'Last_name',
    'Image' ,
    'Email',
    'Phone',
    'Gender',
    'Birth_date',
    'Address',
    'Group_Id',
  'action'];
  dataSource!: MatTableDataSource<Student>;
  studentList: Student[] = [];
  studentListSubscription!: Subscription;
  removeStudent: Student;
  refresh: Subject<any> = new Subject();

  isLoading=false;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  @ViewChild('TABLE') table: ElementRef;

  constructor(private studentService: StudentService,private modalService: NgbModal,public datepipe:DatePipe, private uploadFileService: UploadFileService, private alertService: AlertService) {}
  ngOnInit(): void {
    this.isLoading=true;
    this.getAllStudentData();
    
    
  }
  selection = new SelectionModel<Student>(true, []);

  getAllStudentData(){
    this.studentListSubscription = timer(0, 60000).pipe(
      switchMap(()=> this.studentService.getAllstudents())
    ).subscribe((list: Student[])=>{
      this.studentList = list;
      this.dataSource = new MatTableDataSource(this.studentList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading=false;
    });
    
  }

  openModal(student: Student = {Id: ""} ){
    const ref = this.modalService.open(AddEditStudentComponent, { centered: true });
    ref.componentInstance.student = student;
    ref.componentInstance.student.Birth_date=this.datepipe.transform(student.Birth_date,'yyyy-MM-dd');
    ref.componentInstance.studentList = this.studentList; 
    ref.result.then((result) => {
      if (result !== 'Close click') {
       this.dataSource.data = result;
      }
      });

    }

  openDelete(student:Student = {Id: ""} ){
    this.removeStudent={
      Id: student.Id,
      First_name: student.First_name,
      Last_name: student.Last_name
    }
  }

  public createImgPath = (serverPath: string) => {
    return `https://localhost:5001/${serverPath}`;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  deleteStudent(id: string){
    if(id!==null || id!==undefined){
      this.studentService.deleteById(id).subscribe(res => {
        if(res)
        {
          this.studentList = this.studentList.filter(item => item.Id !== id);
          this.dataSource.data = this.studentList;
          this.alertService.successResponseFromDataBase();
        }
        else
        this.alertService.errorResponseFromDataBase();
      });
    }
  }

  exportExcell(){
    this.uploadFileService.exportToExcell('student').subscribe( response => {
      if(response.size > 0)
      {
        saveAs(response, "ReportStudents.xls");
        this.alertService.successResponseFromDataBase();
      }
      else
      {
        this.alertService.errorResponseFromDataBase();
      }
    })
  }

  uploadToExcell(){
    const ref = this.modalService.open(UploadExcelModalComponent, { centered: true, size: 'xl'  ,scrollable: true });
    // ref.result.then((result) => {
    //   if (result) {
    //    this.dataSource.data = result;
    //   }
    //   });
  }

  refreshData(){
    if(this.studentListSubscription)
      this.studentListSubscription.unsubscribe();
    this.getAllStudentData();
  }

  ngOnDestroy(){
    if(this.studentListSubscription)
      this.studentListSubscription.unsubscribe();
  }
}

