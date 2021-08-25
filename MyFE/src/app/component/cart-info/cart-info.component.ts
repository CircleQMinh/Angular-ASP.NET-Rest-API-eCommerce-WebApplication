import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Product } from 'src/app/class/product';
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
  constructor(private authService: AuthenticationService, private toast: HotToastService,private cartService:CartService,
    private router:Router,private route:ActivatedRoute,private proService:ProductService) { }

  ngOnInit(): void {
    this.cartService.getLocalStorage()
    this.totalItem=this.cartService.totalItem
    this.totalPrice=this.cartService.totalPrice
    this.cartItems=this.cartService.cartItems
    this.cartItemsQuantity=this.cartService.cartItemsQuantity
    window.scrollTo(0,0)
    console.log(this.cartItemsQuantity)
  }

}
