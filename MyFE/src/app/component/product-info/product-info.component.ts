import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotToastService } from '@ngneat/hot-toast';
import { Product } from 'src/app/class/product';
import { PromotionInfo } from 'src/app/class/promotion-info';
import { Review } from 'src/app/class/review';
import { User } from 'src/app/class/user';
import { AdminService } from 'src/app/service/admin.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CartService } from 'src/app/service/cart.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.css']
})
export class ProductInfoComponent implements OnInit {

  product!: Product
  randomProducts: Product[] = []
  id!: string
  isLoading = false

  isLogin: boolean = false
  user!: User

  rating!: number
  review: string = ""

  fivestar: number = 0
  fourstar: number = 0
  threestar: number = 0
  twostar: number = 0
  onestar: number = 0
  avgRating: number = 0

  alreadyReview = false
  reviewedContent = {
    userId: "",
    imgUrl: "",
    username: "",
    date: "",
    star: 0,
    content: "",
  }
  reWriteReview = false

  pageReview = 1
  pageSizeReview = 3
  pagedReview: Review[] = []

  sort = "d"
  ratingFilter = 0

  displayCategory = ""

  promoInfo!:PromotionInfo

  isRemovingReview=false
  review_owner_id=""

  constructor(private router: Router, private route: ActivatedRoute, private proService: ProductService, private toast: HotToastService
    , private cartService: CartService, private authService: AuthenticationService,private modalService:NgbModal,private adminService:AdminService) { }

  ngOnInit(): void {
    window.scrollTo(0, 0)
    this.authService.getLocalStorage()
    this.user = this.authService.user
    this.isLogin = this.authService.isLogin
    this.route.paramMap.subscribe(
      params => {
        this.isLoading = true
        window.scrollTo(0, 0)
        this.updateInfo()
        setInterval(()=>{
          this.refreshInfo()
         // console.log(this.user)
        },1000)
      }
    )
  }

  sortChange() {
    if (this.sort == "d") {
      this.product.reviews.sort((a, b) => {
        var c: any = new Date(a.date);
        var d: any = new Date(b.date);
        return d - c
      })
    }
    else {
      this.product.reviews.sort((a, b) => {
        var c: any = new Date(a.date);
        var d: any = new Date(b.date);
        return c - d
      })
    }
    this.getPagedReviews()
  }

  getPagedReviews() {
    this.pagedReview = []
    for (let i = 0; i < this.pageSizeReview; i++) {
      if (this.product.reviews[i + this.pageSizeReview * (this.pageReview - 1)]) {
        this.pagedReview.push(this.product.reviews[i + this.pageSizeReview * (this.pageReview - 1)])
      }

    }
  }

  refreshInfo() {
    this.id = this.route.snapshot.paramMap.get("id")!
    this.authService.getLocalStorage()
    this.user = this.authService.user
    this.isLogin = this.authService.isLogin

    this.proService.getProductInfo(this.id).subscribe(
      data => {
        //console.log(data)
        this.product = data.result
        if(this.product.status==0){
          this.router.navigateByUrl("/error")
        }
        this.product.reviews = data.reviews
        //console.log(this.product)
        this.product.tags=data.tags
        this.displayCategory = this.product.category.name
        this.promoInfo=data.promoInfo
        this.product.promoInfo=data.promoInfo
        this.getProductRating()
        this.product.reviews.sort((a, b) => {
          var c: any = new Date(a.date);
          var d: any = new Date(b.date);
          return d - c
        })
        this.getPagedReviews()
        this.checkIfReviewed()

        //console.log(this.alreadyReview)

        this.isLoading = false
      },
      error => {
        this.toast.error("Kết nối với API không được!")
        console.log(error)
      }
    )
  }

  updateInfo() {
    this.id = this.route.snapshot.paramMap.get("id")!
    this.authService.getLocalStorage()
    this.user = this.authService.user
    this.isLogin = this.authService.isLogin

    this.proService.getProductInfo(this.id).subscribe(
      data => {
        //console.log(data)
        this.product = data.result
        if(this.product.status==0){
          this.router.navigateByUrl("/error")
        }
        this.product.reviews = data.reviews
        this.product.tags=data.tags
        this.displayCategory = this.product.category.name
        this.promoInfo=data.promoInfo
        // console.log(this.product)
        this.getRandomProduct()
        this.getProductRating() ///khác chỗ này

        this.product.reviews.sort((a, b) => {
          var c: any = new Date(a.date);
          var d: any = new Date(b.date);
          return d - c
        })
        this.getPagedReviews()
        this.checkIfReviewed()

        //console.log(this.alreadyReview)

        this.isLoading = false
      },
      error => {
        this.toast.error("Kết nối với API không được!")
        console.log(error)
      }
    )
  }

  getDisplayCategory(cate: string): string {
    switch (cate) {
      case "Fruit":
        return "Trái cây"
      case "Vegetable":
        return "Rau củ"
      case "Snack":
        return "Snack"
      case "Confectionery":
        return "Bánh kẹo"
      case "CannedFood":
        return "Đồ hộp"
      case "AnimalProduct":
        return "Thịt tươi sống"
      default:
        return ""
    }
  }

