import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { GroupService } from 'src/services/WebApiService/group.service';

import { SelectionModel } from '@angular/cdk/collections';
import { Group } from 'src/services/models/group';
import { AddEditGroupComponent } from './components/add-edit-group/add-edit-group.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { getMatIconFailedToSanitizeLiteralError } from '@angular/material/icon';
import { UploadFileService } from '../../../../services/WebApiService/uploadFile.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit, OnDestroy {
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
  isSelected = false;
  groupList: Group[] = [];
  groupListSubscription!: Subscription;
  removeGroup: Group;
  isLoading = false;;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  @ViewChild('TABLE') table: ElementRef;

  constructor(private modalService: NgbModal,
    private alertService: AlertService, private groupService: GroupService,
    private fileHandlerService: UploadFileService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.getAllGroupData();
  }
  selection = new SelectionModel<Group>(true, []);
  // Get All Groups
  getAllGroupData() {
    this.groupListSubscription = timer(0, 60000).pipe(
      switchMap(() => this.groupService.getAllGroups())
    ).subscribe((list: Group[]) => {
      this.groupList = list;
      this.dataSource = new MatTableDataSource(this.groupList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading = false;
    },
      error => {
        this.alertService.genericAlertMsg("error", error);
        this.isLoading = false;
      });
  }
  // Export to Excel
  exportExcell() {
    this.fileHandlerService.exportexcel(this.table.nativeElement, "Groups.xlsx")
  }

  // Open Modal to add or edit group 
  openModal(group: Group = { Id: "" }) {
    const ref = this.modalService.open(AddEditGroupComponent, { centered: true });
    ref.componentInstance.group = group;
    //ref.componentInstance.student.Birth_date=this.datepipe.transform(student.Birth_date,'yyyy-MM-dd');
    ref.componentInstance.groupList = this.groupList;
    ref.result.then((result) => {
      if (result !== 'Close click') {
        this.dataSource.data = result;
      }
    });
  }
  // Open delete modal
  openDelete(group: Group = { Id: "" }) {
    this.removeGroup = {
      Id: group.Id,
      GroupNumber: group.GroupNumber
    }
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
  // Filter by char
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Delete selected groups
  deleteSelectedGroups() {
    if (this.selection.hasValue()) {
      this.selection.selected.forEach(selected => (this.deleteGroup(selected.Id)));
      this.refreshData();
    }
  }

  //Delete group
  deleteGroup(id: string) {
    if (id !== null || id !== undefined) {
      this.groupService.deleteById(id).subscribe(res => {
        if (res) {
          this.groupList = this.groupList.filter(item => item.Id !== id);
          this.dataSource.data = this.groupList;
          this.alertService.successResponseFromDataBase();
        }
      },
        error => {
          this.alertService.genericAlertMsg("error", error);
        });
    }
  }
  // Refresh
  refreshData() {
    if (this.groupListSubscription)
      this.groupListSubscription.unsubscribe();
    this.getAllGroupData();
  }

  ngOnDestroy() {
    if (this.groupListSubscription)
      this.groupListSubscription.unsubscribe();
  }

}

