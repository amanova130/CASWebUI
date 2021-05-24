import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TeachersService } from 'src/services/WebApi/teacher.service';
import { Teacher } from 'src/services/models/teacher';
import { TeacherUtils } from 'src/services/utils/teacherUtils';
import { SelectionModel } from '@angular/cdk/collections';


@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss']
})
export class TeachersComponent implements OnInit {
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
    'Status',
    'TeachesCourses',
  'action'];
  dataSource!: MatTableDataSource<Teacher>;

  teacherList: Teacher[] = [];
  teacherListSubscription!: Subscription;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

  constructor(private teacherUtils: TeacherUtils, private teacherService: TeachersService) {}
  ngOnInit(): void {
    this.teacherListSubscription = timer(0, 60000).pipe(
      switchMap(()=> this.teacherService.getAllTeachers())
    ).subscribe((list: Teacher[])=>{
      this.teacherList = list;
      this.dataSource = new MatTableDataSource(this.teacherList);
      this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log(this.dataSource);
      // Do something
      console.log(this.teacherList);
    });
  }
  selection = new SelectionModel<Teacher>(true, []);

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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

