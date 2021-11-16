import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotToastService } from '@ngneat/hot-toast';
import { Order } from 'src/app/class/order';
import { OrderDetail } from 'src/app/class/order-detail';
import { User } from 'src/app/class/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CartService } from 'src/app/service/cart.service';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-profile-order-info',
  templateUrl: './profile-order-info.component.html',
  styleUrls: ['./profile-order-info.component.css']
})
export class ProfileOrderInfoComponent implements OnInit {
  user!: User
  userID: any
  isLogin: boolean = false

  userInfo!: User

  pageSizeOrderDetail = 5
  pageNumberOrderDetails = 1
  pagedOrderDetails: OrderDetail[] = []

  orderID: any
  currentOrder!: Order
  currentOrderDetails: OrderDetail[] = []
  currentOrderShippingInfo: any

  isLoading = false
  isDisconnect = false

  autoInterval: any
  isCancelingOrder=false
  rf1!: FormGroup;
  shippingFee:number=0
  
  constructor(private authService: AuthenticationService, private toast: HotToastService, private router: Router,
    private route: ActivatedRoute, private orderService: OrderService, private modalService: NgbModal,
    private cartService: CartService) { }

  ngOnInit(): void {
    this.rf1 = new FormGroup({
      note: new FormControl('',
        [Validators.required])
    });

    this.userID = this.route.snapshot.paramMap.get("id")
    this.orderID = this.route.snapshot.paramMap.get("oid")
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
      //console.log(this.userInfo)
      this.userInfo.orders.forEach(element => {
        if (this.orderID == element.id) {
          this.currentOrder = element
        }
      });
      this.shippingFee=this.orderService.shippingFee
      this.isLoading = true
      this.getDetail()
      this.autoInterval = setInterval(() => {
        this.getUserInfo()
        this.getDetail()
      }, 5000)
    }
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.autoInterval) {
      clearInterval(this.autoInterval);
     // console.log("Xóa interval admin!")
    }
  }
  getUserInfo() {
    this.authService.getUserInfo(this.userID).subscribe(
      data => {

        this.isDisconnect = false
        this.userInfo = data.user
        this.userInfo.roles = data.roles
        this.userInfo.orders.forEach(element => {
          if (this.orderID == element.id) {
            this.currentOrder = element
          }
        });
        localStorage.setItem("user-info", JSON.stringify(this.userInfo))
        this.isLoading = false
      },
      error => {
        console.log(error)
        this.isDisconnect = true
      }
    )
  }
  getDetail() {
    this.orderService.getOrderDetails(this.currentOrder.id).subscribe(
      data => {
        this.isDisconnect = false
        this.currentOrderDetails = data.orderDetails
        //console.log(this.currentOrderDetails)
        //console.log(this.userInfo)
       // console.log(this.currentOrder)
        this.isLoading = false
      },
      error => {
        console.log(error)
        this.isDisconnect = true
      }
    )
    if (this.currentOrder.status == 2 || this.currentOrder.status == 3) {
      this.orderService.getShippingInfo(this.currentOrder.id).subscribe(
        data => {
          this.currentOrderShippingInfo = data.result
          this.isDisconnect = false
          //console.log(this.currentOrderShippingInfo)
        },
        error => {
          console.log(error)
          this.isDisconnect = true
        }
      )
    }
  }

  getPaymentMethod(method: string): string {
    if (method == "cash") {

      return "Tiền mặt"
    }
    else if (method == "vnpay") {
      return "VNPay"
    }
    else if (method == "momo") {
      return "Momo"
    }
    return "?"
  }
  signOut() {
    let a = this.router.url
    this.authService.signOut()
    this.isLogin = this.authService.isLogin
    this.user = this.authService.user
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigateByUrl(a))
  }
  toNumber(string: string): number {
    return Number(string)
  }
  openCancelOrderInfoModal(modal:any) {
    //this.rf1.controls["note"].setValue("Tôi muốn hủy đơn hàng!")
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
  }
  cancelOrder(){
    if(this.rf1.valid){
      this.isCancelingOrder=true
      this.orderService.cancelOrder(this.currentOrder.id,this.rf1.controls["note"].value).subscribe(
        data=>{
          if(data.success==false){
            this.toast.info("Đơn hàng không thể hủy!")
          }
          else{
            this.toast.info("Đơn hàng đã được hủy")
          }
          this.isCancelingOrder=false
          this.modalService.dismissAll()
        },
        error=>{
          this.isCancelingOrder=false
          this.toast.error("Có lỗi xảy ra! Xin hãy thử lại!")
        }
      )
    }
    else{
      this.toast.error("Hãy nhập lý do hủy đơn hàng!")
    }
  }
}
