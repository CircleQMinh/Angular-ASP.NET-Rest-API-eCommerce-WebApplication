import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Product } from 'src/app/class/product';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CartService } from 'src/app/service/cart.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.css']
})
export class ProductInfoComponent implements OnInit {

  product!: Product
  randomProducts: Product[] = []
  id!: string
  isLoading = false
  constructor(private router: Router, private route: ActivatedRoute, private proService: ProductService, private toast: HotToastService
    , private cartService: CartService, private authService: AuthenticationService) { }

  ngOnInit(): void {
    window.scrollTo(0, 0)
    this.id = this.route.snapshot.paramMap.get("id")!
    this.isLoading = true
    this.proService.getProductInfo(this.id).subscribe(
      data => {
        this.product = data
        this.getRandomProduct()
        this.isLoading = false
      },
      error => {
        this.toast.error("Kết nối với API không được!")
        console.log(error)
      }
    )
  }
  goToProductPage(id:number){
    this.router.navigateByUrl('/', {skipLocationChange: true})
    .then(() => this.router.navigate([`/product/${id}`]));
  }
  getRandomProduct() {
 
    for (let i = 0; i < 5; i++) {
      let id = this.randomInteger(1, 100)
      this.proService.getProductInfo(String(id)).subscribe(
        data => {
          this.randomProducts.push(data)
        },
        error => {
          i--
          console.log(error)
        }
      )
    }
  }
  randomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  addToFav(pro: Product) {
    if (localStorage.getItem("isLogin")) {
      this.authService.addToFav(localStorage.getItem('user-id')!, pro.id).subscribe(
        data => {
          if (data.success) {
            this.toast.success("Product added to favorite list successfully")
          }
          else {
            this.toast.info("This product is already on your favorite list")
          }
        },
        error => {
          console.log(error)
          this.toast.error(" An error has occurred ! Try again !")
        }
      )
    }
    else {
      this.toast.info("Login to add this product to your favorite list")
    }

  }
  addToCart(pro: Product) {
    this.cartService.addToCart(pro)
    this.toast.success("Product added to cart!")
  }
}
