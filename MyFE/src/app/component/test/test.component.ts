import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AdminService } from 'src/app/service/admin.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { OrderService } from 'src/app/service/order.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  myThumbnail="https://demo73leotheme.b-cdn.net/prestashop/at_freshio/36-large_default/mug-today-is-a-good-day.jpg";
  myFullresImage="https://demo73leotheme.b-cdn.net/prestashop/at_freshio/36-large_default/mug-today-is-a-good-day.jpg";

  constructor(private http: HttpClient,private authService:AuthenticationService,private orderService:OrderService,
    private toast:HotToastService,private router:Router,private proService:ProductService,private adminService:AdminService) { }

  ngOnInit(): void {

  }

  test(){
    this.adminService.getAuthorizeHttp(localStorage.getItem('JWT_token')).subscribe(
      data=>{
        console.log(data)
        this.toast.success(data.greet)
      }
      ,error=>{
        console.log(error)
        console.log(error.status)
        if(error.status==403){
          this.toast.error('403 : Bạn không có quyền')
        }
        else if(error.status==401){
          this.toast.error('401 : Token không hợp lệ')
        }
    
      }
    )
  }




}
