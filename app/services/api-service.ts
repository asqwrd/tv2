import {Injectable,EventEmitter} from '@angular/core';
import {Http, Headers, Response, RequestOptions} from "@angular/http";
import {EventService} from "./event-services";


import { Observable } from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import { Subject } from 'rxjs/Subject';


declare var moment:any;
@Injectable()

export class ApiService {

    private headers = new Headers();
    private app: Object;
    private eventService;
    domain:string;
    guide:Object;
    airtimes:Array<string>;


    constructor(private http:Http,eventService:EventService) {
        this.headers.append('Content-Type', 'application/json');
        this.domain = 'http://api.tvmaze.com';
        this.eventService = eventService;


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

    search(value:string):Observable<Object[]>{
      return this.http.get(this.domain+'/search/shows?q='+value).map((res:Response)=>{
        let data = res.json();
        let shows = [];
        data.forEach((item)=>{
          let show = {
            image: item.show.image,
            showname: item.show.name,
            network: item.show.network ? item.show.network.name:"N/A",
            status: item.show.status,
            summary:item.show.summary,
            showid:item.show.id
          };

          shows.push(show);
        })
        return shows;
      });
    }

    showDetail(showid):Observable<Object>{
      return this.http.get(this.domain+'/shows/'+showid+'?embed=nextepisode').map((res:Response)=>{
        let data = res.json();
        if(data._embedded){
          data._embedded.nextepisode.airtime = moment(data._embedded.nextepisode.airtime, 'hh:mm a').format('hh:mm a');
          data._embedded.nextepisode.airdate = moment(data._embedded.nextepisode.airdate).format('DD MMM, YYYY');
        }
        return data;
      });
    }

    getSchedule() : Observable<Object>{
      if(!this.guide){
        return this.http.get(this.domain+'/schedule?country=US').map((res:Response)=>{
            let data = res.json();
            let shows = [];
            let airtimes = [];
            data.forEach((item)=>{
              let show = {
                epsname:item.name,
                id:this.guid(),
                airtime: moment(item.airtime, 'hh:mm a').format('hh:mm a'),
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
              if(airtimes.indexOf(show.airtime) ==  -1){
                airtimes.push(moment(show.airtime, 'hh:mm a').format('hh:mm a'));
              }
              shows.push(show);
            });
            let guide ={
              shows: shows,
              airtimes:airtimes
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
