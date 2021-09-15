import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotToastService } from '@ngneat/hot-toast';
import { Product } from 'src/app/class/product';
import { User } from 'src/app/class/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CartService } from 'src/app/service/cart.service';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-profile-favorite',
  templateUrl: './profile-favorite.component.html',
  styleUrls: ['./profile-favorite.component.css']
})
export class ProfileFavoriteComponent implements OnInit {

  user!: User
  userID: any
  isLogin: boolean = false

  userInfo!: User

  pageSizeFav = 4
  pageNumberFav = 1
  pagedFavProduct: Product[] = []

  constructor(private authService: AuthenticationService, private toast: HotToastService, private router: Router,
    private route: ActivatedRoute, private orderService: OrderService, private modalService: NgbModal, private cartService: CartService) { }

  ngOnInit(): void {
    this.userID = this.route.snapshot.paramMap.get("id")

    window.scrollTo(0, 0)
    this.getLocalStorage()
    if (!this.isLogin) {
      this.router.navigateByUrl("/login")
      this.toast.info("Phiên đăng nhập hết hạn, xin hãy đăng nhập lại!")
    }
    if (this.user.id != this.userID) {
      this.router.navigateByUrl("/error")
    }

    if(!localStorage.getItem("user-info")){
      this.router.navigateByUrl(`/profile/${this.userID}`)
    }
    else{
      this.userInfo=JSON.parse(localStorage.getItem("user-info")!)
      this.getPagedFavProduct()
    }

  
  }

  getLocalStorage() {
    if(localStorage.getItem("isLogin")){
   
      let timeOut= new Date(localStorage.getItem("login-timeOut")!)
      let timeNow = new Date()
  
      if(timeOut.getTime()<timeNow.getTime()){
        //console.log("time out remove key")
        localStorage.removeItem("isLogin")
        localStorage.removeItem("user-id")
        localStorage.removeItem("user-email")
        localStorage.removeItem("login-timeOut")
        localStorage.removeItem("user-disName")
        localStorage.removeItem("user-imgUrl")
        localStorage.removeItem("user-role")
        localStorage.removeItem("user-info")
        
      }
      else{
        this.isLogin = Boolean(localStorage.getItem('isLogin'))
        this.user=new User
        this.user.id = localStorage.getItem('user-id')!
        this.user.email = localStorage.getItem("user-email")!
        this.user.displayName = localStorage.getItem("user-disName")!
        this.user.imgUrl=localStorage.getItem("user-imgUrl")!
        this.user.roles=[]
        this.user.roles.push(localStorage.getItem("user-role")!)
        //console.log("still login")
      }
    }
    else{
     // console.log("no login acc")
    }

  }
  getPagedFavProduct() {
    this.pagedFavProduct = []
    for (let i = 0; i < this.pageSizeFav; i++) {
      if (this.userInfo.favoriteProducts[i + this.pageSizeFav * (this.pageNumberFav - 1)]) {
        this.pagedFavProduct.push(this.userInfo.favoriteProducts[i + this.pageSizeFav * (this.pageNumberFav - 1)])
      }

    }
  }
  removeFromFav(pro: Product) {
    this.authService.removeFromFav(this.userInfo.id, pro.id).subscribe(
      data => {
        if (data.success) {
          this.toast.success("Product remove from favorite list successfully")
          //console.log(this.userInfo.favoriteProducts)
          this.removeFromLocal(pro.id)
          //console.log(this.userInfo.favoriteProducts)
        }
        else {
          this.toast.info("This product is not on your favorite list")
        }
      },
      error => {
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }
  removeFromLocal(id: number) {


    for (let i = 0; i < this.userInfo.favoriteProducts.length; i++) {
      if (this.userInfo.favoriteProducts[i].id == id) {
        this.userInfo.favoriteProducts.splice(i, 1)
        break
      }
    }
    this.getPagedFavProduct()
  }
  addToCart(pro: Product) {
    this.cartService.addToCart(pro)
    this.toast.success("Product added to cart!")
  }
}
