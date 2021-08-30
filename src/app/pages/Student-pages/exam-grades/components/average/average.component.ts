import { Component, OnInit } from '@angular/core';
import { totalmem } from 'os';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { TokenStorageService } from 'src/app/shared/helperServices/token-storage.service';
import { CourseAvg } from 'src/services/models/courseAvg';
import { User } from 'src/services/models/user';
import { StudExamService } from 'src/services/WebApiService/stud-exam.service';
import { StudentService } from 'src/services/WebApiService/student.service';
import { TeacherService } from 'src/services/WebApiService/teacher.service';
import { UploadFileService } from 'src/services/WebApiService/uploadFile.service';

@Component({
  selector: 'app-average',
  templateUrl: './average.component.html',
  styleUrls: ['./average.component.scss']
})
export class AverageComponent implements OnInit {
  loggedUser: User;
  isLoading = false;
  groupNumber: string;
  year = new Date().getFullYear().toString();
  avgByStudentId: CourseAvg[];
  pieChartsData: any[];
  view: any[] = [700, 400];
  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  noData = false;
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(private tokenStorage: TokenStorageService, private studentService: StudentService,
    private studExamService: StudExamService, private teacherService: TeacherService,
    private fileHandlerService: UploadFileService, private alertService: AlertService,) {
    this.loggedUser = this.tokenStorage.getUser();
    this.groupNumber = this.tokenStorage.getToken('group');
  }

  ngOnInit(): void {
    this.getAverage(this.loggedUser.UserName, this.year, this.groupNumber);
  }

  // Get average by choosen year
  getAverage(studentId: string, year: string, groupNumber: string) {
    this.studExamService.getAvgOfGradesByStudentId(studentId, year, groupNumber).subscribe(result => {
      if (result.length > 0) {
        this.avgByStudentId = result;
        this.pieChartsData = result.map(data => ({ name: data.courseName, value: data.avg }));
      }
      else{
        this.noData = true;
      }
    },
    error => {
      this.alertService.genericAlertMsg("error", error);
    });
  }
// Choose year form field
  choosenYear(event: string) {
    if (event != null || event != undefined) {
      this.year = event;
      this.getAverage(this.loggedUser.UserName, this.year, this.groupNumber);
    }
    else
      this.alertService.errorFormField();
  }
  setTotalAverage(){
    let total = 0
    if(this.avgByStudentId != undefined)
    {
      if(this.avgByStudentId.length > 0)
      {
        this.avgByStudentId.every(avg=> total += avg.avg);
        total /= this.avgByStudentId.length;
      }
    }
    return total.toFixed(1);
  }
}
