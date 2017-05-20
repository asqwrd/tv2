import {Injectable} from '@angular/core';
import {Http, Headers, Response} from "@angular/http";
import {ApiService} from "./api-service";
import { Router,Resolve, ActivatedRouteSnapshot,CanActivate } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/first';
import { Observable } from 'rxjs/Observable';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()

export class UserResolve implements Resolve<any> {
  constructor(private api: ApiService,private af:AngularFireAuth, private router:Router) {

  }

  resolve(route: ActivatedRouteSnapshot) {
     // should return an observable
    return this.af.authState.map((auth)=>{
      if(auth){
        return auth;
      }else{
        return false;
      }
    }).first()
  }
}

@Injectable()

export class UserAuth implements CanActivate {
  af:AngularFireAuth;
  constructor(af:AngularFireAuth) {
    this.af = af;
  }

  canActivate(route: ActivatedRouteSnapshot) {
     // should return an observable
    return this.af.authState.map((auth)=>{
      if(auth){
        return true;
      }else{
        //location.reload();
        return false;
      }
    }).first();
  }
}
