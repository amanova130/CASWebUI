// Pipe to get random color 
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'randomColor'
})
export class RandomColorPipe implements PipeTransform {

  constructor() { }
    transform(value: any, ...args: any[]) {
        var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
    }
  

}