import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.css']
})
export class ConfirmAccountComponent implements OnInit {

  isLoading=false
  constructor(private router:Router,private route:ActivatedRoute,private authService:AuthenticationService,private toast:HotToastService) { }

  ngOnInit(): void {
    let email:string = this.route.snapshot.queryParamMap.get("email")!
    let token:string =this.route.snapshot.queryParamMap.get("token")!
    // console.log(email)
    // console.log(token)
    if(email&&token){
      this.isLoading=true
      this.authService.comfirmAccount(email,token).subscribe(
        data=>{

          this.isLoading=false
          // console.log(data)
          this.toast.success("Xác thực tài khoản thành công!")
          this.toast.info("Điều hướng về trang đăng nhập!")
          this.router.navigateByUrl("/login");
          
        },
        error=>{
          this.toast.error("Xác thực không thành công!")
          this.toast.info("Điều hướng về trang chủ!")
          this.router.navigateByUrl("/home");
        }
      )
    }
    else{
      this.router.navigateByUrl("/home");
    }
   

  }

}
