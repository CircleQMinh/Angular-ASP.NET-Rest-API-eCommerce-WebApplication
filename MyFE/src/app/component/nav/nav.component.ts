import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/class/user';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  
  isCollapsed: boolean = true
  isLogin: boolean = false

  user!:User

  constructor(private router:Router) { }

  ngOnInit(): void {
    this.getLocalStorage()
  }
  getLocalStorage() {
    if(localStorage.getItem("isLogin")){
   
      let timeOut= new Date(localStorage.getItem("login-timeOut")!)
      let timeNow = new Date()
  
      if(timeOut.getTime()<timeNow.getTime()){
        //console.log("time out remove key")
        localStorage.removeItem("isLogin")
        localStorage.removeItem("user-id")
        localStorage.removeItem("user-email")
        localStorage.removeItem("login-timeOut")
        localStorage.removeItem("user-disName")
      }
      else{
        this.isLogin = Boolean(localStorage.getItem('isLogin'))
        this.user=new User
        this.user.id = localStorage.getItem('user-id')!
        this.user.email = localStorage.getItem("user-email")!
        this.user.displayName = localStorage.getItem("user-disName")!
        //console.log("still login")
      }
    }
    else{
     // console.log("no login acc")
    }

  }
  signOut() {
    this.isLogin = false
    let a = this.router.url
    localStorage.removeItem("isLogin")
    localStorage.removeItem("user-id")
    localStorage.removeItem("user-email")
    localStorage.removeItem("login-timeOut")
    localStorage.removeItem("user-disName")

    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigateByUrl(a))
  }
}
