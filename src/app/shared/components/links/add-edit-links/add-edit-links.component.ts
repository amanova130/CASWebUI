import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, timer } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { Course } from 'src/services/models/course';
import { ExtendedLink } from 'src/services/models/extended_link';
import { Faculty } from 'src/services/models/faculty';
import { CourseService } from 'src/services/WebApiService/course.service';
import { ExtendedLinkService } from 'src/services/WebApiService/extended_link.service';
import { FacultyService } from 'src/services/WebApiService/faculty.service';
import { UploadFileService } from 'src/services/WebApiService/uploadFile.service';

@Component({
  selector: 'app-add-edit-links',
  templateUrl: './add-edit-links.component.html',
  styleUrls: ['./add-edit-links.component.scss']
})
export class AddEditLinksComponent implements OnInit, OnDestroy {

 
@Input()
public link: ExtendedLink;
@Input()
public linkList!: ExtendedLink[];

@ViewChild('form') form!: any;
isAddMode = true;
isLoading=false;
submitted=false;
facultyList: Faculty[] = [];
facultyListSubscription!: Subscription;


constructor(
  private alertService: AlertService,
  public activeModal: NgbActiveModal,
  private linkService: ExtendedLinkService,
  private uploadFileService: UploadFileService,
  private facultyService: FacultyService,
) { }

ngOnInit(): void {
  this.getFaculties();
  this.isAddMode = !this.link.Id;
  if(this.isAddMode)
  {
    this.link= {
      Id: '',
      Title: '',
      Description: '',
      URL: '',
      Image: '',
      Status: true
    }
  }
}

private getFaculties(){
  this.facultyListSubscription = timer(0).pipe(switchMap(()=> this.facultyService.getAllFaculties())).subscribe((list: Faculty[])=>
  {
    this.facultyList = list;
  });
}

onSubmit()
{
    this.isLoading = true;
    if(this.form.valid)
    {
      this.submitted = true;
      if (this.isAddMode) 
        this.createLink();
      else this.updateLink();
    }
    else {
      this.alertService.errorFormField();
      this.isLoading = false;
    }
}

private createLink(){
  this.linkService.create(this.link)
  .pipe(first())
  .subscribe(result => {
      if(result)
      {
        this.linkList.push(result);
        this.alertService.successResponseFromDataBase();
        this.activeModal.close(this.linkList);
      
      }  
      else
      this.alertService.errorResponseFromDataBase();
  })
  .add(() => this.isLoading = false);
}

public uploadFile = (files: any) => {
  if (files.length === 0) {
    return;
  }
  let fileToUpload = <File>files[0];
  const formData = new FormData();
  formData.append('file', fileToUpload, fileToUpload.name);
  this.uploadFileService.uploadImage(formData).pipe(first())
  .subscribe(result => {
    if(result)
    this.link.Image=Object.values(result).toString();// getting location of Img in backend  locallhost:/5001/Resources/Images
  });
}


private updateLink()
{
  this.linkService.update(this.link)
  .pipe(first()).subscribe((result) => {
      if(result)
      {
        let x = this.linkList.find(x => x.Id === this.link.Id)
        let index = this.linkList.indexOf(x!)
        this.linkList[index] = this.link;
        this.alertService.successResponseFromDataBase();
        this.activeModal.close(this.linkList);
     
      }
      else
      this.alertService.errorResponseFromDataBase();
  })
  .add(() => this.isLoading = false);
}

refresh(): void {
  window.location.reload();
}

ngOnDestroy(){
  if(this.facultyListSubscription)
    this.facultyListSubscription.unsubscribe();
}
}
