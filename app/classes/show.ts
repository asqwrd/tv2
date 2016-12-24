import {NetworkType} from './network';

export class Show {
  image: {
    original:string
  };
  showname: string;
  runtime:any;
  epsnumber:any;
  airtime:string;
  id:string;
  network:string;
  season:any;
  showid:any;
  status:string;
  summary:string;
  epsname:string;
  year:string;
  premiered:string;
  _embedded:{
    episodes?: Array<Object>,
    seasons?: Array<Object>,
    nextepisode?:{
      season:number,
      number:number,
      airtime:string,
      name:string,
      airstamp:string

    }
  };
}
