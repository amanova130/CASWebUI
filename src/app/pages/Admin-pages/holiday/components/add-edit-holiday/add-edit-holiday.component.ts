import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/services/helperServices/alert.service';
import { Holiday } from 'src/services/models/holiday';
import { HolidayService } from 'src/services/WebApiService/holidayService';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-add-edit-holiday',
  templateUrl: './add-edit-holiday.component.html',
  styleUrls: ['./add-edit-holiday.component.scss']
})
export class AddEditHolidayComponent implements  OnInit {
  isAddMode=false;
  loading = false;
  submitted = false;
  newHoliday!: Holiday;
  checkedList: any;
  currentSelected!: {};
  
  @Input()
    public holiday: Holiday;
  @Input()
    public holidayList!: Holiday[];

  @ViewChild('form') form!: any;
  
  constructor(
      private holidayService: HolidayService,
      public activeModal: NgbActiveModal,
      private alertService: AlertService,
  ) {}

  ngOnInit() {
    if(this.holiday === undefined)
    {
      this.isAddMode = !this.isAddMode;
      this.holiday={
        Id: "",
        Title: "",
        Details: "",
        Type: ""
      }
    }
     
  }

  onSubmit() {
      this.loading = true;
      if(this.form.valid)
      {
        this.submitted = true;
        if (this.isAddMode) 
          this.createHoliday();
        else 
          this.updateHoliday();
      }
      else {
        this.loading = false;
      }
    
  }

  private createHoliday() {
      this.holidayService.create(this.holiday)
      .pipe(first())
      .subscribe(result => {
          if(result)
          {
            this.holidayList.push(result);
              this.activeModal.close();
              this.alertService.openAlertMsg('success', 'Input is updated')
            }
            else
            this.alertService.openAlertMsg('error', 'Cannot update the data, please try again')
      })
      .add(() => this.loading = false);
}

  private updateHoliday() {
        this.holidayService.update(this.holiday)
        .pipe(first()).subscribe((result) => {
            if(result)
            {
              let x = this.holidayList.find(x => x.Id === this.holiday.Id)
              let index = this.holidayList.indexOf(x!)
              this.holidayList[index] = this.holiday;
              this.activeModal.close();
              this.alertService.openAlertMsg('success', 'Input is updated')
            }
            else
            this.alertService.openAlertMsg('error', 'Cannot update the data, please try again')
        })
        .add(() => this.loading = false);
  }



}



