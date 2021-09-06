import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // apiUrl:string="http://circleqm-001-site1.dtempurl.com/api/";
  apiUrl: string = "https://localhost:44324/api/";
  firebaseUrl: string = "https://random-website-7f4cf-default-rtdb.firebaseio.com/";
  constructor(private http: HttpClient, private route: Router) { }

  getDashboardInfo():Observable<any>{
    return this.http.get(`${this.apiUrl}admin/dashboardInfo`)
  }


  getProducts(category:string,order:string,pageNumber:number,pageSize:number):Observable<any>{
    return this.http.get(`${this.apiUrl}admin/products?category=${category}&order=${order}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  getOrders(status:number,order:string,pageNumber:number,pageSize:number):Observable<any>{
    return this.http.get(`${this.apiUrl}admin/orders?status=${status}&order=${order}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  getUsers(order:string,role:string):Observable<any>{
    return this.http.get(`${this.apiUrl}admin/users?order=${order}&role=${role}`);
  }

}
