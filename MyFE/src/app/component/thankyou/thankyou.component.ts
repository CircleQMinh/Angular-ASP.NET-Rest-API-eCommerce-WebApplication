import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Order } from 'src/app/class/order';
import { Product } from 'src/app/class/product';
import { CartService } from 'src/app/service/cart.service';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css']
})
export class ThankyouComponent implements OnInit {

  isLoading=true
  payment_status=""
  vnp_ResponseCode=""
  momo_ResponCode=""
  user_Order!:Order
  cartItems: Product[] = [];
  cartItemsQuantity: number[] = [];
  
  constructor(private router:Router,private route:ActivatedRoute,private orderService:OrderService,private toast:HotToastService,
    private cartService:CartService) { }

  ngOnInit(): void {
    this.getCartInfo()
    if(this.route.snapshot.queryParamMap.has("vnp_ResponseCode")){
      // console.log("VNPay")
      this.vnp_ResponseCode=this.route.snapshot.queryParamMap.get("vnp_ResponseCode")!
      // console.log(this.vnp_ResponseCode)
      this.xuLyVNPay()
    }
    else if(this.route.snapshot.queryParamMap.has("errorCode")){
      console.log("momo")
      this.momo_ResponCode=this.route.snapshot.queryParamMap.get("errorCode")!
      this.xuLyMomo()
    }
    else{
      this.router.navigateByUrl("/error")
    }

  }
  getCartInfo() {
    this.cartService.getLocalStorage()
    this.cartItems = this.cartService.cartItems
    this.cartItemsQuantity = this.cartService.cartItemsQuantity
  }

  xuLyVNPay(){
    if(this.vnp_ResponseCode=="00"){
      this.payment_status="OK"
      this.user_Order=JSON.parse(localStorage.getItem("user-current-order")!)
      this.orderService.saveOrderPrePay(this.user_Order.userID,this.user_Order.contactName,this.user_Order.address,this.user_Order.phone
        ,this.user_Order.email,this.user_Order.paymentMethod,this.user_Order.orderDate,this.user_Order.totalItem
        ,this.user_Order.totalPrice,this.user_Order.note).subscribe(
          data=>{
            this.saveOrderDetail(data.order_id)
            localStorage.removeItem("user-current-order")
            this.cartService.emptyCart()
            this.isLoading=false
          },
          error=>{
            console.log(error)
            localStorage.removeItem("user-current-order")
            this.toast.error("Có lỗi gì rồi!")
          }
        )
    }
    else if(this.vnp_ResponseCode=="24"){
      this.payment_status="Cancel"
      localStorage.removeItem("user-current-order")
      this.router.navigateByUrl("/cart")
      this.isLoading=false
    }
    else{
      this.payment_status="Error"
      this.isLoading=false
    }
  }
  xuLyMomo(){
    if(this.momo_ResponCode=="49"||this.momo_ResponCode=="36"){
      this.payment_status="Cancel"
      localStorage.removeItem("user-current-order")
      this.router.navigateByUrl("/cart")
      this.isLoading=false
    }
    else if(this.momo_ResponCode=="0"){
      this.payment_status="OK"
      this.user_Order=JSON.parse(localStorage.getItem("user-current-order")!)
      this.orderService.saveOrderPrePay(this.user_Order.userID,this.user_Order.contactName,this.user_Order.address,this.user_Order.phone
        ,this.user_Order.email,this.user_Order.paymentMethod,this.user_Order.orderDate,this.user_Order.totalItem
        ,this.user_Order.totalPrice,this.user_Order.note).subscribe(
          data=>{
            this.saveOrderDetail(data.order_id)
            localStorage.removeItem("user-current-order")
            this.cartService.emptyCart()
            this.isLoading=false
          },
          error=>{
            console.log(error)
            localStorage.removeItem("user-current-order")
            this.toast.error("Có lỗi gì rồi!")
          }
        )
    }
    else{
      this.payment_status="Error"
      this.isLoading=false
    }

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
}
