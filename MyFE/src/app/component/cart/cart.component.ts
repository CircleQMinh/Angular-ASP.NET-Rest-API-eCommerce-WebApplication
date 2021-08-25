import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/service/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  totalItem:number=0
  totalPrice:number=0
  constructor(private cartService:CartService) { }

  ngOnInit(): void {
    this.cartService.getLocalStorage()
    setInterval(()=>{
      this.totalItem=this.cartService.totalItem
      this.totalPrice=this.cartService.totalPrice
    },100)
  }

}
