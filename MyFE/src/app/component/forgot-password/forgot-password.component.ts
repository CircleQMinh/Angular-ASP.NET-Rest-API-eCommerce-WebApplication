import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  rf1!: FormGroup;
  showFormError: boolean = false
  email_send: boolean = false
  isLoading=false
  constructor(private authService: AuthenticationService, private toast: HotToastService) { }

  ngOnInit(): void {
    this.rf1 = new FormGroup({
      email: new FormControl('',
        [Validators.required, Validators.email])
    });
  }

  tryRecover() {
    this.showFormError = true
    this.isLoading=true
    if (this.rf1.valid) {
      this.authService.recoverPassword(this.rf1.controls["email"].value).subscribe(
        data => {
          // console.log(data)
          this.isLoading=false
          this.toast.success("Đã gủi mail xác nhận tới email của bạn! Hãy kiểm tra email để khôi phục tài khoản của bạn.")
          this.signOut()
          this.email_send = true
        },
        error => {
          this.toast.error(error.error.msg)
          this.isLoading=false
        }
      )
    }
    else {
      this.toast.error("Thông tin nhập không hợp lệ!. Hãy chỉnh sửa và gửi lại.")
    }
  }
  signOut() {

    localStorage.removeItem("isLogin")
    localStorage.removeItem("user-id")
    localStorage.removeItem("user-email")
    localStorage.removeItem("login-timeOut")
    localStorage.removeItem("user-disName")
    localStorage.removeItem("user-imgUrl")
    localStorage.removeItem("user-role")

  }
}
