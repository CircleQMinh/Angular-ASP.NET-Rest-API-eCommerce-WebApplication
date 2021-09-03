import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  apiUrl:string="http://circleqm-001-site1.dtempurl.com/api/";
  // apiUrl:string="https://localhost:44324/api/";
  constructor(private http: HttpClient,private route:Router) { }

  saveOrder(userID:string,contactName:string,address:string,phone:string,email:string,
    paymentMethod:string,orderDate:string,totalItem:number,totalPrice:number,note:string):Observable<any>{
    return this.http.post(`${this.apiUrl}order`,{
      userID: userID,
      contactName: contactName,
      address: address,
      phone: phone,
      email: email,
      paymentMethod: paymentMethod,
      orderDate: orderDate,
      totalItem: totalItem,
      totalPrice: totalPrice,
      note: note,
      status: 0
    })
  }
  saveOrderDetail(orderId:number,productID:number,quantity:number):Observable<any>{
    return this.http.post(`${this.apiUrl}order/addOrderDetails`,{
      productId: productID,
      quantity: quantity,
      orderId: orderId
    })
  }

  getOrderDetails(ID:number):Observable<any>{
    return this.http.get(`${this.apiUrl}order/getOrderDetails?id=${ID}`)
  }

}
