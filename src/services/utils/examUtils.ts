import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import { Exam } from '../models/exam';


@Injectable({
    providedIn: 'root'
})

export class ExamUtils{

    private examList: Exam[] = [];
    examListChanged = new Subject<Exam[]>();

    constructor(){}

    setexamList(examList: Exam[])
    {
        this.examList = examList;
        this.examListChanged.next(this.examList.slice());
    }
}