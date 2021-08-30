import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Schedule } from 'src/services/models/event';
import { Faculty } from 'src/services/models/faculty';
import { TimeTable } from 'src/services/models/timeTable';
import { TimeTableService } from 'src/services/WebApiService/timeTable.service';
import moment from 'moment-timezone';
import { DatePipe } from '@angular/common';
import { TokenStorageService } from 'src/app/shared/helperServices/token-storage.service';

@Component({
  selector: 'app-time-table-view',
  templateUrl: './time-table-view.component.html',
  styleUrls: ['./time-table-view.component.scss']
})
export class TimeTableViewComponent implements OnInit {
  public timeTable: TimeTable;
  public calendarUrl: string;
  public schedule: Schedule[];
  public groupNum: string;

  constructor(
    private timeTableService: TimeTableService,
    public datepipe: DatePipe,
    private tokenStorage: TokenStorageService
  ) { }
// Get time-table schedule for student
  ngOnInit(): void {
    this.groupNum = this.tokenStorage.getToken("group");
    this.timeTableService.getTTByGroupNumber(this.groupNum).subscribe(res => {
      if (res) {
        this.calendarUrl = "https://calendar.google.com/calendar/embed?src=" + res.CalendarId;
        this.timeTable = res;
        this.schedule = this.timeTable.GroupSchedule;
        this.schedule = this.schedule.filter(lesson => new Date(lesson.LastDate) > new Date());
        this.schedule = this.schedule.sort((a, b) => (new Date(a.Start).getHours() > new Date(b.Start).getHours() ? 1 : -1));
        this.schedule.forEach(lesson => {
          lesson.rrule = {
            byweekday: new Date(lesson.Start).getDay()
          }
        })
      }
    })
  }
}

