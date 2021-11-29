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
  isDisconnect = false

  autoInterval: any
  constructor(private authService: AuthenticationService, private toast: HotToastService, private router: Router,
    private route: ActivatedRoute, private orderService: OrderService, private modalService: NgbModal, private cartService: CartService) { }

  ngOnInit(): void {
    this.userID = this.route.snapshot.paramMap.get("id")

    window.scrollTo(0, 0)
    this.authService.getLocalStorage()
    this.user = this.authService.user
    this.isLogin = this.authService.isLogin
    if (!this.isLogin) {
      this.router.navigateByUrl("/login")
      this.toast.info("Phiên đăng nhập hết hạn, xin hãy đăng nhập lại!")
    }
    if (this.user.id != this.userID) {
      this.router.navigateByUrl("/error")
    }

    if (!localStorage.getItem("user-info")) {
      this.router.navigateByUrl(`/profile/${this.userID}`)
    }
    else {
      this.userInfo = JSON.parse(localStorage.getItem("user-info")!)
      //this.getPagedFavProduct()
      this.getUserInfo()
      this.autoInterval = setInterval(() => {
        this.getUserInfo()
      
        //console.log("beep")
      }, 5000)
    }
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.autoInterval) {
      clearInterval(this.autoInterval);

    }
  }
  getUserInfo() {
    this.authService.getUserInfo(this.userID).subscribe(
      data => {
        //console.log(data)

        this.userInfo = data.user
        this.userInfo.roles = data.roles
        this.isDisconnect = false
       
        for(let i=0;i<this.user.favoriteProducts.length;i++){
          this.userInfo.favoriteProducts[i].promoInfo=data.promoInfo[i]
        }
        console.log(this.user.favoriteProducts)
        this.getPagedFavProduct()

        localStorage.setItem("user-info", JSON.stringify(this.userInfo))
        //this.isLoading = false
      },
      error => {
        console.log(error)
        this.isDisconnect = true
        // this.router.navigateByUrl("/login")
        // this.toast.info("Phiên đăng nhập hết hạn, xin hãy đăng nhập lại!")
      }
    )
  }
  toNumber(string: string): number {
    return Number(string)
  }
  openProductUrlInNewWindow(id: any) {

    window.open(`/#/product/${id}`, '_blank');
  }
  getPagedFavProduct() {
    this.pagedFavProduct = []
    for (let i = 0; i < this.pageSizeFav; i++) {
      if (this.userInfo.favoriteProducts[i + this.pageSizeFav * (this.pageNumberFav - 1)]) {
        this.pagedFavProduct.push(this.userInfo.favoriteProducts[i + this.pageSizeFav * (this.pageNumberFav - 1)])
      }

    }
    console.log(this.pagedFavProduct)
  }
  removeFromFav(pro: Product) {
    this.authService.removeFromFav(this.userInfo.id, pro.id).subscribe(
      data => {
        if (data.success) {
          this.toast.success("Đã loại bỏ sản phẩm khỏi danh sách yêu thích")
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
    this.toast.success("Thêm sản phẩm vào giỏ hàng thành công!")
  }
  signOut() {
    let a = this.router.url
    this.authService.signOut()
    this.isLogin = this.authService.isLogin
    this.user = this.authService.user
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigateByUrl(a))
  }
  alertSoldOut(){
    this.toast.info("Sản phẩm đã hết hàng!")
  }
}
