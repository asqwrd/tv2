import { Routes }          from '@angular/router';
import {Guide} from '../pages/guide/guide';
import {SearchPage} from '../pages/search/search';
import {ShowPage} from '../pages/show/show';


export const LayoutRoutes: Routes = [
    { path: "", component: Guide },
    { path: "search/:query", component: SearchPage },
    { path: "show/:id", component: ShowPage },

];
