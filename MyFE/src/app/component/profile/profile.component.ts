import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotToastService } from '@ngneat/hot-toast';
import { User } from 'src/app/class/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  selectedTab:any="profile"

  user!: User
  userID: any
  isLogin: boolean = false

  userInfo!: User

  isLoading: boolean = false
  isUpdateProfile : boolean = false

  urlIMG: any = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/450px-No_image_available.svg.png"
  uploadedUrlImg: any
  msg = "";
  newName!:string
  newPhone!:string


  constructor(private authService: AuthenticationService, private toast: HotToastService, private router: Router,
    private route: ActivatedRoute, private orderService: OrderService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.userID = this.route.snapshot.paramMap.get("id")
    //console.log(this.userID)
    this.getLocalStorage()
    if(!this.isLogin){
      this.router.navigateByUrl("/login")
    }
    if(this.user.id!=this.userID){
      this.router.navigateByUrl("/error")
    }
    window.scrollTo(0, 0)
    this.getUserInfo()
  }
  getUserInfo() {
    this.isLoading = true
    this.authService.getUserInfo(this.userID).subscribe(
      data => {
        // console.log(data)
        this.userInfo = data.user
        this.userInfo.roles = data.roles
        //console.log(this.userInfo)
        this.getOrderDetails()
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

  getLocalStorage() {
    if (localStorage.getItem("isLogin")) {

      let timeOut = new Date(localStorage.getItem("login-timeOut")!)
      let timeNow = new Date()

      if (timeOut.getTime() < timeNow.getTime()) {
        //console.log("time out remove key")
        localStorage.removeItem("isLogin")
        localStorage.removeItem("user-id")
        localStorage.removeItem("user-email")
        localStorage.removeItem("login-timeOut")
        localStorage.removeItem("user-disName")
      }
      else {
        this.isLogin = Boolean(localStorage.getItem('isLogin'))
        this.user = new User
        this.user.id = localStorage.getItem('user-id')!
        this.user.email = localStorage.getItem("user-email")!
        this.user.displayName = localStorage.getItem("user-disName")!
        //console.log("still login")
      }
    }
    else {
      // console.log("no login acc")
    }

  }
  openChangeModal(changeIMG: any) {
    this.newName=this.userInfo.displayName
    this.newPhone=this.userInfo.phoneNumber
    this.urlIMG=this.userInfo.imgUrl
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
    this.isUpdateProfile=true
    if(this.urlIMG==this.userInfo.imgUrl){
      this.uploadedUrlImg=this.urlIMG
      this.updateProfile()
    }
    else{
      this.authService.upLoadIMG(this.urlIMG).subscribe(
        data => {
          //console.log(data)
          this.uploadedUrlImg=data.secure_url
          //console.log(this.uploadedUrlImg)
          this.updateProfile()
        },
        error => {
          console.log(error)
        }
      )
    }
  
  }
  updateProfile(){
    this.authService.updateProfile(this.uploadedUrlImg,this.newPhone,this.newName,this.userInfo.id).subscribe(
      data=>{
        //console.log(data)
        this.modalService.dismissAll()
        this.router.navigateByUrl('/', {skipLocationChange: true})
          .then(() => this.router.navigate(['/profile/'+this.userInfo.id]));
      },
      error=>{
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }
  switchTab(tab:any){
    window.scrollTo(0,0)
    this.selectedTab=tab
  }

}
