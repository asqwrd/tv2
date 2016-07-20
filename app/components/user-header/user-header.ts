import {Component,Input,ViewChild} from "@angular/core";
import {HTTP_PROVIDERS} from "@angular/http";
import {NgStyle,NgFor} from '@angular/common';


import 'rxjs/Rx';
import {Router} from "@angular/router";

//shared components and service
import {ApiService} from "../../services/api-service";
import {EventService} from "../../services/event-services";
import {ComponentHandler} from "../../directives/component-handler";





//noinspection TypeScriptValidateTypes
@Component({
    selector: 'user-header',
    viewProviders: [HTTP_PROVIDERS],
    templateUrl: 'app/components/user-header/user-header.html',
    directives:[NgStyle,NgFor,ComponentHandler]
})


export class UserHeader {
    @Input() lng:string;
    @Input() userid:string;
    @Input() users:Array<Object>;
    router:Router;
    api:ApiService;
    eventService:EventService;


    constructor(eventService:EventService,router:Router,apiService:ApiService) {
        this.router = router;
        this.api = apiService;
        this.eventService = eventService;
    }

    ngOnInit(){
        console.log(this.userid);
    }
    ngAfterViewInit(){
    }
    

}