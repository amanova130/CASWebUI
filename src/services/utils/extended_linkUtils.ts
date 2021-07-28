import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import { ExtendedLink } from '../models/extended_link';

@Injectable({
    providedIn: 'root'
})

export class ExtendedLinkUtils{

    private linkList: ExtendedLink[] = [];
   linkListChanged = new Subject<ExtendedLink[]>();

    constructor(){}

    setLinkList(linkList: ExtendedLink[])
    {
        this.linkList = linkList;
        this.linkListChanged.next(this.linkList.slice());
        console.log(this.linkListChanged);
    }
}