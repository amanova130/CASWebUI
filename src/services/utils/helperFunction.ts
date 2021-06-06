import { HttpResponse } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {of, Subject, throwError} from 'rxjs';
import { delay, dematerialize, materialize } from 'rxjs/operators';
import { Teacher } from '../models/teacher';

@Injectable({
    providedIn: 'root'
})

export class HelperFunction{

    constructor(){}

    ok(body?: any) {
        return of(new HttpResponse({ status: 200, body }))
            .pipe(delay(500)); // delay observable to simulate server api call
    }

 error(message: any) {
        return throwError({ error: { message } })
            .pipe(materialize(), delay(500), dematerialize()); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
    }
}