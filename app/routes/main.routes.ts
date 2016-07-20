import { provideRouter, RouterConfig } from '@angular/router';
import {Layout} from "../layout/layout";
import {LayoutRoutes} from "./layout.routes";

export const routes: RouterConfig = [
    { path: "", component: Layout,
        children: LayoutRoutes
    },
];
export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];