import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Order } from 'src/app/class/order';
import { Product } from 'src/app/class/product';
import { User } from 'src/app/class/user';
import { AdminService } from 'src/app/service/admin.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { OrderService } from 'src/app/service/order.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  isCollapsed: boolean = true

  isLogin: boolean = false

  user!: User

  active_tab = "user"

  userList: User[] = []
  pagedUserList: User[] = []
  pageNumberUser = 1
  pageSizeUser = 5
  orderUser = "Id"
  role = "all"

  productList: Product[] = []
  pageNumberProduct = 1
  pageSizeProduct = 5
  orderProduct = "Id"
  category = "all"
  collectionSizeProduct=0

  orderList: Order[] = []
  pageNumberOrder = 1
  pageSizeOrder = 5
  orderOrder = "Id"
  status = 99
  collectionSizeOrder=0

  dashboardInfo = {
    totalOrder: 7,
    totalProduct: 102,
    totalUser: 0
  }


  constructor(private router: Router, private route: ActivatedRoute, private toast: HotToastService, private adminService: AdminService,
    private productService: ProductService, private orderService: OrderService, private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.adminService.getDashboardInfo().subscribe(
      data => {
        this.dashboardInfo=data
        //console.log(this.dashboardInfo)
      },
      error => {
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
    this.getUser()
    this.getProduct()
    this.getOrder()



  }

  onPageSizeCategoryChange(){
    this.pageNumberProduct=1
    this.getProduct()
  }

  getProduct() {
    this.adminService.getProducts(this.category, this.orderProduct, this.pageNumberProduct, this.pageSizeProduct).subscribe(
      data => {
        //console.log(data)
        this.productList=data.result
        this.collectionSizeProduct=data.count

      },
      error => {
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }

  onPageSizeStatusChage(){

    this.pageNumberOrder=1
    this.getOrder()
  }

  getUser() {

    this.pageNumberUser = 1
    this.adminService.getUsers(this.orderUser, this.role).subscribe(
      data => {
        //console.log(data)
        this.userList = data.result
        this.userList.forEach((element, index: number) => {
          element.roles = data.roles[index]
        });
        this.getPagedUserList()
        //console.log(this.userList)
      },
      error => {
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }
  getPagedUserList() {
    this.pagedUserList = []
    for (let i = 0; i < this.pageSizeUser; i++) {
      if (this.userList[i + this.pageSizeUser * (this.pageNumberUser - 1)]) {
        this.pagedUserList.push(this.userList[i + this.pageSizeUser * (this.pageNumberUser - 1)])
      }

    }
  }
  getOrder() {
    this.adminService.getOrders(this.status, this.orderOrder, this.pageNumberOrder, this.pageSizeOrder).subscribe(
      data => {
         console.log(data)
        this.orderList=data.result
        this.collectionSizeOrder=data.count

      },
      error => {
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }
  switchTab(s:string){
    this.active_tab=s
  }

}
