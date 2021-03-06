import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotToastService } from '@ngneat/hot-toast';
import { Order } from 'src/app/class/order';
import { User } from 'src/app/class/user';
import { AdminService } from 'src/app/service/admin.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { OrderService } from 'src/app/service/order.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-shipper',
  templateUrl: './shipper.component.html',
  styleUrls: ['./shipper.component.css']
})
export class ShipperComponent implements OnInit {

  user!: User
  isLogin: boolean = false

  active_tab = "av"
  isLoading = false
  isCollapsed: boolean = true

  isGettingOrderDetail = false
  isAcceptingOrder = false
  isFinishingOrder = false

  pageNumberOrder = 1
  pageSizeOrder = 5
  orderOrder = "OrderDate"
  orderDirOrder: any = "Desc"
  collectionSizeOrder = 0

  orderList: Order[] = []
  shippingInfoList:any[]=[]
  selectedOrder!: Order

  rf1!: FormGroup;

  isDisconnect = false
  autoInterval: any

  shippingFee:number=0

  constructor(private router: Router, private route: ActivatedRoute, private toast: HotToastService, private adminService: AdminService,
    private productService: ProductService, private orderService: OrderService, private authService: AuthenticationService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.shippingFee=this.orderService.shippingFee
    this.rf1 = new FormGroup({
      status: new FormControl('',
        [Validators.required]),
      note: new FormControl('',
        [Validators.required])
    });


    this.isLoading = true
    this.authService.getLocalStorage()
    this.user = this.authService.user
    this.isLogin = this.authService.isLogin
    if (!this.isLogin) {
      this.router.navigateByUrl("/error")
    }
    else {
      this.getUserInfo()

    }
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.autoInterval) {
      clearInterval(this.autoInterval);
      //console.log("X??a interval shipp!")
    }

  }
  switchTab(s: string) {
    this.active_tab = s
    if (this.active_tab == "av") {
      this.getAvailableOrder()
    }
    if (this.active_tab == "dv") {
      this.getAcceptedOrder()
    }

    if (this.active_tab == "his") {
      this.getOrderHistory()
    }
  }
  getUserInfo() {
    this.isLoading = true
    this.authService.getUserInfo(this.user.id).subscribe(
      data => {
        //console.log(data)

        this.user = data.user
        this.user.roles = data.roles
        if (this.user.roles[0] != "Shipper") {
          this.router.navigateByUrl("/error")
        }
        //console.log(this.user)
        this.getAvailableOrder()
        this.autoUpdate()
        this.isLoading = false
      },
      error => {
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }
  autoUpdate(){
    this.autoInterval=setInterval(()=>{
      if (this.active_tab == "av") {
        this.getAvailableOrder()
      }
      if (this.active_tab == "dv") {
        this.getAcceptedOrder()
      }
  
      if (this.active_tab == "his") {
        this.getOrderHistory()
      }
    },4000)

  }
  signOut() {
    this.isLogin = false
    this.authService.signOut()
    this.isLogin = this.authService.isLogin
    this.user=this.authService.user
    this.router.navigateByUrl('/home')
  }
  getAvailableOrder() {
    this.orderService.getAvailableOrder(1, this.orderOrder, this.pageNumberOrder, this.pageSizeOrder, this.orderDirOrder).subscribe(
      data => {
        this.orderList = data.result
        //console.log(this.orderList)
        this.collectionSizeOrder = data.count
        this.isDisconnect=false
        this.isLoading = false
      },
      error => {
        console.log(error)
        this.isDisconnect=true
      }
    )
  }
  onAvailableOrderFilterChange() {
    this.pageNumberOrder = 1
    this.getAvailableOrder()
  }
  getAcceptedOrder() {
    this.orderService.getAcceptedOrder(this.user.id).subscribe(
      data => {
         //console.log(data)
        // console.log(data.sil)
        // console.log(data.sil[0])
        this.isDisconnect=false
        this.orderList = []
        for (let i = 0; i < data.sil.length; i++) {
          this.orderList.push(data.sil[i].order)
        }

        this.isLoading=false
      },
      error => {
        console.log(error)
        this.isDisconnect=true
      }
    )
  }
  getOrderHistory() {
    this.orderService.getShipperOrderHistory(this.user.id).subscribe(
      data => {
        //console.log(data)
        this.isDisconnect=false
        this.orderList = []
        this.shippingInfoList = []
        this.shippingInfoList=data.sil
        for (let i = 0; i < data.sil.length; i++) {
          this.orderList.push(data.sil[i].order)
        }
        this.isLoading=false
      },
      error => {
        console.log(error)
        this.isDisconnect=true
      }
    )
  }


  openOrderInfoModal(info: any, o: Order) {
    this.isGettingOrderDetail = true
    this.selectedOrder = o
    this.orderService.getOrderDetails(o.id).subscribe(
      data => {
        this.selectedOrder.orderDetails = data.orderDetails
        this.selectedOrder.discountCode = data.discountCode
        this.isGettingOrderDetail = false
        //console.log(data)
      },
      error => {
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
    this.modalService.open(info, { ariaLabelledBy: 'modal-basic-title' })
  }
  openAcceptOrderInfoModal(info: any, o: Order) {
    this.selectedOrder = o
    this.modalService.open(info, { ariaLabelledBy: 'modal-basic-title' })
  }
  acceptOrder() {
    this.isAcceptingOrder = true
    this.orderService.acceptOrder(this.user.id, this.selectedOrder.id).subscribe(
      data => {

        this.getAvailableOrder()
        this.toast.success("B???n ???? nh???n giao ????n h??ng!")
        this.isAcceptingOrder = false
        this.modalService.dismissAll()
      },
      error => {
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }
  openFinishOrderInfoModal(info: any, o: Order) {
    this.selectedOrder = o
    console.log(this.selectedOrder)
    this.rf1.controls["note"].setValue("Giao h??ng th??nh c??ng!")
    this.rf1.controls["status"].setValue(3)
    this.modalService.open(info, { ariaLabelledBy: 'modal-basic-title' })
  }

  finishOrder() {
    this.isAcceptingOrder = true
    let today = formatDate(Date.now(), 'dd-MM-yyyy HH:mm:ss', 'en');
    this.orderService.finishOrder(this.user.id, this.selectedOrder.id, this.rf1.controls["status"].value,
    today, this.rf1.controls["note"].value).subscribe(
      data => {
        this.getAcceptedOrder()
        if(this.rf1.controls["status"].value==3){
          this.getShopCoinsForUser(this.selectedOrder.userID,this.selectedOrder.id)
        }
        this.toast.success("???? ho??n th??nh ????n h??ng!")
        this.isAcceptingOrder = false
        this.modalService.dismissAll()
      },
      error => {
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }
  toNumber(string: string): number {
    return Number(string)
  }
  calculateTotalPrice(o:Order):number{
    let shippingFee=0
    if(o.shippingFee==1){
      shippingFee=15000
    }
    if(o.discountCode){
      if(o.discountCode.discountAmount!='null'){
        if(o.totalPrice+shippingFee-Number(o.discountCode.discountAmount)<0){
          return 0
        }
        return o.totalPrice+shippingFee-Number(o.discountCode.discountAmount)
      }
      return (o.totalPrice+shippingFee)-(o.totalPrice+shippingFee)*Number(o.discountCode.discountPercent)/100
    }
    else{
      return o.totalPrice+shippingFee
    }
  }

  getShopCoinsForUser(userID:any,orderID: any){
    this.orderService.getShopCoins(userID, orderID).subscribe(
      data => {
        // if (data.coins > 0) {
        //   this.toast.success("B???n nh???n ???????c " + data.coins + " shop xu! Shop xu s??? d???ng ????? ?????i m?? gi???m gi??.")
        // }
      },
      error => {

      }
    )
  }
}
