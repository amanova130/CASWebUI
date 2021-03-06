import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { Holiday } from 'src/services/models/holiday';
import { HolidayService } from 'src/services/WebApiService/holiday.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-add-edit-holiday',
  templateUrl: './add-edit-holiday.component.html',
  styleUrls: ['./add-edit-holiday.component.scss']
})
export class AddEditHolidayComponent implements OnInit {
  isAddMode = false;
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
  ) { }

  ngOnInit() {
    if (this.holiday === undefined) {
      this.isAddMode = !this.isAddMode;
      this.holiday = {
        Id: "",
        Title: "",
        Details: "",
        Type: ""
      }
    }

  }
  //Submit Form
  onSubmit() {
    this.loading = true;
    if (this.form.valid) {
      this.submitted = true;
      if (this.isAddMode)
        this.createHoliday();
      else
        this.updateHoliday();
    }
    else {
      this.alertService.errorFormField();
      this.loading = false;
    }

  }
  // Create a new Holiday object
  private createHoliday() {
    this.holidayService.create(this.holiday)
      .pipe(first())
      .subscribe(result => {
        if (result) {
          this.holidayList.push(result);
          this.alertService.successResponseFromDataBase();
          this.activeModal.close(this.holidayList);
        }
      },
        error => {
          this.alertService.genericAlertMsg("error", error);
        })
      .add(() => this.loading = false);
  }

  // Update Holiday
  private updateHoliday() {
    this.holidayService.update(this.holiday)
      .pipe(first()).subscribe((result) => {
        if (result) {
          let x = this.holidayList.find(x => x.Id === this.holiday.Id)
          let index = this.holidayList.indexOf(x!)
          this.holidayList[index] = this.holiday;
          this.alertService.successResponseFromDataBase();
          this.activeModal.close(this.holidayList);
        }
      },
      error => {
        this.alertService.genericAlertMsg("error", error);
      })
      .add(() => this.loading = false);
  }



}



