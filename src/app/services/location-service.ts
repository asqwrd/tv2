import {Injectable} from '@angular/core';
import {Http, Headers, Response} from "@angular/http";
import {ApiService} from "./api-service";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class LocationService implements Resolve<any> {
  position:Object;
  constructor(private api: ApiService) {

  }

  resolve(route: ActivatedRouteSnapshot) {
     // should return an observable
   return this.api.getLocation();
  }
}
