import {Component, Input, ViewChild, NgZone,ElementRef} from "@angular/core";

import {Show} from "../../classes/show";


import {Router,ActivatedRoute} from "@angular/router";

//shared components and service
import {ApiService} from "../../services/api-service";
import {EventService} from "../../services/event-services";
import { AngularFire,FirebaseListObservable  } from 'angularfire2';



import {Subject} from "rxjs/Rx";
declare var moment:any;
declare var ColorThief:any;
declare var SunCalc:any;


@Component({
    selector: 'favorites',
    templateUrl: 'favorites.html',
})


export class Favorites {
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
    backgroundimage:string;
    backgroundcolor:string;
    colorthief:any;
    _timeout:any;
    fontcolor:string;
    user:Object;
    favoritesArr:Array<Object>;
    favoritesToday:boolean;
    favoritesRawData:Array<Object>;
    favoritesDB:FirebaseListObservable<any>;
    favSub:any;
    loading:boolean;
    gradient:string;

    @ViewChild('favorites') favorites:ElementRef;
    @ViewChild('searchEl') searchEl:ElementRef;
    @ViewChild('input') input:ElementRef;
    @ViewChild('searchForm') searchForm:ElementRef;
    @ViewChild('detail') detail:ElementRef;
    latitude:number;
    longitude:number;


    constructor(private zone:NgZone,private eventService:EventService,router:Router,private api:ApiService,public af:AngularFire, public route:ActivatedRoute) {
      this.router = router;
      this.search = false;
      this.date = moment().format('dddd MMM DD hh:mm a');
      this.time = moment().format('hh:mm a');
      this.eventService = eventService;
      this.scroll_id = 0;
      this.colorthief = new ColorThief();
      this.fontcolor = "#000";
      this.favoritesArr = [];
      this.loading = true;
      this.fontcolor = '#000';
      console.log(this.route.snapshot.data);

      //this.api.user.subscribe((user)=>{
        this.user = this.route.snapshot.data['user'];
        this.api.getFavorites(this.user['uid']);
        this.api.favorites_subject.subscribe((data)=>{
          let count = data['total_favorites'];
          let favorites = data['favorites'];
          if(favorites && (favorites.length == count)){
            this.favoritesArr = favorites;
            this.favoritesRawData = data['rawData'];
            this.favoritesDB = data['db'];
            this.favSub = data['subcribed'];

            let position = this.route.snapshot.data['position'];
            this.backgroundimage = this.api.getTimeBg(position.coords.latitude,position.coords.longitude);
            this.colorthief.getColorFromUrl(this.backgroundimage,(color,element)=>{
              this.backgroundcolor = 'rgba('+color[0]+','+color[1]+','+color[2]+',1)';
              this.gradient = 'rgba('+color[0]+','+color[1]+','+color[2]+',0)';
              this.changefontcolor(color);

            });


          //  this.api.getLocation('favorites').subscribe((position)=>{

          //  });
          }
        },(error)=>{
          this.router.navigateByUrl('/');
        });
    //  })

    }


    changefontcolor(rgb:Array<any>){
      let c = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
      let o = Math.round(((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) + (parseInt(rgb[2]) * 114)) / 1000);
      let logo = 'images/logo.svg';
      if(o > 125){
        this.fontcolor = '#000';
      }else{
        this.fontcolor = '#fff';
        logo = 'images/logo-light.svg';
      }
      this.loading = false;

      this.eventService.changeBackground({color:this.fontcolor,opaque:false,logo:logo});
    }

    ngOnInit(){
      //this.api.getUser();





    }
    ngAfterViewInit(){

    }
    ngOnDestroy(){
      this.favSub.unsubscribe();
    }

    goToDetail(event){
      let id = event.show.showid;
      this.router.navigateByUrl('/show/'+ id);
    }

    unwatch(data){
      console.log(data);
      let index = this.favoritesRawData.findIndex((item)=>{
        return item['showid'] == data['show']['showid'];
      });
      console.log(this.favoritesRawData[index]);
      this.af.database.list('/favorites').remove(this.favoritesRawData[index]['$key']);
    }
}
