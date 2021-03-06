import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { DiscountCode } from 'src/app/class/discount-code';
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

  isLoading = false
  payment_status = "OK"

  vnp_ResponseCode = ""
  momo_ResponCode = ""
  user_Order!: Order
  cartItems: Product[] = [];
  cartItemsQuantity: number[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private orderService: OrderService, private toast: HotToastService,
    private cartService: CartService) { }

  ngOnInit(): void {
    this.getCartInfo()
    if (this.route.snapshot.queryParamMap.has("vnp_ResponseCode")) {
      // console.log("VNPay")
      this.vnp_ResponseCode = this.route.snapshot.queryParamMap.get("vnp_ResponseCode")!
      // console.log(this.vnp_ResponseCode)
      this.xuLyVNPay()
    }
    else if (this.route.snapshot.queryParamMap.has("errorCode")) {
      console.log("momo")
      this.momo_ResponCode = this.route.snapshot.queryParamMap.get("errorCode")!
      this.xuLyMomo()
    }
    // else{
    //   this.router.navigateByUrl("/error")
    // }

  }
    
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

    localStorage.removeItem("DiscountCode")
  }
  getCartInfo() {
    this.cartService.getLocalStorage()
    this.cartItems = this.cartService.cartItems
    this.cartItemsQuantity = this.cartService.cartItemsQuantity
  }

  xuLyVNPay() {
    if (this.vnp_ResponseCode == "00") {
      this.payment_status = "OK"
      this.user_Order = JSON.parse(localStorage.getItem("user-current-order")!)
      let haveFee = 0
      if (this.user_Order.totalPrice >= 200000) {
        haveFee = 0
      }
      else {
        haveFee = 1
      }
      this.orderService.saveOrderPrePay(this.user_Order.userID, this.user_Order.contactName, this.user_Order.address, this.user_Order.phone
        , this.user_Order.email, this.user_Order.paymentMethod, this.user_Order.orderDate, this.user_Order.totalItem
        , this.user_Order.totalPrice, this.user_Order.note, haveFee).subscribe(
          data => {
            this.saveOrderDetail(data.order_id)

            localStorage.removeItem("user-current-order")
            this.cartService.emptyCart()

            this.isLoading = false
          },
          error => {
            console.log(error)
            localStorage.removeItem("user-current-order")
            this.toast.error("C?? l???i g?? r???i!")
          }
        )
    }
    else if (this.vnp_ResponseCode == "24") {
      this.payment_status = "Cancel"
      localStorage.removeItem("user-current-order")
      this.router.navigateByUrl("/cart")
      this.isLoading = false
    }
    else {
      this.payment_status = "Error"
      this.isLoading = false
    }
  }
  xuLyMomo() {
    if (this.momo_ResponCode == "49" || this.momo_ResponCode == "36") {
      this.payment_status = "Cancel"
      localStorage.removeItem("user-current-order")
      this.router.navigateByUrl("/cart")
      this.isLoading = false
    }
    else if (this.momo_ResponCode == "0") {
      this.payment_status = "OK"
      this.user_Order = JSON.parse(localStorage.getItem("user-current-order")!)
      this.orderService.saveOrderPrePay(this.user_Order.userID, this.user_Order.contactName, this.user_Order.address, this.user_Order.phone
        , this.user_Order.email, this.user_Order.paymentMethod, this.user_Order.orderDate, this.user_Order.totalItem
        , this.user_Order.totalPrice, this.user_Order.note, 0).subscribe(
          data => {
            this.saveOrderDetail(data.order_id)
            localStorage.removeItem("user-current-order")
            this.cartService.emptyCart()
            this.isLoading = false
          },
          error => {
            console.log(error)
            localStorage.removeItem("user-current-order")
            this.toast.error("C?? l???i g?? r???i!")
          }
        )
    }
    else {
      this.payment_status = "Error"
      this.isLoading = false
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
            this.applyDiscountCode(orderID)

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
  sendEmailWithOrderInfo(email: string, id: number) {
    // console.log("aaaaaaaaaaaaaaaaaaaaaa")
    this.orderService.sentEmailWithOrderInfo(id, email).subscribe(
      data => {
        console.log(data)
      },
      error => {
        console.log(error)
      }
    )
  }

  applyDiscountCode(orderID: number) {
    if (localStorage.getItem("DiscountCode")) {
      let dc: DiscountCode = JSON.parse(localStorage.getItem("DiscountCode")!)
      this.orderService.applyDiscountCode(dc.code, orderID).subscribe(
        data => {
          this.sendEmailWithOrderInfo(this.user_Order.email, orderID)
         // this.getShopCoinsForUser(orderID)
        },
        error => {
          console.log(error)
        }
      )
    }
    else{
      this.sendEmailWithOrderInfo(this.user_Order.email, orderID)
      //this.getShopCoinsForUser(orderID)
    }
  }
  getShopCoinsForUser(orderID: any){
    this.orderService.getShopCoins(this.user_Order.userID, orderID).subscribe(
      data => {
        if (data.coins > 0) {
          this.toast.success("B???n nh???n ???????c " + data.coins + " shop xu! Shop xu s??? d???ng ????? ?????i m?? gi???m gi??.")
        }
      },
      error => {

      }
    )
  }
}
