import {Layout} from "../layout/layout";
import {LayoutRoutes} from "./layout.routes";
import { Routes, RouterModule } from '@angular/router';
import {UserResolve} from "../services/user-service";
import {LocationService} from "../services/location-service";



export const appRoutes: Routes = [
  {
    path: "",
    component: Layout,
    children: LayoutRoutes,
    resolve:{
      user:UserResolve
    },
  },
];

export const routing = RouterModule.forRoot(appRoutes,{useHash:true});
