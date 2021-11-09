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

  tick=3

  constructor(private authService: AuthenticationService,private toast:HotToastService,private router:Router) { }

  ngOnInit(): void {

    this.rf1 = new FormGroup({
      email: new FormControl('',
        [Validators.required]),
      password: new FormControl('',
        [Validators.required]),
    });
    this.authService.getLocalStorage()
    this.user=this.authService.user
    this.isLogin=this.authService.isLogin

    setInterval(()=>{
      this.tick-=1
    },1000)

    setTimeout(()=>{
      if(this.isLogin){
        if(this.user.roles.includes("Administrator")){
          this.router.navigateByUrl('/', {skipLocationChange: true})
          .then(() => this.router.navigate(['/admin']));
        }
        else if(this.user.roles.includes("Shipper")){
          this.router.navigateByUrl('/', {skipLocationChange: true})
          .then(() => this.router.navigate(['/shipper']));
        }
        else{
          if(localStorage.getItem("redirectURL")){
            let reURL = localStorage.getItem("redirectURL")
            localStorage.removeItem("redirectURL")
            this.router.navigateByUrl('/', {skipLocationChange: true})
            .then(() => this.router.navigate([reURL]));
          }
        }
      }
 
    },3000)
    window.scrollTo(0,0)
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
          // console.log(data)
          // console.log(data.token)
          this.user=data.user
          this.user.roles=data.roles
          localStorage.setItem('JWT_token',data.token)
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
          this.toast.error(error.error.msg)
          this.isLoading=false
          this.login_error=true
        }
      )
    }
    else{
      this.toast.error("Thông tin nhập không hợp lệ!")
      this.isLoading=false
    }
  }
}
