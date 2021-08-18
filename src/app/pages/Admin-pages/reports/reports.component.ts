import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/services/WebApiService/course.service';
import { Course } from 'src/services/models/course';
import { FacultyService } from 'src/services/WebApiService/faculty.service';
import { Faculty } from 'src/services/models/faculty';
import { ReportService } from 'src/services/WebApiService/report.service';
import { GroupService } from 'src/services/WebApiService/group.service';
import { Group } from 'src/services/models/group';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Average } from 'src/services/models/courseAvg';
import * as XLSX from 'xlsx'; 

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
isAverage=false;
isCourse=false;
isFaculty=false;
isGroup=false;
displayedColumns: string[] = [];
dataSource!: MatTableDataSource<any>;
myTable!: MatTable<any>;
course:string;
faculty:any;
group:any;
tableData:any[]=[];
isSelected=false;
isValid=false;
isTable=false;
isLoading=false;
fileName= 'Report.xlsx'; 
courseList:string[];
groupList:Group[];
studentAvg:Average[];
facultyList:Faculty[];
  constructor(private courseService:CourseService,
              private groupService:GroupService,
             private reportService:ReportService,
             private facultyService:FacultyService) { }
             selection = new SelectionModel<any>(true, );

  ngOnInit(): void {
  }
  choosenReport(report:any)
  {
    console.log(report);
    if(report.value == 'average')
      this.isAverage=true;
  }
  choosenCategory(category:any)
  {
    console.log(category);
    if(category.value == 'groups')
    {
     this.groupService.getAllGroups().subscribe(res=>{
       this.isGroup=true;
        this.groupList=res;
        
     })
    }
    }
    choosenGroup(group:any)
    {
      this.isValid=true;
      this.isTable=false;
      this.displayedColumns = [
        'Id',
        'Name'];
      group.value.courses.forEach((course: string)=>{
        this.displayedColumns.push(course);
      })
      this.displayedColumns.push("Total_Avg");
      
    }


    
    exportExcel(): void 
    {
       /* table id is passed over here */   
       let element = document.getElementById('myTable'); 
       const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       /* save to file */
       if(this.isGroup)
       XLSX.writeFile(wb, "average "+this.group.GroupNumber+".xlsx");
			
    }


    onSubmit()
    {
      this.isLoading=true;
      //console.log(this.course);
      this.tableData.length=0;
          this.reportService.getAvgByGroup(this.group.GroupNumber,"2021").subscribe(res=>{
              if(res)
              {
                //console.log(res);
                this.studentAvg=res;
                let totalAvg=0;
                this.studentAvg.forEach(elem=>{
                  let totalStudentAvg=0;
                  
                  let coursesCount=0;
                  let tableObject={
                    Name:elem.Name,
                    Id:elem.Id
                  }
                  elem.courseAvg.forEach(average=>{
                    var key=average.courseName;
                    var value=average.avg.toFixed(1);
                    Object.assign(tableObject, {[key]: value});
                    if(average.avg != 0)
                    {
                      totalStudentAvg+=average.avg;
                      coursesCount++;
                    }
                  })
                  if(coursesCount != 0)
                    totalStudentAvg/=coursesCount;
                    totalAvg+=totalStudentAvg;
                  Object.assign(tableObject, {"Total_Avg":totalStudentAvg.toFixed(1) });
                  this.tableData.push(tableObject);
                })
                totalAvg/=res.length;
                const total={
                  Total_Avg:totalAvg.toFixed(1)
                }
                this.tableData.push(total);
                console.log(this.tableData);
                  
                
                this.dataSource = new MatTableDataSource(this.tableData);
                this.isTable=true;
                this.isLoading=false;
              }
          })
        }
  }



