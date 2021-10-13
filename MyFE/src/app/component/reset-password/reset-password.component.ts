import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  rf1!: FormGroup;
  showFormError: boolean = false
  email_send: boolean = false
  email!: string
  token!: string
  isLoading=false
  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthenticationService, private toast: HotToastService) { }

  ngOnInit(): void {
    this.rf1 = new FormGroup({
      password: new FormControl('',
        [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')])
    });

    this.email = this.route.snapshot.queryParamMap.get("email")!
    this.token = this.route.snapshot.queryParamMap.get("token")!
    console.log(this.email)
    console.log(this.token)
    if (this.email && this.token) {

    }
    else {
      this.router.navigateByUrl("/home");
    }
  }
  tryReset() {
    this.showFormError = true
    if (this.rf1.valid) {
      this.isLoading=true
      this.authService.comfirmPassword(this.email,this.token,this.rf1.controls['password'].value).subscribe(
        data=>{
          console.log(data)
          this.toast.success("Đổi mật khẩu thành công!")
          this.toast.info("Điều hướng về trang đăng nhập!")
          this.router.navigateByUrl("/login");
        },
        error=>{
          console.log(error)
          this.toast.error(" An error has occurred ! Try again !")
          this.isLoading=false
        }
      )
    }
    else {
      this.toast.error("Thông tin nhập không hợp lệ!. Hãy chỉnh sửa và gửi lại.")
    }
  }
}
