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
    selector: 'search',
    templateUrl: 'search.html',
})


export class SearchPage {
    router:Router;
    shows:Array<Show>;
    date:any;
    time:any;
    backgroundimage:string;
    backgroundcolor:string;
    backgroundcolors:Array<string[]>;
    colorthief:any;
    _timeout:any;
    fontcolor:string;
    param:ActivatedRoute;
    query:string;

    constructor(private zone:NgZone,private eventService:EventService,router:Router,private api:ApiService, route:ActivatedRoute) {
        this.router = router;
        this.eventService = eventService;
        this.colorthief = new ColorThief();
        this.fontcolor = "#000";
        this.query = decodeURI(route.snapshot.params['query']);
        this.api.search(this.query).subscribe((data)=>{
          console.log(data);
          this.shows = data['shows'];
          this.backgroundimage = data['backgroundimage'];
          this.colorthief.getColorFromUrl(this.backgroundimage,(color,element)=>{
            this.backgroundcolor = 'rgb('+color[0]+','+color[1]+','+color[2]+')';
            this.changefontcolor(color);
            console.log(color);

          });

        });

      route.params.subscribe(params => {
         this.query = decodeURI(params['query']);
         this.api.search(this.query).subscribe((data)=>{
           this.shows = data['shows'];
           this.backgroundimage = data['backgroundimage'];
           this.colorthief.getColorFromUrl(this.backgroundimage,(color,element)=>{
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
      this.eventService.changeBackground({color:this.fontcolor,opaque:false,logo:logo});
    }

    ngOnInit(){
    }
    ngAfterViewInit(){

    }

    goToDetail(event){
      let id = event.show.showid;
      this.router.navigateByUrl('/show/'+ id);
    }
}
