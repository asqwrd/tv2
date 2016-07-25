import {Component,Input,ViewChild,EventEmitter} from "@angular/core";
import {HTTP_PROVIDERS} from "@angular/http";
import {NgStyle,NgFor} from '@angular/common';


import 'rxjs/Rx';
import {Router} from "@angular/router";

//shared components and service
import {ApiService} from "../../services/api-service";
import {EventService} from "../../services/event-services";
import {ComponentHandler} from "../../directives/component-handler";
import {Colorthief} from "../../directives/color-thief";
import {SwiperJs} from "../../directives/swiperjs-directive/swiperjs";




//noinspection TypeScriptValidateTypes
@Component({
    selector: 'shows',
    viewProviders: [HTTP_PROVIDERS],
    templateUrl: 'app/components/shows/shows.html',
    directives:[NgStyle,NgFor,ComponentHandler,SwiperJs],
    outputs:['view']
})


export class Shows {
    @Input() shows:Array<Object>;
    @Input() selectedshow:Object;
    @Input() airtimes:Array<string>;
    @Input() search:Boolean;
    view = new EventEmitter();
    guid:string;

    constructor(private eventService:EventService,router:Router,private api:ApiService) {

    }

    ngOnInit(){

    }
    ngAfterViewInit(){
    }

    open_card(modal:HTMLElement,show:Object){
      this.view.emit({modal:modal,show:show});
    }

    close(modal:HTMLElement){
      modal.classList.remove('open');
    }


}
