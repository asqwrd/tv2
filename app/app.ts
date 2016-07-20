import {
    Component,
} from "@angular/core";
import {enableProdMode, provide} from "@angular/core";
import {bootstrap} from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS} from '@angular/http';
import {
    Location,
    LocationStrategy,
    HashLocationStrategy}
    from '@angular/common';


import {
    ROUTER_DIRECTIVES,
    Router,
} from '@angular/router';

import { APP_ROUTER_PROVIDERS } from './routes/main.routes';

//shared components
import {EventService} from './services/event-services';
import {ApiService} from "./services/api-service";



@Component({
  selector: "app",
  template: "<router-outlet></router-outlet>",
  directives: [ROUTER_DIRECTIVES],
})

export class App {
  currentUser:Object;

  constructor(private api:ApiService,private router: Router, private location: Location) {
     
  }
  ngOnInit(){
  }

}


bootstrap(App, [
  // These are dependencies of our App
    HTTP_PROVIDERS,
    APP_ROUTER_PROVIDERS,
    EventService,
    ApiService,
    provide(LocationStrategy, {useClass: HashLocationStrategy}) // use #/ routes, remove this for HTML5 mode
]).catch(err => console.error(err));
