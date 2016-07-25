/**
 * Created by asqwrd on 7/1/2016.
 */

import {Directive, ElementRef, Renderer, OnInit, NgZone,EventEmitter} from '@angular/core';

declare var Vibrant:any;
@Directive({
    selector: '[color-thief]',
    inputs: ['tint','elem'],
})
export class Colorthief implements OnInit{
    el:ElementRef;
    tint:any;
    colorThief:any;
    elem:HTMLImageElement;
    constructor(el: ElementRef, renderer: Renderer) {
        this.el = el;


    }


    ngOnInit() {
      console.log(this.elem);
    }

    ngAfterViewInit(){
      setTimeout(()=>{
        this.colorThief = new Vibrant(this.el.nativeElement);
        let swatches = this.colorThief.swatches();
        for (var swatch in swatches)
        if (swatches.hasOwnProperty(swatch) && swatches[swatch])
            console.log(swatch, swatches[swatch].getHex())
      },1000)
    }

}
