
import {
    Component,
    ViewChild,
    ElementRef
} from "@angular/core";
 import {DomSanitizer,SafeUrl} from '@angular/platform-browser'

import {Guide} from "../pages/guide/guide";
import 'rxjs/Rx';
import { AngularFire } from 'angularfire2';




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
  backgroundimage:string;
  user:Object;
  results:Array<Object>;
  focused:boolean;
  @ViewChild('search_input') search_input:ElementRef;

  constructor(private api:ApiService, private eventService:EventService, private sanitizer:DomSanitizer, public af:AngularFire) {
    this.focused = false;
    this.af.auth.subscribe((auth) =>{
       console.log(auth);
       if(auth.google){
         this.user = auth.google;
       }

     });

  }

  toggleSearch(){
    this.search = !this.search;
  }
  ngOnInit(){
    if (navigator.geolocation) {
      // geolocation is available
      navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position);
        this.api.setCoords(position.coords.latitude,position.coords.longitude)
      },(error)=>{
        this.api.setCoords(0,0);
      });
    }
    else {
      // geolocation is not supported
      this.api.setCoords(0,0);
    }
  }

  loginGoogle(){
    this.api.loginGoogle();
  }

  onFocus(){
    this.focused = true;
  }

  onBlur(){
    this.focused = false;
  }
  focusInput(){
    this.search_input.nativeElement.focus();
  }

  searching(){
    this.api.search(this.search_input.nativeElement.value).subscribe((response)=>{
      console.log(response);
      this.results = response;
    })

  }


}
