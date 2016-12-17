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
    name: "groupBy"
})

export class GroupByPipe {

    transform( collection: Object[] , term: string ) {

        var newValue = [];

        for (let i = 0; i < collection.length; i++) {
            let keyVal = GroupByPipe.deepFind(collection[i], term);
            let index = newValue.findIndex( myObj => myObj.key == keyVal);
            if (index >= 0) {
                newValue[index].value.push(collection[i]);
            } else {
                newValue.push({key: keyVal, value: [collection[i]]});
            }
        }
        console.log(newValue);

        return newValue;

    }

    static deepFind(obj, path) {

        var paths = path.toString().split(/[\.\[\]]/);
        var current = obj;

        for (let i = 0; i < paths.length; ++i) {
            if (paths[i] !== "") {
                if (current[paths[i]] == undefined) {
                    return undefined;
                } else {
                    current = current[paths[i]];
                }
            }
        }
        return current;

    }

}
