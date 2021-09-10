import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  apiUrl:string="http://circleqm-001-site1.dtempurl.com/api/";
  // apiUrl: string = "https://localhost:44324/api/";
  constructor(private http: HttpClient, private route: Router) { }

  saveOrder(userID: string, contactName: string, address: string, phone: string, email: string,
    paymentMethod: string, orderDate: string, totalItem: number, totalPrice: number, note: string): Observable<any> {
    return this.http.post(`${this.apiUrl}order`, {
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
  saveOrderDetail(orderId: number, productID: number, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}order/addOrderDetails`, {
      productId: productID,
      quantity: quantity,
      orderId: orderId
    })
  }

  getOrderDetails(ID: number): Observable<any> {
    return this.http.get(`${this.apiUrl}order/getOrderDetails?id=${ID}`)
  }

  getAvailableOrder(status: number, order: string, pageNumber: number, pageSize: number, orderDir: string): Observable<any> {
    return this.http.get(`${this.apiUrl}order/availableOrder?status=${status}&order=${order}&pageNumber=${pageNumber}&pageSize=${pageSize}&orderDir=${orderDir}`)
  }

  acceptOrder(shipperId: string, orderId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}order/acceptOrder?shipperId=${shipperId}&orderId=${orderId}`, {})
  }

  getAcceptedOrder(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}order/acceptedOrder?shipperId=${id}`)
  }

  finishOrder(shipperId: string, orderId: number, status: number,date:string ,note: string): Observable<any> {
    return this.http.post(`${this.apiUrl}order/finishOrder`, {
      shipperId: shipperId,
      orderId: orderId,
      status: status,
      date: date,
      note: note
    })
  }

  getFinishedOrder(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}order/finishedOrder?shipperId=${id}`)
  }

  getShippingInfo(id:number): Observable<any>{
    return this.http.get(`${this.apiUrl}order/getOrderShippingInfo?orderId=${id}`)
  }
}
