import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotToastService } from '@ngneat/hot-toast';
import { Order } from 'src/app/class/order';
import { User } from 'src/app/class/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CartService } from 'src/app/service/cart.service';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-profile-order',
  templateUrl: './profile-order.component.html',
  styleUrls: ['./profile-order.component.css']
})
export class ProfileOrderComponent implements OnInit {

  user!: User
  userID: any
  isLogin: boolean = false

  userInfo!: User

  pageSizeOrder=5
  pageNumberOrder=1
  pagedOrder:Order[]=[]

  
  constructor(private authService: AuthenticationService, private toast: HotToastService, private router: Router,
    private route: ActivatedRoute, private orderService: OrderService, private modalService: NgbModal, 
    private cartService: CartService) { }

  ngOnInit(): void {
    this.userID = this.route.snapshot.paramMap.get("id")

    window.scrollTo(0, 0)
    this.authService.getLocalStorage()
    this.user=this.authService.user
    this.isLogin=this.authService.isLogin
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
      this.userInfo.orders.reverse()
      this.getPagedOrder()
    }
  }

  getPagedOrder() {
    this.pagedOrder = []
    for (let i = 0; i < this.pageSizeOrder; i++) {
      if(this.userInfo.orders[i + this.pageSizeOrder * (this.pageNumberOrder - 1)]){
        this.pagedOrder.push(this.userInfo.orders[i + this.pageSizeOrder * (this.pageNumberOrder - 1)])
      }

    }
  }
  signOut() {
    let a = this.router.url
    this.authService.signOut()
    this.isLogin = this.authService.isLogin
    this.user=this.authService.user
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigateByUrl(a))
  }
}
