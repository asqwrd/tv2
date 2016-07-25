/**
 * Created by asqwrd on 7/1/2016.
 */

import {Directive, ElementRef, Renderer, OnInit, NgZone,EventEmitter} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {EventService} from "../../services/event-services";
import {ApiService} from "../../services/api-service";



declare var Swiper:any;
@Directive({
    selector: '[swiperjs]',
    inputs: ['next','prev','scrollbar','guid'],
})
export class SwiperJs implements OnInit{
    el:ElementRef;
    next:HTMLDivElement;
    prev:HTMLDivElement;
    scrollbar:HTMLDivElement;
    swiper:any;
    guid:string;
    constructor(el: ElementRef, renderer: Renderer,private eventService:EventService,private api:ApiService,private zone:NgZone) {
        this.el = el;
        this.eventService.swiper.subscribe((data)=>{
          if(this.guid == data['id']){
            console.log('update');
            this.zone.run(()=>{
              this.swiper.update(true);

            });

          }

          //
        });



    }


    ngOnInit() {

    }
    ngAfterViewInit(){
      this.swiper = new Swiper(this.el.nativeElement, {
       nextButton: this.next? this.next:false,
       prevButton: this.prev? this.prev:false,
       spaceBetween: 20,
       slidesPerView: 'auto',
       freeMode: true,
       mousewheelControl: true,
       mousewheelForceToAxis:true,
       scrollbar: this.scrollbar ? this.scrollbar:false,
       scrollbarHide: true,
     });
    }
}
