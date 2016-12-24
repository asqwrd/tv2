import {Injectable} from '@angular/core';
import {Http, Headers, Response} from "@angular/http";
import {EventService} from "./event-services";
import {Show} from "../classes/show";


import { Observable } from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import { Subject } from 'rxjs/Subject';

import { AngularFire, FirebaseListObservable,AuthProviders, AuthMethods } from 'angularfire2';


declare var moment:any;
declare var ColorThief:any;
declare var SunCalc:any;
@Injectable()

export class ApiService {

    private headers = new Headers();
    private app: Object;
    private eventService;
    domain:string;
    guide:Object;
    airtimes:Array<string>;
    latitude:number;
    longitude:number;
    af:AngularFire;
    user = new Subject();
    currentUser:Object;

    constructor(private http:Http,eventService:EventService,af:AngularFire) {
        this.headers.append('Content-Type', 'application/json');
        this.domain = 'http://api.tvmaze.com';
        this.eventService = eventService;
        this.latitude = 0;
        this.longitude = 0;
        this.af = af;
        this.af.auth.subscribe((auth) =>{
          console.log(auth);
          if(auth.google){
            this.currentUser = auth.google;
            this.user.next(auth.google);
          }

        });
    }


    setCoords(lat,long){
      this.latitude =lat;
      this.longitude = long;
    }

    getLat(){
      return this.latitude;
    }

    getLong(){
      return this.longitude;
    }

    init() : Observable<Object>{

        if(!this.app) {
            return Observable.forkJoin(
            ).flatMap((data)=> {
                return this.createObservable(this.app);
            });

        }else{
            return this.createObservable(this.app);
        }
    }

    loginGoogle(){
      this.af.auth.login({
        provider: AuthProviders.Google,
        method: AuthMethods.Popup,
      })
    }

    setUser(user){
      this.user = user;
    }
    getUser():Object{
      return this.currentUser;
    }
    search(value:string):Observable<Object>{
      return this.http.get(this.domain+'/search/shows?q='+value).map((res:Response)=>{
        let data = res.json();
        let shows = [];
        let time_of_day = SunCalc.getTimes(new Date(), this.latitude, this.longitude);
        let now = new Date();
        let day_image = "";
        if((now >= time_of_day.sunrise) && (now <= time_of_day.sunriseEnd)){
          day_image = "images/morning.jpg";
        }else if((now > time_of_day.sunriseEnd) && (now <= time_of_day.goldenHourEnd)){
          day_image = "images/afternoon.jpg";
        }else if((now > time_of_day.goldenHourEnd) && (now <= time_of_day.goldenHour)){
          day_image = "images/noon4.jpg";
        }else if((now > time_of_day.goldenHour) && (now <= time_of_day.dusk)){
          day_image = "images/afternoon2.jpg";
        }else{
          day_image = "images/evening.jpg"
        }

        data.forEach((item)=>{
          let show = {
            image: item.show.image,
            showname: item.show.name,
            network: item.show.network ? item.show.network.name:"N/A",
            status: item.show.status,
            summary:item.show.summary,
            showid:item.show.id,
            id:item.show.id,
            year:item.show.premiered ? item.show.premiered.split('-')[0] : undefined
          };

          shows.push(show);
        })
        return {shows:shows,backgroundimage:day_image};
      });
    }

    showDetail(showid):Observable<Object>{
      return this.http.get(this.domain+'/shows/'+showid+'?embed[]=nextepisode&embed[]=episodes&embed[]=seasons').map((res:Response)=>{
        let data = res.json();
        let time_of_day = SunCalc.getTimes(new Date(), this.latitude, this.longitude);
        let now = new Date();
        let day_image = "";
        if((now >= time_of_day.sunrise) && (now <= time_of_day.sunriseEnd)){
          day_image = "images/morning.jpg";
        }else if((now > time_of_day.sunriseEnd) && (now <= time_of_day.goldenHourEnd)){
          day_image = "images/afternoon.jpg";
        }else if((now > time_of_day.goldenHourEnd) && (now <= time_of_day.goldenHour)){
          day_image = "images/noon4.jpg";
        }else if((now > time_of_day.goldenHour) && (now <= time_of_day.dusk)){
          day_image = "images/afternoon2.jpg";
        }else{
          day_image = "images/evening.jpg"
        }
        data.network = data.network ? data.network['name'] : 'No network';
        data.showname = data['name'];
        let backgroundimage = data.image ? data.image.original:day_image;

        return {show:data,backgroundimage:backgroundimage};
      });
    }

    getSchedule() : Observable<Object>{
      if(!this.guide){
        return this.http.get(this.domain+'/schedule?country=US').map((res:Response)=>{
            let data = res.json();
            let shows = [];
            let airtimes = [];
            let airtimesunix = [];
            let backgroundimages = [];
            let time_of_day = SunCalc.getTimes(new Date(), this.latitude, this.longitude);

            data.forEach((item)=>{
              let airtime = (item.airtime && item.airtime.trim().length > 0) ? item.airtime: "00:00";
              let show = {
                epsname:item.name,
                id:item.show.id,
                airtime: moment(airtime, 'hh:mm a').format('hh:mm a'),
                airtimeunix: moment(airtime, 'hh:mm a').valueOf(),
                runtime: item.runtime,
                season: item.season,
                epsnumber: item.number,
                image: item.show.image,
                showname: item.show.name,
                network: item.show.network.name,
                status: item.show.status,
                summary:item.show.summary,
                showid:item.show.id
              };
              if(airtimes.indexOf(show.airtimeunix) ==  -1){
                airtimes.push(show.airtimeunix);
              }
              shows.push(show);
            });

            shows.sort((a,b)=>{
              return a.airtimeunix - b.airtimeunix;
            });

            airtimes.sort();
            let airtimes_images = [];
            //noon4
            //afternoon2 for sunset
            //afternoon for sunrise
            //morning
            //evening

            let now = new Date();
            let day_image = "";
            if((now >= time_of_day.sunrise) && (now <= time_of_day.sunriseEnd)){
              day_image = "images/morning.jpg";
            }else if((now > time_of_day.sunriseEnd) && (now <= time_of_day.goldenHourEnd)){
              day_image = "images/afternoon.jpg";
            }else if((now > time_of_day.goldenHourEnd) && (now <= time_of_day.goldenHour)){
              day_image = "images/noon4.jpg";
            }else if((now > time_of_day.goldenHour) && (now <= time_of_day.dusk)){
              day_image = "images/afternoon2.jpg";
            }else{
              day_image = "images/evening.jpg"
            }
            shows.forEach((show)=>{
              if(airtimes_images.indexOf(show.airtimeunix) ==  -1){
                let image = (show.image && show.image.original) ? show.image.original : day_image;
                backgroundimages.push(image);
                airtimes_images.push(show.airtimeunix);
              }
            })
            airtimes.forEach((time,index)=>{
              airtimes[index] = moment(time).format('hh:mm a');
            });
            let guide ={
              shows: shows,
              airtimes:airtimes,
              backgroundimages:backgroundimages
            }
            this.guide = guide;
            return this.guide;
          });
      }else{
        return this.createObservable(this.guide);
      }
    }

    private createObservable(data: any) : Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            observer.next(data);
            observer.complete();
        });
    }

    private handleError(error: any) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

    guid():string {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    }

    private s4():string {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

}
