import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DiscountCode } from '../class/discount-code';
import { Employee } from '../class/employee';
import { Order } from '../class/order';
import { Promotion } from '../class/promotion';
import { PromotionInfo } from '../class/promotion-info';
import { Tag } from '../class/tag';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // apiUrl:string="http://circleqm31052000-001-site1.itempurl.com/api/";
  apiUrl: string = "https://localhost:44324/api/";

  apikey:string="3113feaeeb294cee92641b976ba196de"
  firebaseUrl: string = "https://random-website-7f4cf-default-rtdb.firebaseio.com/";
  constructor(private http: HttpClient, private route: Router) { }

  getDashboardInfo(): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.get(`${this.apiUrl}admin/dashboardInfo`, { headers: header })
  }


  getProducts(category: string, order: string, pageNumber: number, pageSize: number,orderDir:string): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.get(`${this.apiUrl}admin/products?category=${category}&order=${order}&pageNumber=${pageNumber}&pageSize=${pageSize}&orderDir=${orderDir}`
    , { headers: header });
  }

  getOrders(status: number, order: string, pageNumber: number, pageSize: number,orderDir:string): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.get(`${this.apiUrl}admin/orders?status=${status}&order=${order}&pageNumber=${pageNumber}&pageSize=${pageSize}&orderDir=${orderDir}`
    , { headers: header });
  }

  getUsers(order: string, role: string,orderDir:string): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.get(`${this.apiUrl}admin/users?role=${role}&order=${order}&orderDir=${orderDir}`, { headers: header });
  }

  getEmployees(order: string, role: string,orderDir:string): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.get(`${this.apiUrl}admin/employees?order=${order}&role=${role}&orderDir=${orderDir}`, { headers: header });
  }

  createUser(email: string, password: string, userName: string, phoneNumber: string, role: string,imgUrl:string): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.post(`${this.apiUrl}admin/createUser`, {
      email: email,
      password: password,
      displayName: userName,
      imgUrl: imgUrl,
      phoneNumber: phoneNumber,
      roles: [
        role
      ]
    }, { headers: header })
  }
  deleteUser(id: string): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.delete(`${this.apiUrl}admin/deleteUser?id=${id}`, { headers: header })
  }

  createProduct(name: string, price: number, des: string, uis: number, cate: string, imgurl: string, date: string,status:string):Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.post(`${this.apiUrl}product`, {
      name: name,
      price: price,
      description: des,
      unitInStock: uis,
      category: cate,
      imgUrl: imgurl,
      lastUpdate: date,
      status:status
    }, { headers: header })
  }

  editProduct(id:number,name: string, price: number, des: string,
    uis: number, cate: string, imgurl: string, date: string,status:string):Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.put(`${this.apiUrl}product/${id}`, {
      name: name,
      price: price,
      description: des,
      unitInStock: uis,
      category: cate,
      imgUrl: imgurl,
      lastUpdate: date,
      status:status
    }, { headers: header })
  }
  deleteProduct(id:number):Observable<any>{
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.delete(`${this.apiUrl}product/${id}`, { headers: header })
  }

  editOrder(o:Order):Observable<any>{
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.put(`${this.apiUrl}order/${o.id}`,{
      contactName: o.contactName,
      address: o.address,
      phone:o.phone,
      email: o.email,
      paymentMethod: o.paymentMethod,
      orderDate:o.orderDate,
      totalItem: o.totalItem,
      totalPrice: o.totalPrice,
      note: o.note,
      status: o.status
    }, { headers: header })
  }
  deleteOrder(id:number):Observable<any>{
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.delete(`${this.apiUrl}order/${id}`, { headers: header })
  }
  getNew(category:string):Observable<any>{
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.get(`https://newsapi.org/v2/top-headlines?category=${category}&country=us&apiKey=${this.apikey}`, { headers: header })
  }

  createEmployee(e:Employee,password:any): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.post(`${this.apiUrl}admin/createEmployee`, {
      password: password,
      email: e.email,
      address: e.Address,
      imgUrl: e.imgUrl,
      sex: e.Sex,
      salary: e.Salary,
      cmnd: e.CMND,
      startDate: e.StartDate,
      status: 0,
      displayName: e.displayName,
      phoneNumber: e.phoneNumber,
      roles: e.roles
    }, { headers: header })
  }
  removeReview(userID: string, proID: number): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.post(`${this.apiUrl}admin/removeReview`, {

      productId: proID,
      userID: userID,

    }, { headers: header })
  }
  editEmployee(e:Employee,id:any): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.put(`${this.apiUrl}admin/editEmployee?id=${id}`, {
      address: e.Address,
      imgUrl: e.imgUrl,
      sex: e.Sex,
      salary: e.Salary,
      cmnd: e.CMND,
      startDate: e.StartDate,
      status: 0,
      displayName: e.displayName,
      phoneNumber: e.phoneNumber,
      roles: e.roles
    }, { headers: header })
  }

  deleteEmployee(id:any):Observable<any>{
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.delete(`${this.apiUrl}admin/deleteEmployee?id=${id}`, { headers: header })
  }

  getSalesChart(from:string,to:string):Observable<any>{
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.get(`${this.apiUrl}admin/getSalesChart?from=${from}&to=${to}`, { headers: header })
  }

  getProductChart():Observable<any>{
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.get(`${this.apiUrl}admin/getProductChart`, { headers: header })
  }

  getTopProductChart(top:any):Observable<any>{
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.get(`${this.apiUrl}admin/getTopProductChart?top=${top}`, { headers: header })
  }

  getPromotion(status: number, order: string, pageNumber: number, pageSize: number, orderDir: string):Observable<any>{
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.get(`${this.apiUrl}admin/promotion?status=${status}&order=${order}&pageNumber=${pageNumber}
    &pageSize=${pageSize}&orderDir=${orderDir}`, { headers: header })
  }

  getOnePromotion(id:any):Observable<any>{
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.get(`${this.apiUrl}admin/promo/${id}`, { headers: header });
  }


  createPromotion(promo:Promotion){
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.post(`${this.apiUrl}admin/createPromotion`, {
      name: promo.name,
      description: promo.description,
      imgUrl: promo.imgUrl,
      startDate: promo.startDate,
      endDate: promo.endDate,
      status: 0,
      visible:0
    }, { headers: header })
  }

  editPromotion(promo:Promotion){
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.put(`${this.apiUrl}admin/editPromotion/${promo.id}`, {
      name: promo.name,
      description: promo.description,
      imgUrl: promo.imgUrl,
      startDate: promo.startDate,
      endDate: promo.endDate,
      status: promo.status,
      visible:promo.visible
    }, { headers: header })
  }

  deletePromotion(id:any):Observable<any>{
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.delete(`${this.apiUrl}admin/deletePromotion?id=${id}`, { headers: header })
  }

  getPromotionInfo(id:any):Observable<any>{
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.get(`${this.apiUrl}admin/getPromotionInfo?promoId=${id}`, { headers: header })
  }
  createPromotionInfo(promoInfo:PromotionInfo):Observable<any>{
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.post(`${this.apiUrl}admin/createPromotionInfo`, {
      productId: promoInfo.productId,
      promotionId: promoInfo.promotionId,
      promotionPercent: promoInfo.promotionPercent,
      promotionAmount: promoInfo.promotionAmount
    }, { headers: header })
  }
  editPromotionInfo(promoInfo:PromotionInfo):Observable<any>{
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.put(`${this.apiUrl}admin/editPromotionInfo/${promoInfo.id}`, {
      productId: promoInfo.productId,
      promotionId: promoInfo.promotionId,
      promotionPercent: promoInfo.promotionPercent,
      promotionAmount: promoInfo.promotionAmount
    }, { headers: header })
  }

  deletePromotionInfo(id:any):Observable<any>{
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.delete(`${this.apiUrl}admin/deletePromotionInfo?id=${id}`,{ headers: header })
  }


  createProductTag(t:Tag): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.post(`${this.apiUrl}admin/addProductTag`, {
      name: t.name,
      productId: t.productId
    }, { headers: header })
  }

  editProductTag(t:Tag): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.put(`${this.apiUrl}admin/editProductTag`, {
      id: t.id,
      name: t.name,
      productId: t.productId
    }, { headers: header })
  }

  deleteProductTag(id:any):Observable<any>{
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.delete(`${this.apiUrl}admin/deleteProductTag?id=${id}`, { headers: header })
  }



  getAuthorizeHttp(auth_token:any): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + auth_token);
    return this.http.get(`${this.apiUrl}admin/getAuthorizeHttp?variable=3`, { headers: header })
  }

  getDiscountCode(order: string, pageNumber: number, pageSize: number, orderDir: string):Observable<any>{
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.get(`${this.apiUrl}admin/getDiscountCode?&order=${order}&pageNumber=${pageNumber}
    &pageSize=${pageSize}&orderDir=${orderDir}`, { headers: header })
  }

  createDisCountCode(dc:DiscountCode):Observable<any>{
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.post(`${this.apiUrl}admin/createDiscountCode`, {
      code:dc.code,
      discountPercent: dc.discountPercent,
      discountAmount: dc.discountAmount,
      startDate: dc.startDate,
      endDate: dc.endDate,
      status: 0
    }, { headers: header })
  }

  editDisCountCode(dc:DiscountCode):Observable<any>{
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.put(`${this.apiUrl}admin/editDiscountCode/${dc.id}`, {
      code:dc.code,
      discountPercent: dc.discountPercent,
      discountAmount: dc.discountAmount,
      startDate: dc.startDate,
      endDate: dc.endDate,
      status: dc.status
    }, { headers: header })
  }
  deleteDisCountCode(dc:DiscountCode):Observable<any>{
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.delete(`${this.apiUrl}admin/deleteDiscountCode/${dc.id}`, { headers: header })
  }

  editUserCoins(userID:string,coin:number):Observable<any>{
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.put(`${this.apiUrl}admin/editUserCoins`, {
      userId: userID,
      coins: coin
    }, { headers: header })
  }
}
