import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AlertService } from 'src/services/helperServices/alert.service';
import { Faculty } from 'src/services/models/faculty';
import { FacultyUtils} from 'src/services/utils/facultyUtils';
import { FacultyService} from 'src/services/WebApi/faculty.service';
import { AddEditFacultyComponent } from './components/add-edit-faculty/add-edit-faculty.component';


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
  isLoading=true;
  isSelected=false;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  @ViewChild('myTable')
  myTable!: MatTable<any>;

  constructor(private facultyUtils: FacultyUtils, private facultyService: FacultyService, private modalService: NgbModal,public datepipe: DatePipe, private alertService: AlertService) {}
  ngOnInit(): void {
    this.getAllfacultyData();
  }
  selection = new SelectionModel<Faculty>(true, []);

  getAllfacultyData(){
    this.facultyListSubscription = timer(0, 60000).pipe(
      switchMap(()=> this.facultyService.getAllFaculties())
    ).subscribe((list: Faculty[])=>{
      this.facultyList = list;
      this.dataSource = new MatTableDataSource(this.facultyList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading=false;
      console.log(this.facultyList);
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    if(numSelected !== undefined)
      this.isSelected=true;
    else
      this.isSelected=false;
    return numSelected === numRows;
    
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if(this.isAllSelected())
    {
      this.selection.clear();
      this.isSelected=false;
    }
      else
      {
        this.dataSource.data.forEach(row => this.selection.select(row));
        this.isSelected=true;
      }
        
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  openModal(faculty: Faculty = {Id: ""} ){
    const ref = this.modalService.open(AddEditFacultyComponent, { centered: true });
    ref.componentInstance.faculty = faculty;
    ref.componentInstance.facultyList = this.facultyList;
    
  }

  openDelete(faculty:Faculty = {Id: ""} ){
    this.removeFaculty={
      Id: faculty.Id,
    }
  }
  deleteSelectedFaculties()
  {
    if(this.selection.hasValue())
    {
      this.selection.selected.forEach(selected=>(this.deleteFaculty(selected.Id)));
    }
  }

  deleteFaculty(id: string){
    if(id!==null || id!==undefined){
      this.facultyService.deleteById(id).subscribe(res => {
        if(res)
        {
          this.facultyList = this.facultyList.filter(item => item.Id !== id);
          this.dataSource = new MatTableDataSource(this.facultyList);

        }
      
      });
    }
  }

  refresh(){
    this.getAllfacultyData();
    console.log("Refresh done");
  }
  
  ngOnDestroy()
  {
    this.facultyListSubscription.unsubscribe();
  }
}

