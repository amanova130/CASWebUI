import { Component, OnInit } from '@angular/core';
import { Faculty } from 'src/services/models/faculty';
import { ReportService } from 'src/services/WebApiService/report.service';
import { GroupService } from 'src/services/WebApiService/group.service';
import { Group } from 'src/services/models/group';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Average } from 'src/services/models/courseAvg';
import * as XLSX from 'xlsx';
import { CourseService } from 'src/services/WebApiService/course.service';
import { FacultyService } from 'src/services/WebApiService/faculty.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  isAverage = false;
  isCourse = false;
  isFaculty = false;
  isGroup = false;
  isTeacher = false;
  displayedColumns: string[] = [];
  dataSource!: MatTableDataSource<any>;
  myTable!: MatTable<any>;
  course: string;
  faculty: any;
  group: any;
  tableData: any[] = [];
  isSelected = false;
  isValid = false;
  isTable = false;
  isLoading = false;
  fileName = 'Report.xlsx';
  courseList: string[] = [];
  groupList: Group[];
  studentAvg: Average[];
  teacherAvg: Average[];
  facultyList: Faculty[];
  constructor(private courseService: CourseService,
    private groupService: GroupService,
    private reportService: ReportService,
    private facultyService: FacultyService) { }
  selection = new SelectionModel<any>(true,);

  ngOnInit(): void {
  }
  choosenReport(report: any) {
    console.log(report);
    if (report.value == 'average')
      this.isAverage = true;
  }
  choosenCategory(category: any) {
    console.log(category);
    if (category.value == 'groups') {
      this.groupService.getAllGroups().subscribe(res => {
        this.isGroup = true;
        this.isTeacher = true;
        this.groupList = res;

      })
    }
    else if (category.value == 'teachers') {
      this.isTable = false;
      this.courseService.getAllCourses().subscribe(res => {
        this.courseList = [];
        for (let course of res)
          this.courseList.push(course.CourseName);
        this.isTeacher = true;
        this.isGroup = false;
        this.isValid = true;
        this.displayedColumns = [
          'Id',
          'Name'];
        this.courseList.forEach((course: string) => {
          this.displayedColumns.push(course);
        })
        this.displayedColumns.push("Total_Avg");

      })


    }
  }

  choosenGroup(group: any) {
    this.isValid = true;
    this.isTable = false;
    this.displayedColumns = [
      'Id',
      'Name'];
    group.value.courses.forEach((course: string) => {
      this.displayedColumns.push(course);
    })
    this.displayedColumns.push("Total_Avg");
  }
  // Export to excell
  exportExcel(): void {
    /* table id is passed over here */
    let element = document.getElementById('myTable');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    if (this.isGroup)
      XLSX.writeFile(wb, "average " + this.group.GroupNumber + ".xlsx");
    else if (this.isTeacher)
      XLSX.writeFile(wb, "teachers average.xlsx");
  }

  onSubmit() {
    this.isLoading = true;
    //console.log(this.course);
    this.tableData.length = 0;
    if (this.isGroup) {
      this.reportService.getAvgByGroup(this.group.GroupNumber, "2021").subscribe((res: Average[]) => {
        if (res) {
          this.studentAvg = res;
          this.createGroupTable();
        }

      });
    }
    else if (this.isTeacher) {
      this.reportService.getAvgOfAllTeachers("2021").subscribe((res: Average[]) => {
        if (res) {
          this.teacherAvg = res;
          this.createTeacherTable();
        }
      });
    }
  }

  createGroupTable() {
    let totalAvg = 0;
    this.studentAvg.forEach(elem => {
      let totalStudentAvg = 0;

      let coursesCount = 0;
      let tableObject = {
        Name: elem.Name,
        Id: elem.Id
      }
      elem.courseAvg.forEach(average => {
        var key = average.courseName;
        var value = average.avg.toFixed(1);
        Object.assign(tableObject, { [key]: value });
        if (average.avg != 0) {
          totalStudentAvg += average.avg;
          coursesCount++;
        }
      })
      if (coursesCount != 0)
        totalStudentAvg /= coursesCount;
      totalAvg += totalStudentAvg;
      Object.assign(tableObject, { "Total_Avg": totalStudentAvg.toFixed(1) });
      this.tableData.push(tableObject);
    })
    totalAvg /= this.studentAvg.length;
    const total = {
      Total_Avg: totalAvg.toFixed(1)
    }
    this.tableData.push(total);
    console.log(this.tableData);


    this.dataSource = new MatTableDataSource(this.tableData);
    this.isTable = true;
    this.isLoading = false;
  }


  createTeacherTable() {
    let totalAvg = 0;
    this.teacherAvg.forEach(elem => {
      let totalTeacherAvg = 0;
      let coursesCount = 0;
      let tableObject = {
        Name: elem.Name,
        Id: elem.Id
      }
      elem.courseAvg.forEach(average => {
        var key = average.courseName;
        var value = average.avg.toFixed(1);
        Object.assign(tableObject, { [key]: value });
        coursesCount++;
        totalTeacherAvg += average.avg;
      })
      if (coursesCount != 0)
        totalTeacherAvg /= coursesCount;
      totalAvg += totalTeacherAvg;
      Object.assign(tableObject, { "Total_Avg": totalTeacherAvg.toFixed(1) });
      this.tableData.push(tableObject);
    })
    totalAvg /= this.teacherAvg.length
    const total = {
      Total_Avg: totalAvg.toFixed(1)
    }
    this.tableData.push(total);
    this.dataSource = new MatTableDataSource(this.tableData);
    this.isTable = true;
    this.isLoading = false;
  }
}




