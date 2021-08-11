import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AutoResetPassComponent } from 'src/app/shared/components/auto-reset-pass/auto-reset-pass.component';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { TokenStorageService } from 'src/app/shared/helperServices/token-storage.service';
import { User } from 'src/services/models/user';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {
loggedUser:User;
  constructor(private modalService: NgbModal,
             private tokenStorage: TokenStorageService,
             private alertService:AlertService) { }

  ngOnInit(): void {
      
  }

}
