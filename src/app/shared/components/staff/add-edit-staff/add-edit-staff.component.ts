import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { AddressBook } from 'src/services/models/addressBook';
import { Admin } from 'src/services/models/admin';
import { AdminService } from 'src/services/WebApiService/admin.service';
import { UploadFileService } from 'src/services/WebApiService/uploadFile.service';

@Component({
  selector: 'app-add-edit-admin',
  templateUrl: './add-edit-staff.component.html',
  styleUrls: ['./add-edit-staff.component.scss']
})
export class AddEditStaffComponent implements OnInit {
  isAddMode!: boolean;
  loading = false;
  submitted = false;
  newAdmin!: Admin;
  address: AddressBook = {
    City: "",
    Street: "",
    ZipCode: 0
  };
  editAdmin: Admin = {
    Id: "",
    Address: this.address,
  };
  @Input()
  public admin: Admin = {
    Id: "",
    Address: this.address,
  };
  @Input()
  public adminList!: Admin[];
  @ViewChild('form') form!: any;

  constructor(
    private adminService: AdminService,
    private alertService: AlertService,
    public activeModal: NgbActiveModal,
    private uploadFileService: UploadFileService) { }

  ngOnInit(): void {
    this.editAdmin = {
      Id: this.admin.Id,
      First_name: this.admin.First_name,
      Last_name: this.admin.Last_name,
      Image: this.admin.Image,
      Phone: this.admin.Phone,
      Email: this.admin.Email,
      Gender: this.admin.Gender,
      Birth_date: this.admin.Birth_date,
      Address: this.admin.Address,
      Status: true,
    }
    this.isAddMode = !this.admin.Id;
    if (!this.isAddMode) {
      this.address = {
        City: this.admin.Address.City,
        Street: this.admin.Address.Street,
        ZipCode: this.admin.Address.ZipCode
      }
    }
  }

  // On submit form
  onSubmit() {
    this.loading = true;
    if (this.form.valid) {
      this.submitted = true;
      if (this.isAddMode) this.createAdmin();
      else this.updateAdmin();
    }
    else {
      this.alertService.errorFormField();
      this.loading = false;
    }
  }

  // Update  Admin  profile
  private updateAdmin() {
    this.editAdmin.Address = this.address;
    this.adminService.update(this.editAdmin)
      .pipe(first()).subscribe(result => {
        if (result) {
          this.admin = this.editAdmin;
          let x = this.adminList.find(x => x.Id === this.admin.Id)
          let index = this.adminList.indexOf(x!)
          this.adminList[index] = this.admin;
          this.alertService.successResponseFromDataBase();
          this.activeModal.close(this.adminList);
        }
        else
          this.alertService.errorResponseFromDataBase();
      },
      error=>{
        this.alertService.genericAlertMsg("error", error);
      })
      .add(() => this.loading = false);
  }

  // Create a new Admin
  private createAdmin() {
    this.admin = this.editAdmin;
    this.admin.Address = this.address;
    this.adminService.create(this.admin)
      .pipe(first())
      .subscribe(result => {
        if (result) {
          this.adminList.push(result);
          this.alertService.successResponseFromDataBase();
          this.activeModal.close(this.adminList);
        }
      },
      error=>{
        this.alertService.genericAlertMsg("error", error);
      })
      .add(() => this.loading = false);
  }

  // Upload image to backend
  public uploadFile = (files: any) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    this.uploadFileService.uploadImage(formData).pipe(first())
      .subscribe(result => {
        if (result)
          this.editAdmin.Image = Object.values(result).toString();
      });
  }
}
