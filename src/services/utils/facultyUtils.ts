import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import { Faculty } from '../models/faculty';


@Injectable({
    providedIn: 'root'
})

export class FacultyUtils{

    private facultyList: Faculty[] = [];
    facultyListChanged = new Subject<Faculty[]>();

    constructor(){}

    setFacultyList(facultyList: Faculty[])
    {
        this.facultyList = facultyList;
        this.facultyListChanged.next(this.facultyList.slice());
    }
}