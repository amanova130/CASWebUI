
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { Message } from 'src/services/models/message';
import { MessageService } from 'src/services/WebApiService/message.service';
@Component({
  selector: 'app-view-mail',
  templateUrl: './view-mail.component.html',
  styleUrls: ['./view-mail.component.scss']
})

export class ViewMailComponent implements OnInit {

  constructor(
    public datepipe: DatePipe,
    public activeModal: NgbActiveModal,
    public messageService: MessageService,
    public alertService: AlertService
  ) { }
  @Input()
  public message: Message;

  ngOnInit(): void {
  }
  // Close the modal
  close() {
    this.activeModal.close();
  }
  // Resend the email
  resend() {
    this.message.DateTime = new Date();
    this.messageService.create(this.message).subscribe(res => {
      if (res) {
        this.alertService.genericAlertMsg("success", "Email sent successfully");
        this.activeModal.close();
      }
    },
      err => {
        this.alertService.errorResponseFromDataBase;
        this.activeModal.close();
      });
  }
}
