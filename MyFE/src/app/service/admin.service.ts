import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Employee } from '../class/employee';
import { Order } from '../class/order';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // apiUrl:string="http://circleqm-001-site1.dtempurl.com/api/";
  apiUrl: string = "https://localhost:44324/api/";

  apikey:string="3113feaeeb294cee92641b976ba196de"
  firebaseUrl: string = "https://random-website-7f4cf-default-rtdb.firebaseio.com/";
  constructor(private http: HttpClient, private route: Router) { }

  getDashboardInfo(): Observable<any> {
    return this.http.get(`${this.apiUrl}admin/dashboardInfo`)
  }


  getProducts(category: string, order: string, pageNumber: number, pageSize: number,orderDir:string): Observable<any> {
    return this.http.get(`${this.apiUrl}admin/products?category=${category}&order=${order}&pageNumber=${pageNumber}&pageSize=${pageSize}&orderDir=${orderDir}`);
  }

  getOrders(status: number, order: string, pageNumber: number, pageSize: number,orderDir:string): Observable<any> {
    return this.http.get(`${this.apiUrl}admin/orders?status=${status}&order=${order}&pageNumber=${pageNumber}&pageSize=${pageSize}&orderDir=${orderDir}`);
  }

  getUsers(order: string, role: string,orderDir:string): Observable<any> {
    return this.http.get(`${this.apiUrl}admin/users?order=${order}&role=${role}&orderDir=${orderDir}`);
  }

  getEmployees(order: string, role: string,orderDir:string): Observable<any> {
    return this.http.get(`${this.apiUrl}admin/employees?order=${order}&role=${role}&orderDir=${orderDir}`);
  }

  createUser(email: string, password: string, userName: string, phoneNumber: string, role: string): Observable<any> {
    return this.http.post(`${this.apiUrl}admin/createUser`, {
      email: email,
      password: password,
      displayName: userName,
      imgUrl: "https://el.tvu.edu.vn/images/avatar/no-avatar.png",
      phoneNumber: phoneNumber,
      roles: [
        role
      ]
    })
  }
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}admin/deleteUser?id=${id}`)
  }

  createProduct(name: string, price: number, des: string, uis: number, cate: string, imgurl: string, date: string):Observable<any> {
    return this.http.post(`${this.apiUrl}product`, {
      name: name,
      price: price,
      description: des,
      unitInStock: uis,
      category: cate,
      imgUrl: imgurl,
      lastUpdate: date
    })
  }

  editProduct(id:number,name: string, price: number, des: string, uis: number, cate: string, imgurl: string, date: string):Observable<any> {
    return this.http.put(`${this.apiUrl}product/${id}`, {
      name: name,
      price: price,
      description: des,
      unitInStock: uis,
      category: cate,
      imgUrl: imgurl,
      lastUpdate: date
    })
  }
  deleteProduct(id:number):Observable<any>{
    return this.http.delete(`${this.apiUrl}product/${id}`)
  }

  editOrder(o:Order):Observable<any>{
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
    })
  }
  deleteOrder(id:number):Observable<any>{
    return this.http.delete(`${this.apiUrl}order/${id}`)
  }
  getNew(category:string):Observable<any>{
    return this.http.get(`https://newsapi.org/v2/top-headlines?category=${category}&country=us&apiKey=${this.apikey}`)
  }

  createEmployee(e:Employee,password:any): Observable<any> {
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
    })
  }

  editEmployee(e:Employee,id:any): Observable<any> {
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
    })
  }
}
