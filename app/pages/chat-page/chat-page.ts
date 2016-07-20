import {Component, Input, ViewChild, NgZone} from "@angular/core";
import {HTTP_PROVIDERS} from "@angular/http";
import {NgStyle,NgFor} from '@angular/common';


import 'rxjs/Rx';
import {Router} from "@angular/router";

//shared components and service
import {ApiService} from "../../services/api-service";
import {EventService} from "../../services/event-services";


import {UserHeader} from "../../components/user-header/user-header";
import {ChatWindow} from "../../components/chat-window/chat-window";
import {ChatInput} from "../../components/chat-input/chat-input";
import {ChatUsersTyping} from "../../components/chat-users-typing/chat-users-typing";
import {Subject} from "rxjs/Rx";
declare var PUBNUB:any;


@Component({
    selector: 'chat-page',
    viewProviders: [HTTP_PROVIDERS],
    templateUrl: 'app/pages/chat-page/chat-page.html',
    directives:[NgStyle,NgFor,UserHeader,ChatWindow,ChatUsersTyping,ChatInput]
})


export class ChatPage {
    router:Router;
    api:ApiService;
    eventService:EventService;
    last_timestamp:any;
    messages:Array<Object>;
    userid:string;
    users:Array<string>;


    constructor(private zone:NgZone,eventService:EventService,router:Router,apiService:ApiService) {
        this.router = router;
        this.messages = [];
        this.users = [];
        this.api = apiService;
        this.eventService = eventService;
        this.userid = this.api.getUserId();
        this.zone.run(()=>{
            this.api.getPubnub().subscribe({
                channel: 'DemoChat',
                message:(message)=>{
                    //console.log(this.messages);
                    //console.log(message);
                    this.messages.push(message);
                },
                presence: (presenceData) =>{
                    console.log(presenceData);
                    switch (presenceData.action) {
                        case 'join':
                            this.users.push(presenceData.uuid);
                            //this.props.setLang('en');
                            break;
                        case 'leave':
                        case 'timeout':
                            this.users = this.users.filter((user)=>{
                                return user !== presenceData.uid;
                            });
                            break;
                        case 'state-change':
                            /*if (presenceData.data) {
                                if (presenceData.data.isTyping === true) {
                                    this.props.addTypingUser(presenceData.uuid);
                                } else {
                                    this.props.removeTypingUser(presenceData.uuid);
                                }
                            }*/
                            break;
                        default:
                            break;
                    }
                },
            });
            this.getMessages();
        });

        
        
    }

    ngOnInit(){
    }
    ngAfterViewInit(){
    }

    getMessages(){
        this.api.getPubnub().history({
            channel: 'DemoChat',
            count: 15,
            start:this.last_timestamp ,
            callback: (data) => {
                // data is Array(3), where index 0 is an array of messages
                // and index 1 and 2 are start and end dates of the messages
                //props.addHistory(data[0], data[1]);
                this.messages = data[0];
                this.last_timestamp = data[1];
               // console.log(this.messages);
                //console.log(this.last_timestamp);
            },
        });
    }

    isTyping(data){

    }

}