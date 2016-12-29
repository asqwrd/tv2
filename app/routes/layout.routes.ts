import { Routes }          from '@angular/router';
import {Guide} from '../pages/guide/guide';
import {Favorites} from '../pages/favorites/favorites';
import {SearchPage} from '../pages/search/search';
import {ShowPage} from '../pages/show/show';
import {UserResolve,UserAuth} from "../services/user-service";
import {LocationService} from "../services/location-service";



export const LayoutRoutes: Routes = [
    {
      path: "",
      component: Guide,
      resolve:{
        position:LocationService,
        user:UserResolve
      }
    },
    {
      path: "search/:query",
      component: SearchPage,
      resolve:{
        position:LocationService,
        user:UserResolve
      }
    },
    {
      path: "show/:id",
      component: ShowPage,
      resolve:{
        position:LocationService,
        user:UserResolve
      }
    },
    {
      path: "favorites",
      component: Favorites,
      resolve:{
        position:LocationService,
        user:UserResolve
      },
      canActivate:[UserAuth]
    },

];
