import {Component, Input, ViewChild, NgZone,ElementRef} from "@angular/core";

import {Show} from "../../classes/show";


import {Router} from "@angular/router";

//shared components and service
import {ApiService} from "../../services/api-service";
import {EventService} from "../../services/event-services";
import { AngularFire,FirebaseListObservable  } from 'angularfire2';



import {Subject} from "rxjs/Rx";
declare var moment:any;
declare var ColorThief:any;
declare var SunCalc:any;


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
    user:Object;
    favorites:Array<string>;
    favoritesRawData:Array<Object>;
    favoritesDB:FirebaseListObservable<any>;

    @ViewChild('guide') guide:ElementRef;
    @ViewChild('searchEl') searchEl:ElementRef;
    @ViewChild('input') input:ElementRef;
    @ViewChild('searchForm') searchForm:ElementRef;
    @ViewChild('detail') detail:ElementRef;
    latitude:number;
    longitude:number;


    constructor(private zone:NgZone,private eventService:EventService,router:Router,private api:ApiService,public af:AngularFire) {
        this.router = router;
        this.search = false;
        this.date = moment().format('dddd MMM DD hh:mm a');
        this.time = moment().format('hh:mm a');
        this.eventService = eventService;
        this.scroll_id = 0;
        this.colorthief = new ColorThief();
        this.fontcolor = "#000";
        this.backgroundimages = [];
        this.longitude = this.api.getLong();
        this.latitude = this.api.getLat();
        this.backgroundcolors = [];
        this.user = this.api.getUser();
        let time_of_day = SunCalc.getTimes(new Date(), this.latitude, this.longitude);
        let now = new Date();
        let day_image = "";
        if((now >= time_of_day.sunrise) && (now <= time_of_day.sunriseEnd)){
          day_image = "/images/morning.jpg";
        }else if((now > time_of_day.sunriseEnd) && (now <= time_of_day.goldenHourEnd)){
          day_image = "/images/afternoon.jpg";
        }else if((now > time_of_day.goldenHourEnd) && (now <= time_of_day.goldenHour)){
          day_image = "/images/noon4.jpg";
        }else if((now > time_of_day.goldenHour) && (now <= time_of_day.dusk)){
          day_image = "/images/afternoon2.jpg";
        }else{
          day_image = "/images/evening.jpg"
        }
        if(this.user){
          this.favoritesDB = this.af.database.list('/favorites', {
            query: {
              orderByChild: 'userid',
              equalTo: this.user['uid'],
            }
          })
          this.favoritesDB.subscribe((data)=>{

            this.favorites = [];
            data.forEach((value)=>{
              this.favorites.push(value.showid);
            })
            if(this.favorites.length > 0){
              this.backgroundimages.unshift(day_image);
              this.colorthief.getColorFromUrl(this.backgroundimages[0],(color,element)=>{
                this.backgroundcolors.unshift(color);
                this.backgroundcolor = 'rgb('+color[0]+','+color[1]+','+color[2]+')';
                this.changefontcolor(color);
              });

            }
          });
        }else{
          this.api.user.subscribe((user)=>{
            this.user = user;
            console.log(this.user);
            if(this.user){
              this.favoritesDB = this.af.database.list('/favorites', {
                query: {
                  orderByChild: 'userid',
                  equalTo: this.user['uid'],
                }
              })
              this.favoritesDB.subscribe((data)=>{
                this.favorites = [];
                this.favoritesRawData = data;
                data.forEach((value)=>{
                  this.favorites.push(value.showid);
                })
                if(this.favorites.length > 0){
                  this.backgroundimages.unshift(day_image);
                  this.colorthief.getColorFromUrl(this.backgroundimages[0],(color,element)=>{
                    this.backgroundcolors.unshift(color);
                    this.backgroundcolor = 'rgb('+color[0]+','+color[1]+','+color[2]+')';
                    this.changefontcolor(color);
                  });
                }
              });
            }
          })
        }



        this.api.getSchedule().subscribe((data)=>{
          this.shows = data['shows'];
          this.airtimes = data['airtimes'];
          this.backgroundimages = this.backgroundimages.concat(data['backgroundimages']);
          this.colorthief.getColorAsyncArray(this.backgroundimages,(colors)=>{
            this.backgroundcolors = this.backgroundcolors.concat(colors);
            this.backgroundcolor = 'rgb('+this.backgroundcolors[0][0]+','+this.backgroundcolors[0][1]+','+this.backgroundcolors[0][2]+')';
            this.changefontcolor(this.backgroundcolors[0]);
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

    scrolling(e){
      if(this._timeout){ //if there is already a timeout in process cancel it
          window.clearTimeout(this._timeout);
        }
        this._timeout = setTimeout(() => {
          this._timeout = undefined;
          let anchorTarget =[].slice.call( document.querySelectorAll('.scroll-groups'));
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

    goToDetail(event){
      let id = event.show.showid;
      this.router.navigateByUrl('/show/'+ id);
    }

    watch(data){
      console.log(data);
      this.favoritesDB.push({userid:this.user['uid'],showid:data.show.showid});
    }

    unwatch(data){
      console.log(data);
      let index = this.favoritesRawData.findIndex((item)=>{
        return item['showid'] == data['show']['showid'];
      });
      console.log(this.favoritesRawData[index]);
      this.favoritesDB.remove(this.favoritesRawData[index]['$key']);
    }
}
