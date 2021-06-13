import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Group } from '../models/group';
import { GroupUtils } from '../utils/groupUtils';
import {map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  constructor(private groupUtils: GroupUtils,  private http: HttpClient) { }

  getAllGroups(){
    return this.http.get<Group[]>('https://localhost:5001/api/Group/getAllGroups').pipe(map( (groupList: Group[])=>{
      return groupList;
    }),
    tap((groupList: Group[]) =>{
      this.groupUtils.setGroupList(groupList);
    })
    );
  }
}
