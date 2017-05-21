import {Component,Input,ViewChild,EventEmitter} from "@angular/core";

import {Show} from "../../classes/show";


import {Router} from "@angular/router";


@Component({
    selector: 'show-card',
    templateUrl: 'show-card.html',
    outputs:['detail','watch','unwatch']
})


export class ShowCard {
    @Input() show:Show;
    @Input() fontcolor:string;
    @Input() status:boolean;
    @Input() season:boolean;
    @Input() favorites:Array<string>;
    @Input() showunwatch:boolean;
    detail = new EventEmitter();
    watch = new EventEmitter();
    unwatch = new EventEmitter();



    constructor() {
    }

    ngOnInit(){
    }
    ngAfterViewInit(){
    }
    showDetail(){
      this.detail.emit({show:this.show});
    }

    watchShow(event){
      event.stopPropagation()
      this.watch.emit({show:this.show});
    }

    unwatchShow(event){
      event.stopPropagation();
      this.unwatch.emit({show:this.show});
    }

}