  getProductRating() {
    this.onestar=0
    this.twostar=0
    this.threestar=0
    this.fourstar=0
    this.fivestar=0
    this.product.reviews.forEach(element => {
      switch (element.star) {
        case 1:
          this.onestar++
          break
        case 2:
          this.twostar++
          break
        case 3:
          this.threestar++
          break
        case 4:
          this.fourstar++
          break
        case 5:
          this.fivestar++
          break
      }
    });
    this.avgRating = (this.fivestar * 5 + this.fourstar * 4 + this.threestar * 3 + this.twostar * 2 + this.onestar) / this.product.reviews.length
  }

  checkIfReviewed() {
    if (this.isLogin) {
      this.product.reviews.forEach(element => {
        if (element.user.id == this.user.id) {
          this.alreadyReview = true
          this.reviewedContent.userId = element.user.id
          this.reviewedContent.username = element.user.displayName
          this.reviewedContent.content = element.content
          this.reviewedContent.star = element.star
          this.reviewedContent.date = element.date
          this.reviewedContent.imgUrl = element.user.imgUrl
          //console.log(this.reviewedContent)
        }
      });
    }
  }

  goToProductPage(id: number) {
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([`/product/${id}`]));
  }
  getRandomProduct() {

    this.randomProducts = []
    this.proService.getRandomProduct(this.product.id,this.product.category.name,5).subscribe(
      data=>{
        this.randomProducts=data.result
      },
      error=>{

      }
    )
  }
  randomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  addToFav(pro: Product) {
    if (localStorage.getItem("isLogin")) {
      this.authService.addToFav(localStorage.getItem('user-id')!, pro.id).subscribe(
        data => {
          if (data.success) {
            this.toast.success("Sản phẩm đã thêm vào yêu thích")
          }
          else {
            this.toast.info("Sản phẩm đã nằm trong yêu thích")
          }
        },
        error => {
          console.log(error)
          this.toast.error("Có lỗi xảy ra ! Xin hãy thử lại !")
        }
      )
    }
    else {
      this.toast.info("Đăng nhập để thêm sản phẩm vào yêu thích")
    }

  }
  addToCart(pro: Product) {
    this.cartService.addToCart(pro)
    //this.toast.success("Đã thêm sản phẩm vào giỏ!")
  }

  addReview() {
    if (this.rating == undefined) {
      this.toast.error("Bạn chưa đánh giá sản phẩm!")
    }
    else {
      if (this.review.trim().length == 0) {
        this.toast.error("Nhận xét không được trống!")
      }
      else {

        // console.log(this.rating)
        // console.log(this.review)
        // console.log(this.product.id)
        // console.log(this.user.id)

        let r: Review = new Review
        r.content = this.review
        r.star = this.rating
        r.user = this.user
        r.date = formatDate(Date.now(), "dd-MM-yyyy HH:mm:ss", "en")

        this.authService.addReview(r.user.id, this.product.id, r.content, r.star, r.date).subscribe(
          data => {
            if (!data.update) {

              this.toast.success("Đã đăng nhận xét!")
            }
            else {
              this.toast.success("Đã chỉnh sửa nhận xét!")
            }
            this.addReviewLocal(r)
          },
          error => {
            console.log(error)
            this.toast.error("Có lỗi xảy ra ! Xin hãy thử lại !")
          }
        )

      }
    }
  }
  addReviewLocal(r: Review) {

    // let isExist = false
    // let index = 0
    // for (let i = 0; i < this.product.reviews.length; i++) {
    //   let item = this.product.reviews[i]
    //   if (item.user.id == r.user.id) {
    //     isExist = true
    //     index = i
    //     break
    //   }
    // }
    // if (isExist) {
    //   this.product.reviews[index].content = r.content
    //   this.product.reviews[index].star = r.star
    //   this.product.reviews[index].date = r.date
    // }
    // else {
    //   this.product.reviews.push(r)
    //   this.checkIfReviewed()
    //   this.sortChange()
    // }
    // this.checkIfReviewed()
  }
  
  toNumber(string:string):number{
    return Number(string)
  }

  searchByTag(t:any){
    localStorage.setItem("searchTag",t)
    window.open("/#/search")
  }
  openDeleteReViewModal(modal: any) {
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
  }
  removeReview(){
    //this.toast.info("Đã xóa review của bạn!")
    this.isRemovingReview=true
    this.authService.removeReview(this.reviewedContent.userId,this.product.id).subscribe(
      data=>{
        this.toast.info("Đã xóa review của bạn!")
        this.isRemovingReview=false
        this.alreadyReview=false
        this.modalService.dismissAll()
      },
      error=>{
        this.toast.error("Có lỗi xảy ra! Xin hãy thử lại!")
        this.isRemovingReview=false
      }
    )
  }
  openAdminDeleteReViewModal(modal: any,userID:any) {
    this.review_owner_id=userID
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
  }
  removeUserReview(){
    this.isRemovingReview=true
    this.adminService.removeReview(this.review_owner_id,this.product.id).subscribe(
      data=>{
        this.toast.info("Đã xóa review!")
        this.isRemovingReview=false
        this.alreadyReview=false
        this.modalService.dismissAll()
      },
      error=>{
        this.toast.error("Có lỗi xảy ra! Xin hãy thử lại!")
        this.isRemovingReview=false
      }
    )
  }
  isAdminUser():boolean{
    if(this.isLogin){
      if(this.user.roles.includes("Administrator")){
        return true
      }
      return false
    }
    else{
      return false
    }
  }

  alertSoldOut(){
    this.toast.info("Sản phẩm đã hết hàng!")
  }
}
