import {Component,Input,ViewChild} from "@angular/core";
import {HTTP_PROVIDERS} from "@angular/http";
import {NgStyle,NgFor} from '@angular/common';


import 'rxjs/Rx';
import {Router} from "@angular/router";


import {ComponentHandler} from "../../directives/component-handler";


@Component({
    selector: 'show-card',
    viewProviders: [HTTP_PROVIDERS],
    templateUrl: 'app/components/show-card/show-card.html',
    directives:[NgStyle,NgFor,ComponentHandler]
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
