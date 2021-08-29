import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TokenStorageService } from 'src/app/shared/helperServices/token-storage.service';
import { Exam } from 'src/services/models/exam';
import { StudExam } from 'src/services/models/studExam';
import { Teacher } from 'src/services/models/teacher';
import { User } from 'src/services/models/user';
import { StudentService } from 'src/services/WebApiService/student.service';
import { TeacherService } from 'src/services/WebApiService/teacher.service';
import { StudExamService } from '../../../../../../services/WebApiService/stud-exam.service';
import { UploadFileService } from '../../../../../../services/WebApiService/uploadFile.service';
import { AlertService } from '../../../../../shared/helperServices/alert.service';

@Component({
  selector: 'app-exam-view-tab',
  templateUrl: './exam-view-tab.component.html',
  styleUrls: ['./exam-view-tab.component.scss']
})
export class ExamViewTabComponent implements OnInit {
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  loggedUser: User;
  isLoading = false;
  groupNumber: string;
  gradeExamList: StudExam[];
  year = new Date().getFullYear().toString();
  dataSource!: MatTableDataSource<StudExam>;
  teacherList: Teacher[] = [];
  teacher: string;
  @ViewChild('TABLE') table: ElementRef;
  displayedColumns: string[] = [
    'Course',
    'Date',
    'Time',
    'Room',
    'Semester',
    'Test_Number',
    'Teacher_name',
    'Grade',
    'UpdatedDate'
  ];

  constructor(private tokenStorage: TokenStorageService, private studentService: StudentService,
    private studExamService: StudExamService, private teacherService: TeacherService, private fileHandlerService: UploadFileService, private alertService: AlertService) {
    this.loggedUser = this.tokenStorage.getUser();
    this.groupNumber = this.tokenStorage.getToken('group');
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.getAllTeacher();
    this.getGradesbyStudentIdAndYear(this.loggedUser.UserName, this.year);
  }
  exportExcell(){
    this.fileHandlerService.exportexcel(this.table.nativeElement, "Exams and Grades.xlsx")
  }
  choosenYear(event: string) {
    if(event != null || event != undefined)
    {
      this.year = event;
      this.getGradesbyStudentIdAndYear(this.loggedUser.UserName, this.year);
    }
    else
    this.alertService.errorFormField();
    
  }

  getAllTeacher() {
    this.teacherService.getAllTeachers().subscribe(res => {
      if (res)
        this.teacherList = res;
    });
  }

  getTeacherById(id: string) {
    if (id !== null && id !== undefined) {
      this.teacherList.forEach(teach => {
        if (teach.Id === id)
          this.teacher = teach.Last_name + ' ' + teach.First_name;
      });
      return this.teacher;
    }
    else
      return '';
  }
  getGradesbyStudentIdAndYear(studentId: string, year: string) {
    this.studExamService.getGradesByStudentIdAndYear(studentId, year).subscribe(result => {
      if (result)
        this.gradeExamList = result;
        this.dataSource = new MatTableDataSource(this.gradeExamList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
    });
  }

}
