import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AutoResetPassComponent } from 'src/app/shared/components/auto-reset-pass/auto-reset-pass.component';
import { TokenStorageService } from 'src/app/shared/helperServices/token-storage.service';
import { User } from 'src/services/models/user';

@Component({
  selector: 'app-student-page',
  templateUrl: './student-page.component.html',
  styleUrls: ['./student-page.component.scss']
})
export class StudentPageComponent implements OnInit {
loggedUser:User;
role: string = '';
constructor(private modalService: NgbModal,
  private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    this.loggedUser=this.tokenStorage.getUser();
    this.role = this.tokenStorage.getToken("role");
    const today=new Date();
    const dateChange=new Date(new Date(this.loggedUser.ChangePwdDate));
    if(today >= dateChange)
    {
      this.modalService.open(AutoResetPassComponent, { centered: true,backdrop:"static" });
    }   
  }
}
