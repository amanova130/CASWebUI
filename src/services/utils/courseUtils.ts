import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import { Course } from '../models/course';

@Injectable({
    providedIn: 'root'
})

export class CourseUtils{

    private courseList: Course[] = [];
    courseListChanged = new Subject<Course[]>();

    constructor(){}

    setCourseList(courseList: Course[])
    {
        this.courseList = courseList;
        this.courseListChanged.next(this.courseList.slice());
        console.log(this.courseListChanged);
    }
}