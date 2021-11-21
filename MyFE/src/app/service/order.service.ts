import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  shippingFee:number = 15000

  // apiUrl:string="http://circleqm31052000-001-site1.itempurl.com/api/";
  // hostUrl:string="http://circleqm31052000-001-site1.itempurl.com/#/"

  hostUrl:string="http://localhost:4200/#/"
  apiUrl: string = "https://localhost:44324/api/";

  momoUrl: string = "https://test-payment.momo.vn/gw_payment/transactionProcessor"

  headerDict = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
  requestOptions = {
    headers: new HttpHeaders(this.headerDict),
  };
  constructor(private http: HttpClient, private route: Router) { }

  saveOrder(userID: string, contactName: string, address: string, phone: string, email: string,
    paymentMethod: string, orderDate: string, totalItem: number, totalPrice: number, note: string,shippingFee:number): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
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
      status: 0,
      shippingFee: shippingFee
    }, { headers: header })
  }
  saveOrderPrePay(userID: string, contactName: string, address: string, phone: string, email: string,
    paymentMethod: string, orderDate: string, totalItem: number, totalPrice: number, note: string,shippingFee:number): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
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
      status: 1,
      shippingFee: shippingFee
    }, { headers: header })
  }

  saveOrderDetail(orderId: number, productID: number, quantity: number): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.post(`${this.apiUrl}order/addOrderDetails`, {
      productId: productID,
      quantity: quantity,
      orderId: orderId
    }, { headers: header })
  }

  getOrderDetails(ID: number): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.get(`${this.apiUrl}order/getOrderDetails?id=${ID}`, { headers: header })
  }

  getAvailableOrder(status: number, order: string, pageNumber: number, pageSize: number, orderDir: string): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.get(`${this.apiUrl}order/availableOrder?status=${status}&order=${order}&pageNumber=${pageNumber}&pageSize=${pageSize}&orderDir=${orderDir}`, { headers: header })
  }

  acceptOrder(shipperId: string, orderId: number): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.post(`${this.apiUrl}order/acceptOrder?shipperId=${shipperId}&orderId=${orderId}`, {}, { headers: header })
  }

  getAcceptedOrder(id: string): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.get(`${this.apiUrl}order/acceptedOrder?shipperId=${id}`, { headers: header })
  }

  finishOrder(shipperId: string, orderId: number, status: number, date: string, note: string): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.post(`${this.apiUrl}order/finishOrder`, {
      shipperId: shipperId,
      orderId: orderId,
      status: status,
      date: date,
      note: note
    }, { headers: header })
  }

  cancelOrder(orderId: number, note: string): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.post(`${this.apiUrl}order/cancelOrder`, {
      id: orderId,
      note: note
    }, { headers: header })
  }

  getShipperOrderHistory(id: string): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.get(`${this.apiUrl}order/shipperOrderHistory?shipperId=${id}`, { headers: header })
  }

  getShippingInfo(id: number): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.get(`${this.apiUrl}order/getOrderShippingInfo?orderId=${id}`, { headers: header })
  }

  getPaymentSig(id: number, totalPrice: number): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.get(`${this.apiUrl}order/getPaySign?Id=${id}&totalPrice=${totalPrice}`, { headers: header })
  }

  getPaymentUrl(id: string, totalPrice: string, signature: string): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.post(`https://test-payment.momo.vn/gw_payment/transactionProcessor`, {
      accessKey: "Vxo6vQMlwjbrGq3c",
      partnerCode: "MOMOEVY720210913",
      requestType: "captureMoMoWallet",
      notifyUrl: `${this.hostUrl}thankyou`,
      returnUrl: `${this.hostUrl}thankyou`,
      orderId: id,
      amount: totalPrice,
      orderInfo: "Thanh toán cho đơn hàng của CircleShop",
      requestId: id,
      extraData: "",
      signature: signature
    }, this.requestOptions)
  }

  getVNPayURL(totalPrice:number):Observable<any>{
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.get(`${this.apiUrl}order/getVNPayUrl2?totalPrice=${totalPrice}`, { headers: header })
  }


  sentEmailWithOrderInfo(id: number, email: string): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.get(`${this.apiUrl}order/sendEmailWithOrderInfo?Id=${id}&email=${email}`, { headers: header })
  }


  checkDiscountCode(code:string):Observable<any>{
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.get(`${this.apiUrl}order/checkDiscountCode?code=${code}`, { headers: header })
  }

  applyDiscountCode(code:string,orderId:number):Observable<any>{
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.post(`${this.apiUrl}order/applyDiscountCode`, {
      code: code,
      orderID: orderId,
    }, { headers: header })
  }

}
