import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import { Teacher } from '../models/teacher';

@Injectable({
    providedIn: 'root'
})

export class TeacherUtils{

    private teacherList: Teacher[] = [];
    teacherListChanged = new Subject<Teacher[]>();

    constructor(){}

    setTeacherList(teacherList: Teacher[])
    {
        this.teacherList = teacherList;
        this.teacherListChanged.next(this.teacherList.slice());
        console.log(this.teacherListChanged);
    }
}