import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotToastService } from '@ngneat/hot-toast';
import { Product } from 'src/app/class/product';
import { User } from 'src/app/class/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CartService } from 'src/app/service/cart.service';
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


  constructor(private authService: AuthenticationService, private toast: HotToastService,private cartService:CartService,
    private router:Router,private route:ActivatedRoute,private proService:ProductService,private modalService: NgbModal) { }

  ngOnInit(): void {
 
    this.getCartInfo()
    this.authService.getLocalStorage()
    this.user=this.authService.user
    this.isLogin=this.authService.isLogin

    this.rf1 = new FormGroup({
      email: new FormControl('',
        [Validators.required, Validators.email]),
      password: new FormControl('',
        [Validators.required, Validators.minLength(8)]),
    });
    window.scrollTo(0,0)
 
    //console.log(this.cartItemsQuantity)
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
  }
  removeOneFromCart(pro:Product){
    this.cartService.decrementQuantity(pro)
    this.getCartInfoWithoutDelete()
  }
  removeFromCart(pro:Product){
    this.cartService.removeItem(pro)
    this.getCartInfo()
  }
  checkOut(){
    if(this.isLogin){
      this.router.navigateByUrl("/checkout")
    }
    else{
      this.toast.info("Please login to continue!")
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
}
