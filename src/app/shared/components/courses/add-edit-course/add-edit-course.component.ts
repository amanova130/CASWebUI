import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { Course } from 'src/services/models/course';
import { CourseService } from 'src/services/WebApiService/course.service';
import { UploadFileService } from 'src/services/WebApiService/uploadFile.service';

@Component({
  selector: 'app-add-edit-course',
  templateUrl: './add-edit-course.component.html',
  styleUrls: ['./add-edit-course.component.scss']
})
export class AddEditCourseComponent implements OnInit {

@Input()
  public course: Course;
@Input()
  public courseList!: Course[];
@Input()
  public dataSource: MatTableDataSource<Course>;

@ViewChild('form') form!: any;
isAddMode = true;
isLoading=false;
submitted=false;


  constructor(
    private alertService: AlertService,
    public activeModal: NgbActiveModal,
    private courseService: CourseService,
    private uploadFileService: UploadFileService,
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.isAddMode = !this.course.Id;
    if(this.isAddMode)
    {
      this.course= {
        Id: '',
        CourseName: '',
        Description: '',
        Duration: null,
        Image: '',
        Status: true
      }
    }
  }

  onSubmit()
  {
      this.isLoading = true;
      if(this.form.valid)
      {
        this.submitted = true;
        if (this.isAddMode) 
          this.createCourse();
        else this.updateCourse();
      }
      else {
        this.alertService.errorFormField();
        this.isLoading = false;
      }
  }

  private createCourse(){
    this.courseService.create(this.course)
    .pipe(first())
    .subscribe(result => {
        if(result)
        {
          this.courseList.push(result)
          this.activeModal.close(this.courseList);
          this.alertService.successResponseFromDataBase();

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
      this.course.Image=Object.values(result).toString();
    });
  }


  private updateCourse()
  {
    this.courseService.update(this.course)
    .pipe(first()).subscribe((result) => {
        if(result)
        {
          let x = this.courseList.find(x => x.Id === this.course.Id)
          let index = this.courseList.indexOf(x!)
          this.courseList[index] = this.course;
          this.alertService.successResponseFromDataBase();
          this.activeModal.close(this.courseList);
        }
        else
        this.alertService.errorResponseFromDataBase();
    })
    .add(() => this.isLoading = false);
  }

  refresh(): void {
    window.location.reload();
}
}
