import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { Request } from 'src/services/models/request';
import { RequestService } from '../../../../../services/WebApiService/request.service';

@Component({
  selector: 'app-add-request',
  templateUrl: './add-request.component.html',
  styleUrls: ['./add-request.component.scss']
})
export class AddRequestComponent implements OnInit {

  request: Request;
  isLoading = false;
  constructor(private requestService: RequestService,
    private alertService: AlertService,
    public activeModal: NgbActiveModal,) {
  }


  ngOnInit(): void {
    this.request =
    {
      Reason: '',
      Subject: ''
    }
  }

  onSubmit() {
    this.request.SenderId = '336441696' ///then need to change it to senderId from sessionStorage
    this.request.CreatedDate = new Date().toLocaleDateString();
    this.request.StatusOfRequest = 'New';
    this.request.Status = true;
    this.request.GroupNum = '44.5'; ///then need to change it to groupNum from sessionStorage
    this.requestService.createRequest(this.request).subscribe(result => {
      if (result) {
        this.alertService.successResponseFromDataBase();
        this.activeModal.close(result);
      }
    })
  }

}
