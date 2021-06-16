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
import { AddEditGroupComponent } from './components/add-edit-group/add-edit-group.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/services/helperServices/alert.service';


@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'GroupNumber',
    'AcademicYear',
    'NumberOfStudent',
    'Semester',
    'courses',
    'Fac_Name',
  'action'];
  dataSource!: MatTableDataSource<Group>;

  groupList: Group[] = [];
  groupListSubscription!: Subscription;
  removeGroup: Group;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

  constructor(private groupUtils: GroupUtils,private modalService: NgbModal,private alertService: AlertService, private groupService: GroupService) {}
  ngOnInit(): void {
    this.getAllGroupData();
  }
  selection = new SelectionModel<Group>(true, []);

getAllGroupData(){
  this.groupListSubscription = timer(0, 60000).pipe(
    switchMap(()=> this.groupService.getAllGroups())
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

openModal(group: Group = {Id: ""} ){
  const ref = this.modalService.open(AddEditGroupComponent, { centered: true });
  ref.componentInstance.group = group;
  //ref.componentInstance.student.Birth_date=this.datepipe.transform(student.Birth_date,'yyyy-MM-dd');
  ref.componentInstance.groupList = this.groupList; 
}

openDelete(group:Group = {Id: ""} ){
  this.removeGroup={
    Id: group.Id,
    GroupNumber:group.GroupNumber
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteGroup(id: string){
    if(id!==null || id!==undefined){
      this.groupService.deleteById(id).subscribe(res => {
        if(res)
        {
          this.groupList = this.groupList.filter(item => item.Id !== id);
          this.dataSource = new MatTableDataSource(this.groupList);
          this.alertService.success("Group deleted successfully!");
          console.log('Group deleted successfully!');
        }
      
      });
    }
  }
}

