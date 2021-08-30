import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/shared/helperServices/token-storage.service';
import { Course } from 'src/services/models/course';
import { TimeTable } from 'src/services/models/timeTable';
import { CourseService } from 'src/services/WebApiService/course.service';
import { TimeTableService } from 'src/services/WebApiService/timeTable.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {
  public courses: Course[];
  public timeTable: TimeTable;
  public progressInfo: any[] = [];
  public isLoading = false;

  constructor(private courseService: CourseService,
    private tokenStorageService: TokenStorageService,
    private timeTableService: TimeTableService) { }

  ngOnInit(): void {
    this.isLoading = true;
    const group = this.tokenStorageService.getToken("group");
    var progress: number = 0;
    var weeksProgress = 0;
    this.courseService.getCoursesByGroupName(group).subscribe(courses => {
      if (courses)
        this.courses = courses;
      this.timeTableService.getTTByGroupNumber(group).subscribe(timeTable => {
        if (timeTable) {
          this.timeTable = timeTable;
          this.courses.forEach(course => {
            progress = 0;
            weeksProgress = 0;
            this.timeTable.GroupSchedule.forEach(lesson => {
              if (lesson.Title === course.CourseName) {
                progress += new Date(lesson.End).getTime() - new Date(lesson.Start).getTime();
                const weeks = this.getWeek(new Date()) - this.getWeek(lesson.Start);
                if (weeks > weeksProgress)
                  weeksProgress = weeks;
              }
            });
            progress = this.msToTime(progress);
            progress *= weeksProgress;
            const info: any = {
              course: course.CourseName,
              progressPercentage: progress * 100 / course.Duration,
              duration: course.Duration
            }
            if (info.progressPercentage > 100)
              info.progressPercentage = 100;
            this.progressInfo.push(info);
          });
          this.isLoading = false;
        }
      });
    });
  }

// Get Week function
  getWeek(date: Date): number {
    var currentdate = new Date(date);
    var oneJan = new Date(currentdate.getFullYear(), 0, 1);
    var numberOfDays = Math.floor((currentdate.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
    var result = Math.ceil((currentdate.getDay() + 1 + numberOfDays) / 7);
    return result;
  }

// Convert minutes to time
  msToTime(duration: number) {
    var milliseconds = Math.floor((duration % 1000) / 100)
    var seconds = Math.floor((duration / 1000) % 60);
    var minutes = Math.floor((duration / (1000 * 60)) % 60);
    var hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    hours = (hours < 10) ? 0 + hours : hours;
    minutes = (minutes < 10) ? 0 + minutes : minutes;
    hours += minutes / 60;
    return hours;
  }

}
