import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Product } from 'src/app/class/product';
import { PromotionInfo } from 'src/app/class/promotion-info';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CartService } from 'src/app/service/cart.service';
import { ProductService } from 'src/app/service/product.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  isLoading = false
  keyword: any

  cate = [
    { name: 'Trái cây', value: 'Fruit', checked: false },
    { name: 'Rau củ', value: 'Vegetable', checked: false },
    { name: 'Bánh kẹo', value: 'Confectionery', checked: false },
    { name: 'Snack', value: 'Snack', checked: false },
    { name: 'Thịt tươi sống', value: 'AnimalProduct', checked: false },
    { name: 'Đồ hộp', value: 'CannedFood', checked: false }
  ]
  defaultPriceRange = ["0,20000", "20000,40000", "40000,120000", "120000,999999", "0,999999"]

  allCate = false

  priceMin: any
  priceMax: any
  priceRange: any = "0,999999"
  stringCate: string = ""
  tag:string ="all"
  onPromoOnly = false

  products: Product[] = []
  promoInfo: PromotionInfo[] = []

  pagedProduct:Product[]=[]

  isDisconnect = false
  autoInterval: any

  pageNumber:number=1
  pageSize:number=10

  constructor(private router: Router, private route: ActivatedRoute, private productService: ProductService, private toast: HotToastService,
    private cartService: CartService, private authService: AuthenticationService, private location: Location) { }

  ngOnInit(): void {
    this.isLoading = true

    if(localStorage.getItem("searchCate")){
      let a = localStorage.getItem("searchCate")
      for(let i=0;i<this.cate.length;i++){
        if(a==this.cate[i].value){
          this.cate[i].checked=true
        }
      }
      this.stringCate=a!
    }
    else{
      this.allCate = true
      this.stringCate = "all"
    }

    this.priceRange = "0,999999"
    this.keyword = ""
    this.findProduct()

    //console.log(this.keyword)
    this.autoInterval = setInterval(() => {
      this.findProduct()
    }, 5000)
    window.scrollTo(0, 0)
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.autoInterval) {
      clearInterval(this.autoInterval);
      console.log("Xóa interval search!")
    }
    localStorage.removeItem("searchCate")
  }
  applyTag(t:any){
    this.tag=t
    this.findProduct()
  }
  findProduct() {

    this.productService.getSearchProductResult(this.keyword, this.priceRange, this.stringCate,this.tag).subscribe(
      data => {
        this.isDisconnect = false
        this.products = data.result
        this.promoInfo = data.promoInfo
        for(let i=0;i<this.products.length;i++){
          this.products[i].promoInfo=this.promoInfo[i]
        }
        this.getPagedProduct()
        //console.log(this.products)
        this.isLoading = false
      },
      error => {
        console.log(error)
        this.isDisconnect = true
        //this.toast.error("Kết nối API không được!")
        this.isLoading = false
      }
    )
  }
  getPagedProduct() {
    this.pagedProduct = []
    for (let i = 0; i < this.pageSize; i++) {
      if (this.products[i + this.pageSize * (this.pageNumber - 1)]) {
        this.pagedProduct.push(this.products[i + this.pageSize * (this.pageNumber - 1)])
      }

    }
  }
  filterChange(bool: any) {
    this.stringCate = ""
    if (bool != null) {
      this.allCate = bool
    }
    if (!this.allCate) {
      let listCate = this.cate.filter(opt => opt.checked).map(opt => opt.value)
      // console.log(this.priceRange)
      // console.log(listCate)

      if (listCate.length == 0) {
        listCate.push("all")
        this.allCate=true
      }

      for (let i = 0; i < listCate.length; i++) {
        this.stringCate += listCate[i] + ","
      }

      this.stringCate = this.stringCate.slice(0, this.stringCate.length - 1)
      this.newSearch()
    }
    else {
      this.cate.forEach(element => {
        element.checked = false
      });
      let listCate: string[] = []

      listCate.push("all")
      for (let i = 0; i < listCate.length; i++) {
        this.stringCate += listCate[i] + ","
      }
      this.stringCate = this.stringCate.slice(0, this.stringCate.length - 1)
      this.newSearch()
    }
  }
  newSearch() {
    // let url = this.router.createUrlTree([], {
    //   relativeTo: this.route, queryParams:
    //     { keyword: this.keyword, category: this.stringCate, priceRange: this.priceRange }
    // }).toString();
    // //console.log(url)
    // this.location.go(url)
    this.findProduct()
    // this.router.navigateByUrl('/', { skipLocationChange: true })
    //   .then(() => this.router.navigate([`/search`], { queryParams: { keyword: this.keyword,category: this.stringCate,priceRange:this.priceRange } }));
  }

  applyPriceRange() {
    if (this.priceMin && this.priceMax) {
      try {
        if (Number(this.priceMin) > Number(this.priceMax)) {
          this.toast.error("Khoảng giá không hợp lệ")
        }
        else {
          let newRange = String(this.priceMin) + "," + String(this.priceMax)
          // this.router.navigateByUrl('/', { skipLocationChange: true })
          // .then(() => this.router.navigate([`/search`], { queryParams: { keyword: this.keyword,category: this.stringCate,priceRange:newRange } }));
          // let url = this.router.createUrlTree([], {
          //   relativeTo: this.route, queryParams:
          //     { keyword: this.keyword, category: this.stringCate, priceRange: newRange }
          // }).toString();
          //console.log(url)
          this.priceRange = newRange
          //this.location.go(url)
          this.findProduct()
        }
      }
      catch (e) {
        this.toast.error("Khoảng giá không hợp lệ")
      }
    }
    else {
      this.toast.error("Khoảng giá không hợp lệ")
    }
  }
  openProductUrlInNewWindow(id: any) {

    window.open(`/#/product/${id}`, '_blank');
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
          this.toast.error(" An error has occurred ! Try again !")
        }
      )
    }
    else {
      this.toast.info("Đăng nhập để thêm sản phẩm vào yêu thích")
    }

  }
  addToCart(pro: Product) {
    this.cartService.addToCart(pro)
    this.toast.success("Đã thêm sản phẩm vào giỏ!")
  }

  toNumber(string: string): number {
    return Number(string)
  }

  totalProduct(): number {

    if (this.onPromoOnly == true) {
      let s = 0;
      this.promoInfo.forEach(element => {
        if (element != null) {
          s += 1
        }
      });
      return s;
    }
    else {
      return this.products.length
    }

  }
  scrollToTop() {
    window.scrollTo(0, 0)
  }
}
