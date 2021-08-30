import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { TokenStorageService } from 'src/app/shared/helperServices/token-storage.service';
import { User } from 'src/services/models/user';

@Component({
  selector: 'app-exam-grades',
  templateUrl: './exam-grades.component.html',
  styleUrls: ['./exam-grades.component.scss']
})
export class ExamGradesComponent implements OnInit {
  isLoading = false;
  obs: Observable<any>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  contactList: any = [];
  dataSource!: MatTableDataSource<any>;
  asyncTabs: Observable<any>;
  loggedUser: User;
  groupNumber: string;
  colorValue: string;

  constructor(private tokenStorage: TokenStorageService) {
    this.loggedUser = this.tokenStorage.getUser();
    this.groupNumber = this.tokenStorage.getToken('group');
  }

  ngOnInit(): void {
  }
//Filter by Char
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.obs = this.dataSource.connect();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
