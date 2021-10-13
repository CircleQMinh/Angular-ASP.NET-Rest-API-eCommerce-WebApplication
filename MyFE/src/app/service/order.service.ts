import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  apiUrl:string="http://circleqm-001-site1.dtempurl.com/api/";
  hostUrl:string="http://circle-shop-18110320.000webhostapp.com/#/"

  // hostUrl:string="http://localhost:4200/#/"
  // apiUrl: string = "https://localhost:44324/api/";

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
  saveOrderPrePay(userID: string, contactName: string, address: string, phone: string, email: string,
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
      status: 1
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

  finishOrder(shipperId: string, orderId: number, status: number, date: string, note: string): Observable<any> {
    return this.http.post(`${this.apiUrl}order/finishOrder`, {
      shipperId: shipperId,
      orderId: orderId,
      status: status,
      date: date,
      note: note
    })
  }

  getFinishedOrder(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}order/shipperOrderHistory?shipperId=${id}`)
  }
  getShipperOrderHistory(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}order/shipperOrderHistory?shipperId=${id}`)
  }

  getShippingInfo(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}order/getOrderShippingInfo?orderId=${id}`)
  }

  getPaymentSig(id: number, totalPrice: number): Observable<any> {
    return this.http.get(`${this.apiUrl}order/getPaySign?Id=${id}&totalPrice=${totalPrice}`)
  }

  getPaymentUrl(id: string, totalPrice: string, signature: string): Observable<any> {
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
    return this.http.get(`${this.apiUrl}order/getVNPayUrl2?totalPrice=${totalPrice}`)
  }

}
