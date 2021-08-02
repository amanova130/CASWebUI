import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import { Admin } from '../models/admin';

@Injectable({
    providedIn: 'root'
})

export class AdminUtils{

    private adminList: Admin[] = [];
    adminListChanged = new Subject<Admin[]>();

    constructor(){}

    setAdminList(adminList: Admin[])
    {
        this.adminList = adminList;
        this.adminListChanged.next(this.adminList.slice());
        console.log(this.adminListChanged);
    }
}