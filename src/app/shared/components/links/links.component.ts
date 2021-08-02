import { AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { ChangeDetectorRef, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ExtendedLink } from 'src/services/models/extended_link';
import { Faculty } from 'src/services/models/faculty';
import { ExtendedLinkService } from 'src/services/WebApiService/extended_link.service';
import { FacultyService } from 'src/services/WebApiService/faculty.service';
import { AlertService } from '../../helperServices/alert.service';
import { SliderService } from '../../helperServices/slider.service';
import { AddEditLinksComponent } from './add-edit-links/add-edit-links.component';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss'],
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
  filtredLinkList: ExtendedLink[];
  facultyList: Faculty[] = [];
  facultyListSubscription!: Subscription;
  responsiveOptions: any;
  backgroundImg: any; 
  sliderItems: any;

  constructor( 
    private linkService: ExtendedLinkService, 
    private alertService: AlertService, 
    private modalService: NgbModal,
    private facultyService: FacultyService,
    private sliderService: SliderService,
    private cdRef:ChangeDetectorRef
     ) {}
  
  ngOnInit(): void {
    this.getFaculties();
    this.getLinks();
    this.responsiveOptions = this.sliderService.responsiveOptions;
    this.backgroundImg = this.sliderService.backgroundImages;
  }

  setBackgroundImg(num: any){
    return `url(${this.backgroundImg[num]})`;
  }

  private getLinks(){
    this.linkListSubscription = timer(0, 60000).pipe(switchMap(()=> this.linkService.getAllLinks())).subscribe((list: ExtendedLink[])=>
    {
      this.linkList = list;
      this.filtredLinkList = this.linkList;
      this.isLoading=false;
    });
  }


  public createImgPath = (serverPath: string) => {
    return `https://localhost:5001/${serverPath}`;
  }
  getLinksByFaculty(faculty : string)
  {
    this.filtredLinkList=this.linkList.filter(link=> link.Fac_name == faculty);
    if(this.filtredLinkList.length == 0)
      this.filtredLinkList = this.linkList;
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
