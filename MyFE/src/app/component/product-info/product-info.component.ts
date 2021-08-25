import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Product } from 'src/app/class/product';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.css']
})
export class ProductInfoComponent implements OnInit {

  product!:Product
  id!:string
  isLoading=false
  constructor(private router:Router,private route:ActivatedRoute,private proService:ProductService,private toast:HotToastService) { }

  ngOnInit(): void {
    window.scrollTo(0,0)
    this.id=this.route.snapshot.paramMap.get("id")!
    this.isLoading=true
    this.proService.getProductInfo(this.id).subscribe(
      data=>{
        this.product=data
        this.isLoading=false
      },
      error=>{
        this.toast.error("Kết nối với API không được!")
        console.log(error)
      }
    )
  }

}
