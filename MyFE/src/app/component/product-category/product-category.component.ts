import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { OperatorFunction, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Product } from 'src/app/class/product';
import { PromotionInfo } from 'src/app/class/promotion-info';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CartService } from 'src/app/service/cart.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {
  products!: Product[];
  content!: Product[];
  pageNumber: number = 1;
  pageSize: number = 10;
  collectionSize: number = 0;
  order: string = ""
  searchMode: boolean = false;
  searchCount: number = 0

  isLoading: boolean = false
  category:any

  priceRange:any = "0,999999"
  stringCate:string = "all"

  promoInfo:PromotionInfo[]=[]

  isDisconnect=false
  autoInterval:any

  constructor(private proService: ProductService, private toast: HotToastService, private cartService: CartService,
    private router: Router,private authService:AuthenticationService ) { }

  ngOnInit(): void {
    if(this.router.url.includes("products")){
      this.category="all"
    }
    else if(this.router.url.includes("fruit")){
      this.category="Fruit"
    }
    else if(this.router.url.includes("vegetable")){
      this.category="Vegetable"
    }
    else if(this.router.url.includes("confectionery")){
      this.category="Confectionery"
    }
    else if(this.router.url.includes("animalproduct")){
      this.category="AnimalProduct"
    }
    else if(this.router.url.includes("cannedfood")){
      this.category="CannedFood"
    }
    else{
      this.category="Snack"
    }
    console.log(this.category)
    window.scrollTo(0,0)
    this.getProductAll()
    this.getProduct()
    this.autoInterval=setInterval(()=>{
      this.getUpdate()
     },5000)
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.autoInterval) {
      clearInterval(this.autoInterval);
      console.log("X??a interval product-category!")   
    }
  }

  keyword: any;

  searchProduct: OperatorFunction<string, readonly Product[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.products.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  )
  getUpdate(){
    this.proService.getProduct(this.category, this.order, this.pageNumber, this.pageSize).subscribe(
      data => {
        this.isDisconnect=false
        let updateList:Product[] = data.results
        let updatePromo:PromotionInfo[] = data.promoInfo
        for (let i = 0; i < updatePromo.length; i++) {
          updateList[i].promoInfo = updatePromo[i]
        }
        // console.log(updateList)
        // console.log(this.content)
        if(!this.arraysEqual(this.content,updateList)){
          this.content = data.results
          this.collectionSize = data.totalItem
          this.promoInfo = data.promoInfo
          // console.log(this.promoInfo)
          // console.log('C?? update')
        
          for (let i = 0; i < this.promoInfo.length; i++) {
            this.content[i].promoInfo = this.promoInfo[i]
          }
        }
        else{
          //console.log("Kh??ng c?? g?? m???i!")
        }
      },
      error => {
        this.isDisconnect=true
        console.log(error)
      }
    )
  }
  arraysEqual(a:Product[], b:Product[]) {
    return JSON.stringify(a)==JSON.stringify(b);
  }

  getProduct() {
    this.isLoading = true
    this.proService.getProduct(this.category, this.order, this.pageNumber, this.pageSize).subscribe(
      data => {
        //  console.log(data)
        this.content = data.results
        this.collectionSize = data.totalItem
        this.promoInfo=data.promoInfo
        for(let i=0;i<this.content.length;i++){
          this.content[i].promoInfo=this.promoInfo[i]
        }
        this.isLoading = false
      },
      error => {
        this.toast.error("K???t n???i v???i API kh??ng ???????c!")
        this.isLoading = false
        console.log(error)
      }
    )
  }
  getProductAll() {
    this.isLoading = true
    this.proService.getProduct("all", "", 1, 999).subscribe(
      data => {
        //console.log(data)
        this.products = data.results
        //this.collectionSize = data.totalItem
        this.isLoading = false
      },
      error => {
        this.toast.error("K???t n???i v???i API kh??ng ???????c!")
        this.isLoading = false
        console.log(error)
      }
    )
  }
  openProductUrlInNewWindow(id:any) {
    
    window.open(`/#/product/${id}`, '_blank');
  }
  getSearchResult(keyword: string) {

  }

  addToFav(pro: Product) {
    if(localStorage.getItem("isLogin")){
      this.authService.addToFav(localStorage.getItem('user-id')!,pro.id).subscribe(
        data=>{
          if(data.success){
            this.toast.success("S???n ph???m ???? th??m v??o y??u th??ch")
          }
          else{
            this.toast.info("S???n ph???m ???? n???m trong y??u th??ch")
          }
        },
        error=>{
          console.log(error)
          this.toast.error(" An error has occurred ! Try again !")
        }
      )
    }
    else{
      this.toast.info("????ng nh???p ????? th??m s???n ph???m v??o y??u th??ch")
    }
  }
  addToCart(pro: Product) {
    this.cartService.addToCart(pro)
    this.toast.success("???? th??m s???n ph???m v??o gi???!")
  }
  productPageChange() {
    this.getProduct()
  }
  newSearch(){


    this.router.navigateByUrl('/', {skipLocationChange: true})
    .then(() => this.router.navigate([`/search`],{ queryParams: { keyword: this.keyword ,category: this.stringCate,priceRange:this.priceRange} }));
  }
  test(){
    console.log(this.keyword)
  }
  scroll(el: HTMLParagraphElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
  switchCategory(category: string) {
    this.category = category
    this.pageNumber = 1
    this.getProduct()
  }
  nextProPage() {
    if (this.collectionSize / this.pageSize > this.pageNumber) {
      this.pageNumber += 1
      this.getProduct()
    }
  }
  prevPropage() {
    if (1 < this.pageNumber) {
      this.pageNumber -= 1
      this.getProduct()

    }
  }
  selectedItem(item: any) {
    this.router.navigateByUrl(`/product/${item.item.id}`)

  }
  
  toNumber(string:string):number{
    return Number(string)
  }
}
