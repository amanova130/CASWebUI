import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { AlertService } from 'src/services/helperServices/alert.service';
import { Message, OutlookMessage, ReceiverDetails } from 'src/services/models/message';
import { Faculty, Group } from 'src/services/models/models';
import { Student } from 'src/services/models/student';
import { FacultyService } from 'src/services/WebApiService/faculty.service';
import { GroupService } from 'src/services/WebApiService/group.service';
import { MessageService } from 'src/services/WebApiService/message.service';
import { StudentService } from 'src/services/WebApiService/student.service';

@Component({
  selector: 'app-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.scss']
})

  export class ComposeComponent implements OnInit {

    FormData: FormGroup;
    public attachments:boolean = false;
    public carbonCopy:boolean = false;
    public blindCarbonCopy:boolean = false;
    public studentList:Student[]=[];
    public facultyList:Faculty[]=[];
    public groupList:Group[]=[];
    public receiverList:ReceiverDetails[]=[];
    public isFaculty:boolean=false;
    selectedFaculty: any;
    selectedStudent: any;
    selectedGroup: any;


    public isGroup:boolean=false;
    public isStudent:boolean=false;
    selectedOptions:[];
    selectedOption:any;
    faculty:any;

  
    constructor(private builder: FormBuilder,
      private studentService:StudentService,
      private facultyService:FacultyService,
      private groupService:GroupService,
      private alertService:AlertService,
      private messageService:MessageService) { }
      
    ngOnInit() {
      this.FormData = this.builder.group({
      Description: new FormControl('', [Validators.required]),
      Subject: new FormControl('',[Validators.required,Validators.required]),
      faculties: new FormControl(''),
      groups: new FormControl(''),
      students: new FormControl(''),
      category: new FormControl(''),


      
      })
      }
onSubmit(value:any)
{
  this.receiverList.length=0;
if(value.category === 'faculty')
{
  for(let faculty of value.faculties)
  {
    this.getGroupsByFaculty(faculty);
    if(this.groupList.length > 0)
    {
    for(let group of this.groupList)
      this.getStudentsByGroup(group.GroupNumber);
    }

  }
  //this.sendMessage(value);
}
  else if(value.category === 'group')
  {
    for(let groupName of value.groups)
    {

      this.getStudentsByGroup(groupName);
    }
   // this.sendMessage(value);

  }
  else
  {
    for(let student of value.students)
    {
        this.addReceiver(student);
    }
 //   this.sendMessage(value);

  }
  console.log(this.receiverList);

  



}

sendMessage(value:any)
{
  const message:Message=
  {
   Description:value.Description,
   Subject:value.Subject,
    Receiver:this.receiverList,
    DateTime:new Date(),
    Status:true
  }
  this.messageService.create(message).subscribe(result => {
    if(result)
    {
        this.alertService.openAlertMsg('success','Added new message');
    }  
    else
        this.alertService.openAlertMsg('error','Cannot add a new Group');
}) 
}
 
 choosenCategory(e:MatSelectChange)
    {
      if(e.value === "faculty")
      {
        this.getAllFaculties();
        this.groupList.length=0;
        this.studentList.length=0;

        this.isFaculty=true;
        this.isGroup=false;
        this.isStudent=false;
      }
         else if(e.value === "group")
        {
          this.groupService.getAllGroups().subscribe((list: Group[])=>{
            this.groupList = list;
            this.facultyList.length=0;
            this.studentList.length=0;
            this.isFaculty=false;
            this.isGroup=true;
            this.isStudent=false;
          });
          
        }
        else
        {
          this.studentService.getAllstudents().subscribe((list: Student[])=>{
            if(list)
            {
            this.studentList = list;
            this.groupList.length=0;
            this.facultyList.length=0;
            this.studentList.map(
              (student: any) => {
                student.full_name = student.First_name + ' ' + student.Last_name;
                return student;
              });
            this.isFaculty=false;
            this.isGroup=false;
            this.isStudent=true;
            }
        });
      }
    }
   getAllFaculties()
   {
    this.facultyService.getAllFaculties().subscribe((list: Faculty[])=>{
      this.facultyList = list;
    });
   }
  async getGroupsByFaculty(facultyName:string)
   {
   let res =await this.groupService.getGroupsByFaculty(facultyName).then(data=>{
    console.log("promise result");
   })
   console.log("after promise");
   }
   getStudentsByGroup(groupNumber:string)
   {
    
      this.studentService.getStudentsByGroup(groupNumber).subscribe((list: Student[])=>{
        if(list)
        {
        for(let student of list)
        {
          //this.studentList.push(student);
          const receiver:ReceiverDetails={
            Id:student.Id,
            Email:student.Email
          }
          this.receiverList.push(receiver);
        }
      }
      });
    
   }
   addReceiver(studentId:string )
   {
     for(let student of this.studentList)
     {
       if(studentId === student.Id)
       {
    const receiver:ReceiverDetails={
      Id:student.Id,
      Email:student.Email
    }
    this.receiverList.push(receiver);
  }
  }
}
  }
  
    
  
    


