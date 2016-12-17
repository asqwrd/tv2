import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {HttpModule} from '@angular/http';


import { App }  from './app';
import {ShowCard} from './components/show-card/show-card';
import {SwiperJs} from './directives/swiperjs-directive/swiperjs';
import {TaggleDirective} from './directives/taggle-directive/taggle-directive';
import {Colorthief} from './directives/color-thief';
import {ComponentHandler} from './directives/component-handler';

import {ApiService} from './services/api-service';
import {EventService} from './services/event-services';
import {
  OrderByPipe,
  OrderByDatePipe,
  MomentPipe,
  GroupByPipe
} from './pipes/pipes';

import {Guide} from './pages/guide/guide';
import {Layout} from './layout/layout';

import {routing} from './routes/main.routes';

@NgModule({
  imports:      [
    BrowserModule,
    RouterModule,
    CommonModule,
    FormsModule,
    HttpModule,
    routing
  ],
  declarations: [
    App,
    Layout,
    Guide,
    ShowCard,
    SwiperJs,
    TaggleDirective,
    Colorthief,
    ComponentHandler,
    OrderByPipe,
    OrderByDatePipe,
    MomentPipe,
    GroupByPipe
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
