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
    location:Object;
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
          if(auth.google){
            this.currentUser = auth.google;
            this.user.next(auth.google);
          }

        });
    }

    getLocation(where:string = "api-service"):Observable<any>{
      console.log(where);
      if ((window.navigator && window.navigator.geolocation) && !this.location) {
        // geolocation is available
        return  Observable.create((observer) => {
          window.navigator.geolocation.getCurrentPosition((position)=>{
            this.location = position;
            observer.next(position);
            //this.api.setCoords(position.coords.latitude,position.coords.longitude)
          },(error)=>{
            this.location = {
                coords:{
                latitude:0,
                longitude:0
              }
            }
            observer.next(this.location);
          })
        });
      }else {
        // geolocation is not supported
        if(!this.location){
          this.location = {
              coords:{
              latitude:0,
              longitude:0
            }
          }
        }
        return  this.createObservable(this.location);
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

    getTimeBg(latitude,longitude):string{
      let time_of_day = SunCalc.getTimes(new Date(), latitude, longitude);
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
      return day_image;
    }

    search(value:string):Observable<Object>{
      return this.http.get(this.domain+'/search/shows?q='+value).map((res:Response)=>{
        let data = res.json();
        return data;
      }).flatMap((data)=>{
        return this.getLocation().map((position)=>{
          let shows = [];
          let day_image = this.getTimeBg(position.coords.latitude,position.coords.longitude);

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
        })
      });
    }

    showDetail(showid):Observable<Object>{
      return this.http.get(this.domain+'/shows/'+showid+'?embed[]=nextepisode&embed[]=episodes&embed[]=seasons').map((res:Response)=>{
        let data = res.json();
        return data;
      }).flatMap((data)=>{
        return this.getLocation().map((position)=>{
          let day_image = this.getTimeBg(position.coords.latitude,position.coords.longitude);
          data.network = data.network ? data.network['name'] : 'No network';
          data.showname = data['name'];
          let backgroundimage = data.image ? data.image.original:day_image;

          return {show:data,backgroundimage:backgroundimage};
        })
      });
    }

    getSchedule() : Observable<Object>{
      if(!this.guide){
        return this.http.get(this.domain+'/schedule?country=US').map((res:Response)=>{
            let data = res.json();
            return data;
          }).flatMap((data)=>{
            return this.getLocation().map((position)=>{
              let shows = [];
              let airtimes = [];
              let airtimesunix = [];
              let backgroundimages = [];

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

            let day_image = this.getTimeBg(position.coords.latitude,position.coords.longitude);
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
            })
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
