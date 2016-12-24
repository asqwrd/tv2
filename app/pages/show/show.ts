import {Component, Input, ViewChild, NgZone,ElementRef} from "@angular/core";

import {Show} from "../../classes/show";


import {Router,ActivatedRoute} from "@angular/router";

//shared components and service
import {ApiService} from "../../services/api-service";
import {EventService} from "../../services/event-services";


import {Subject} from "rxjs/Rx";
declare var moment:any;
declare var ColorThief:any;


@Component({
    selector: 'show-page',
    templateUrl: 'show.html',
})


export class ShowPage {
    router:Router;
    show:Show;
    date:any;
    time:any;
    backgroundimage:string;
    backgroundcolor:string;
    colorthief:any;
    _timeout:any;
    fontcolor:string;
    param:ActivatedRoute;
    id:string;
    @ViewChild('showdetail') showdetail:ElementRef;
    logo:string;

    constructor(private zone:NgZone,private eventService:EventService,router:Router,private api:ApiService, route:ActivatedRoute) {
        this.router = router;
        this.eventService = eventService;
        this.colorthief = new ColorThief();
        this.fontcolor = "#000";
        this.id = route.snapshot.params['id'];
        this.api.showDetail(this.id).subscribe((data)=>{
          console.log(data);
          this.show = data['show'];
          this.backgroundimage = data['backgroundimage'];
          this.colorthief.getColorAsync(this.backgroundimage,(color,element)=>{
            this.backgroundcolor = 'rgb('+color[0]+','+color[1]+','+color[2]+')';
            this.changefontcolor(color);
            console.log(color);

          });

        });

      route.params.subscribe(params => {
         this.id = decodeURI(params['id']);
         this.api.showDetail(this.id).subscribe((data)=>{
           this.show = data['show'];
           this.backgroundimage = data['backgroundimage'];
           this.colorthief.getColorAsync(this.backgroundimage,(color,element)=>{
             this.backgroundcolor = 'rgb('+color[0]+','+color[1]+','+color[2]+')';
             this.changefontcolor(color);

           });

         });
      });

    }

    changefontcolor(rgb:Array<any>){
      let c = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
      let o = Math.round(((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) + (parseInt(rgb[2]) * 114)) / 1000);
      let logo = '/images/logo.svg';
      if(o > 125){
        this.fontcolor = '#000';
      }else{
        this.fontcolor = '#fff';
        logo = '/images/logo-light.svg';
      }
      this.logo = logo;
      this.eventService.changeBackground({color:this.fontcolor,opaque:false,logo:logo});
    }

    ngOnInit(){
    }
    ngAfterViewInit(){

    }

    scrolling(e){
      if(this.showdetail.nativeElement.scrollTop >= 260){
        this.eventService.changeBackground({opaque:true,logo:'/images/logo.svg'});
      }else{
        this.eventService.changeBackground({opaque:false,logo:this.logo});
      }
    }
}
