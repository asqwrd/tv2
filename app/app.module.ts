import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule} from '@angular/http';
import { AngularFireModule } from 'angularfire2';

import { App }  from './app';
import { ShowCard} from './components/show-card/show-card';
import { SearchDropdown} from './components/search-dropdown/search-dropdown';
import { SwiperJs} from './directives/swiperjs-directive/swiperjs';
import { TaggleDirective} from './directives/taggle-directive/taggle-directive';
import { Colorthief} from './directives/color-thief';
import { ComponentHandler} from './directives/component-handler';

import { ApiService} from './services/api-service';
import { EventService} from './services/event-services';
import {
  OrderByPipe,
  OrderByDatePipe,
  MomentPipe,
  GroupByPipe,
  FilterPipe
} from './pipes/pipes';

import {Guide} from './pages/guide/guide';
import {SearchPage} from './pages/search/search';
import {ShowPage} from './pages/show/show';
import {Layout} from './layout/layout';
import {Show} from './classes/show';
import {Episode} from './classes/episode';

import {routing} from './routes/main.routes';

export const firebaseConfig = {
  apiKey: 'AIzaSyAuccXGpEWjAMVkDYQsi7ewFAVmDXIGjRQ',
  authDomain: 'awaritv-2b373.firebaseapp.com',
  databaseURL: 'https://awaritv-2b373.firebaseio.com',
  storageBucket: 'awaritv-2b373.appspot.com',
  messagingSenderId: "533309421994"

};

@NgModule({
  imports:      [
    BrowserModule,
    RouterModule,
    CommonModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    routing
  ],
  declarations: [
    App,
    Layout,
    Guide,
    SearchPage,
    ShowPage,
    ShowCard,
    SearchDropdown,
    SwiperJs,
    TaggleDirective,
    Colorthief,
    ComponentHandler,
    OrderByPipe,
    OrderByDatePipe,
    MomentPipe,
    GroupByPipe,
    FilterPipe
  ],
  exports:[
    BrowserModule,
    RouterModule,
    CommonModule,
    FormsModule,
    HttpModule,
  ],
  providers:[
    ApiService,
    EventService
  ],
  bootstrap:    [ App ]
})
export class AppModule { }
