
import {
    Component,
    ViewChild,
    ElementRef
} from "@angular/core";
import {
    Location}
    from '@angular/common';


import {
    ROUTER_DIRECTIVES,
    Router,
    ActivatedRoute,
    RouterStateSnapshot,
    ActivatedRouteSnapshot,
    CanActivate
} from '@angular/router';




import {EventService} from '../services/event-services';
import {ApiService} from '../services/api-service';


@Component({
    selector: "layout",
    templateUrl: "app/layout/layout.html",
    directives: [ROUTER_DIRECTIVES],

})


export class Layout{

    constructor(private api:ApiService, router: Router, private location: Location,eventService:EventService) {
    }

    ngOnInit(){
    }

}
