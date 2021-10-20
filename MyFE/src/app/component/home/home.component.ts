import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { HotToastService } from '@ngneat/hot-toast';
import { Product } from 'src/app/class/product';
import { Promotion } from 'src/app/class/promotion';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CartService } from 'src/app/service/cart.service';
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

  isDisconnect=false
  autoInterval:any

  topProduct:any[]=[]
  maxTopProduct=0
  promoInfoTop:any[]=[]
  constructor(private proService:ProductService,private router:Router,private toast:HotToastService,private cartService: CartService,
    private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.getPromotion()
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.autoInterval) {
      clearInterval(this.autoInterval);
      console.log("Xóa interval home!")
    }
  }

  openPromoUrlInNewWindow(id:any) {
    
    window.open(`/#/khuyenmai/${id}`, '_blank');
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
        this.isDisconnect=true
        console.log("Kết nối API không thành công")
        console.log(error)
      }
    )
    this.getTopProduct()
    this.autoInterval=setInterval(()=>{
      this.proService.getPromotion().subscribe(
        data=>{
          if(!this.isHover){
          this.promotions=data.result
          this.getNextPromo()
          }
          this.isDisconnect=false
          //console.log(this.promotion)
        },
        error=>{
          this.isDisconnect=true
          console.log(error)
        }
      )

      this.getTopProduct()
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
  getTopProduct(){
    this.proService.getTopProduct(5).subscribe(
      data=>{
        this.topProduct=data.result
       // console.log(this.topProduct)
       this.promoInfoTop=data.promoInfo
        this.maxTopProduct=data.max
      },
      error=>{

      }

    )
  }
  openProductUrlInNewWindow(id:any) {
    
    window.open(`/#/product/${id}`, '_blank');
  }
  toNumber(string: string): number {
    return Number(string)
  }
  addToFav(pro: Product) {
    if (localStorage.getItem("isLogin")) {
      this.authService.addToFav(localStorage.getItem('user-id')!, pro.id).subscribe(
        data => {
          if (data.success) {
            this.toast.success("Sản phẩm đã thêm vào yêu thích")
          }
          else {
            this.toast.info("Sản phẩm đã nằm trong yêu thích")
          }
        },
        error => {
          console.log(error)
          this.toast.error(" An error has occurred ! Try again !")
        }
      )
    }
    else {
      this.toast.info("Đăng nhập để thêm sản phẩm vào yêu thích")
    }

  }
  addToCart(pro: Product) {
    this.cartService.addToCart(pro)
    this.toast.success("Đã thêm sản phẩm vào giỏ!")
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