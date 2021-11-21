import { formatDate } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotToastService } from '@ngneat/hot-toast';
import { DiscountCode } from 'src/app/class/discount-code';
import { Product } from 'src/app/class/product';
import { User } from 'src/app/class/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CartService } from 'src/app/service/cart.service';
import { OrderService } from 'src/app/service/order.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-cart-info',
  templateUrl: './cart-info.component.html',
  styleUrls: ['./cart-info.component.css']
})
export class CartInfoComponent implements OnInit {
  cartItems:Product[]=[];
  cartItemsQuantity:number[]=[];
  totalItem:number=0
  totalPrice:number=0
  isLogin=false
  user!:User

  @ViewChild('loginModal', { static: true }) loginModal!: ElementRef;
  rf1!: FormGroup;
  showFormError=false
  isLoadingLogin=false
  
  isCheckingDCode=false

  dcode!:string
  discountCode!:DiscountCode
  appliedCode=false

  shippingFee:number = 0

  constructor(private authService: AuthenticationService, private toast: HotToastService,private cartService:CartService,
    private router:Router,private route:ActivatedRoute,private proService:ProductService,private modalService: NgbModal,
    private orderService:OrderService) { }

  ngOnInit(): void {
 
    this.getCartInfo()
    this.authService.getLocalStorage()
    this.user=this.authService.user
    this.isLogin=this.authService.isLogin
    if(this.totalPrice<200000){
      this.shippingFee=this.orderService.shippingFee
    }
    

    this.rf1 = new FormGroup({
      email: new FormControl('',
        [Validators.required, Validators.email]),
      password: new FormControl('',
        [Validators.required, Validators.minLength(8)]),
    });
    window.scrollTo(0,0)
 
    //console.log(this.cartItemsQuantity)
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

    // localStorage.removeItem("DiscountCode")
  }
  getCartInfo(){
    this.cartService.getLocalStorage()
    this.totalItem=this.cartService.totalItem
    this.totalPrice=this.cartService.totalPrice
    this.cartItems=this.cartService.cartItems
    this.cartItemsQuantity=this.cartService.cartItemsQuantity
  }
  getCartInfoWithoutDelete(){
    this.cartService.getLocalStorage()
    this.totalItem=this.cartService.totalItem
    this.totalPrice=this.cartService.totalPrice
    //this.cartItems=this.cartService.cartItems
    this.cartItemsQuantity=this.cartService.cartItemsQuantity
  }

  addOneToCart(pro:Product){
    this.cartService.incrementQuantity(pro)
    this.getCartInfoWithoutDelete()
    if(this.totalPrice<200000){
      this.shippingFee=this.orderService.shippingFee
    }
    else{
      this.shippingFee=0
    }
  }
  removeOneFromCart(pro:Product){
    this.cartService.decrementQuantity(pro)
    this.getCartInfoWithoutDelete()
    if(this.totalPrice<200000){
      this.shippingFee=this.orderService.shippingFee
    }
    else{
      this.shippingFee=0
    }
  }
  removeFromCart(pro:Product){
    this.cartService.removeItem(pro)
    this.getCartInfo()
    if(this.totalPrice<200000){
      this.shippingFee=this.orderService.shippingFee
    }
    else{
      this.shippingFee=0
    }
  }
  checkOut(){
    if(this.appliedCode){
      localStorage.setItem("DiscountCode",JSON.stringify(this.discountCode))
    }
    else{
      localStorage.removeItem("DiscountCode")
    }

    if(this.isLogin){
      this.router.navigateByUrl("/checkout")
    }
    else{
      this.toast.info("Hãy đăng nhập để tiếp tục!")
      this.openloginModal(this.loginModal)
    }
    
  }
  openloginModal(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }
  tryLogin(){
    this.showFormError = true
    this.isLoadingLogin=true
    if (this.rf1.valid) {
      // console.log(this.rf1.controls['email'].value)
      // console.log(this.rf1.controls['password'].value)
      this.authService.signIn(this.rf1.controls['email'].value, this.rf1.controls['password'].value).subscribe(
        data => {
          console.log(data)

          this.user=data.user
          this.user.roles=data.roles
          localStorage.setItem('isLogin', "true")
          localStorage.setItem('JWT_token',data.token)
          localStorage.setItem("user-id",this.user.id)
          localStorage.setItem("user-disName",this.user.displayName)
          localStorage.setItem("user-email",this.user.email)
          let a = new Date()
          a.setMinutes(a.getMinutes()+120)
          localStorage.setItem("login-timeOut",formatDate(a, 'MMMM d, y, hh:mm:ss a z', 'en'))
          this.modalService.dismissAll()
          this.router.navigateByUrl('/', {skipLocationChange: true})
          .then(() => this.router.navigate(['/checkout']));
          this.isLoadingLogin=false
        },
        error => {
          console.log(error)
          this.toast.error(" An error has occurred ! Try again !")
          this.isLoadingLogin=false
        }
      )
    }
    else{
      this.toast.error("The submitted data is not valid. Please correct it to continue")
      this.isLoadingLogin=false
    }
  }
  toNumber(string: string): number {
    return Number(string)
  }

  applyDCode(){
    this.isCheckingDCode=true
    this.orderService.checkDiscountCode(this.dcode).subscribe(
      data=>{
        if(data.success){
          this.isCheckingDCode=false
          this.discountCode=data.discountCode
          this.appliedCode=true
          this.toast.success("Áp dụng mã giảm giá thành công!")
        }
        else{
          this.toast.error(data.msg)
          this.isCheckingDCode=false
        }
      },
      error=>{
        this.isCheckingDCode=false
        this.toast.error("Có lỗi xảy ra! Xin hãy thử lại.")
      }
    )
  }

  calculateFullPrice():number{
    if(this.appliedCode){
      if(this.discountCode.discountAmount!='null'){
        if(this.totalPrice+this.shippingFee-Number(this.discountCode.discountAmount)<0){
          return 0
        }
        return this.totalPrice+this.shippingFee-Number(this.discountCode.discountAmount)
      }
      return (this.totalPrice+this.shippingFee)-(this.totalPrice+this.shippingFee)*Number(this.discountCode.discountPercent)/100
    }
    else{
      return this.totalPrice+this.shippingFee
    }
  }
}
