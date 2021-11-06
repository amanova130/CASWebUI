import { Component } from '@angular/core';
import { merge, fromEvent, Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CASWebUI';
  checkinterent: boolean;
  isOffline = false;

  ngOnInit(){
    this.therichpost$().subscribe(isOnline => this.checkinterent = isOnline);
  
    //checking internet connection
    if(!this.checkinterent)
    {
      //show danger alert if net internet not working
      this.isOffline= !this.isOffline;
    }
    else
    console.log("Internet is working");
  
  }
  therichpost$() {
    return merge<boolean>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      }));
    }
}
