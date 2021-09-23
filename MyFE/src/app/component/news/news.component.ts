import { Component, OnInit } from '@angular/core';
import  {parse} from 'rss-to-json';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  category="food"
  food:any[]=[]
  tip:any[]=[]
  rss:any

  constructor() { }

  ngOnInit(): void {
    window.scrollTo(0,0)
    this.getNewAboutFood()
    this.getNetAboutTip()
  }

  getNewAboutFood(){
    let config:any

    (async () => {
    
        var rss = await parse('https://thanhnien.vn/rss/van-hoa/mon-ngon-ha-noi.rss',config);
        console.log(rss.items);
        this.food=rss.items

    })();


  }

  getNetAboutTip(){
    let config:any

    (async () => {
    
        var rss = await parse('https://thanhnien.vn/rss/suc-khoe/song-vui-khoe.rss',config);
        console.log(rss.items);
        this.tip=rss.items

    })();

  }

}
