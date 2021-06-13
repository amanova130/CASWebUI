import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { GroupService } from 'src/services/WebApi/group.service';
import { GroupUtils } from 'src/services/utils/groupUtils';
import { SelectionModel } from '@angular/cdk/collections';
import { Group } from 'src/services/models/group';


@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'Id' ,
    'GroupNumber',
    'AcademicYear',
    'NumberOfStudent',
    'Semester',
    'courses',
    'Status',  
  'action'];
  dataSource!: MatTableDataSource<Group>;

  groupList: Group[] = [];
  groupListSubscription!: Subscription;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

  constructor(private groupUtils: GroupUtils, private groupsService: GroupService) {}
  ngOnInit(): void {
    this.groupListSubscription = timer(0, 60000).pipe(
      switchMap(()=> this.groupsService.getAllGroups())
    ).subscribe((list: Group[])=>{
      this.groupList = list;
      this.dataSource = new MatTableDataSource(this.groupList);
      this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log(this.dataSource);
      // Do something
      console.log(this.groupList);
    });
  }
  selection = new SelectionModel<Group>(true, []);

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

