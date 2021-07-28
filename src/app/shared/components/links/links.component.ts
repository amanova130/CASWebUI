import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AddEditCourseComponent } from 'src/app/shared/components/courses/add-edit-course/add-edit-course.component';
import { Course } from 'src/services/models/course';
import { ExtendedLink } from 'src/services/models/extended_link';
import { Faculty } from 'src/services/models/faculty';
import { CourseService } from 'src/services/WebApiService/course.service';
import { ExtendedLinkService } from 'src/services/WebApiService/extended_link.service';
import { FacultyService } from 'src/services/WebApiService/faculty.service';
import { AlertService } from '../../helperServices/alert.service';
import { AddEditLinksComponent } from './add-edit-links/add-edit-links.component';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss']
})
export class LinksComponent implements OnInit, OnDestroy {
  isAddMode: boolean;
  isLoading=true;
  obs: Observable<any>;
  linkListSubscription: Subscription;
  linkList: ExtendedLink[];
  dataSource!: MatTableDataSource<ExtendedLink>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  link: ExtendedLink={
    Id: "",
  };
  @ViewChild('form') form!: any;
  submitted: boolean;
  facultyList: Faculty[] = [];
  facultyListSubscription!: Subscription;

  constructor( 
    private linkService: ExtendedLinkService, 
    private alertService: AlertService, 
    private http: HttpClient, 
    private changeDetectorRef: ChangeDetectorRef,
    private modalService: NgbModal,
    private facultyService: FacultyService,
     ) {}
  
  ngOnInit(): void {
    this.changeDetectorRef.detectChanges();
    this.getFaculties();
   this.getLinks()
  }

  private getLinks(){
    this.linkListSubscription = timer(0, 60000).pipe(switchMap(()=> this.linkService.getAllLinks())).subscribe((list: ExtendedLink[])=>
    {
      this.linkList = list;
      this.isLoading=false;
    });
  }


  public createImgPath = (serverPath: string) => {
    return `https://localhost:5001/${serverPath}`;
  }

  openAddEditModal(link: ExtendedLink = {Id: ""} ){
    const ref = this.modalService.open(AddEditLinksComponent, { centered: true });
    ref.componentInstance.link = link;
    ref.componentInstance.linkList = this.linkList;
    ref.result.then((result) => {
      if(result !== 'Close click')
      {
        this.linkList = result;
      }
    });

  }

  openDeleteModal(link: ExtendedLink = {Id: ""}){
    this.link.Id = link.Id;
    this.link.Title = link.Title;
  }

  deleteLink(id: string){
    if(id!==null || id!==undefined){
      this.linkService.deleteById(id).subscribe(res => {
        if(res)
        {
          this.linkList = this.linkList.filter(item => item.Id !== id);
          this.alertService.successResponseFromDataBase();
        }
        else
          this.alertService.errorResponseFromDataBase();
      
      });
    }
  }
  refresh(){
    if(this.linkListSubscription)
      this.linkListSubscription.unsubscribe();
    this.getLinks();
  }
  private getFaculties(){
    this.facultyListSubscription = timer(0).pipe(switchMap(()=> this.facultyService.getAllFaculties())).subscribe((list: Faculty[])=>
    {
      this.facultyList = list;
    });
  }

  ngOnDestroy()
  {
    if(this.linkListSubscription)
      this.linkListSubscription.unsubscribe();
  }
}
