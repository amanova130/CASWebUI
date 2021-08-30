import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
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
import { TokenStorageService } from '../../helperServices/token-storage.service';
import { User } from 'src/services/models/user';
import { Role } from '../../pipes-and-enum/roleEnum';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss'],
})
export class LinksComponent implements OnInit, OnDestroy {
  isAddMode: boolean;
  isLoading = true;
  obs: Observable<any>;
  linkListSubscription: Subscription;
  linkList: ExtendedLink[];
  dataSource!: MatTableDataSource<ExtendedLink>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  link: ExtendedLink = {
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
  loggedUser: User;
  isStudent = true;

  constructor(
    private linkService: ExtendedLinkService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private facultyService: FacultyService,
    private sliderService: SliderService,
    private tokenStorage: TokenStorageService
  ) { }

  ngOnInit(): void {
    this.loggedUser = this.tokenStorage.getUser();
    if (this.loggedUser.Role === Role.Student)
      this.isStudent = !this.isStudent;
    this.getFaculties();
    this.getLinks();
    this.responsiveOptions = this.sliderService.responsiveOptions;
    this.backgroundImg = this.sliderService.backgroundImages;
  }
  // Set Background Image to faculty cards
  setBackgroundImg(num: any) {
    return `url(${this.backgroundImg[num]})`;
  }
  // Get All Links
  private getLinks() {
    this.linkListSubscription = timer(0, 60000).pipe(switchMap(() => this.linkService.getAllLinks())).subscribe((list: ExtendedLink[]) => {
      this.linkList = list;
      this.filtredLinkList = this.linkList;
      this.isLoading = false;
    },
      error => {
        this.alertService.genericAlertMsg("error", error);
        this.isLoading = false;
      });
  }

  //Create image Path
  public createImgPath = (serverPath: string) => {
    return `https://localhost:5001/${serverPath}`;
  }

  //Filter Links by Faculty name
  getLinksByFaculty(faculty: string) {
    this.filtredLinkList = this.linkList.filter(link => link.Fac_name == faculty);
    if (this.filtredLinkList.length == 0)
      this.filtredLinkList = this.linkList;
  }

  // Open add and edit modal window for Links
  openAddEditModal(link: ExtendedLink = { Id: "" }) {
    const ref = this.modalService.open(AddEditLinksComponent, { centered: true });
    ref.componentInstance.link = link;
    ref.componentInstance.linkList = this.linkList;
    ref.result.then((result) => {
      if (result !== 'Close click') {
        this.linkList = result;
      }
    });
  }
  // Open Delete Modal
  openDeleteModal(link: ExtendedLink = { Id: "" }) {
    this.link.Id = link.Id;
    this.link.Title = link.Title;
  }
  // Delete link
  deleteLink(id: string) {
    if (id !== null || id !== undefined) {
      this.linkService.deleteById(id).subscribe(res => {
        if (res) {
          this.linkList = this.linkList.filter(item => item.Id !== id);
          this.alertService.successResponseFromDataBase();
        }
      },
        error => {
          this.alertService.genericAlertMsg("error", error);
          this.isLoading = false;
        });
    }
  }
  //Refresh the data
  refresh() {
    if (this.linkListSubscription)
      this.linkListSubscription.unsubscribe();
    this.getLinks();
  }
// Get Faculties
  private getFaculties() {
    this.facultyListSubscription = timer(0).pipe(switchMap(() => this.facultyService.getAllFaculties())).subscribe((list: Faculty[]) => {
      this.facultyList = list;
    });
  }

  ngOnDestroy() {
    if (this.linkListSubscription)
      this.linkListSubscription.unsubscribe();
  }
}
