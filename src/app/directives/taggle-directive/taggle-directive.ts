import {Directive, ElementRef, Renderer, OnInit, NgZone,EventEmitter} from '@angular/core';
import {EventService} from '../../services/event-services';

declare var Taggle:any;
declare var autoComplete:any;
@Directive({
    selector: '[taggle]',
    inputs: [
        'tags: tags',
        'autocompleteTags: autocompleteTags',
        'bar:bar'

    ],
    outputs:['add','remove']
})
export class TaggleDirective implements OnInit{
    el:ElementRef;
    tags:Array<string>;
    autocompleteTags:any;
    eventService:EventService;
    bar:Object;
    autocompleteStrings:Array<string>;
    autocompleteIds:Array<string>;
    add = new EventEmitter();
    remove = new EventEmitter();

    constructor(el: ElementRef, renderer: Renderer,eventService:EventService) {
        this.el = el;
        this.eventService = eventService;
        this.autocompleteStrings = [];
        this.autocompleteIds = [];

    }


    ngOnInit() {
        if(this.autocompleteTags instanceof Array && this.autocompleteTags[0] instanceof Object) {
            this.autocompleteTags.forEach((tag)=> {
                this.autocompleteStrings[tag['group_id']] = tag['name'];
                this.autocompleteIds[tag['name']] = tag['group_id'];
            });
        }else{
            this.autocompleteStrings = this.autocompleteTags;
        }
        var tagInput = new Taggle(this.el.nativeElement, {
            tags: this.tags? this.tags : [],
            allowDuplicates: false,
            allowedTags: this.autocompleteTags ? this.autocompleteStrings:false,
            onTagRemove: (event, tag) =>{
                this.remove.emit(tag);
            },
            onTagAdd: (event, tag) =>{
                if(this.autocompleteTags == undefined) {
                    this.add.emit(tag);
                }
            }
        });

        var input = tagInput.getInput();
        var parent = input.parentElement;
        if(this.bar) {
            parent.appendChild(this.bar);
        }
        if(this.autocompleteTags) {
            new autoComplete({
                selector: input,
                minChars: 1,
                source: (term, suggest) => {
                    term = term.toLowerCase();
                    var choices = this.autocompleteTags;
                    var matches = [];
                    for (var i = 0; i < choices.length; i++) {
                        if (~choices[i]['name'].toLowerCase().indexOf(term)) {
                            matches.push(choices[i]['name']);
                        }
                    }
                    suggest(matches);
                }, onSelect: (e, term, item) => {
                    tagInput.add(term);
                    var term_id =this.autocompleteIds[term];
                    this.add.emit({tag:term,id:term_id});
                }
            });
        }



    }

}