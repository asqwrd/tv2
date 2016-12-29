import {Injectable} from '@angular/core';
import {Http, Headers, Response} from "@angular/http";
import {ApiService} from "./api-service";
import { Router,Resolve, ActivatedRouteSnapshot,CanActivate } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/first';
import { Observable } from 'rxjs/Observable';

import { AngularFire, FirebaseListObservable,AuthProviders, AuthMethods,FirebaseAuth } from 'angularfire2';

@Injectable()

export class UserResolve implements Resolve<any> {
  constructor(private api: ApiService,private af:AngularFire, private router:Router) {

  }

  resolve(route: ActivatedRouteSnapshot) {
     // should return an observable
    return this.af.auth.map((auth)=>{
      if(auth && auth.google){
        return auth.google;
      }else if(auth && auth.facebook){
        return auth.facebook;
      }else{
        return false;
      }
    }).first()
  }
}

export class UserAuth implements CanActivate {
  constructor(private api: ApiService,private af:AngularFire,private router:Router) {

  }

  canActivate(route: ActivatedRouteSnapshot) {
     // should return an observable
    return this.af.auth.map((auth)=>{
      if(auth && auth.google){
        return true;
      }else if(auth && auth.facebook){
        return true;
      }else{
        //location.reload();
        return false;
      }
    }).first();
  }
}
