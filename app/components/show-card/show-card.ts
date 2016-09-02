import {Component,Input,ViewChild} from "@angular/core";

import {Show} from "../../classes/show";


import {Router} from "@angular/router";


@Component({
    selector: 'show-card',
    templateUrl: 'show-card.html',
})


export class ShowCard {
    @Input() show:Show;



    constructor() {
    }

    ngOnInit(){
    }
    ngAfterViewInit(){
    }


}
