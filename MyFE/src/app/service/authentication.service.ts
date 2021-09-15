import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../class/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // apiUrl:string="http://circleqm-001-site1.dtempurl.com/api/";
  apiUrl: string = "https://localhost:44324/api/";
  firebaseUrl: string = "https://random-website-7f4cf-default-rtdb.firebaseio.com/";

  userInfo!:User

  constructor(private http: HttpClient, private route: Router) { }

  signUp(email: string, password: string, userName: string, phoneNumber: string): Observable<any> {
    return this.http.post(`${this.apiUrl}account/register`, {
      email: email,
      password: password,
      displayName: userName,
      imgUrl: "https://el.tvu.edu.vn/images/avatar/no-avatar.png",
      phoneNumber: phoneNumber,
      roles: [
        "User"
      ]
    })
  }
  comfirmAccount(email: string, token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}account/ConfirmEmail`, {
      email: email,
      token: token
    })
  }
  recoverPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}account/ForgotPassword?email=${email}`, {})
  }
  comfirmPassword(email: string, token: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}account/ResetPassword`, {
      email: email,
      token: token,
      password: password
    })
  }
  signIn(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}account/login`, {
      email: email,
      password: password
    })
  }

  getUserInfo(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}account?id=${id}`)
  }

  upLoadIMG(blob_string: any): Observable<any> {
    return this.http.post('https://api.cloudinary.com/v1_1/dkmk9tdwx/image/upload', { file: blob_string, upload_preset: 'v0q5hczm' })
  }
  updateProfile(url: string, phone: string, name: string, id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}account?id=${id}`, {
      username: name,
      imgUrl: url,
      phone: phone
    })
  }

  addToFav(userID: string, proID: number): Observable<any> {
    return this.http.post(`${this.apiUrl}account/addFavoriteProduct`, {
      productId: proID,
      userId: userID
    })
  }
  removeFromFav(userID: string, proID: number): Observable<any> {
    return this.http.post(`${this.apiUrl}account/removeFavoriteProduct`, {
      productId: proID,
      userId: userID
    })
  }

  addReview(userID: string, proID: number, content: string, star: number, date: string): Observable<any> {
    return this.http.post(`${this.apiUrl}review`, {
      star: star,
      content: content,
      productId: proID,
      userID: userID,
      date: date
    })
  }

  addChatMess(user: string, time: string, content: string, role: string): Observable<any> {
    return this.http.post(`${this.firebaseUrl}chatME.json`, {
      user: user,
      time: time,
      content: content,
      userrole: role
    }
    )
  }
  getChatMess(): Observable<any> {
    return this.http.get(`${this.firebaseUrl}chatME.json`)
  }
}
