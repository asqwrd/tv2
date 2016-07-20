import { Pipe,PipeTransform } from "@angular/core";
import {Http, Headers, Response}                from '@angular/http';


declare var moment;
@Pipe({
    name: "orderby",
    pure:true
})
export class OrderByPipe implements PipeTransform{
    transform(array: Array<string>): Array<string> {
        if(array instanceof Array) {
            array.sort((a:any, b:any) => {
                if (a.index >= 0 && b.index >= 0) {
                    if (parseInt(a.index) < parseInt(b.index)) {
                        return -1;
                    } else if (parseInt(a.index) > parseInt(b.index)) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            });
            return array;
        }
        return;
    }
}

@Pipe({
    name: "orderby_date",
    pure:true
})
export class OrderByDatePipe implements PipeTransform{
    transform(array: Array<string>): Array<string> {
        if(array instanceof Array) {
            array.sort((a:any, b:any) => {
                if (a.created_at >= 0 && b.created_at >= 0) {
                    if (parseInt(a.created_at) < parseInt(b.created_at)) {
                        return -1;
                    } else if (parseInt(a.created_at) > parseInt(b.created_at)) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            });
            return array;
        }
        return;
    }
}

@Pipe({
    name: "moment",
    pure:true
})
export class MomentPipe implements PipeTransform{
    transform(date: string): string {
        var date_ms = parseInt(date) * 1000;
        return moment(date).format('MM/DD/YYYY, hh:mm a');

    }
}


@Pipe({
    name: "translate",
    pure:false
})
export class Translate implements PipeTransform{
    private headers = new Headers();
    private translated: string = null;
    private prevtext = '';

    constructor(private http: Http) {
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    }
    transform(text: string): string {
        if (text !== this.prevtext) {
            this.prevtext = text;
            this.translated = null;
            this.http.post('https://translate.yandex.net/api/v1.5/tr.json/translate?lang=es-en&key=trnsl.1.1.20160702T062231Z.b01e74e50f545073.41cbb76d976818cfaa0e1ac3ac78b561079e3420&text='+text,{},{headers:this.headers}).map((response:Response)=>{
                return response.json();
            }).subscribe((data)=>{
                this.translated= data.text[0];
            });
        }
        return this.translated;
    }
}
