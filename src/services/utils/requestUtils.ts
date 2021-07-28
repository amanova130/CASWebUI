import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import { Request } from '../models/request';

@Injectable({
    providedIn: 'root'
})

export class RequestUtils{

    private requestList: Request[] = [];
    requestListChanged = new Subject<Request[]>();

    constructor(){}

    setRequestList(requestList: Request[])
    {
        this.requestList = requestList;
        this.requestListChanged.next(this.requestList.slice());
    }
}