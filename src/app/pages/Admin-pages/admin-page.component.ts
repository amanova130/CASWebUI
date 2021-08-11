import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AutoResetPassComponent } from 'src/app/shared/components/auto-reset-pass/auto-reset-pass.component';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { TokenStorageService } from 'src/app/shared/helperServices/token-storage.service';
import { User } from 'src/services/models/user';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {

  loggedUser:User;
  constructor(private modalService: NgbModal,
    private tokenStorage: TokenStorageService,
    private alertService:AlertService) { }
  
    ngOnInit(): void {
      
      this.loggedUser=this.tokenStorage.getUser();
      const today=new Date();
      const dateChange=new Date(new Date(this.loggedUser.ChangePwdDate));
      if(today >= dateChange)
      {
        this.modalService.open(AutoResetPassComponent, { centered: true,backdrop:"static" });
      }   
    }

}
