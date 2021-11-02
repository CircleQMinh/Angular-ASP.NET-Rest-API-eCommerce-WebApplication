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



  goToSearch(cate:any){
    localStorage.setItem("searchCate",cate)
    this.router.navigateByUrl("/search")
  }



}
