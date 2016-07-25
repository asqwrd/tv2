
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

import {Guide} from "../pages/guide/guide";


declare var moment:any;

import {EventService} from '../services/event-services';
import {ApiService} from '../services/api-service';
import {ComponentHandler} from '../directives/component-handler';


@Component({
    selector: "layout",
    templateUrl: "app/layout/layout.html",
    directives: [ROUTER_DIRECTIVES,ComponentHandler],
    precompile: [Guide]

})


export class Layout{
  date:any;
  time:any;
  airtimes:Array<string>;
  search:Boolean;
  shows:Array<Object>;
  constructor(private api:ApiService, router: Router, private location: Location,private eventService:EventService) {
    this.date = moment().format('dddd MMM DD');
    this.time = moment().format('hh:mm a');
    this.search=false;
    this.api.getSchedule().subscribe((data)=>{
      this.airtimes = data['airtimes'];
      this.shows = data['shows'];
    });
  }

  toggleSearch(){
    this.search = !this.search;
  }
  ngOnInit(){
  }

  searching(input:HTMLInputElement){
    if(input.value.trim().length == 0){
      this.eventService.search.next({data:this.shows,search:false})
      this.search = false;
    }else{
      this.api.search(input.value).debounceTime(500).subscribe((data)=>{
        this.eventService.search.next({data:data,search:true})
      });
    }
  }

}
