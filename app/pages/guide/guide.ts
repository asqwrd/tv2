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
    favoritesToday:boolean;
    favoritesRawData:Array<Object>;
    favoritesDB:FirebaseListObservable<any>;
    favSub:any;

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
      this.backgroundcolors = [];
      this.user = this.api.getUser();

      this.favoritesToday = false;


      this.api.getSchedule().subscribe((shows)=>{
        this.shows = shows['shows'];
        this.airtimes = shows['airtimes'];
        let backgrounds = shows['backgroundimages'];
        this.api.getLocation('guide').subscribe((position)=>{
          let day_image = this.api.getTimeBg(position.coords.latitude,position.coords.longitude);
          if(this.user){
            this.favoritesDB = this.af.database.list('/favorites', {
              query: {
                orderByChild: 'userid',
                equalTo: this.user['uid'],
              }
            })
            this.favSub = this.favoritesDB.subscribe((data)=>{
              console.log('cache');
              this.favorites = [];
              this.favoritesRawData = data;
              let add_favimg:any;
              let add_favcolor:any;
              data.forEach((value)=>{
                this.favorites.push(value.showid);
              })

              let today_favs = this.shows.filter((show)=>{
                return this.favorites.indexOf(show.showid) >=0;
              });
              console.log(today_favs);
              if(today_favs.length > 0){
                this.favoritesToday = true;
                add_favimg = day_image;
                console.log('add_favimg');
                this.backgroundimages = [];
                this.backgroundcolors = [];
                this.backgroundimages.push(add_favimg);
                this.backgroundimages = this.backgroundimages.concat(backgrounds);
                console.log(this.backgroundimages);

                this.colorthief.getColorAsyncArray(this.backgroundimages,(colors)=>{
                  this.backgroundcolors = colors;
                  console.log(colors);
                  if(this.guide.nativeElement.scrollTop <= 215){
                    this.backgroundcolor = 'rgb('+this.backgroundcolors[0][0]+','+this.backgroundcolors[0][1]+','+this.backgroundcolors[0][2]+')';
                    this.changefontcolor(this.backgroundcolors[0]);
                  }
                });
              }else{
                this.favoritesToday = false;
                this.backgroundimages = backgrounds;
                this.colorthief.getColorAsyncArray(backgrounds,(colors)=>{
                  this.backgroundcolors = colors;
                  this.backgroundcolor = 'rgb('+this.backgroundcolors[0][0]+','+this.backgroundcolors[0][1]+','+this.backgroundcolors[0][2]+')';
                  this.changefontcolor(this.backgroundcolors[0]);
                });

              }
            });
          }else{
            this.api.user.subscribe((user)=>{
              this.user = user;
              if(this.user){
                this.favoritesDB = this.af.database.list('/favorites', {
                  query: {
                    orderByChild: 'userid',
                    equalTo: this.user['uid'],
                  }
                })
                this.favSub = this.favoritesDB.subscribe((data)=>{
                  this.favorites = [];
                  this.favoritesRawData = data;
                  data.forEach((value)=>{
                    this.favorites.push(value.showid);
                  })

                  let today_favs = this.shows.filter((show)=>{
                    return this.favorites.indexOf(show.showid) >=0;
                  });
                  if(today_favs.length > 0){
                    this.favoritesToday = true;
                    this.backgroundimages.unshift(day_image);
                    this.colorthief.getColorFromUrl(this.backgroundimages[0],(color,element)=>{
                      this.backgroundcolors.unshift(color);
                      if(this.guide.nativeElement.scrollTop <= 215){
                        this.backgroundcolor = 'rgb('+color[0]+','+color[1]+','+color[2]+')';
                        this.changefontcolor(color);
                      }
                    });

                  }else{
                    this.favoritesToday = false;
                    this.backgroundimages.shift();
                    this.backgroundcolors.shift();
                    if(this.backgroundcolors.length > 0){
                      this.backgroundcolor = 'rgb('+  this.backgroundcolors[0][0]+','+  this.backgroundcolors[0][1]+','+  this.backgroundcolors[0][2]+')';
                      this.changefontcolor(  this.backgroundcolors[0]);
                    }
                  }
                  this.backgroundimages = this.backgroundimages.concat(backgrounds);
                  this.colorthief.getColorAsyncArray(this.backgroundimages,(colors)=>{
                    if(this.favoritesToday == true){
                      colors.shift();
                    }
                    this.backgroundcolors = this.backgroundcolors.concat(colors);
                    this.backgroundcolor = 'rgb('+this.backgroundcolors[0][0]+','+this.backgroundcolors[0][1]+','+this.backgroundcolors[0][2]+')';
                    this.changefontcolor(this.backgroundcolors[0]);
                  });
                });
              }else{
                this.backgroundimages = this.backgroundimages.concat(backgrounds);
                this.colorthief.getColorAsyncArray(this.backgroundimages,(colors)=>{
                  this.backgroundcolors = this.backgroundcolors.concat(colors);
                  this.backgroundcolor = 'rgb('+this.backgroundcolors[0][0]+','+this.backgroundcolors[0][1]+','+this.backgroundcolors[0][2]+')';
                  this.changefontcolor(this.backgroundcolors[0]);
                });
              }
            })
          }
        })
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
    ngOnDestroy(){
      this.favSub.unsubscribe();
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
