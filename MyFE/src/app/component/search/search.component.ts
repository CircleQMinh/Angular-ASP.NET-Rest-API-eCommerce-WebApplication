import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Product } from 'src/app/class/product';
import { PromotionInfo } from 'src/app/class/promotion-info';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CartService } from 'src/app/service/cart.service';
import { ProductService } from 'src/app/service/product.service';
import { Location } from '@angular/common';
import { Category } from 'src/app/class/category';
import { Tag } from 'src/app/class/tag';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  isLoading = false
  keyword: any

  defaultPriceRange = ["0,20000", "20000,40000", "40000,120000", "120000,99999999", "0,99999999"]

  allCate = false

  priceMin: any
  priceMax: any
  priceRange: any = "0,99999999"
  stringCate: string = ""
  tag: string[] = ["all"]
  onPromoOnly = false

  products: Product[] = []
  promoInfo: PromotionInfo[] = []

  pagedProduct: Product[] = []

  isDisconnect = false
  autoInterval: any

  pageNumber: number = 1
  pageSize: number = 10

  categoryList:Category[]=[]
  collectionSize: any;
  relatedTag:Tag[]=[]
  
  constructor(private productService: ProductService, private toast: HotToastService,
    private cartService: CartService, private authService: AuthenticationService) { }

  ngOnInit(){
    this.isLoading = true
    this.getCategory()


    if(localStorage.getItem("searchCate")){
      let a = localStorage.getItem("searchCate")
      console.log(a)
      localStorage.removeItem("searchCate")
      for(let i=0;i<this.categoryList.length;i++){
        if(a==this.categoryList[i].name){
          this.categoryList[i].checked=true
        }
      }
      this.stringCate=a!
    }
    else{
      this.allCate = true
      this.stringCate = "all"
    }

    this.priceRange = "0,99999999"
    this.keyword = ""
    if(localStorage.getItem("searchKeyWord")){
      this.keyword=localStorage.getItem("searchKeyWord")
      localStorage.removeItem("searchKeyWord")
    }
    if(localStorage.getItem("searchTag")){
      let a= localStorage.getItem("searchTag")
      console.log(a)
      this.tag=[]
      this.tag.push(a!)
      localStorage.removeItem("searchTag")
    }


    this.findProduct()

    //console.log(this.keyword)
    this.autoInterval = setInterval(() => {
      //this.getCategory()
      this.findProduct()
    }, 10000)
    window.scrollTo(0, 0)
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.autoInterval) {
      clearInterval(this.autoInterval);
      console.log("X??a interval search!")
    }
    localStorage.removeItem("searchCate")
  }

  getCategory(){

    if(localStorage.getItem("categoryList")){
      console.log("Kh??ng ph???i t???i l???i")
      this.categoryList=JSON.parse(localStorage.getItem("categoryList")!)
    }
    else{
      
      this.productService.getCategory().subscribe(
        data=>{
          this.isDisconnect = false
          this.categoryList=data.cate
          this.categoryList.forEach(element => {
            element.checked=false
          });
  
        },
        error=>{
          console.log(error)
          this.isDisconnect = true
        }
      )
    }

  }

  findProduct() {

    this.productService.getSearchProductResult(this.keyword, this.priceRange, this.stringCate, this.tag[0],this.pageNumber,this.pageSize).subscribe(
      data => {
        this.isDisconnect = false
        this.products = data.result
        this.collectionSize=data.total
        //console.log(this.products)
        this.promoInfo = data.promoInfo
        for (let i = 0; i < this.products.length; i++) {
          this.products[i].promoInfo = this.promoInfo[i]
        }
        //this.getPagedProduct()
        //console.log(this.products)
        if(this.stringCate!="all"){
          this.getCategoryTag(this.stringCate)
        }
        this.isLoading = false
      },
      error => {
        console.log(error)
        this.isDisconnect = true
        //this.toast.error("K???t n???i API kh??ng ???????c!")
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
  filterChange(name: any) {
    this.pageNumber=1
    if (name) {
      if (name == "all") {
        this.allCate = true
      }
      else {
        this.allCate = false
      }
      this.categoryList.forEach(element => {
        if (element.name != name) {
          element.checked = false
        }
      });
      this.stringCate = name
      this.tag=[]
      this.tag = ["all"]
    }
    this.newSearch()
  }
  newSearch() {
    // let url = this.router.createUrlTree([], {
    //   relativeTo: this.route, queryParams:
    //     { keyword: this.keyword, category: this.stringCate, priceRange: this.priceRange }
    // }).toString();
    // //console.log(url)
    // this.location.go(url)
    this.isLoading = true
    this.findProduct()
    // this.router.navigateByUrl('/', { skipLocationChange: true })
    //   .then(() => this.router.navigate([`/search`], { queryParams: { keyword: this.keyword,category: this.stringCate,priceRange:this.priceRange } }));
  }

  applyPriceRange() {
    if (this.priceMin && this.priceMax) {
      try {
        if (Number(this.priceMin) > Number(this.priceMax)) {
          this.toast.error("Kho???ng gi?? kh??ng h???p l???")
        }
        else {
          this.isLoading = true
          let newRange = String(this.priceMin) + "," + String(this.priceMax)
          this.priceRange = newRange
          this.findProduct()
        }
      }
      catch (e) {
        this.toast.error("Kho???ng gi?? kh??ng h???p l???")
      }
    }
    else {
      this.toast.error("Kho???ng gi?? kh??ng h???p l???")
    }
  }
  openProductUrlInNewWindow(id: any) {

    window.open(`/#/product/${id}`, '_blank');
  }
  applyTag(t: any) {
    this.tag = []
    this.tag.push(t)
    this.newSearch()

  }
  removeTag(t: any) {
    this.isLoading = true
    for (let i = 0; i < this.tag.length; i++) {
      if (this.tag[i] == t) {
        this.tag.splice(i, 1);
        break
      }
    }
    if (this.tag.length == 0) {
      this.tag = ["all"]
    }
    this.findProduct()
  }
  removeCate(c: any) {
    this.isLoading = true
    this.stringCate = ""
    for (let i = 0; i < this.categoryList.length; i++) {
      if (this.categoryList[i].name == c) {
        this.categoryList[i].checked = false
      }
    }
    let listCate = this.categoryList.filter(opt => opt.checked).map(opt => opt.name)
    if (listCate.length == 0) {
      listCate.push("all")
      this.allCate = true
    }
    for (let i = 0; i < listCate.length; i++) {
      this.stringCate += listCate[i] + ","
    }
    this.stringCate = this.stringCate.slice(0, this.stringCate.length - 1)
    this.tag=[]
    this.tag = ["all"]
    this.findProduct()
  }
  removePriceRange() {
    this.isLoading = true
    this.priceRange = '0,99999999'
    this.findProduct()
  }
  resetFilter() {
    this.isLoading = true
    this.allCate = true
    this.stringCate = "all"
    this.priceRange = "0,99999999"
    this.keyword = ""
    this.tag = ["all"]
    this.onPromoOnly = false
    for (let i = 0; i < this.categoryList.length; i++) {
      this.categoryList[i].checked = false
    }
    this.findProduct()
  }
  addToFav(pro: Product) {
    if (localStorage.getItem("isLogin")) {
      this.authService.addToFav(localStorage.getItem('user-id')!, pro.id).subscribe(
        data => {
          if (data.success) {
            this.toast.success("S???n ph???m ???? th??m v??o y??u th??ch")
          }
          else {
            this.toast.info("S???n ph???m ???? n???m trong y??u th??ch")
          }
        },
        error => {
          console.log(error)
          this.toast.error(" An error has occurred ! Try again !")
        }
      )
    }
    else {
      this.toast.info("????ng nh???p ????? th??m s???n ph???m v??o y??u th??ch")
    }

  }
  addToCart(pro: Product) {
    this.cartService.addToCart(pro)
    //this.toast.success("???? th??m s???n ph???m v??o gi???!")
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
    //window.scrollTo(0, 0)
  }
  alertSoldOut(){
    this.toast.info("S???n ph???m ???? h???t h??ng!")
  }

  displayPriceRange(priceRange:string):string{
    let pr:string[]=priceRange.split(",")
    if(pr[1]=="99999999"){
      return "Tr??n " + pr[0]+" VND"
    }
    else{
      return "T??? "+pr[0]+" ?????n "+pr[1]+ " VND"
    }
  }
  getCategoryTag(cate:string){
    this.productService.getCategoryTag(cate).subscribe(
      data=>{
        this.relatedTag=data.result
        console.log(this.relatedTag)
      },
      error=>{
        console.log(error)
      }
    )
  }
}