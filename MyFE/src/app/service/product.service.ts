import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // apiUrl:string="http://circleqm-001-site1.dtempurl.com/api/";
  apiUrl:string="https://localhost:44324/api/";
  constructor(private http: HttpClient,private route:Router) { }

  getProduct(category:string,order:string,pageNumber:number,pageSize:number):Observable<any>{
    return this.http.get(`${this.apiUrl}product?category=${category}&order=${order}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }


}
