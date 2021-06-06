import { Component, OnInit } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { Student } from 'src/services/models/student';
import { Subscription,timer } from 'rxjs';
import { StudentUtils } from 'src/services/utils/studentUtils';
import { StudentsService } from 'src/services/WebApi/student.service';
import { switchMap } from 'rxjs/operators';





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
    'PersonalUser',
  'action'];
  dataSource!: MatTableDataSource<Student>;
  studentList: Student[] = [];
  studentListSubscription!: Subscription;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

  constructor(private studentUtils: StudentUtils, private studentService: StudentsService) {}
  ngOnInit(): void {
    this.studentListSubscription = timer(0, 60000).pipe(
      switchMap(()=> this.studentService.getAllstudents())
    ).subscribe((list: Student[])=>{
      this.studentList = list;
      this.dataSource = new MatTableDataSource(this.studentList);
      this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log(this.dataSource);
      // Do something
      console.log(this.studentList);
    });
  }
  selection = new SelectionModel<Student>(true, []);




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
}

