import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { DiscountCode } from 'src/app/class/discount-code';
import { Order } from 'src/app/class/order';
import { Product } from 'src/app/class/product';
import { User } from 'src/app/class/user';
import { CartService } from 'src/app/service/cart.service';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  District: string[] = ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10',
    'Quận 11', 'Quận 12', 'Quận Thủ Đức', 'Quận Gò Vấp', 'Quận Bình Thạnh', 'Quận Tân Bình', 'Quận Tân Phú', 'Quận Phú Nhuận', 'Quận Bình Tân'
    , 'Huyện Củ Chi', 'Huyện Hóc Môn', 'Huyện Bình Chánh', 'Huyện Nhà Bè', 'Huyện Cần Giờ']

  Ward: string[] = ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10',
    'Phường 11', 'Phường 12', 'Phường 13', 'Phường 14', 'Phường 15']
  showFormError = false
  isDone: boolean = false
  isLoading: boolean = false

  cartItems: Product[] = [];
  cartItemsQuantity: number[] = [];
  totalItem: number = 0
  totalPrice: number = 0

  isLogin = false
  user!: User

  rf1!: FormGroup;

  shippingFee:number=0
  haveFee:number=0
  constructor(private toast: HotToastService, private orderService: OrderService, private cartService: CartService
    , private router: Router) { }

  ngOnInit(): void {
    this.getCartInfo()
    this.getLocalStorageLoginInfo()
  
    if (this.totalItem == 0) {
      this.router.navigateByUrl("/cart")
    }
    if (!this.isLogin) {
      this.router.navigateByUrl("/cart")
    }

    if(this.totalPrice>=200000){
      this.haveFee=0
      this.shippingFee=0
    }
    else{
      this.shippingFee=this.orderService.shippingFee
      this.haveFee=1
    }

    this.rf1 = new FormGroup({
      email: new FormControl('',
        [Validators.required, Validators.email]),
      contactname: new FormControl('',
        [Validators.required]),
      phone: new FormControl("",
        [Validators.required, Validators.pattern('[- +()0-9]+')]),
      district: new FormControl(""),
      ward: new FormControl(""),
      street: new FormControl("", [Validators.required]),
      address: new FormControl("", [Validators.required]),
      billOption: new FormControl(""),
      note: new FormControl("")
    });
    this.rf1.controls["district"].setValue(this.District[0])
    this.rf1.controls["ward"].setValue(this.Ward[0])
    this.rf1.controls["billOption"].setValue("cash")
    this.reFillFormInfo()
    window.scrollTo(0, 0)
  }
  
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

    localStorage.removeItem("DiscountCode")
  }


  getCartInfo() {
    this.cartService.getLocalStorage()
    this.totalItem = this.cartService.totalItem
    this.totalPrice = this.cartService.totalPrice
    this.cartItems = this.cartService.cartItems
    this.cartItemsQuantity = this.cartService.cartItemsQuantity
  }
  getLocalStorageLoginInfo() {
    if (localStorage.getItem("isLogin")) {

      let timeOut = new Date(localStorage.getItem("login-timeOut")!)
      let timeNow = new Date()

      if (timeOut.getTime() < timeNow.getTime()) {
        //console.log("time out remove key")
        localStorage.removeItem("isLogin")
        localStorage.removeItem("user-id")
        localStorage.removeItem("user-email")
        localStorage.removeItem("login-timeOut")
        localStorage.removeItem("user-disName")
        localStorage.removeItem("user-imgUrl")
        localStorage.removeItem("user-role")
      }
      else {
        this.isLogin = Boolean(localStorage.getItem('isLogin'))
        this.user = new User
        this.user.id = localStorage.getItem('user-id')!
        this.user.email = localStorage.getItem("user-email")!
        this.user.displayName = localStorage.getItem("user-disName")!
        this.user.imgUrl = localStorage.getItem("user-imgUrl")!
        this.user.roles = []
        this.user.roles.push(localStorage.getItem("user-role")!)
        //console.log("still login")
      }
    }
    else {
      // console.log("no login acc")
    }

  }

  submitInfo() {
    this.showFormError = true

    if (this.rf1.valid) {
      this.saveFormForReUse()
      let address = this.rf1.controls["address"].value + " " + this.rf1.controls["street"].value + " " +
        this.rf1.controls["ward"].value + " " + this.rf1.controls["district"].value + " TP.HCM"
      let today = formatDate(Date.now(), 'dd-MM-yyyy HH:mm:ss', 'en');
      if (this.rf1.controls["billOption"].value == "momo") {
        this.saveOrderToLocal(address, today)
        let momo_id = formatDate(Date.now(), 'ddMMyyyyhhmmss', 'en');
        let sign = ""
        this.orderService.getPaymentSig(Number(momo_id),this.totalPrice).subscribe(
          data=>{
            sign=data.sig
            this.payWithMomo(momo_id,sign)
          },
          error=>{
            console.log(error)
            this.toast.error("Đã có lỗi xảy ra ! Xin hãy thử lại.")
          }
        )
      }
      else if (this.rf1.controls["billOption"].value == "vnpay") {

        this.saveOrderToLocal(address, today)
        let fullprice = this.calculateFullPrice()
        if(fullprice<20000){
          this.toast.info("VN Pay không hỗ trợ thanh toán dưới 20.000VND!")
        }
        else{
          this.orderService.getVNPayURL(fullprice).subscribe(
            data => {
              window.location.href = data.paymentUrl
            },
            error => {
              console.log(error)
              this.toast.error("Đã có lỗi xảy ra ! Xin hãy thử lại.")
            }
          )
        }
      }
      else {

        this.isLoading = true
        this.orderService.saveOrder(
          this.user.id,
          this.rf1.controls["contactname"].value, address,
          this.rf1.controls["phone"].value,
          this.rf1.controls["email"].value, this.rf1.controls["billOption"].value, today, this.totalItem, this.totalPrice,
          this.rf1.controls["note"].value,this.haveFee).subscribe(
            data => {
              //console.log(data)
              this.saveOrderDetail(data.order_id)
           
              this.cartService.emptyCart()
            },
            error => {
              console.log(error)
              this.toast.error(" An error has occurred ! Try again !")
            }
          )
      }
    }
    else {
      window.scrollTo(0, 0)
      this.toast.error("The submitted data is not valid. Please correct it to continue")
    }

  }
  saveOrderToLocal(address: any, today: any) {
    let curOrder = new Order
    curOrder.address = address
    curOrder.contactName = this.rf1.controls["contactname"].value
    curOrder.email = this.rf1.controls["email"].value
    curOrder.note = this.rf1.controls["note"].value
    curOrder.orderDate = today
    curOrder.paymentMethod = this.rf1.controls["billOption"].value
    curOrder.phone = this.rf1.controls["phone"].value
    curOrder.totalItem = this.totalItem
    curOrder.totalPrice = this.totalPrice
    curOrder.userID = this.user.id
    localStorage.setItem("user-current-order", JSON.stringify(curOrder))
  }
  payWithMomo(id:string,sign:any){
    let payUrl=""
    this.orderService.getPaymentUrl(id,(this.totalPrice).toString(),sign).subscribe(
      data=>{
        console.log(data)
        payUrl=data.payUrl
        if(payUrl){
          window.location.href = payUrl
        }
 

      },error=>{
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }
  saveOrderDetail(data: number) {
    let orderID = data
    //console.log(orderID)
    for (let i = 0; i < this.cartItems.length; i++) {
      this.orderService.saveOrderDetail(orderID, this.cartItems[i].id, this.cartItemsQuantity[i]).subscribe(
        data => {
          //console.log(data)
          if (i == this.cartItems.length - 1) {
            window.scrollTo(0, 0)
            this.applyDiscountCode(orderID)
          
            this.isDone = true
          }
        },
        error => {
          console.log(error)
          this.toast.error(" An error has occurred ! Try again !")
        }
      )
      //console.log(this.cartItems[i].id, this.cartItemsQuantity[i])
    }
  }

  saveFormForReUse(){
    //console.log(this.rf1.value)
    localStorage.setItem("submitedForm",JSON.stringify(this.rf1.value))
  }
  reFillFormInfo(){
    if(localStorage.getItem("submitedForm")){
      let form:any = JSON.parse(localStorage.getItem("submitedForm")!)
      this.rf1.controls["email"].setValue(form["email"])
      this.rf1.controls["contactname"].setValue(form["contactname"])
      this.rf1.controls["phone"].setValue(form["phone"])
      this.rf1.controls["district"].setValue(form["district"])
      this.rf1.controls["ward"].setValue(form["ward"])
      this.rf1.controls["street"].setValue(form["street"])
      this.rf1.controls["address"].setValue(form["address"])
      this.rf1.controls["billOption"].setValue(form["billOption"])
      this.rf1.controls["note"].setValue(form["note"])
      this.toast.info("Tự động điền form cho bạn!")
    }
  }

  sendEmailWithOrderInfo(email:string,id:number){
   // console.log("aaaaaaaaaaaaaaaaaaaaaa")
    this.orderService.sentEmailWithOrderInfo(id,email).subscribe(
      data=>{
        console.log(data)
      },
      error=>{
        console.log(error)
      }
    ) 
  }

  applyDiscountCode(orderID:number){
    if(localStorage.getItem("DiscountCode")){
      let dc:DiscountCode = JSON.parse(localStorage.getItem("DiscountCode")!)
      this.orderService.applyDiscountCode(dc.code,orderID).subscribe(
        data=>{
          this.sendEmailWithOrderInfo(this.rf1.controls["email"].value,orderID)
        },
        error=>{
          console.log(error)
        }
      )
    }
    else{
      this.sendEmailWithOrderInfo(this.rf1.controls["email"].value,orderID)
    }
  }

  calculateFullPrice():number{
    if(localStorage.getItem("DiscountCode")){
      let dc:DiscountCode = JSON.parse(localStorage.getItem("DiscountCode")!)
      if(dc.discountAmount!='null'){
        if(this.totalPrice+this.shippingFee-Number(dc.discountAmount)<0){
          return 0
        }
        return this.totalPrice+this.shippingFee-Number(dc.discountAmount)
      }
      return (this.totalPrice+this.shippingFee)-(this.totalPrice+this.shippingFee)*Number(dc.discountPercent)/100
    }
    else{
      return this.totalPrice+this.shippingFee
    }
  }
}
