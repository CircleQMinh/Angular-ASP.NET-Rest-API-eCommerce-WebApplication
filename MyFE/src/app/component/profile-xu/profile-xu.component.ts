import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotToastService } from '@ngneat/hot-toast';
import { DiscountCode } from 'src/app/class/discount-code';
import { User } from 'src/app/class/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CartService } from 'src/app/service/cart.service';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-profile-xu',
  templateUrl: './profile-xu.component.html',
  styleUrls: ['./profile-xu.component.css']
})
export class ProfileXuComponent implements OnInit {

  selectedTab: any = "xu"

  user!: User
  userID: any
  isLogin: boolean = false

  userInfo!: User

  isLoading: boolean = false

  isDisconnect = false

  exchageMode = 0
  isExchangingDC = false
  exchangedDC !: DiscountCode

  autoInterval: any
  constructor(private authService: AuthenticationService, private toast: HotToastService, private router: Router,
    private route: ActivatedRoute, private orderService: OrderService, private modalService: NgbModal, private cartService: CartService) { }

  ngOnInit(): void {

    this.userID = this.route.snapshot.paramMap.get("id")
    //console.log(this.userID)
    this.authService.getLocalStorage()
    this.user = this.authService.user
    this.isLogin = this.authService.isLogin
    this.exchangedDC = null!

    if (!this.isLogin) {
      this.router.navigateByUrl("/login")
      this.toast.info("Phiên đăng nhập hết hạn, xin hãy đăng nhập lại!")
    }
    if (this.user.id != this.userID) {
      this.router.navigateByUrl("/error")
    }
    window.scrollTo(0, 0)
    if (!localStorage.getItem("user-info")) {
      this.router.navigateByUrl(`/profile/${this.userID}`)
    }
    else {
      this.userInfo = JSON.parse(localStorage.getItem("user-info")!)
    }
    this.autoInterval = setInterval(() => {
      this.getUserInfo()
    }, 5000)
  }
  signOut() {
    let a = this.router.url
    this.authService.signOut()
    this.isLogin = this.authService.isLogin
    this.user = this.authService.user
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigateByUrl(a))
  }
  getUserInfo() {
    this.authService.getUserInfo(this.userID).subscribe(
      data => {
        this.userInfo = data.user
        this.userInfo.roles = data.roles
        //console.log(this.userInfo)
        localStorage.setItem("user-info", JSON.stringify(this.userInfo))
        this.isLoading = false
        this.isDisconnect = false
      },
      error => {
        console.log(error)
        this.isDisconnect = true
        // this.router.navigateByUrl("/login")
        // this.toast.info("Phiên đăng nhập hết hạn, xin hãy đăng nhập lại!")
      }
    )
  }

  openExchangeModal(modal: any, mode: any) {
    this.exchageMode = mode
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
  }
  exchangeDiscountCode(mode: any) {
    this.isExchangingDC = true
    this.authService.exchangeDiscountCode(this.userInfo.id, mode).subscribe(
      data => {
        console.log(data)
        if (data.success == true) {
          this.toast.success(data.msg)
          this.isExchangingDC = false
          this.modalService.dismissAll()
          this.exchangedDC=data.discountCode
        }
        else {
          this.toast.error(data.msg)
          this.isExchangingDC = false
        }

      },
      error => {
        this.toast.error("Có lỗi xảy ra! Xin hãy thử lại.")
      }
    )
  }
}
