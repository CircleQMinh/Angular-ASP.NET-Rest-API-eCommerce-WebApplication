import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  id=25
  totalPrice=20000
  signature=""
  payUrl=""

  constructor(private http: HttpClient,private authService:AuthenticationService,private orderService:OrderService,
    private toast:HotToastService,private router:Router) { }
  ngOnInit(): void {

  }


  payWithMomo(){
    this.orderService.getPaymentSig(this.id,this.totalPrice).subscribe(
      data=>{
        console.log(data)
        this.signature=data.sig
        console.log(this.signature)
        this.getPayUrl()
      },
      error=>{
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }

  getPayUrl(){
    this.orderService.getPaymentUrl(this.id.toString(),this.totalPrice.toString(),this.signature).subscribe(
      data=>{
        console.log(data)
        this.payUrl=data.payUrl
        console.log(this.payUrl)
        //this.router.navigateByUrl(this.payUrl)
        window.location.href = this.payUrl

      },error=>{
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }


}
