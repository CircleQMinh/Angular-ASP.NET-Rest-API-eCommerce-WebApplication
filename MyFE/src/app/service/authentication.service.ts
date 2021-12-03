import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Observable } from 'rxjs';
import { User } from '../class/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  apiUrl:string="http://minh18110320-001-site1.etempurl.com/api/";
  // apiUrl: string = "https://localhost:44324/api/";
  firebaseUrl: string = "https://random-website-7f4cf-default-rtdb.firebaseio.com/";

  userInfo!:User

  isLogin: boolean = false
  user!: User

  constructor(private http: HttpClient, private router: Router,private toast:HotToastService) { }

  getLocalStorage() {
    if (localStorage.getItem("isLogin")) {

      let timeOut = new Date(localStorage.getItem("login-timeOut")!)
      let timeNow = new Date()

      if (timeOut.getTime() < timeNow.getTime()) {
        //console.log("time out remove key")
        localStorage.removeItem("JWT_token")
        localStorage.removeItem("isLogin")
        localStorage.removeItem("user-id")
        localStorage.removeItem("user-email")
        localStorage.removeItem("login-timeOut")
        localStorage.removeItem("user-disName")
        localStorage.removeItem("user-imgUrl")
        localStorage.removeItem("user-role")
        localStorage.removeItem("user-info")
      }
      else {
        this.isLogin = Boolean(localStorage.getItem('isLogin'))
        this.user = new User
     
        this.user.id = localStorage.getItem('user-id')!
        this.user.email = localStorage.getItem("user-email")!
        this.user.displayName = localStorage.getItem("user-disName")!
        this.user.imgUrl = localStorage.getItem("user-imgUrl")!
        if(localStorage.getItem("user-info")){
          this.user = JSON.parse(localStorage.getItem("user-info")!)
        }
        this.user.roles = []
        this.user.roles.push(localStorage.getItem("user-role")!)
        //console.log("still login")
      }
    }
    else {
      // console.log("no login acc")
    }
  }

  signOut() {
    this.isLogin = false
    this.user=null!
    localStorage.removeItem("isLogin")
    localStorage.removeItem("user-id")
    localStorage.removeItem("user-email")
    localStorage.removeItem("login-timeOut")
    localStorage.removeItem("user-disName")
    localStorage.removeItem("user-imgUrl")
    localStorage.removeItem("user-role")
    localStorage.removeItem("user-info")
    localStorage.removeItem("JWT_token")
    //localStorage.removeItem("submitedForm")

    this.toast.info("Đăng xuất thành công")
  }

  signUp(email: string, password: string, userName: string, phoneNumber: string): Observable<any> {
    return this.http.post(`${this.apiUrl}account/register`, {
      email: email,
      password: password,
      displayName: userName,
      imgUrl: "https://res.cloudinary.com/dkmk9tdwx/image/upload/v1635284412/tszai1cvlsw5p2wwxis1.png",
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
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.get(`${this.apiUrl}account?id=${id}`, { headers: header })
  }

  upLoadIMG(blob_string: any): Observable<any> {
    return this.http.post('https://api.cloudinary.com/v1_1/dkmk9tdwx/image/upload', { file: blob_string, upload_preset: 'v0q5hczm' })
  }
  updateProfile(url: string, phone: string, name: string, id: string): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.put(`${this.apiUrl}account?id=${id}`, {
      username: name,
      imgUrl: url,
      phone: phone
    }, { headers: header })
  }

  addToFav(userID: string, proID: number): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.post(`${this.apiUrl}account/addFavoriteProduct`, {
      productId: proID,
      userId: userID
    }, { headers: header })
  }
  removeFromFav(userID: string, proID: number): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.post(`${this.apiUrl}account/removeFavoriteProduct`, {
      productId: proID,
      userId: userID
    }, { headers: header })
  }

  addReview(userID: string, proID: number, content: string, star: number, date: string): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.post(`${this.apiUrl}review`, {
      star: star,
      content: content,
      productId: proID,
      userID: userID,
      date: date
    }, { headers: header })
  }

  removeReview(userID: string, proID: number): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.post(`${this.apiUrl}review/remove`, {

      productId: proID,
      userID: userID,

    }, { headers: header })
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

  exchangeDiscountCode(userID: string, mode:number): Observable<any> {
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + localStorage.getItem("JWT_token"));
    return this.http.post(`${this.apiUrl}account/exchangeDiscountCode`, {
      userID: userID,
      mode: mode
    }, { headers: header })
  }


}
