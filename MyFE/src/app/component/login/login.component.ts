import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { User } from 'src/app/class/user';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  rf1!: FormGroup;

  showFormError: boolean = false
  login_error: boolean = false
  isLoading:boolean=false

  isLogin: boolean = false
  user!:User

  constructor(private authService: AuthenticationService,private toast:HotToastService,private router:Router) { }

  ngOnInit(): void {

    this.rf1 = new FormGroup({
      email: new FormControl('',
        [Validators.required, Validators.email]),
      password: new FormControl('',
        [Validators.required, Validators.minLength(8)]),
    });
    this.getLocalStorage()
    window.scrollTo(0,0)
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
        localStorage.removeItem("user-imgUrl")
        localStorage.removeItem("user-role")
      }
      else{
        this.isLogin = Boolean(localStorage.getItem('isLogin'))
        this.user=new User
        this.user.id = localStorage.getItem('user-id')!
        this.user.email = localStorage.getItem("user-email")!
        this.user.displayName = localStorage.getItem("user-disName")!
        this.user.imgUrl=localStorage.getItem("user-imgUrl")!
        this.user.roles=[]
        this.user.roles.push(localStorage.getItem("user-role")!)
        //console.log("still login")
      }
    }
    else{
     // console.log("no login acc")
    }

  }
  trySignIn(){
    this.showFormError = true
    this.isLoading=true
    this.login_error=false
    if (this.rf1.valid) {
      // console.log(this.rf1.controls['email'].value)
      // console.log(this.rf1.controls['password'].value)
      this.authService.signIn(this.rf1.controls['email'].value, this.rf1.controls['password'].value).subscribe(
        data => {
          //console.log(data)

          this.user=data.user
          this.user.roles=data.roles
          localStorage.setItem('isLogin', "true")
          localStorage.setItem("user-id",this.user.id)
          localStorage.setItem("user-disName",this.user.displayName)
          localStorage.setItem("user-imgUrl",this.user.imgUrl)
          localStorage.setItem("user-email",this.user.email)
          localStorage.setItem("user-role",this.user.roles[0])
          let a = new Date()
          a.setMinutes(a.getMinutes()+120)
          localStorage.setItem("login-timeOut",formatDate(a, 'MMMM d, y, hh:mm:ss a z', 'en'))
          this.router.navigateByUrl('/', {skipLocationChange: true})
          .then(() => this.router.navigate(['/login']));
          this.isLoading=false
        },
        error => {
          console.log(error)
          this.toast.error(" An error has occurred ! Try again !")
          this.isLoading=false
          this.login_error=true
        }
      )
    }
    else{
      this.toast.error("The submitted data is not valid. Please correct it to continue")
      this.isLoading=false
    }
  }
}
