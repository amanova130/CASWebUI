import { DatePipe } from "@angular/common";
import { Component, OnInit, Input } from "@angular/core";
import { TokenStorageService } from "src/app/shared/helperServices/token-storage.service";
import { User } from "src/services/models/user";
import { SplashAnimationType } from "./splash-animation-type";

@Component({
  selector: "splash-screen",
  templateUrl: "./splash-screen.component.html",
  styleUrls: ["./splash-screen.component.scss"]
})
export class SplashScreenComponent implements OnInit {
  windowWidth: string;
  splashTransition: string;
  opacityChange: number = 1;
  showSplash = true;
  loggedUser: User;
  @Input() animationDuration: number = 0.5;
  @Input() duration: number = 3;
  @Input() animationType: SplashAnimationType = SplashAnimationType.SlideLeft;
  constructor(
    private tokenStorage: TokenStorageService,
    public datepipe: DatePipe
  ) { }
  // Set Splash screen
  ngOnInit(): void {
    this.loggedUser = this.tokenStorage.getUser();
    setTimeout(() => {
      let transitionStyle = "";
      switch (this.animationType) {
        case SplashAnimationType.SlideLeft:
          this.windowWidth = "-" + window.innerWidth + "px";
          transitionStyle = "left " + this.animationDuration + "s";
          break;
        case SplashAnimationType.SlideRight:
          this.windowWidth = window.innerWidth + "px";
          transitionStyle = "left " + this.animationDuration + "s";
          break;
        case SplashAnimationType.FadeOut:
          transitionStyle = "opacity " + this.animationDuration + "s";
          this.opacityChange = 0;
      }
      this.splashTransition = transitionStyle;
      setTimeout(() => {
        this.showSplash = !this.showSplash;
      }, this.animationDuration * 1000);
    }, this.duration * 1000);
  }


  ngAfterViewInit() {
    const user = this.tokenStorage.getUser();
    user.LogIn = new Date();
    this.tokenStorage.saveUser(user);
  }
}