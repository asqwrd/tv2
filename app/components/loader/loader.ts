import {Component,Input,ViewChild,EventEmitter} from "@angular/core";

import {Show} from "../../classes/show";


import {Router} from "@angular/router";


@Component({
    selector: 'loader',
    templateUrl: 'loader.html',
})


export class Loader {
    @Input() show:boolean;
    @Input() fontcolor:string;
    @Input() loader:string;


    constructor() {
    }

    ngOnInit(){
    }
    ngAfterViewInit(){
    }

}
