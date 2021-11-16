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

  isDisconnect=false

  autoInterval:any

  constructor(private authService: AuthenticationService, private toast: HotToastService, private router: Router,
    private route: ActivatedRoute, private orderService: OrderService, private modalService: NgbModal,private cartService:CartService) { }

  ngOnInit(): void {
    this.userID = this.route.snapshot.paramMap.get("id")
    //console.log(this.userID)
    this.authService.getLocalStorage()
    this.user=this.authService.user
    this.isLogin=this.authService.isLogin

    if (!this.isLogin) {
      this.router.navigateByUrl("/login")
      this.toast.info("Phiên đăng nhập hết hạn, xin hãy đăng nhập lại!")
    }
    if (this.user.id != this.userID) {
      this.router.navigateByUrl("/error")
    }
    window.scrollTo(0, 0)
    this.isLoading = true
    this.autoInterval=setInterval(()=>{
      this.getUserInfo()
    },5000)
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.autoInterval) {
      clearInterval(this.autoInterval);
      console.log("Xóa interval profile!")
    }
  }
  getUserInfo() {
    this.authService.getUserInfo(this.userID).subscribe(
      data => {
        //console.log(data)
        
        this.userInfo = data.user
        this.userInfo.roles = data.roles
        //console.log(this.userInfo)
        // this.getOrderDetails()
        // this.getPagedOrder()
        // this.getPagedFavProduct()
        //console.log(this.userInfo)
        localStorage.setItem("user-info",JSON.stringify(this.userInfo))
        this.isLoading = false
        this.isDisconnect=false
      },
      error => {
        console.log(error)
        this.isDisconnect=true
        //this.router.navigateByUrl("/error")
        //this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }

  signOut() {
    let a = this.router.url
    this.authService.signOut()
    this.isLogin = this.authService.isLogin
    this.user=this.authService.user
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigateByUrl(a))
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

  randomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
