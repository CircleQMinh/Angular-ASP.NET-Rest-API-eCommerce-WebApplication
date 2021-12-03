import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  apiUrl:string="http://minh18110320-001-site1.etempurl.com/api/";
  // apiUrl:string="https://localhost:44324/api/";
  constructor(private http: HttpClient,private route:Router) { }

  getProduct(category:string,order:string,pageNumber:number,pageSize:number):Observable<any>{
    return this.http.get(`${this.apiUrl}product?category=${category}&order=${order}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  getProductInfo(id:string):Observable<any>{
    return this.http.get(`${this.apiUrl}product/${id}`);
  }
  
  getSearchProductResult(keyword:string,priceRange:string,cate:string,tag:string,pageNumber:number,pageSize:number):Observable<any>{
    return this.http.post(`${this.apiUrl}product/search`, {
      tag: tag,
      category: cate,
      priceRange: priceRange,
      keyword: keyword,
      pageNumber:pageNumber,
      pageSize:pageSize
    })
  }

  
  getRandomProduct(id:number,category:string,number:number):Observable<any>{
    return this.http.get(`${this.apiUrl}product/getRandomProduct?id=${id}&category=${category}&number=${number}`);
  }
  getTopProduct(top:any):Observable<any>{
    return this.http.get(`${this.apiUrl}product/getTopProduct?top=${top}`)
  }
  getLatestProduct(top:any):Observable<any>{
    return this.http.get(`${this.apiUrl}product/getLatestProduct?top=${top}`)
  }
  getMostFavProduct(top:any):Observable<any>{
    return this.http.get(`${this.apiUrl}product/getMostFavoriteProduct?top=${top}`)
  }

  getPromotion():Observable<any>{
    return this.http.get(`${this.apiUrl}product/getPromotion`)
  }
  getPromotionInfo(id:any):Observable<any>{
    return this.http.get(`${this.apiUrl}product/getPromotionInfo/${id}`)
  }

  getRelatedPromotion(id:any,number:any):Observable<any>{
    return this.http.get(`${this.apiUrl}product/getRelatedPromotionInfo/${id}?number=${number}`)
  }


  getCategory():Observable<any>{
    return this.http.get(`${this.apiUrl}product/getCategory`)
  }
  getCategoryTag(cate:string):Observable<any>{
    return this.http.get(`${this.apiUrl}product/getRelatedTag?category=${cate}`)
  }
}
