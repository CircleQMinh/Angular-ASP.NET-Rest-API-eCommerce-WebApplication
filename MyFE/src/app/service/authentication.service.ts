import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // apiUrl:string="http://circleqm-001-site1.dtempurl.com/api/";
  apiUrl: string = "https://localhost:44324/api/";
  constructor(private http: HttpClient, private route: Router) { }

  signUp(email: string, password: string,userName:string,phoneNumber:string): Observable<any> {
    return this.http.post(`${this.apiUrl}account/register`, {
      email: email,
      password: password,
      displayName: userName,
      imgUrl: "null",
      phoneNumber: phoneNumber,
      roles: [
        "User"
      ]
    })
  }
  comfirmAccount(email:string,token:string):Observable<any>{
    return this.http.post(`${this.apiUrl}account/ConfirmEmail`,{
      email:email,
      token:token
    })
  }
  recoverPassword(email:string):Observable<any>{
    return this.http.post(`${this.apiUrl}account/ForgotPassword?email=${email}`,{})
  }
  comfirmPassword(email:string,token:string,password:string):Observable<any>{
    return this.http.post(`${this.apiUrl}account/ResetPassword`,{
      email:email,
      token:token,
      password:password
    })
  }
  signIn(email:string,password:string):Observable<any>{
    return this.http.post(`${this.apiUrl}account/login`,{
      email:email,
      password:password
    })
  }
}
