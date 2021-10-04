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
  justUpdateCart=false
  showInfo=false
  constructor(private cartService:CartService) { }

  ngOnInit(): void {
    this.cartService.getLocalStorage()
    setInterval(()=>{
      if(this.totalItem!=this.cartService.totalItem){
        this.justUpdateCart=true
        //console.log("Update")
      }
      this.totalItem=this.cartService.totalItem
      this.totalPrice=this.cartService.totalPrice
    },100)

    setInterval(()=>{
      if(this.justUpdateCart){
        this.justUpdateCart=false
        this.showInfo=true
        setTimeout(()=>{
          this.showInfo=false
        },3000) 
      }
    },200)
  }

}
