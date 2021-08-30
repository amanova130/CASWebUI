import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import moment from "moment";
import { User } from "src/services/models/user";
import { UserService } from "src/services/WebApiService/user.service";
import { AlertService } from "../../helperServices/alert.service";
import { TokenStorageService } from "../../helperServices/token-storage.service";


@Component({
  selector: 'app-auto-reset-pass',
  templateUrl: './auto-reset-pass.component.html',
  styleUrls: ['./auto-reset-pass.component.scss']
})
export class AutoResetPassComponent implements OnInit {
  newPWD: string = "";
  confirmPWD: string = "";
  currentPWD: string = "";
  loggedUser: User;
  formData: FormGroup;
  isLoading = false;
  isCurrent = true;
  isConfirmed = true;
  isCorrectFormat = true;
  isSame = true;

  constructor(private alertService: AlertService,
    private userService: UserService,
    private tokenStorageService: TokenStorageService,
    public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.alertService.genericAlertMsg("info", "Please change your password now to protect your account");
    this.loggedUser = this.tokenStorageService.getUser();
  }
// Confirm a new Password
  confirmNewPWD() {
    if (this.newPWD === this.confirmPWD && this.newPWD.length >= 5) {
      this.isConfirmed = true;
    }
    else if (this.newPWD !== this.confirmPWD && this.newPWD.length >= 5 && this.newPWD.length !== 0)
      this.isConfirmed = false;
  }
// Check Current Password
  checkCurrentPWD() {
    if (this.currentPWD.length > 0) {
      this.userService.checkEnteredPWD(this.currentPWD, this.loggedUser.UserName).subscribe(res => {
        if (res)
          this.isCurrent = true;
      },
        err => {
          this.isCurrent = false;
        }
      )
    }
  }

  // Check new Password
  checkNewPWD() {
    if (this.newPWD.match("^[A-Za-z0-9]+$"))
      this.isCorrectFormat = true;
    else
      this.isCorrectFormat = false;
    if (this.newPWD !== this.currentPWD)
      this.isSame = true;
    else
      this.isSame = false;
  }

  // Submit Form
  onSubmit() {
    this.isLoading = true;
    if (this.isConfirmed && this.newPWD.length >= 5 && this.confirmPWD === this.newPWD && this.isCorrectFormat && this.isSame) {
      this.loggedUser.Password = this.newPWD;
      var today = new Date();
      today.setFullYear(today.getFullYear() + 1);
      this.loggedUser.ChangePwdDate = today.toLocaleDateString();
      this.userService.updateUser(this.loggedUser).subscribe(res => {
        if (res) {
          this.tokenStorageService.saveUser(this.loggedUser);
          this.alertService.successResponseFromDataBase();
          this.activeModal.close();
        }
      }).add(() => this.isLoading = false);
    }
    else {
      this.alertService.errorFormField();
      this.isLoading = false;
    }
  }

}
