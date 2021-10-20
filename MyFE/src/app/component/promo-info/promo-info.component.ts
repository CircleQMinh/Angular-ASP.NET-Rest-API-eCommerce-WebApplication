import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Product } from 'src/app/class/product';
import { Promotion } from 'src/app/class/promotion';
import { PromotionInfo } from 'src/app/class/promotion-info';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CartService } from 'src/app/service/cart.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-promo-info',
  templateUrl: './promo-info.component.html',
  styleUrls: ['./promo-info.component.css']
})
export class PromoInfoComponent implements OnInit {

  isLoading=false
  id:any

  promotion!:Promotion
  promotionInfos:PromotionInfo[]=[]
  relatedPromo:Promotion[]=[]
  topProduct:any[]=[]
  maxTopProduct=0

  constructor(private router: Router, private route: ActivatedRoute, private proService: ProductService, private toast: HotToastService
    , private cartService: CartService, private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.isLoading=true
    window.scrollTo(0,0)
    this.id = this.route.snapshot.paramMap.get("id")!

    this.proService.getPromotionInfo(this.id).subscribe(
      data=>{
        this.promotion=data.result
        this.promotionInfos=data.promoInfo
        this.getRelatedPromo()
        this.getTopProduct()

        console.log(this.promotion)
        console.log(this.promotionInfos)
        this.isLoading=false
      },
      error=>{
        this.router.navigateByUrl("/error")
      }
    )
  }

  toNumber(string: string): number {
    return Number(string)
  }

  getRelatedPromo(){
    this.proService.getRelatedPromotion(this.promotion.id,2).subscribe(
      data=>{
        this.relatedPromo=data.result
      },
      error=>{

      }
    )
  }

  getTopProduct(){
    this.proService.getTopProduct(10).subscribe(
      data=>{
        this.topProduct=data.result
       // console.log(this.topProduct)
        this.maxTopProduct=data.max
      },
      error=>{

      }

    )
  }
}
