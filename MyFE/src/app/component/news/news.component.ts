import { Component, OnInit } from '@angular/core';
import  {parse} from 'rss-to-json';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  feed:any[]=[]
  rss:any

  constructor() { }

  ngOnInit(): void {
   this.getNew()
  }

  getNew(){
    let config:any

    (async () => {
    
        var rss = await parse('https://thanhnien.vn/rss/van-hoa/mon-ngon-ha-noi.rss',config);
        console.log(rss.items);
        this.feed=rss.items
        this.rss=rss

    })();


  }

}
