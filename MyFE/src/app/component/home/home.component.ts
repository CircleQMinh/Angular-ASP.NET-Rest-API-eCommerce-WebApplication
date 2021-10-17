import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { Promotion } from 'src/app/class/promotion';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  images = ['https://res.cloudinary.com/dkmk9tdwx/image/upload/v1627026204/Dozen-reasons_header_xwmgkc.jpg',
  'https://www.oishi.com.ph/wp-content/uploads/2020/12/Always-On-WEBSITE-BANNER-DESKTOP-FA-01-resize.jpg',
];

  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  pauseOnFocus = true;

  isLoading=true
  promotions:Promotion[]=[]
  indexPromo:number=-1
  currentPromo!:Promotion
  isHover=false

  constructor(private proService:ProductService) { }

  ngOnInit(): void {
    this.getPromotion()
  }


  getPromotion(){
    this.proService.getPromotion().subscribe(
      data=>{
        this.promotions=data.result
        this.isLoading=false
        this.getNextPromo()
        //console.log(this.promotion)
      },
      error=>{
        console.log(error)
      }
    )

    setInterval(()=>{
      this.proService.getPromotion().subscribe(
        data=>{
          if(!this.isHover){
          this.promotions=data.result
          this.getNextPromo()
          }
          //console.log(this.promotion)
        },
        error=>{
          console.log(error)
        }
      )
    },6000)
  }
  getNextPromo(){
    //console.log(this.isHover)
    if(!this.isHover){
      this.currentPromo = null!
      if(this.indexPromo+1>=this.promotions.length){
        this.indexPromo=0;
        this.currentPromo=this.promotions[this.indexPromo]
      }
      else{
        this.indexPromo+=1
        this.currentPromo=this.promotions[this.indexPromo]
      }
    }

  }

  switchPromo(i:number){
    this.currentPromo=this.promotions[i];this.indexPromo=i
  }

  togglePaused() {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;
  }
  
  @ViewChild('carousel', { static: true })
  carousel!: NgbCarousel;
  onSlide(slideEvent: NgbSlideEvent) {
    if (this.unpauseOnArrow && slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)) {
      this.togglePaused();
    }
    if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
      this.togglePaused();
    }
  }
}