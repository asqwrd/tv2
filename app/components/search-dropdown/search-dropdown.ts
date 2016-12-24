import {Component,Input,EventEmitter,ViewChild,ElementRef} from "@angular/core";

//shared components and service
import {ApiService} from "../../services/api-service";
import {EventService} from "../../services/event-services";
import {Show} from "../../classes/show";


import 'rxjs/Rx';

import {ActivatedRoute} from "@angular/router";


//shared components and service

@Component({
    selector: 'search-dropdown',
    templateUrl: 'search-dropdown.html',
    outputs:['selected','search']
})



export class SearchDropdown {
    @Input() shows:Array<Show>;
    @Input() fontcolor:string;
    selected = new EventEmitter();
    search = new EventEmitter();
    @ViewChild('selectOptions') selectOptions:ElementRef;
    @ViewChild('inputElement') inputElement:ElementRef;
    @ViewChild('dropcontainer') dropcontainer:ElementRef;
    uuid:string;
    selectedIndex:number;
    is_inputFocus:boolean;
    _timeout:any;



    constructor(public api:ApiService,private eventService:EventService) {
        this.eventService = eventService;
        this.selectedIndex=-1;
        this.is_inputFocus = false;

    }

    ngOnInit(){

    }
    ngAfterViewInit(){
    }

    onFocus(){
        this.selectOptions.nativeElement.classList.add('show-dropdown');
        this.is_inputFocus = true;
        this.dropcontainer.nativeElement.classList.add('active');
        this.inputElement.nativeElement.select();
    }

    onMouseEnter(){
        this.is_inputFocus = false;
    }

    onMouseLeave(){
        this.is_inputFocus = true;
    }

    onBlur(){
        if(this.is_inputFocus == true){
            this.selectOptions.nativeElement.classList.remove('show-dropdown');
            this.dropcontainer.nativeElement.classList.remove('active');
        }
    }

    selectOption(event,show:Show,index){
        event.stopPropagation();
        this.selectedIndex=-1;
        this.inputElement.nativeElement.value = show.showname;
        this.inputElement.nativeElement.blur();
        this.selectOptions.nativeElement.classList.remove('show-dropdown');
        this.dropcontainer.nativeElement.classList.remove('active');
        console.log(show);
        this.selected.emit({show:show});


    }

    showOptions(event,id:string){
        event.stopPropagation();
        if(this.shows && this.shows.length > 0){
            this.selectOptions.nativeElement.classList.add('show-dropdown');
            this.dropcontainer.nativeElement.classList.add('active');
            this.selectOptions.nativeElement.focus();
        }

    }

    filter_list(data){
      //api call
      if(this._timeout){ //if there is already a timeout in process cancel it
          window.clearTimeout(this._timeout);
        }
        this._timeout = setTimeout(() => {
          this.api.search(this.inputElement.nativeElement.value).subscribe((response)=>{
            this.shows = response['shows'];
            this.selectedIndex = -1;
          })
        },300)
    }

