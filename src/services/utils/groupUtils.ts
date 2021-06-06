import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import { Group } from '../models/group';

@Injectable({
    providedIn: 'root'
})

export class GroupUtils{

    private groupList: Group[] = [];
    groupListChanged = new Subject<Group[]>();

    constructor(){}

    setGroupList(groupList: Group[])
    {
        this.groupList = groupList;
        this.groupListChanged.next(this.groupList.slice());
        console.log(this.groupListChanged);
    }
}