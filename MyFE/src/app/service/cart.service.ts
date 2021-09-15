import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../class/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems:Product[]=[];
  cartItemsQuantity:number[]=[];
  totalItem:number=0
  totalPrice:number=0

  constructor(private http: HttpClient) { }

  getLocalStorage() {
    if(localStorage.getItem("cart-timeOut")){
   
      let timeOut= new Date(localStorage.getItem("cart-timeOut")!)
      let timeNow = new Date()
  
      if(timeOut.getTime()<timeNow.getTime()){
        //console.log("time out remove key")
        localStorage.removeItem("totalItem")
        localStorage.removeItem("totalPrice")
        localStorage.removeItem("cartItems")
        localStorage.removeItem("cartItemsQuantity")
        localStorage.removeItem("cart-timeOut")
      }
      else{
        this.totalItem=Number(localStorage.getItem("totalItem"))
        this.totalPrice=Number(localStorage.getItem("totalPrice"))
        this.cartItems=JSON.parse(localStorage.getItem("cartItems")!)
        this.cartItemsQuantity=JSON.parse(localStorage.getItem("cartItemsQuantity")!)
        this.computeCartTotals()
        //console.log("cart not timeout")
      }
    }
    else{
     // console.log("no cart info ")
    }

  }

  computeCartTotals() {
    let sum=0;
    let qua=0;
    for(let i = 0; i < this.cartItems.length; i++){
      let a:Product = this.cartItems[i];
      sum+=a.price!*this.cartItemsQuantity[i];
      qua+=this.cartItemsQuantity[i];
    }
    this.totalItem=qua
    this.totalPrice=sum
    localStorage.setItem("totalItem",String(qua))
    localStorage.setItem("totalPrice",String(sum))
    localStorage.setItem("cartItems",JSON.stringify(this.cartItems))
    localStorage.setItem("cartItemsQuantity",JSON.stringify(this.cartItemsQuantity))
    let a = new Date()
    a.setMinutes(a.getMinutes()+30)
    localStorage.setItem("cart-timeOut",formatDate(a, 'MMMM d, y, hh:mm:ss a z', 'en'))
    // console.log(this.totalItem)
    // console.log(this.totalPrice)
  }

  addToCart(pro:Product){
    let alreadyExistsInCart: boolean = false;
    
    for(let i = 0; i < this.cartItems.length; i++){
      let a:Product = this.cartItems[i];
      if(a.name==pro.name){
        alreadyExistsInCart=true;
        this.cartItemsQuantity[i]++;
        break;
      }
    }

    if(!alreadyExistsInCart){
      this.cartItems.push(pro);
      this.cartItemsQuantity.push(1);
    }
    this.computeCartTotals();
  }

  incrementQuantity(pro:Product){
    this.addToCart(pro);
  }
  decrementQuantity(pro:Product){
    for(let i = 0; i < this.cartItems.length; i++){
      let a:Product = this.cartItems[i];
      if(pro.name==a.name){
        if(this.cartItemsQuantity[i]>1){
          this.cartItemsQuantity[i]--;
          break;
        }
      }
    }
    this.computeCartTotals();
    
  }
  removeItem(pro:Product){
    for(let i = 0; i < this.cartItems.length; i++){
      let a:Product = this.cartItems[i];
      if(pro.name==a.name){
        this.cartItems.splice(i,1);
        this.cartItemsQuantity.splice(i,1);
        break;
      }
    }
    this.computeCartTotals();
  }

  emptyCart(){
    this.cartItems=[]
    this.cartItemsQuantity=[]
    this.computeCartTotals()
  }

  // saveOrder(order:OrderBill): Observable<any> {
  //   return this.http.post(`http://localhost:8080/api/v1/Orders/createOrder`, order);
  // }

  // saveOrderDetail(od:OrderDetail): Observable<any> {
  //   return this.http.post(`http://localhost:8080/api/v1/Orders/createOrderDetail`, od);
  // }
}