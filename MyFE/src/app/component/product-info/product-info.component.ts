import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Product } from 'src/app/class/product';
import { Review } from 'src/app/class/review';
import { User } from 'src/app/class/user';
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
    userId:"",
    imgUrl:"",
    username:"",
    date:"",
    star:0,
    content:"",
  }
  reWriteReview=false

  pageReview=1
  pageSizeReview=3
  pagedReview:Review[]=[]

  sort="d"
  ratingFilter=0


  constructor(private router: Router, private route: ActivatedRoute, private proService: ProductService, private toast: HotToastService
    , private cartService: CartService, private authService: AuthenticationService) { }

  ngOnInit(): void {
    window.scrollTo(0, 0)
    this.getLocalStorage()
    this.route.paramMap.subscribe(
      params => {
        this.updateInfo()
        window.scrollTo(0, 0)
      }
    )




  }

  sortChange(){
    if(this.sort=="d"){
      this.product.reviews.sort((a, b) =>{
        var c:any = new Date(a.date);
        var d:any = new Date(b.date);
        return d-c})
    }
    else{
      this.product.reviews.sort((a, b) =>{
        var c:any = new Date(a.date);
        var d:any = new Date(b.date);
        return c-d})
    }
    this.getPagedReviews()
  }

  getPagedReviews() {
    this.pagedReview = []
    for (let i = 0; i < this.pageSizeReview; i++) {
      if(this.product.reviews[i + this.pageSizeReview * (this.pageReview - 1)]){
        this.pagedReview.push(this.product.reviews[i + this.pageSizeReview * (this.pageReview - 1)])
      }

    }
  }


  updateInfo() {
    this.id = this.route.snapshot.paramMap.get("id")!
    this.getLocalStorage()
    this.isLoading = true
    this.proService.getProductInfo(this.id).subscribe(
      data => {
       // console.log(data)
        this.product = data.result
        this.product.reviews = data.reviews
        
       // console.log(this.product)
        this.getRandomProduct()
        this.getProductRating()
        this.product.reviews.sort((a, b) =>{
          var c:any = new Date(a.date);
          var d:any = new Date(b.date);
          return d-c})
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

  getProductRating() {
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
    this.avgRating= (this.fivestar*5+this.fourstar*4+this.threestar*3+this.twostar*2+this.onestar)/this.product.reviews.length
  }

  checkIfReviewed(){

    if(this.isLogin){

      this.product.reviews.forEach(element => {
        if(element.user.id==this.user.id){
          this.alreadyReview=true
          this.reviewedContent.userId=element.user.id
          this.reviewedContent.username=element.user.displayName
          this.reviewedContent.content=element.content
          this.reviewedContent.star=element.star
          this.reviewedContent.date=element.date
          this.reviewedContent.imgUrl=element.user.imgUrl
          //console.log(this.reviewedContent)
        }
      });
    }

  
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
        localStorage.removeItem("user-imgUrl")
      }
      else {
        this.isLogin = Boolean(localStorage.getItem('isLogin'))
        this.user = new User
        this.user.id = localStorage.getItem('user-id')!
        this.user.email = localStorage.getItem("user-email")!
        this.user.displayName = localStorage.getItem("user-disName")!
        this.user.imgUrl = localStorage.getItem("user-imgUrl")!
        //console.log("still login")
      }
    }
    else {
      // console.log("no login acc")
    }

  }
  goToProductPage(id: number) {
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([`/product/${id}`]));
  }
  getRandomProduct() {

    this.randomProducts=[]
    for (let i = 0; i < 5; i++) {
      let id = this.randomInteger(1, 100)
      this.proService.getProductInfo(String(id)).subscribe(
        data => {
          this.randomProducts.push(data.result)
        },
        error => {
          i--
          console.log(error)
        }
      )
    }
  }
  randomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  addToFav(pro: Product) {
    if (localStorage.getItem("isLogin")) {
      this.authService.addToFav(localStorage.getItem('user-id')!, pro.id).subscribe(
        data => {
          if (data.success) {
            this.toast.success("Product added to favorite list successfully")
          }
          else {
            this.toast.info("This product is already on your favorite list")
          }
        },
        error => {
          console.log(error)
          this.toast.error(" An error has occurred ! Try again !")
        }
      )
    }
    else {
      this.toast.info("Login to add this product to your favorite list")
    }

  }
  addToCart(pro: Product) {
    this.cartService.addToCart(pro)
    this.toast.success("Product added to cart!")
  }

  addReview() {
    if (this.rating == undefined) {
      this.toast.error("You haven't rate this product yet!")
    }
    else {
      if (this.review.trim().length == 0) {
        this.toast.error("Review can't be empty!")
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
        r.date = formatDate(Date.now(), "dd-MM-yyyy hh:mm:ss", "en")

        this.authService.addReview(r.user.id, this.product.id, r.content, r.star, r.date).subscribe(
          data => {
            if (!data.update) {

              this.toast.success("Review posted!")
            }
            else {
              this.toast.success("Review edited!")
            }
            this.addReviewLocal(r)
          },
          error => {
            console.log(error)
            this.toast.error(" An error has occurred ! Try again !")
          }
        )

      }
    }
  }
  addReviewLocal(r: Review) {
  
    let isExist = false
    let index = 0
    for (let i = 0; i < this.product.reviews.length; i++) {
      let item = this.product.reviews[i]
      if (item.user.id == r.user.id) {
        isExist = true
        index = i
        break
      }
    }
    if (isExist) {
      this.product.reviews[index].content = r.content
      this.product.reviews[index].star = r.star
      this.product.reviews[index].date = r.date
    }
    else {
      this.product.reviews.push(r)
      this.checkIfReviewed()
      this.sortChange()
    }
    this.checkIfReviewed()
  }
}
