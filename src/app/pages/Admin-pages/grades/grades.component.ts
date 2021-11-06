import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ExamDetails } from 'src/services/models/examDetails';
import { Group } from 'src/services/models/group';
import { GroupService } from '../../../../services/WebApiService/group.service';
import { StudentService } from '../../../../services/WebApiService/student.service';
import { ExamService } from '../../../../services/WebApiService/exam.service';
import { Exam } from 'src/services/models/exam';
import { MatTableDataSource } from '@angular/material/table';
import { Grade } from 'src/services/models/grade';
import { Student } from '../../../../services/models/student';
import { StudExam } from '../../../../services/models/studExam';
import { AlertService } from '../../../shared/helperServices/alert.service';
import { Message } from 'src/services/models/message';
import { MessageService } from '../../../../services/WebApiService/message.service';
import { StudExamService } from 'src/services/WebApiService/stud-exam.service';
import { UploadFileService } from '../../../../services/WebApiService/uploadFile.service';

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.scss']
})
export class GradesComponent implements OnInit {
  studExamList: StudExam[] = [];
  selectionObject = {
    semester: '',
    year: new Date().getFullYear().toString(),
    group: '',
    examId: '',
    testNumber: ''
  };
  isLoading = false;
  showTable = false;
  dataSource!: MatTableDataSource<Student>;
  studentList: Student[] = [];
  showExam = false;
  groupList: Group[] = [];
  examList: Exam[] = [];
  email: Message;
  @ViewChild('TABLE') table: ElementRef;

  constructor(
    public examDetails: ExamDetails,
    private groupService: GroupService,
    private examService: ExamService,
    private alertService: AlertService,
    private messageService: MessageService,
    private studExamService: StudExamService,
    private fileHandlerService: UploadFileService,
  ) { }

  ngOnInit(): void {
    this.getAllGroups();
    this.newEmailDetails();
  }
// Get all groups 
  getAllGroups() {
    this.groupService.getAllGroups().subscribe(
      data => {
        if (data)
          this.groupList = data;
      }
    )
  }
// Get exam by Group, semester, year and test number
  getExamForGroup(event: any) {
    this.examList = [];
    if (this.selectionObject.group != '' && this.selectionObject.semester != '' && this.selectionObject.year != '') {
      this.examService.getExamByGroup(this.selectionObject.group, this.selectionObject.semester,
        this.selectionObject.year, this.selectionObject.testNumber).subscribe(data => {
          if (data)
            this.examList = data;
          this.showExam = true;
        });
    }
  }

  // Export to excel
  exportExcell() {
    this.fileHandlerService.exportexcel(this.table.nativeElement, "Grades.xlsx")
  }
// filter by char
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Display list of students by exam id
  setStudExam(event: any) {
    this.studExamService.getAllStudentsGradeByExamId(this.selectionObject.examId).subscribe(result => {
      if (result) {
        this.studExamList = result;
        this.dataSource = new MatTableDataSource(this.studExamList);
        this.showTable = !this.showTable;
      }
    },
    error => {
      this.alertService.genericAlertMsg("error", error);
      this.isLoading = false;
    });
  }

  // Send an email for students when grades change
  sentEmailForStudents() {
    if (this.email !== null && this.email !== undefined) {
      this.messageService.create(this.email).subscribe(data => {
        if (data)
          this.alertService.genericAlertMsg("success", "Emails for students were sent");
      },
        err => {
          this.alertService.errorResponseFromDataBase();
        })
    }
  }
// Change group settings
  changeGroup() {
    this.selectionObject.testNumber = '';
    this.selectionObject.examId = '';
    this.dataSource.data.length = 0;
  }
// Edit grade on blur, table editable and Admin could change the grade automaticaly
  editGrade(event: any, studExam: StudExam) {
    var grade = +event.target.value;
    if (grade > 0 && grade < 100) {
      if (this.selectionObject.examId != '' && this.selectionObject.testNumber != '') {
        let newGrade: StudExam = {
          Id: studExam.Id,
          StudId: studExam.StudId,
          ExamId: studExam.ExamId,
          UpdatedDate: new Date().toLocaleDateString(),
          Year: studExam.Year,
          Grade: grade
        }
        this.studExamService.update(newGrade).subscribe(res => {
          if (res) {
            if (!this.email.Receiver.includes(studExam.JoinedField[0].email)) {
              this.email.Receiver.push(studExam.JoinedField[0].email);
              this.email.ReceiverNames.push(studExam.JoinedField[0].f_name + ' ' + studExam.JoinedField[0].l_name);
            }
          }
        })
      }
      else
        this.alertService.genericAlertMsg("error", "Please choose all fields!");
    }
    else
      this.alertService.genericAlertMsg("warning", "Grade must be between 0 and 100");
  }
// Setting a new email details
  newEmailDetails() {
    this.email = {
      Subject: "You have been graded!",
      Description: "Please check your grade in our portal. If you have a question please contact us",
      Receiver: [],
      DateTime: new Date(),
      ReceiverNames: [],
      Status: true
    }
  }

}
