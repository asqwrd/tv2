
import {
    Component,
    ViewChild,
    ElementRef
} from "@angular/core";
 import {DomSanitizer,SafeUrl} from '@angular/platform-browser'

import {Guide} from "../pages/guide/guide";
import 'rxjs/Rx';

import {Router,ActivatedRoute} from "@angular/router";



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
  @ViewChild('header') header:ElementRef;
  fontcolor:string;
  opaque:boolean;
  logo:string;
  loader:boolean;
  icon:string;
  page:string;

  constructor(private api:ApiService, private eventService:EventService, private sanitizer:DomSanitizer,  public router:Router, public route:ActivatedRoute) {
    this.focused = false;
    window.location.href = "http://awaritv.ajibade.me";
    this.results = [];
    this.logo = 'images/logo.svg';
    this.loader = true;
    this.user = this.route.snapshot.data['user'];
    this.page = this.route.snapshot.children[0].data['route'];
    this.router.events.subscribe((data)=>{
      this.page = this.route.snapshot.children[0].data['route'];
    })


    this.eventService.background.subscribe((data)=>{
      if(data['color']){
        this.fontcolor = data['color'];
      }
      if(data['logo']){
        this.logo = data['logo'];
      }
      if(data['opaque'] !== undefined){
        this.opaque = data['opaque'];
      }
      this.loader = false;
    })

  }

  toggleSearch(){
    this.search = !this.search;
  }

  ngOnInit(){

  }
  ngAfterViewInit(){

  }

  loginGoogle(){
    this.api.loginGoogle();
  }

  loginFacebook(){
    this.api.loginFacebook();
  }

  logout(){
    this.api.logout();
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

  searching(event){
    this.api.search(this.search_input.nativeElement.value).subscribe((response)=>{
      this.results = response['shows'];
    })
  }

  search_term(event){
    this.router.navigateByUrl('/search/'+ event.term);
    this.icon = 'arrow_back'
  }

  select_show(event){
    this.router.navigateByUrl('/show/'+ event.show.showid);
    this.icon = 'arrow_back'
  }

  home(){
    this.router.navigateByUrl('/');
    this.icon = undefined;
  }


}
