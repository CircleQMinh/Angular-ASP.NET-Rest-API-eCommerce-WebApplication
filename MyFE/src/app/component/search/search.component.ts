import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Product } from 'src/app/class/product';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CartService } from 'src/app/service/cart.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  isLoading=false
  keyword:any
  products:Product[]=[]
  constructor(private router:Router,private route:ActivatedRoute,private productService:ProductService,private toast:HotToastService,
    private cartService:CartService,private authService:AuthenticationService) { }

  ngOnInit(): void {
    this.keyword=this.route.snapshot.queryParamMap.get("keyword")
    //console.log(this.keyword)
    this.findProduct()
    window.scrollTo(0,0)
  }
  findProduct(){
    this.isLoading=true
    this.productService.getSearchProductResult(this.keyword).subscribe(
      data=>{
        this.products=data.result
        //console.log(this.products)
        this.isLoading=false
      },
      error=>{
        console.log(error)
        this.toast.error("Kết nối API không được!")
        this.isLoading=false
      }
    )
  }

  newSearch(){

    this.router.navigateByUrl('/', {skipLocationChange: true})
    .then(() => this.router.navigate([`/search`],{ queryParams: { keyword: this.keyword } }));
  }

  addToFav(pro: Product) {
    if(localStorage.getItem("isLogin")){
      this.authService.addToFav(localStorage.getItem('user-id')!,pro.id).subscribe(
        data=>{
          if(data.success){
            this.toast.success("Sản phẩm đã thêm vào yêu thích")
          }
          else{
            this.toast.info("Sản phẩm đã nằm trong yêu thích")
          }
        },
        error=>{
          console.log(error)
          this.toast.error(" An error has occurred ! Try again !")
        }
      )
    }
    else{
      this.toast.info("Đăng nhập để thêm sản phẩm vào yêu thích")
    }

  }
  addToCart(pro: Product) {
    this.cartService.addToCart(pro)
    this.toast.success("Đã thêm sản phẩm vào giỏ!")
  }
}
