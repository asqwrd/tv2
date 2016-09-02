import {Component, Input, ViewChild, NgZone,ElementRef} from "@angular/core";

import {Show} from "../../classes/show";


import {Router} from "@angular/router";

//shared components and service
import {ApiService} from "../../services/api-service";
import {EventService} from "../../services/event-services";


import {Subject} from "rxjs/Rx";
declare var moment:any;


@Component({
    selector: 'guide',
    templateUrl: 'guide.html',
})


export class Guide {
    router:Router;
    shows:Array<Show>;
    airtimes:Array<string>;
    selectedshow:Show;
    search:Boolean;
    searching:Boolean;
    searchResults:Boolean;
    date:any;
    time:any;

    @ViewChild('guide') guide:ElementRef;
    @ViewChild('searchEl') searchEl:ElementRef;
    @ViewChild('input') input:ElementRef;
    @ViewChild('searchForm') searchForm:ElementRef;
    @ViewChild('detail') detail:ElementRef;


    constructor(private zone:NgZone,private eventService:EventService,router:Router,private api:ApiService) {
        this.router = router;
        this.search = false;
        this.date = moment().format('dddd MMM DD hh:mm a');
        this.time = moment().format('hh:mm a');
        this.eventService = eventService;
        this.api.getSchedule().subscribe((data)=>{
          console.log(data);
          this.shows = data['shows'];
          this.airtimes = data['airtimes'];
          this.api.showDetail( this.shows[0]['showid']).subscribe((data)=>{
            this.selectedshow = data;
            this.selectedshow['season'] = this.shows[0]['season'];
            this.selectedshow['epsnumber'] = this.shows[0]['epsnumber'];
            this.selectedshow['epsname'] = this.shows[0]['epsname'];
            this.selectedshow['showname'] = this.shows[0]['showname'];
          });
        });

    }

    ngOnInit(){
    }
    ngAfterViewInit(){
    }

    close_detail(){
      this.detail.nativeElement.classList.remove('open');
    }

    select_show(show:Show){
      this.detail.nativeElement.classList.add('opacity');
      this.detail.nativeElement.classList.add('open');
      setTimeout(()=>{
        this.api.showDetail(show['showid']).subscribe((data)=>{
          this.selectedshow = data;
          if(this.search == false){
            this.selectedshow['season'] = show['season'];
            this.selectedshow['epsnumber'] = show['epsnumber'];
            this.selectedshow['epsname'] = show['epsname'];
            this.selectedshow['showname'] = show['showname'];
          }
          this.detail.nativeElement.classList.remove('opacity');

          console.log(this.selectedshow);
        });
      },400);
    }

    typing(input:HTMLInputElement){
      if(input.value.trim().length == 0){
        this.searching = false;
      }else{
        this.searching = true;
      }
    }

    search_show(e){
      e.preventDefault();
      if(this.input.nativeElement.value.trim().length == 0){
        this.searching = false;
        this.searchResults = false;
        this.searchEl.nativeElement.classList.remove('search');
        this.guide.nativeElement.classList.remove('search');

      }else{
        this.searchEl.nativeElement.classList.remove('search');
        this.guide.nativeElement.classList.remove('search');
        this.api.search(this.input.nativeElement.value).subscribe((shows)=>{
          this.search = false;
          this.searchResults = true;
          this.shows = shows;
          this.guide.nativeElement.classList.add('opacity');
          this.api.showDetail( this.shows[0]['showid']).subscribe((data)=>{
            this.selectedshow = data;
            this.selectedshow['showname'] = this.shows[0]['showname'];
            setTimeout(()=>{
              this.guide.nativeElement.classList.remove('opacity');
            },400)

          })
          this.searchForm.nativeElement.reset();
        });

      }
    }

    clear_search(){
      this.guide.nativeElement.classList.add('opacity');
      setTimeout(()=>{
        this.api.getSchedule().subscribe((data)=>{
          this.shows = data['shows'];
          this.airtimes = data['airtimes'];
          this.selectedshow = this.shows[0];
          this.searching = false;
          this.search = false;
          this.searchResults = false;

            this.guide.nativeElement.classList.remove('opacity');


        });
      },500)
    }

    open_search(){
      this.searchEl.nativeElement.classList.add('search');
      this.guide.nativeElement.classList.add('search');
      this.input.nativeElement.focus();
    }

    open_card(card:HTMLElement){
      console.log(card);
      card.classList.toggle('open');
    }
}
