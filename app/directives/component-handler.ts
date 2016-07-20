/**
 * Created by asqwrd on 7/1/2016.
 */

import {Directive, ElementRef, Renderer, OnInit, NgZone,EventEmitter} from '@angular/core';

declare var componentHandler:any;
@Directive({
    selector: '[component-handler]',
    inputs: [],
})
export class ComponentHandler implements OnInit{
    el:ElementRef;
    constructor(el: ElementRef, renderer: Renderer) {
        this.el = el;
        
    }


    ngOnInit() {
        componentHandler.upgradeElement(this.el.nativeElement);
    }

}