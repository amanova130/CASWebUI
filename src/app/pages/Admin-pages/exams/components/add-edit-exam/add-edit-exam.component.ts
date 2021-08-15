import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, timer } from 'rxjs';
import { switchMap, first } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { Course } from 'src/services/models/course';
import { Faculty } from 'src/services/models/faculty';
import { Group } from 'src/services/models/group';
import { Teacher } from 'src/services/models/teacher';
import { CourseService } from 'src/services/WebApiService/course.service';
import { FacultyService } from 'src/services/WebApiService/faculty.service';
import { GroupService } from 'src/services/WebApiService/group.service';
import { TeacherService } from '../../../../../../services/WebApiService/teacher.service';
import { ExamDetails } from '../../../../../../services/models/examDetails';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Exam } from 'src/services/models/exam';
import { ExamService } from '../../../../../../services/WebApiService/exam.service';

@Component({
  selector: 'app-add-edit-exam',
  templateUrl: './add-edit-exam.component.html',
  styleUrls: ['./add-edit-exam.component.scss']
})
export class AddEditExamComponent implements OnInit {

  @Input()
  public exam: Exam;

  @Input()
  public examList!: Exam[];
  groupList: Group[];
  filtredGroupList: Group[];
  courseList: string[] = [];
  teacherList: Teacher[] = [];
  group: Group;
  facultyList: Faculty[] = [];
  isAddMode = false;
  isLoading = false;
  submitted = false;
  examDate: NgbDateStruct;
  newExam: Exam;
  startTime: string;
  endTime: string;

  @ViewChild('form') form!: any;

  constructor(
    private facultyService: FacultyService,
    private alertService: AlertService,
    private examService: ExamService,
    public activeModal: NgbActiveModal,
    private courseService: CourseService,
    private teacherService: TeacherService,
    private groupService: GroupService,
    public examDetails: ExamDetails
  ) {
    this.newExam = {
      Id: '',
      Course: '',
      Fac_name: '',
      Group_num: '',
      Room: null,
      Teacher_id: '',
      Test_num: '',
      StartTime: '',
      EndTime: '',
      Semester: '',
      Year: new Date().getFullYear().toString(),
      ExamDate: '',
      Status: true
    }
  }

  ngOnInit() {
    this.getFacultyList();
    this.getGroupList();
    if (this.exam === undefined)
      this.isAddMode = true;
    else {
      this.newExam = this.exam;
      //this.choosenGroup(this.newExam.Group_num);
      this.choosenCourse(this.newExam.Course);
    }
  }


  onSubmit() {
    this.isLoading = true;
    if (this.form.valid) {
      this.submitted = true;
      if (this.isAddMode) this.createExam();
      else this.updateExam();
    }
    else {
      this.alertService.errorFormField();
      this.isLoading = false;
    }
  }

  private createExam() {
    this.examService.create(this.newExam).subscribe(res => {
      if (res) {
        this.examList.push(res);
        this.isLoading = false;
        this.alertService.successResponseFromDataBase();
        // this.activeModal.close(this.examList);
      }
      else
        this.alertService.errorResponseFromDataBase();
    })
  }

  private updateExam() {
    this.examService.update(this.newExam).subscribe(res => {
      if (res) {
        this.examList = this.examList.filter(exam => exam.Id !== this.newExam.Id);
        this.examList.push(this.newExam);
        this.isLoading = false;
        this.alertService.successResponseFromDataBase();
        // this.activeModal.close(this.examList);
      }
      else
        this.alertService.errorResponseFromDataBase();
    })
  }

  public choosenCourse(course: string) {
    this.teacherService.getTeachersByCourseName(course).subscribe(res => {
      if (res)
        this.teacherList = res;
    })
  }
  public choosenGroup(group: string) {
    this.courseList = this.groupList.find(g => g.GroupNumber == group).courses;
  }

  public choosenFaculty(facultyName: string) {
    this.filtredGroupList = this.groupList.filter(group => group.Fac_Name === facultyName);
  }
  private getGroupList() {
    this.groupService.getAllGroups().subscribe(groups => {
      if (groups) {
        this.groupList = groups;
        if (this.newExam.Group_num)
          this.courseList = this.groupList.find(g => g.GroupNumber == this.newExam.Group_num).courses;
      }
    })
  }
  private getFacultyList() {
    this.facultyService.getAllFaculties().subscribe(faculties => {
      if (faculties)
        this.facultyList = faculties;
    });

  }

}
