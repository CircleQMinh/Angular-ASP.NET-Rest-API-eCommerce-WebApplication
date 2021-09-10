import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotToastService } from '@ngneat/hot-toast';
import { Order } from 'src/app/class/order';
import { User } from 'src/app/class/user';
import { AdminService } from 'src/app/service/admin.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { OrderService } from 'src/app/service/order.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-shipper',
  templateUrl: './shipper.component.html',
  styleUrls: ['./shipper.component.css']
})
export class ShipperComponent implements OnInit {

  user!: User
  isLogin: boolean = false

  active_tab="av"
  isLoading=false
  isCollapsed: boolean = true

  isGettingOrderDetail=false
  isAcceptingOrder=false
  isFinishingOrder=false

  pageNumberOrder = 1
  pageSizeOrder = 5
  orderOrder = "Id"
  orderDirOrder: any = "Asc"
  collectionSizeOrder=0

  orderList:Order[]=[]
  selectedOrder!:Order

  rf1!: FormGroup;


  constructor(private router: Router, private route: ActivatedRoute, private toast: HotToastService, private adminService: AdminService,
    private productService: ProductService, private orderService: OrderService, private authService: AuthenticationService,
    private modalService: NgbModal) { }

  ngOnInit(): void {

    this.rf1 = new FormGroup({
      status: new FormControl('',
      [Validators.required]),
    note: new FormControl('',
      [Validators.required])
    });


    this.isLoading=true
    this.getLocalStorage()
    if(!this.isLogin){
      this.router.navigateByUrl("/error")
    }
    else{
      this.getUserInfo()
      
    }
  }
  switchTab(s: string) {
    this.active_tab = s
    if(this.active_tab=="av"){
      this.getAvailableOrder()
    }
    if(this.active_tab=="dv"){
      this.getAcceptedOrder()
    }

    if(this.active_tab=="his"){
      this.getOrderHistory()
    }
  }
  getUserInfo() {
    this.isLoading = true
    this.authService.getUserInfo(this.user.id).subscribe(
      data => {
        //console.log(data)
        
        this.user = data.user
        this.user.roles = data.roles
        if(this.user.roles[0]!="Shipper"){
          this.router.navigateByUrl("/error")
        }
        //console.log(this.user)
        this.getAvailableOrder()
        this.isLoading = false
      },
      error => {
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }
  signOut() {
    this.isLogin = false
    localStorage.removeItem("isLogin")
    localStorage.removeItem("user-id")
    localStorage.removeItem("user-email")
    localStorage.removeItem("login-timeOut")
    localStorage.removeItem("user-disName")
    localStorage.removeItem("user-imgUrl")
    localStorage.removeItem("user-role")
    this.router.navigateByUrl('/home')
  }
  getAvailableOrder(){
    this.isLoading=true
    this.orderService.getAvailableOrder(1,this.orderOrder,this.pageNumberOrder,this.pageSizeOrder,this.orderDirOrder).subscribe(
      data=>{
        this.orderList = data.result
        this.collectionSizeOrder = data.count
        this.isLoading = false
      },
      error=>{
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }
  onAvailableOrderFilterChange(){
    this.pageNumberOrder=1
    this.getAvailableOrder()
  }
  getAcceptedOrder(){
    this.orderService.getAcceptedOrder(this.user.id).subscribe(
      data=>{
        // console.log(data)
        // console.log(data.sil)
        // console.log(data.sil[0])
        this.orderList=[]
        for(let i=0;i<data.sil.length;i++){
          this.orderList.push(data.sil[i].order)
        }
       
       
      },
      error=>{
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }
  getOrderHistory(){
    this.orderService.getFinishedOrder(this.user.id).subscribe(
      data=>{
        this.orderList=[]
        for(let i=0;i<data.sil.length;i++){
          this.orderList.push(data.sil[i].order)
        }
      },
      error=>{
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }

  getLocalStorage() {
    if(localStorage.getItem("isLogin")){
   
      let timeOut= new Date(localStorage.getItem("login-timeOut")!)
      let timeNow = new Date()
  
      if(timeOut.getTime()<timeNow.getTime()){
        //console.log("time out remove key")
        localStorage.removeItem("isLogin")
        localStorage.removeItem("user-id")
        localStorage.removeItem("user-email")
        localStorage.removeItem("login-timeOut")
        localStorage.removeItem("user-disName")
        localStorage.removeItem("user-imgUrl")
        localStorage.removeItem("user-role")
      }
      else{
        this.isLogin = Boolean(localStorage.getItem('isLogin'))
        this.user=new User
        this.user.id = localStorage.getItem('user-id')!
        this.user.email = localStorage.getItem("user-email")!
        this.user.displayName = localStorage.getItem("user-disName")!
        this.user.imgUrl=localStorage.getItem("user-imgUrl")!
        this.user.roles=[]
        this.user.roles.push(localStorage.getItem("user-role")!)
        //console.log("still login")
      }
    }
    else{
     // console.log("no login acc")
    }

  }




  openOrderInfoModal(info: any, o: Order) {
    this.isGettingOrderDetail = true
    this.selectedOrder = o
    this.orderService.getOrderDetails(o.id).subscribe(
      data => {
        this.selectedOrder.orderDetails = data.orderDetails
       
        this.isGettingOrderDetail = false
      },
      error => {
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
    this.modalService.open(info, { ariaLabelledBy: 'modal-basic-title' })
  }
  openAcceptOrderInfoModal(info: any, o: Order) {
    this.selectedOrder = o
    this.modalService.open(info, { ariaLabelledBy: 'modal-basic-title' })
  }
  acceptOrder(){
    this.isAcceptingOrder=true
    this.orderService.acceptOrder(this.user.id,this.selectedOrder.id).subscribe(
      data=>{

        this.getAvailableOrder()
        this.toast.success("You accept this order!")
        this.isAcceptingOrder=false
        this.modalService.dismissAll()
      },
      error=>{
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }
  openFinishOrderInfoModal(info: any, o: Order) {
    this.selectedOrder = o
    this.rf1.controls["note"].setValue("Successful delivery!")
    this.rf1.controls["status"].setValue(3)
    this.modalService.open(info, { ariaLabelledBy: 'modal-basic-title' })
  }

  finishOrder(){
    this.isAcceptingOrder=true
    let today = formatDate(Date.now(), 'dd-MM-yyyy hh:mm:ss', 'en');
    this.orderService.finishOrder(this.user.id,this.selectedOrder.id,this.rf1.controls["status"].value,
    today,this.rf1.controls["note"].value).subscribe(
      data=>{

        this.getAcceptedOrder()
        this.toast.success("You finish this order!")
        this.isAcceptingOrder=false
        this.modalService.dismissAll()
      },
      error=>{
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }
}
