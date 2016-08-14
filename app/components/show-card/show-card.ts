import {Component,Input,ViewChild} from "@angular/core";
import {HTTP_PROVIDERS} from "@angular/http";


import 'rxjs/Rx';
import {Router} from "@angular/router";


@Component({
    selector: 'show-card',
    templateUrl: 'show-card.html',
})


export class ShowCard {
    @Input() show:Object;



    constructor() {
    }

    ngOnInit(){
    }
    ngAfterViewInit(){
    }


}