    keypress(event){
        switch (event.keyCode) {
          case 38: // if the UP key is pressed
            if(this.selectedIndex <= 0 && this.shows.length > 0){
                if(this.selectOptions.nativeElement.children[this.selectedIndex]){
                    this.selectOptions.nativeElement.children[this.selectedIndex].classList.remove('selected');
                }
                this.selectedIndex = this.shows.length - 1;
                this.selectOptions.nativeElement.children[this.selectedIndex].classList.add('selected');
                this.selectOptions.nativeElement.scrollTop = this.selectOptions.nativeElement.scrollHeight;
                //this.inputElement.nativeElement.value = this.shows[this.selectedIndex].showname;

                break;
            }else if(this.shows.length > 0){
                this.selectOptions.nativeElement.children[this.selectedIndex].classList.remove('selected');
                this.selectedIndex -= 1;
                this.selectOptions.nativeElement.children[this.selectedIndex].classList.add('selected');
                this.selectOptions.nativeElement.scrollTop -= this.selectOptions.nativeElement.children[this.selectedIndex].clientHeight;
                //this.inputElement.nativeElement.value = this.shows[this.selectedIndex]['label'];
            }
            break;
          case 40: // if the DOWN key is pressed
              if((this.selectedIndex == this.shows.length - 1) && this.shows.length > 0){
                  this.selectOptions.nativeElement.children[this.selectedIndex].classList.remove('selected');
                  this.selectedIndex = 0;
                  this.selectOptions.nativeElement.children[this.selectedIndex].classList.add('selected');
                  this.selectOptions.nativeElement.scrollTop = 0;
                  //this.inputElement.nativeElement.value = this.shows[this.selectedIndex]['label'];
                  break;
              }else if(this.selectedIndex < 0 && this.shows.length > 0){
                  this.selectedIndex = 0;
                  this.selectOptions.nativeElement.children[this.selectedIndex].classList.add('selected');
                  //this.inputElement.nativeElement.value = this.shows[this.selectedIndex]['label'];
                  if(this.selectOptions.nativeElement.children[this.selectedIndex].offsetTop >= this.selectOptions.nativeElement.clientHeight - 40){
                      this.selectOptions.nativeElement.scrollTop += this.selectOptions.nativeElement.children[this.selectedIndex].clientHeight;
                  }
              }else if(this.shows.length > 0){
                  this.selectOptions.nativeElement.children[this.selectedIndex].classList.remove('selected');
                  this.selectedIndex += 1;
                  this.selectOptions.nativeElement.children[this.selectedIndex].classList.add('selected');
                  //this.inputElement.nativeElement.value = this.shows[this.selectedIndex]['label'];
                  if(this.selectOptions.nativeElement.children[this.selectedIndex].offsetTop >= this.selectOptions.nativeElement.clientHeight - 40){
                      this.selectOptions.nativeElement.scrollTop += this.selectOptions.nativeElement.children[this.selectedIndex].clientHeight;
                  }
              }
          break;
          case 13:
            event.preventDefault();
          /*  if(this.only_list){
                let inlist = this.shows.filter((option)=>{
                    return option['label'].toLowerCase() == this.inputElement.nativeElement.value.toLowerCase();
                })
                if(this.shows.length > 0 ){
                    if(this.selectedIndex >= 0){
                      let index = this.selectedIndex;
                      this.value = this.shows[this.selectedIndex]['value'];
                      this.label = this.shows[this.selectedIndex]['label'];
                      if(this.filter){
                          this.shows = this.options.filter((option)=>{
                            return option['label'].toLowerCase().indexOf(this.label.toLowerCase()) >=0;
                          });
                      }
                      this.selectedIndex=-1;
                      this.selected.emit({value:this.value,label:this.label});
                      if(!this.filter){
                          this.selectedIndex = index;
                      }

                      if(this.selectOptions.nativeElement.scrollHeight <= 300){
                        this.pos = (index * -40) + "px";
                      }else{
                        this.pos = "0px";
                      }
                    }
                    this.selectOptions.nativeElement.classList.remove('show-dropdown');
                    if(this.filter){
                        this.inputElement.nativeElement.value = this.label;
                        this.inputElement.nativeElement.blur();
                    }
                }
            }else{*/
                if(this.selectedIndex >= 0){
                  let index = this.selectedIndex;
                  this.selected.emit({show:this.shows[this.selectedIndex]});
                  this.selectedIndex=-1;
                }else{
                  let value = encodeURI(this.inputElement.nativeElement.value);
                  this.search.emit({term:value});
                }
                this.selectOptions.nativeElement.classList.remove('show-dropdown');
                this.dropcontainer.nativeElement.classList.remove('active');
                //this.inputElement.nativeElement.value = this.label;
                this.inputElement.nativeElement.blur();
          //      }
        //  }
          break;
      }
    }

    search_term(event){
      console.log(event);
      if (event.keyCode == 13) {
        let value = encodeURI(this.inputElement.nativeElement.value);
        this.search.emit({term:value});
      }

    }

}
