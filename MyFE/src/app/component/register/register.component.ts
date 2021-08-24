import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
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
  }

  trySignUp(){
    this.isLoading = true
    this.showFormError=true
    console.log("submit")

    if (this.rf1.valid) {
      console.log(this.rf1.controls['email'].value)
      console.log(this.rf1.controls['password'].value)
      console.log(this.rf1.controls['username'].value)
      console.log(this.rf1.controls['phone'].value)
      this.authService.signUp(this.rf1.controls['email'].value,this.rf1.controls['password'].value,
      this.rf1.controls['username'].value,this.rf1.controls['phone'].value).subscribe(
        data=>{
          this.isRegistered=true
          this.toast.success("Check your email to complete the sign-up process!")
          this.isLoading=false
        },
        error=>{
          this.toast.error(" An error has occurred ! Try again !")
          this.unknown_error=true
          this.isLoading=false
        }
      )
     
    }
    else{
      this.toast.error("The submitted data is not valid. Please correct it to continue")
      this.isLoading=false
    }
  }
  delay(ms:number){
    setTimeout(()=>{
      this.isLoading=false
    },ms)
  }
}
