import {Injectable,EventEmitter} from '@angular/core';
import {Http, Headers, Response, RequestOptions} from "@angular/http";
import {EventService} from "./event-services";


import { Observable } from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import { Subject } from 'rxjs/Subject';


declare var PUBNUB:any;
@Injectable()

export class ApiService {
    
    private headers = new Headers();
    private app: Object;
    private eventService;
    domain:string;
    userid:string;
    private pubnub:any;
    

    constructor(private http:Http,eventService:EventService) {
        this.headers.append('Content-Type', 'application/json');
        this.domain = '/webdamws/';
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
    
    initPubnub(){
        this.pubnub = PUBNUB({
            publish_key: 'pub-c-4d0f43b0-ff8d-4143-9fce-8adb0639c9f3',
            subscribe_key: 'sub-c-779a8948-3e64-11e6-85a4-0619f8945a4f',
            //ssl: (location.protocol.toLowerCase() === 'https:'),
            uuid: this.getUserId(),
        });
    }
    
    getPubnub(){
        return this.pubnub;
    }
    
    getDomain(){
        return this.domain;
    }
    
    setDomain(domain:string){
        this.domain = domain;
    }
    
    translate(text:string){
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

    //uuid function

    setUserId():string {
        
        this.userid = this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
        
        return this.userid;
    }
    
    getUserId():string{
        return this.userid;
    }

    private s4():string {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
}