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
  public timeTable:TimeTable;
  public calendarUrl:string;
  public schedule:Schedule[];
  // dataSource!: MatTableDataSource<Faculty>;
  // displayedColumns: string[] = [
  //   'Sunday',
  //   'Monday',
  //   'Tuesday',
  //   'Wednesday',
  //   'Thursday',
  //   'Friday',
  //   ];
  constructor(
    private timeTableService:TimeTableService,
    public datepipe:DatePipe,
    private tokenStorage:TokenStorageService
    )
   { }

  ngOnInit(): void {
    //console.log(localStorage.group);
    const groupNum=this.tokenStorage.getToken("group");
    this.timeTableService.getTTByGroupNumber(groupNum).subscribe(res=>{
      if(res)
      {
        this.calendarUrl="https://calendar.google.com/calendar/embed?src="+ res.CalendarId;
        console.log(res);
        this.timeTable=res;
        this.schedule=this.timeTable.GroupSchedule;
        this.schedule.forEach(lesson=>{
          lesson.rrule={
            byweekday:new Date(lesson.Start).getDay()
          }
        })
      }
    })
}
}
  
