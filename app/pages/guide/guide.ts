import {Component, Input, ViewChild, NgZone,ElementRef} from "@angular/core";
import {HTTP_PROVIDERS} from "@angular/http";
import {NgStyle,NgFor} from '@angular/common';


import 'rxjs/Rx';
import {Router} from "@angular/router";

//shared components and service
import {ApiService} from "../../services/api-service";
import {EventService} from "../../services/event-services";


import {Shows} from "../../components/shows/shows";
import {Subject} from "rxjs/Rx";


@Component({
    selector: 'guide',
    viewProviders: [HTTP_PROVIDERS],
    templateUrl: 'app/pages/guide/guide.html',
    directives:[NgStyle,NgFor,Shows]
})


export class Guide {
    router:Router;
    shows:Array<Object>;
    airtimes:Array<string>;
    selectedshow:Object;
    search:Boolean;


    constructor(private zone:NgZone,private eventService:EventService,router:Router,private api:ApiService) {
        this.router = router;
        this.search = false;
        this.eventService = eventService;
        this.api.getSchedule().subscribe((data)=>{
          console.log(data);
          this.shows = data['shows'];
          this.airtimes = data['airtimes'];
          this.selectedshow = this.shows[0];
        });

        this.eventService.search.subscribe((shows:Array<Object>)=>{
          this.search = shows['search'];
          this.shows = shows['data'];
        });
    }

    ngOnInit(){
    }
    ngAfterViewInit(){
    }

    open_card(card:HTMLElement){
      console.log(card);
      card.classList.toggle('open');
    }
    detail(event){
      this.api.showDetail(event['show'].showid).subscribe((data)=>{
        this.selectedshow = data;
        this.selectedshow['season'] = event['show'].season;
        this.selectedshow['epsnumber'] = event['show'].epsnumber;
        this.selectedshow['epsname'] = event['show'].epsname;
        this.selectedshow['showname'] = event['show'].showname;
        event['modal'].classList.toggle('open');
      })
    }
}
