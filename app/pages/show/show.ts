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
    id:string | number;
    @ViewChild('showdetail') showdetail:ElementRef;
    logo:string;

    favorites:Array<string>;
    favoritesRawData:Array<Object>;
    favoritesDB:FirebaseListObservable<any>;
    favSub:any;
    user:Object;
    loading:boolean;

    constructor(private zone:NgZone,private eventService:EventService,router:Router,private api:ApiService, public route:ActivatedRoute,public af:AngularFire) {
      this.router = router;
      this.eventService = eventService;
      this.colorthief = new ColorThief();
      this.fontcolor = "#000";
      this.loading = true;
      this.id = parseInt(this.route.snapshot.params['id']);

      //this.api.user.subscribe((user)=>{
        this.user = this.route.snapshot.data['user'];
        console.log(this.route.snapshot.data);
        if(this.user){
          console.log(this.user);
          this.af.database.list('/favorites', {
            query: {
              orderByChild: 'userid',
              equalTo: this.user['uid'],
            }
          }).subscribe((data)=>{
            this.favorites = [];
            this.favoritesRawData = data;
            data.forEach((value)=>{
              this.favorites.push(value.showid);
            })

          },(error)=>{

          });
        }
      //})
      this.api.showDetail(this.id).subscribe((data)=>{
        console.log(data);
        this.show = data['show'];
        this.backgroundimage = data['backgroundimage'];
        this.colorthief.getColorAsync(this.backgroundimage,(color,element)=>{
          this.backgroundcolor = 'rgb('+color[0]+','+color[1]+','+color[2]+')';
          this.changefontcolor(color);

        });

      });

      route.params.subscribe(params => {
        this.id = parseInt(params['id']);
        this.api.showDetail(this.id).subscribe((data)=>{
          this.show = data['show'];
          if(this.showdetail){
            this.showdetail.nativeElement.scrollTop = 0;
          }
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
      let logo = 'images/logo.svg';
      if(o > 125){
        this.fontcolor = '#000';
      }else{
        this.fontcolor = '#fff';
        logo = 'images/logo-light.svg';
      }
      this.logo = logo;
      this.loading = false;
      this.eventService.changeBackground({color:this.fontcolor,opaque:false,logo:logo});
    }

    ngOnInit(){
      //this.api.getUser();

    }
    ngAfterViewInit(){

    }

    scrolling(e){
      if(this.showdetail.nativeElement.scrollTop >= 260){
        this.eventService.changeBackground({opaque:true,logo:'images/logo.svg',color:'#000'});
      }else{
        this.eventService.changeBackground({opaque:false,logo:this.logo, color:this.fontcolor});
      }
    }
    ngOnDestroy(){
      /*if(this.favSub){
        this.favSub.unsubscribe();
      }*/
    }

    watch(){
      this.af.database.list('/favorites').push({userid:this.user['uid'],showid:this.id,show:this.show});
    }

    unwatch(){
      let index = this.favoritesRawData.findIndex((item)=>{
        return item['showid'] == this.id;
      });
        this.af.database.list('/favorites').remove(this.favoritesRawData[index]['$key']);
    }
}
