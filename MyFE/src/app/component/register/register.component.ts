import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { User } from 'src/app/class/user';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  rf1!: FormGroup;

  showFormError: boolean = false
  email_exist_error: boolean = false
  unknown_error: boolean = false
  username_exist_error: boolean = false

  id: string = ""

  isRegistered:boolean=false
  isLoading: boolean = false

  step=1

  isLogin: boolean = false

  user!: User


  constructor(private authService: AuthenticationService,private toast:HotToastService) { }

  ngOnInit(): void {

    this.rf1 = new FormGroup({
      email: new FormControl('',
        [Validators.required, Validators.email]),
      password: new FormControl('',
        [Validators.required, Validators.minLength(8),Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]),
      username: new FormControl('',
        [Validators.required, Validators.minLength(3)]),
      phone: new FormControl("",
        [Validators.required,Validators.pattern('[- +()0-9]+')])
    });
    this.authService.getLocalStorage()
    this.user=this.authService.user
    this.isLogin=this.authService.isLogin
  }

  trySignUp(){
    this.isLoading = true
    this.showFormError=true
    console.log("submit")

    if (this.rf1.valid) {
      // console.log(this.rf1.controls['email'].value)
      // console.log(this.rf1.controls['password'].value)
      // console.log(this.rf1.controls['username'].value)
      // console.log(this.rf1.controls['phone'].value)
      this.authService.signUp(this.rf1.controls['email'].value,this.rf1.controls['password'].value,
      this.rf1.controls['username'].value,this.rf1.controls['phone'].value).subscribe(
        data=>{
          this.isRegistered=true
          this.toast.success("Kiểm tra email của bạn để xác thực tài khoản!")
          this.isLoading=false
        },
        error=>{

          this.toast.error(error.error.msg)
          this.unknown_error=true
          this.isLoading=false
        }
      )
     
    }
    else{
      this.toast.error("Thông tin nhập không hợp lệ!. Hãy chỉnh sửa và gửi lại.")
      this.isLoading=false
    }
  }


  
  delay(ms:number){
    setTimeout(()=>{
      this.isLoading=false
    },ms)
  }

}
