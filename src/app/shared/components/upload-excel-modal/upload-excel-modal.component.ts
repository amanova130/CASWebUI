import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Student } from 'src/services/models/student';
import { StudentService } from 'src/services/WebApiService/student.service';
import * as XLSX from 'xlsx';
import { AlertService } from '../../helperServices/alert.service';

@Component({
  selector: 'app-upload-excel-modal',
  templateUrl: './upload-excel-modal.component.html',
  styleUrls: ['./upload-excel-modal.component.scss']
})
export class UploadExcelModalComponent implements OnInit {
  isDataLoaded = true;
  spinnerEnabled = false;
  keys: string[];
  dataSheet = new Subject<any>();
  data: any;
  @ViewChild('inputFile') inputFile: ElementRef;
  isExcelFile: boolean;
  studentList: Student[] = [];

  constructor(public modal: NgbActiveModal, private studentService: StudentService, private alertService: AlertService) { }

  ngOnInit(): void {
  }

  //Read the excel file and display all data in table
  onChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
    if (target.files.length > 1) {
      this.inputFile.nativeElement.value = '';
    }
    if (this.isExcelFile) {
      this.spinnerEnabled = true;
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        this.data = XLSX.utils.sheet_to_json(ws);
      };
      reader.readAsBinaryString(target.files[0]);
      reader.onloadend = (e) => {
        this.spinnerEnabled = false;
        this.keys = Object.keys(this.data[0]);
        this.dataSheet.next(this.data);
        this.isDataLoaded = false;
      }
    } else {
      this.inputFile.nativeElement.value = '';
    }
  }

  // Upload list of Students to Backend
  uploadList() {
    if (this.data !== null && this.data !== undefined)
      this.convertToStudentList();
    if (this.studentList.length > 0) {
      this.studentService.insertListOfStudents(this.studentList).subscribe(result => {
        if (result)
          this.alertService.genericAlertMsg("success", "File uploaded successfully");
      },
        error => {
          this.alertService.genericAlertMsg('error', error);
        });
    }
  }

  // Convert to Student Model List
  convertToStudentList() {
    for (let item of this.data) {
      if (item.Id != null && item.Id != undefined) {
        let student: Student = {
          Id: item.Id,
          First_name: item.First_name,
          Last_name: item.Last_name,
          Email: item.Email,
          Birth_date: item.Birth_date,
          Phone: item.Phone,
          Gender: item.Gender,
          Group_Id: item.Group_Id,
          Address: {
            City: item.City,
            Street: item.Street,
            ZipCode: item.ZipCode
          }
        }
        this.studentList.push(student);
      }
      else {
        this.studentList = [];
        this.alertService.genericAlertMsg("error", "Failed to upload, One of the Ids is empty, please check it before upload");
      }

    }
  }

  // Remove data from table
  removeData() {
    this.inputFile.nativeElement.value = '';
    this.dataSheet.next([]);
    this.keys = [];
    this.isDataLoaded = true;
  }

}
