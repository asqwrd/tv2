import {Component, Input, ViewChild, NgZone,ElementRef} from "@angular/core";

import {Show} from "../../classes/show";


import {Router} from "@angular/router";

//shared components and service
import {ApiService} from "../../services/api-service";
import {EventService} from "../../services/event-services";


import {Subject} from "rxjs/Rx";
declare var moment:any;
declare var ColorThief:any;


@Component({
    selector: 'guide',
    templateUrl: 'guide.html',
})


export class Guide {
    router:Router;
    shows:Array<Show>;
    airtimes:Array<string>;
    selectedshow:Show;
    search:Boolean;
    searching:Boolean;
    searchResults:Boolean;
    date:any;
    time:any;
    scroll_id:string | number;
    backgroundimages:Array<string>;
    backgroundcolor:string;
    backgroundcolors:Array<string[]>;
    colorthief:any;
    _timeout:any;
    fontcolor:string;

    @ViewChild('guide') guide:ElementRef;
    @ViewChild('searchEl') searchEl:ElementRef;
    @ViewChild('input') input:ElementRef;
    @ViewChild('searchForm') searchForm:ElementRef;
    @ViewChild('detail') detail:ElementRef;


    constructor(private zone:NgZone,private eventService:EventService,router:Router,private api:ApiService) {
        this.router = router;
        this.search = false;
        this.date = moment().format('dddd MMM DD hh:mm a');
        this.time = moment().format('hh:mm a');
        this.eventService = eventService;
        this.scroll_id = 0;
        this.colorthief = new ColorThief();
        this.fontcolor = "#000";
        this.api.getSchedule().subscribe((data)=>{
          console.log(data);
          this.shows = data['shows'];
          this.airtimes = data['airtimes'];
          this.backgroundimages = data['backgroundimages'];
          this.colorthief.getColorAsyncArray(this.backgroundimages,(colors)=>{
            this.backgroundcolors = colors;
            this.backgroundcolor = 'rgb('+this.backgroundcolors[0][0]+','+this.backgroundcolors[0][1]+','+this.backgroundcolors[0][2]+')';
            this.changefontcolor(this.backgroundcolors[0]);

          });

        /*  this.api.showDetail( this.shows[0]['showid']).subscribe((data)=>{
            this.selectedshow = data;
            this.selectedshow['season'] = this.shows[0]['season'];
            this.selectedshow['epsnumber'] = this.shows[0]['epsnumber'];
            this.selectedshow['epsname'] = this.shows[0]['epsname'];
            this.selectedshow['showname'] = this.shows[0]['showname'];
          });*/
        });

    }

    changefontcolor(rgb:Array<any>){
      let c = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
      let o = Math.round(((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) + (parseInt(rgb[2]) * 114)) / 1000);
      if(o > 125){
        this.fontcolor = '#000';
      }else{
        this.fontcolor = '#fff';
      }
    }

    ngOnInit(){
    }
    ngAfterViewInit(){
      /*let anchor = 'time_0';
      let anchorTarget:HTMLElement = document.getElementById(anchor);
      console.log(anchor);
      console.log(anchorTarget);
        if (anchorTarget !== null) {
          let scroll = anchorTarget.offsetTop -
                    anchorTarget.scrollTop +
                    anchorTarget.clientTop;
          console.log(scroll);
          if(this.guide.nativeElement.scrollTop == scroll){
            this.scroll_id = 0;
          }
          console.log(this.scroll_id);
        }*/
    }

    scrolling(e){
      if(this._timeout){ //if there is already a timeout in process cancel it
          window.clearTimeout(this._timeout);
        }
        this._timeout = setTimeout(() => {
          this._timeout = undefined;
          console.log('scroll stopped');
          let anchorTarget =[].slice.call( document.querySelectorAll('.show-groups'));
          anchorTarget.forEach((element,index)=>{
            let scroll = element.offsetTop -
                      element.scrollTop +
                      element.clientTop - 164;
            if(this.guide.nativeElement.scrollTop >= scroll){
              let shows = this.shows.filter((show)=>{
                return show.airtime == this.airtimes[index];

              });
              this.backgroundcolor = 'rgb('+this.backgroundcolors[index][0]+','+this.backgroundcolors[index][1]+','+this.backgroundcolors[index][2]+')';
              this.scroll_id = index;
              this.changefontcolor(this.backgroundcolors[index]);
            }
          });
            /*if (anchorTarget !== null) {
              let scroll = anchorTarget.offsetTop -
                        anchorTarget.scrollTop +
                        anchorTarget.clientTop;
              console.log(scroll);
              if(this.guide.nativeElement.scrollTop == scroll){
                this.scroll_id = 0;
              }
              console.log(this.scroll_id);
            }*/
        },500);
    }


    scrollView(anchor:string,index:number,time:string){
      let anchorTarget:HTMLElement = document.getElementById(anchor);
      console.log(anchor);
      console.log(anchorTarget);
        if (anchorTarget !== null) {
          let scroll = anchorTarget.offsetTop -
                    anchorTarget.scrollTop +
                    anchorTarget.clientTop;
          console.log(scroll);
          this.eventService.smoothScroll(this.guide.nativeElement,scroll,450);
          let showtimes = this.shows.filter((show)=>{
            return show.airtime == time;

          });
          this.backgroundcolor = 'rgb('+this.backgroundcolors[index][0]+','+this.backgroundcolors[index][1]+','+this.backgroundcolors[index][2]+')';
          this.scroll_id = index;
          this.changefontcolor(this.backgroundcolors[index]);

        }
    }
}
