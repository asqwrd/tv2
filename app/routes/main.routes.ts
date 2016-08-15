import {Layout} from "../layout/layout";
import {LayoutRoutes} from "./layout.routes";
import { Routes, RouterModule } from '@angular/router';



export const appRoutes: Routes = [
  { path: "", component: Layout,
      children: LayoutRoutes
  },
];

export const routing = RouterModule.forRoot(appRoutes,{useHash:true});
