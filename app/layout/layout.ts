
import {
    Component,
    ViewChild,
    ElementRef
} from "@angular/core";

import {Guide} from "../pages/guide/guide";
import 'rxjs/Rx';



declare var moment:any;

import {EventService} from '../services/event-services';
import {ApiService} from '../services/api-service';
import {ComponentHandler} from '../directives/component-handler';


@Component({
    selector: "layout",
    templateUrl: "layout.html",

})


export class Layout{
  date:any;
  time:any;
  airtimes:Array<string>;
  search:Boolean;
  shows:Array<Object>;
  constructor(private api:ApiService, private eventService:EventService) {


  }

  toggleSearch(){
    this.search = !this.search;
  }
  ngOnInit(){
  }


}
