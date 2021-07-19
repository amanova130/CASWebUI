import { Component, OnInit } from '@angular/core';
import {ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { Student } from 'src/services/models/student';
import { Subject, Subscription,timer } from 'rxjs';
import { StudentUtils } from 'src/services/utils/studentUtils';
import { StudentService} from 'src/services/WebApi/student.service';
import { switchMap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEditStudentComponent } from './components/add-edit-student/add-edit-student.component';
import { DatePipe } from '@angular/common';
import { AlertService } from 'src/services/helperServices/alert.service';





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

  constructor(private studentService: StudentService,private modalService: NgbModal,public datepipe:DatePipe) {}
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
      if (result) {
      this.refreshData();
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
          this.dataSource = new MatTableDataSource(this.studentList);
        }
      
      });
    }
  }


  refreshData(){
    this.getAllStudentData();
    console.log("Refresh done");
  }
}

