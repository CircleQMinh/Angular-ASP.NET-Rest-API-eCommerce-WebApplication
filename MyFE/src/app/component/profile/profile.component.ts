import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotToastService } from '@ngneat/hot-toast';
import { OrderDetail } from 'src/app/class/order-detail';
import { User } from 'src/app/class/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { OrderService } from 'src/app/service/order.service';
import { Order } from 'src/app/class/order';
import { Product } from 'src/app/class/product';
import { CartService } from 'src/app/service/cart.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  selectedTab: any = "profile"

  user!: User
  userID: any
  isLogin: boolean = false

  userInfo!: User

  isLoading: boolean = false
  isUpdateProfile: boolean = false

  urlIMG: any = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/450px-No_image_available.svg.png"
  uploadedUrlImg: any
  msg = "";
  newName!: string
  newPhone!: string

  viewOrderDetails: boolean = false
  currentOrder!: Order
  currentOrderDetails: OrderDetail[] = []
  currentOrderShippingInfo:any


  pageSizeOrder=5
  pageNumberOrder=1
  pagedOrder:Order[]=[]

  pageSizeOrderDetail=5
  pageNumberOrderDetails=1
  pagedOrderDetails:OrderDetail[]=[]

  pageSizeFav=4
  pageNumberFav=1
  pagedFavProduct:Product[]=[]


  constructor(private authService: AuthenticationService, private toast: HotToastService, private router: Router,
    private route: ActivatedRoute, private orderService: OrderService, private modalService: NgbModal,private cartService:CartService) { }

  ngOnInit(): void {
    this.userID = this.route.snapshot.paramMap.get("id")
    //console.log(this.userID)
    this.getLocalStorage()
    if (!this.isLogin) {
      this.router.navigateByUrl("/login")
      this.toast.info("Phiên đăng nhập hết hạn, xin hãy đăng nhập lại!")
    }
    if (this.user.id != this.userID) {
      this.router.navigateByUrl("/error")
    }
    window.scrollTo(0, 0)
    this.getUserInfo()

  }
  getUserInfo() {
    this.isLoading = true
    this.authService.getUserInfo(this.userID).subscribe(
      data => {
        //console.log(data)
        
        this.userInfo = data.user
        this.userInfo.roles = data.roles
        //console.log(this.userInfo)
        this.getOrderDetails()
        this.getPagedOrder()
        this.getPagedFavProduct()
        console.log(this.userInfo)
        localStorage.setItem("user-info",JSON.stringify(this.userInfo))
        this.isLoading = false
      },
      error => {
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }
  getOrderDetails() {
    this.userInfo.orders.forEach(element => {
      this.orderService.getOrderDetails(element.id).subscribe(
        data => {
          //console.log(data)
          element.orderDetails = data.orderDetails
          //console.log(this.userInfo)
        },
        error => {
          console.log(error)
          this.toast.error(" An error has occurred ! Try again !")
        }
      )
    });

  }
  signOut() {
    this.isLogin = false
    let a = this.router.url
    localStorage.removeItem("isLogin")
    localStorage.removeItem("user-id")
    localStorage.removeItem("user-email")
    localStorage.removeItem("login-timeOut")
    localStorage.removeItem("user-disName")
    localStorage.removeItem("user-imgUrl")
    localStorage.removeItem("user-role")
    localStorage.removeItem("user-info")
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigateByUrl(a))
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
  openChangeModal(changeIMG: any) {
    this.newName = this.userInfo.displayName
    this.newPhone = this.userInfo.phoneNumber
    this.urlIMG = this.userInfo.imgUrl
    this.modalService.open(changeIMG, { ariaLabelledBy: 'modal-basic-title' })
  }
  selectFile(event: any) { //Angular 11, for stricter type
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      this.msg = 'You must select an image';
      return;
    }

    var mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.msg = "Only images are supported";
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      this.msg = "";
      this.urlIMG = reader.result;
    }
  }
  saveProfile() {
    this.upLoadAndUpdateProfile()

  }
  upLoadAndUpdateProfile() {
    this.isUpdateProfile = true
    if (this.urlIMG == this.userInfo.imgUrl) {
      this.uploadedUrlImg = this.urlIMG
      this.updateProfile()
    }
    else {
      this.authService.upLoadIMG(this.urlIMG).subscribe(
        data => {
          //console.log(data)
          this.uploadedUrlImg = data.secure_url
          //console.log(this.uploadedUrlImg)
          this.updateProfile()
        },
        error => {
          console.log(error)
        }
      )
    }

  }
  updateProfile() {
    this.authService.updateProfile(this.uploadedUrlImg, this.newPhone, this.newName, this.userInfo.id).subscribe(
      data => {
        //console.log(data)
        this.modalService.dismissAll()
        this.router.navigateByUrl('/', { skipLocationChange: true })
          .then(() => this.router.navigate(['/profile/' + this.userInfo.id]));
      },
      error => {
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }
  switchTab(tab: any) {
    window.scrollTo(0, 0)
    this.selectedTab = tab
  }

  viewDetail(o: Order, od: OrderDetail[]) {

    this.currentOrder = o
    this.currentOrderDetails = od
    this.currentOrderShippingInfo=null!
    if(this.currentOrder.status==2||this.currentOrder.status==3){
      this.isLoading=true
      this.orderService.getShippingInfo(this.currentOrder.id).subscribe(
        data=>{
          this.currentOrderShippingInfo=data.result
          console.log(this.currentOrderShippingInfo)
          this.isLoading=false
        },
        error=>{
          this.isLoading=false
          console.log(error)
          this.toast.error(" An error has occurred ! Try again !")
        }
      )

    }
    this.viewOrderDetails = true
  
  }

  getPagedOrder() {
    this.pagedOrder = []
    for (let i = 0; i < this.pageSizeOrder; i++) {
      if(this.userInfo.orders[i + this.pageSizeOrder * (this.pageNumberOrder - 1)]){
        this.pagedOrder.push(this.userInfo.orders[i + this.pageSizeOrder * (this.pageNumberOrder - 1)])
      }

    }
  }
  getPagedOrderDetails() {
    this.pagedOrderDetails = []
    for (let i = 0; i < this.pageSizeOrderDetail; i++) {
      if(this.currentOrderDetails[i + this.pageSizeOrderDetail * (this.pageNumberOrderDetails - 1)]){
        this.pagedOrderDetails.push(this.currentOrderDetails[i + this.pageSizeOrderDetail * (this.pageNumberOrderDetails - 1)])
      }
    }
  }

  getPagedFavProduct() {
    this.pagedFavProduct = []
    for (let i = 0; i < this.pageSizeFav; i++) {
      if(this.userInfo.favoriteProducts[i + this.pageSizeFav * (this.pageNumberFav - 1)]){
        this.pagedFavProduct.push(this.userInfo.favoriteProducts[i + this.pageSizeFav * (this.pageNumberFav - 1)])
      }

    }
  }

  randomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  addToFav(pro:Product){
    this.toast.info("This product is already on your favorite list")

  }
  removeFromFav(pro:Product){
    this.authService.removeFromFav(this.userInfo.id,pro.id).subscribe(
      data=>{
        if(data.success){
          this.toast.success("Product remove from favorite list successfully")
          //console.log(this.userInfo.favoriteProducts)
          this.removeFromLocal(pro.id)
          //console.log(this.userInfo.favoriteProducts)
        }
        else{
          this.toast.info("This product is not on your favorite list")
        }
      },
      error=>{
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }
  removeFromLocal(id:number){


    for(let i=0;i<this.userInfo.favoriteProducts.length;i++){
      if(this.userInfo.favoriteProducts[i].id==id){
        this.userInfo.favoriteProducts.splice(i,1)
        break
      }
    }
    this.getPagedFavProduct()
  }
  addToCart(pro:Product){
    this.cartService.addToCart(pro)
    this.toast.success("Product added to cart!")
  }
}
