import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { Request } from 'src/services/models/request';
import { User } from 'src/services/models/user';
import { RequestService } from '../../../../../services/WebApiService/request.service';
import { TokenStorageService } from '../../../helperServices/token-storage.service';

@Component({
  selector: 'app-add-request',
  templateUrl: './add-request.component.html',
  styleUrls: ['./add-request.component.scss']
})
export class AddRequestComponent implements OnInit {
  request: Request;
  isLoading = false;
  loggedUser: User;
  groupNumber: string;
  constructor(private requestService: RequestService,
    private alertService: AlertService,
    public activeModal: NgbActiveModal,
    private tokenStorage: TokenStorageService) {
      this.loggedUser = this.tokenStorage.getUser();
      this.groupNumber = this.tokenStorage.getToken('group');
  }

  ngOnInit(): void {

    this.request =
    {
      Reason: '',
      Subject: ''
    }
  }

  onSubmit() {
    this.request.SenderId = this.loggedUser.UserName 
    this.request.CreatedDate = new Date().toLocaleDateString();
    this.request.StatusOfRequest = 'New';
    this.request.Status = true;
    this.request.GroupNum = this.groupNumber; 
    this.requestService.createRequest(this.request).subscribe(result => {
      if (result) {
        this.alertService.successResponseFromDataBase();
        this.activeModal.close(result);
      }
    },
    error=>{
      this.alertService.genericAlertMsg("error", error);
    });
  }

}
