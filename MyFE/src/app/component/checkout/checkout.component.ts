import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
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
  constructor(private toast: HotToastService, private orderService: OrderService, private cartService: CartService
    , private router: Router) { }

  ngOnInit(): void {
    this.getCartInfo()
    this.getLocalStorageLoginInfo()
    if (this.totalItem == 0) {
      this.router.navigateByUrl("/cart")
    }
    if(!this.isLogin){
      this.router.navigateByUrl("/cart")
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

    window.scrollTo(0, 0)
  }
  getCartInfo() {
    this.cartService.getLocalStorage()
    this.totalItem = this.cartService.totalItem
    this.totalPrice = this.cartService.totalPrice
    this.cartItems = this.cartService.cartItems
    this.cartItemsQuantity = this.cartService.cartItemsQuantity
  }
  getLocalStorageLoginInfo() {
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
      }
      else{
        this.isLogin = Boolean(localStorage.getItem('isLogin'))
        this.user=new User
        this.user.id = localStorage.getItem('user-id')!
        this.user.email = localStorage.getItem("user-email")!
        this.user.displayName = localStorage.getItem("user-disName")!
        this.user.imgUrl=localStorage.getItem("user-imgUrl")!
        //console.log("still login")
      }
    }
    else{
     // console.log("no login acc")
    }

  }

  submitInfo() {
    this.showFormError = true
    // console.log("Valid : "+this.rf1.valid)
    // console.log(this.rf1.controls["email"].value)
    // console.log(this.rf1.controls["contactname"].value)
    // console.log(this.rf1.controls["phone"].value)
    // console.log(this.rf1.controls["district"].value)
    // console.log(this.rf1.controls["ward"].value)
    // console.log(this.rf1.controls["street"].value)
    // console.log(this.rf1.controls["address"].value)
    // console.log(this.rf1.controls["billOption"].value)
    console.log()

    if (this.rf1.valid) {

      let address = this.rf1.controls["address"].value + " " + this.rf1.controls["street"].value + " " +
        this.rf1.controls["ward"].value + " " + this.rf1.controls["district"].value + " TP.HCM"
      //console.log(address)
      let today = formatDate(Date.now(), 'dd-MM-yyyy hh:mm:ss', 'en');
      // console.log(today)
      this.isLoading = true
      this.orderService.saveOrder(this.user.id, this.rf1.controls["contactname"].value, address, this.rf1.controls["phone"].value,
        this.rf1.controls["email"].value, this.rf1.controls["billOption"].value, today, this.totalItem, this.totalPrice,
        this.rf1.controls["note"].value).subscribe(
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
    else {
      window.scrollTo(0, 0)
      this.toast.error("The submitted data is not valid. Please correct it to continue")
    }

  }
  saveOrderDetail(data: number) {
    let orderID = data
    console.log(orderID)
    for (let i = 0; i < this.cartItems.length; i++) {
      this.orderService.saveOrderDetail(orderID, this.cartItems[i].id, this.cartItemsQuantity[i]).subscribe(
        data => {
          //console.log(data)
          if (i == this.cartItems.length - 1) {
            window.scrollTo(0, 0)
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

}
