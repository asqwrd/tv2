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
import { Router,Resolve, ActivatedRouteSnapshot,CanActivate } from '@angular/router';


import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';


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
    user = new Subject();
    currentUser:Observable<firebase.User>;
    favorites_subject = new Subject();
    ishttp:boolean;

    constructor(private http:Http,eventService:EventService,public af:AngularFireAuth,private router:Router,public afDB:AngularFireDatabase) {
        this.headers.append('Content-Type', 'application/json');
        this.ishttp = false;
        if(window.location.protocol == "http:" || window.location.protocol == "http"){
          this.domain = "http://api.tvmaze.com";
          this.ishttp = true;
        }else{
          this.domain = '//'+window.location.hostname + ':3001/api';
        }

        this.eventService = eventService;
        this.latitude = 0;
        this.longitude = 0;
        this.currentUser = af.authState;

    }

    ngOnInit(){

    }
    getAuth(){

      return this.currentUser;
    }
    getAuthState(){
      return this.af.authState;
    }

    getLocation(where:string = "api-service"):Observable<any>{
      if ((window.navigator && window.navigator.geolocation) && !this.location) {
        // geolocation is available
        return  Observable.create((observer) => {

            window.navigator.geolocation.getCurrentPosition((position)=>{
                observer.next(position);
                observer.complete()
              //this.api.setCoords(position.coords.latitude,position.coords.longitude)
            },(error)=>{
              this.location = {
                  coords:{
                  latitude:0,
                  longitude:0
                }
              }
              observer.next(this.location);
              observer.complete();

            },{enableHighAccuracy:false})
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
      this.af.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      /*this.af.auth.login({
        provider: AuthProviders.Google,
        method: AuthMethods.Popup,
      }).then((auth)=>{
        this.af.auth.subscribe(auth => {
            if(!auth){
              this.router.navigateByUrl('/');
              location.reload();
            }else{
              location.reload();
            }
        });
      });*/
    }

    loginFacebook(){
      this.af.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
      /*this.af.auth.login({
        provider: AuthProviders.Facebook,
        method: AuthMethods.Popup,
      }).then((auth)=>{
        this.af.auth.subscribe(auth => {
            if(!auth){
              this.router.navigateByUrl('/');
              location.reload();
            }else{
              location.reload();
            }
        });
      });*/
    }

    logout(){
      this.af.auth.signOut();
    }

    setUser(user){
      this.user = user;
    }
    getUser(){
      return this.currentUser;
    }

    getTimeBg(latitude,longitude):string{
      let time_of_day = SunCalc.getTimes(new Date(), latitude, longitude);
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
            if(item.show.image){
              item.show.image.original = "//"+item.show.image.original.replace(/.*?:\/\//g, "");
              item.show.image.medium = "//"+item.show.image.medium.replace(/.*?:\/\//g, "");
            }
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
      let append = '';
      if(this.ishttp){
        append = '?embed[]=nextepisode&embed[]=episodes&embed[]=seasons';
      }
      return this.http.get(this.domain+'/shows/'+showid +''+ append).map((res:Response)=>{
        let data = res.json();
        return data;
      }).flatMap((data)=>{
        return this.getLocation().map((position)=>{
          let day_image = this.getTimeBg(position.coords.latitude,position.coords.longitude);
          data.network = data.network ? data.network['name'] : 'N/A';
          data.showname = data['name'];
          if(data.image){
            data.image.original = "//"+data.image.original.replace(/.*?:\/\//g, "");
            data.image.medium = "//"+data.image.medium.replace(/.*?:\/\//g, "");
          }
          let backgroundimage = data.image ? data.image.original:day_image;

          return {show:data,backgroundimage:backgroundimage};
        })
      });
    }

    getFavorites(userid){
      let favoritesDb = this.getUserFavorites(userid);
      let sub = favoritesDb.subscribe((data)=>{
        let favorites = [];
        let favs = data;
        if(favs.length > 0){
          favs.forEach((item)=>{
            let fav_var = 'shows';
            if(!this.ishttp){
              fav_var = 'favorites'

            }
            this.http.get(this.domain+'/'+fav_var+'/'+item['showid']).subscribe((res:Response)=>{
              let data = res.json();
              if(data.image){
                data.image.original = "//"+data.image.original.replace(/.*?:\/\//g, "");
                data.image.medium = "//"+data.image.medium.replace(/.*?:\/\//g, "");
              }
              let show = {
                image: data.image,
                showname: data.name,
                network: data.network ? data.network.name:"N/A",
                status: data.status,
                summary:data.summary,
                showid:data.id,
                id:data.id,
                year:data.premiered ? data.premiered.split('-')[0] : undefined
              };
              favorites.push(show);
              this.favorites_subject.next({favorites:favorites, total_favorites:favs.length,db:favoritesDb,rawData:favs, subcribed:sub});
            })
          })
        }else{
          this.favorites_subject.next({favorites:[], total_favorites:0,db:favoritesDb,rawData:favs, subcribed:sub});
        }

      },(error)=>{
        this.router.navigateByUrl('/');
      })
    }

    getSchedule() : Observable<Object>{
      let append = '';
      if(this.ishttp){
        append = '?country=US';
      }
      if(!this.guide){
        return this.http.get(this.domain+'/schedule' + append).map((res:Response)=>{
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
                if(item.show.image){
                  item.show.image.original = "//"+item.show.image.original.replace(/.*?:\/\//g, "");
                  item.show.image.medium = "//"+item.show.image.medium.replace(/.*?:\/\//g, "");
                }
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
                  network: item.show.network ? item.show.network.name: "N/A",
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
                backgroundimages:backgroundimages,
                dayimage:day_image
              }
              this.guide = guide;
              let time = 2.16 * 10000000;
              setInterval(()=>{
                this.guide = undefined;
              },time);
              return this.guide;
            })
          });
      }else{
        return this.createObservable(this.guide);
      }
    }

    getUserFavorites(userid): Observable<any>{
      return this.afDB.list<any>('/favorites', ref => ref.orderByChild('userid').equalTo(userid)).snapshotChanges().map((actions)=>{
        let data =[];
        actions.forEach(action => {
            let item = action.payload.val();
            item['key'] = action.key;
            data.push(item);
          });
          return data;
        })
    }

   createObservable(data: any) : Observable<any> {
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
