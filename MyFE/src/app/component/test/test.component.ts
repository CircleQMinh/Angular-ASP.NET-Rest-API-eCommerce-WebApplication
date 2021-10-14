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

  myThumbnail="https://res.cloudinary.com/dkmk9tdwx/image/upload/v1629696503/fritos-198624_yqgozm.jpg";
  myFullresImage="https://res.cloudinary.com/dkmk9tdwx/image/upload/v1629696503/fritos-198624_yqgozm.jpg";

  constructor(private http: HttpClient,private authService:AuthenticationService,private orderService:OrderService,
    private toast:HotToastService,private router:Router) { }
  ngOnInit(): void {

  }





}
