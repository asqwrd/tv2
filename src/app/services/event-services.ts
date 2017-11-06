import {EventEmitter} from "@angular/core";

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


export class EventService {
    public addMessage: Subject<any>;
    public swiper = new Subject();
    public search = new Subject();
    public background = new Subject();


    constructor() {
        this.addMessage = new Subject();

    }

    updateSwiper(data){
      this.swiper.next('update');
    }

    changeBackground(data){
      this.background.next(data);
    }


  debounce(fn, delay) {
    var timer = null;
    return function () {
      var context = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }



  smoothScroll(container,anchor, duration) {

    // Calculate how far and how fast to scroll
    var startLocation = container.scrollTop;
    var endLocation = anchor.offsetTop;
    var distance = endLocation - startLocation;
    var increments = distance/(duration/16);
    var stopAnimation;
    console.log("anchor", anchor,)
    console.log(increments,"dis",distance,'dur',duration);

    // Scroll the page by an increment, and check if it's time to stop
    var animateScroll = function () {
        container.scrollBy(0, increments);
        stopAnimation();
    };

    // If scrolling down
    if ( increments >= 0 ) {
        // Stop animation when you reach the anchor OR the bottom of the page
        stopAnimation = function () {
            var travelled = container.scrollTop;
            if ( (travelled >= (endLocation - increments)) || ((container.innerHeight + travelled) >= document.body.offsetHeight) ) {
                clearInterval(runAnimation);
            }
        };
    }
    // If scrolling up
    else {
        // Stop animation when you reach the anchor OR the top of the page
        stopAnimation = function () {
            var travelled = container.scrollTop;
            if ( travelled <= (endLocation || 0) ) {
                clearInterval(runAnimation);
            }
        };
    }

    // Loop the animation function
    var runAnimation = setInterval(animateScroll, 16);

  }



}
