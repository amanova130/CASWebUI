import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class SliderService {
    
   responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    backgroundImages: string[]=[
        "assets/images/arts_and_humanities.jpg",
        "assets/images/business.jpg",
        "assets/images/data_science.jpg",
        "assets/images/health.jpg",
        "assets/images/information_technology.jpg",
        "assets/images/language_learning.jpg",
        "assets/images/math_and_logic.jpg",
        "assets/images/personal_development.jpg",
        "assets/images/physical_science_and_engineering.jpg",
        "assets/images/social_sciences.jpg",
    ]
   
}