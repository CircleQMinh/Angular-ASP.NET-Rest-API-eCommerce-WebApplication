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
    this.food=[{title:"Cách làm khô cá đù thơm ngon, lạ vị dễ làm tại nhà",url:"https://cuahangtienloi24h.com/cach-lam-kho-ca-du-thom-ngon-la-vi-de-lam-tai-nha/"}
    ,{title:"Cách làm cà na đập muối ớt, thơm ngon hấp dẫn, cực đơn giản",url:"https://cuahangtienloi24h.com/cach-lam-ca-na-dap-muoi-ot-thom-ngon-hap-dan-cuc-don-gian/"}
    ,{title:"Măng cụt làm món gì ngon? Top 5 món ngon mà đơn giản từ măng cụt",url:"https://cuahangtienloi24h.com/mang-cut-lam-mon-gi-ngon-top-5-mon-ngon-ma-don-gian-tu-mang-cut/"}
    ,{title:"Xà lách làm món gì ngon mà bổ dưỡng",url:"https://cuahangtienloi24h.com/xa-lach-lam-mon-gi-ngon-ma-bo-duong/"}
    ,{title:"Cách làm bò một nắng Krong Pa đúng chuẩn Gia Lai",url:"https://cuahangtienloi24h.com/cach-lam-bo-mot-nang-krong-pa-dung-chuan-gia-lai/"}
    ,{title:"Cách làm heo ba chỉ một nắng tại nhà chuẩn vị Krông Pa",url:"https://cuahangtienloi24h.com/cach-lam-heo-ba-chi-mot-nang-tai-nha-chuan-vi-krong-pa/"}
    ,{title:"Mực ống chiên giòn – cách làm ngon đúng chuẩn nhà hàng cực dễ",url:"https://cuahangtienloi24h.com/muc-ong-chien-gion-cach-lam-ngon-dung-chuan-nha-hang-cuc-de/"}]

    this.tip=[ 
      {title:"Hướng dẫn chế biến cá hồi cho bé ăn cơm hoặc ăn dặm",url:"https://cuahangtienloi24h.com/huong-dan-che-bien-ca-hoi-cho-be-an-com-hoac-an-dam/"}
    ,{title:"Cách sơ chế rau củ quả đúng cách, an toàn cho sức khỏe",url:"https://cuahangtienloi24h.com/cach-so-che-rau-cu-qua-dung-cach-an-toan-cho-suc-khoe/"}
    ,{title:"Nên mua cà chua thường hay cà chua bi?",url:"https://cuahangtienloi24h.com/nen-mua-ca-chua-thuong-hay-ca-chua-bi/"}
    ,{title:"Cách bảo quản rau củ tươi lâu mà không cần tủ lạnh",url:"https://cuahangtienloi24h.com/cach-bao-quan-rau-cu-tuoi-lau-ma-khong-can-tu-lanh/"}
    ,{title:"Cách bảo quản rau trong tủ lạnh cả tuần mà vẫn tươi ngon",url:"https://cuahangtienloi24h.com/cach-bao-quan-rau-trong-tu-lanh-ca-tuan-ma-van-tuoi-ngon/"}
    ,{title:"Bạch tuộc nướng và 5 cách chế biến thơm ngon để bạn đón mùa mưa về",url:"https://cuahangtienloi24h.com/bach-tuoc-nuong-va-5-cach-che-bien-thom-ngon-de-ban-don-mua-mua-ve/"}
    ,{title:"Mực ống chiên giòn – cách làm ngon đúng chuẩn nhà hàng cực dễ",url:"https://cuahangtienloi24h.com/muc-ong-chien-gion-cach-lam-ngon-dung-chuan-nha-hang-cuc-de/"}
    ,{title:"3 món ngon với tôm nhất định nên có trong sổ tay nấu ăn của bạn",url:"https://cuahangtienloi24h.com/3-mon-ngon-voi-tom-nhat-dinh-nen-co-trong-so-tay-nau-an-cua-ban/"}
    ,{title:"Top 4 các món ăn mùa hè ngon lạ miệng cực dễ làm",url:"https://cuahangtienloi24h.com/top-4-cac-mon-an-mua-he-ngon-la-mieng-cuc-de-lam/"}
    ,{title:"Cách làm cá nướng bằng lò nướng thơm ngon cho bữa cơm ngày mưa",url:"https://cuahangtienloi24h.com/cach-lam-ca-nuong-bang-lo-nuong-thom-ngon-cho-bua-com-ngay-mua/"}]
  }

  getNewAboutFood(){
    let config:any

    (async () => {
    
        var rss = await parse('https://thanhnien.vn/rss/van-hoa/mon-ngon-ha-noi-303.rss',config);
        console.log(rss.items);
        this.food=rss.items

    })();


  }

  getNetAboutTip(){
    let config:any

    (async () => {
    
        var rss = await parse('https://thanhnien.vn/rss/suc-khoe/song-vui-khoe-232.rss',config);
        console.log(rss.items);
        this.tip=rss.items

    })();

  }

}
