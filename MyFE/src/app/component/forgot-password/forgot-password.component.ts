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
          this.toast.success("Check your email to complete the password-reset process!")
          this.email_send = true
        },
        error => {
          this.toast.error(" An error has occurred ! Try again !")
          this.isLoading=false
        }
      )
    }
    else {
      this.toast.error("The submitted data is not valid. Please correct it to continue")
    }
  }
}
