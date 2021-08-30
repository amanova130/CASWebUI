import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { weekdays } from 'moment';
import { AutoResetPassComponent } from 'src/app/shared/components/auto-reset-pass/auto-reset-pass.component';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { TokenStorageService } from 'src/app/shared/helperServices/token-storage.service';
import { Schedule } from 'src/services/models/event';
import { ExtendedLink } from 'src/services/models/extended_link';
import { StudExam } from 'src/services/models/studExam';
import { TimeTable } from 'src/services/models/timeTable';
import { User } from 'src/services/models/user';
import { ExtendedLinkService } from 'src/services/WebApiService/extended_link.service';
import { TimeTableService } from 'src/services/WebApiService/timeTable.service';
import { StudExamService } from '../../../../services/WebApiService/stud-exam.service';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {
  loggedUser: User;
  groupNumber: string;
  year = new Date().getFullYear().toString();
  isLoading = false;
  isProgressLoading = false;
  lineChartData: any[];
  linkList: ExtendedLink[];
  gradeExamList: StudExam[];
  public timeTable: TimeTable;
  public schedule: Schedule[];
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor(private studExamService: StudExamService,
    private linkService: ExtendedLinkService,
    private tokenStorage: TokenStorageService,
    private alertService: AlertService,
    private timeTableService: TimeTableService,
    public datepipe: DatePipe) {
    this.loggedUser = this.tokenStorage.getUser();

  }

  ngOnInit(): void {
    this.groupNumber = this.tokenStorage.getToken('group');
    this.isLoading = true;
    this.getAllGradesByStudentId(this.loggedUser.UserName, this.year);
    this.getLinks();
    this.getUpcomingClass();
  }
  // Get all grades by Student Id
  getAllGradesByStudentId(studentId: string, year: string) {
    this.studExamService.getGradesByStudentIdAndYear(studentId, year).subscribe(result => {
      if (result)
        this.gradeExamList = result;
      this.lineChartData = this.gradeExamList.map(data => ({ name: data.JoinedField[0].test_num, value: data.Grade, course: data.JoinedField[0].course }));
    });
  }

  // Get Links
  private getLinks() {
    this.linkService.getAllLinks().subscribe((list: ExtendedLink[]) => {
      this.linkList = list;
    });
  }

  // Get Upcoming classes in time table
  private getUpcomingClass() {
    this.timeTableService.getTTByGroupNumber(this.groupNumber).subscribe(res => {
      if (res) {
        this.timeTable = res;
        this.schedule = this.timeTable.GroupSchedule;
        this.schedule.forEach(lesson => {
          lesson.rrule = {
            byweekday: new Date(lesson.Start).getDay()
          }
        });
        this.isLoading = false;
      }
    })
  }
  // Set week day
  setWeekDay(day: number): string {
    let week = '';
    switch (day) {
      case 0:
        week = "Sunday";
        break;
      case 1:
        week = "Monday";
        break;
      case 2:
        week = "Tuesday";
        break;
      case 3:
        week = "Wednesday";
        break;
      case 4:
        week = "Thursday";
        break;
      case 5:
        week = "Friday";
        break;
      case 6:
        week = "Saturday";
        break;
      default:
        week = "exists!";
        break;
    }
    return week;
  }

  // Create image path
  public createImgPath = (serverPath: string) => {
    return `https://localhost:5001/${serverPath}`;
  }
}
