import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Teacher } from '../models/teacher';
import { TeacherUtils } from '../utils/teacherUtils';
import {map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TeachersService {

  constructor(private teachersUtil: TeacherUtils,  private http: HttpClient) { }

  getAllTeachers(){
    return this.http.get<Teacher[]>('https://localhost:5001/api/Teacher').pipe(map( (teacherList: Teacher[])=>{
      return teacherList;
    }),
    tap((teacherList: Teacher[]) =>{
      this.teachersUtil.setTeacherList(teacherList);
    })
    );
  }
}
