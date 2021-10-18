import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { Observable, OperatorFunction } from 'rxjs';
import { Product } from 'src/app/class/product';
import { CartService } from 'src/app/service/cart.service';
import { ProductService } from 'src/app/service/product.service';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { PromotionInfo } from 'src/app/class/promotion-info';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products!: Product[];
  content!: Product[];
  pageNumber: number = 1;
  pageSize: number = 10;
  collectionSize: number = 0;
  category: string = "all"
  order: string = ""
  searchMode: boolean = false;
  searchCount: number = 0

  promoInfo: PromotionInfo[] = []

  isDisconnect=false
  autoInterval:any
  
  isLoading: boolean = false
  @ViewChild('top', { static: true }) contentPage!: ElementRef;
  constructor(private proService: ProductService, private toast: HotToastService, private cartService: CartService,
    private router: Router, private authService: AuthenticationService) { }


  keyword: any;

  searchProduct: OperatorFunction<string, readonly Product[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.products.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  ngOnInit(): void {
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
      console.log("Xóa interval product!")
    }
  }

  openProductUrlInNewWindow(id:any) {
    
    window.open(`/#/product/${id}`, '_blank');
  }
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
         // console.log('Có update')
        
          for (let i = 0; i < this.promoInfo.length; i++) {
            this.content[i].promoInfo = this.promoInfo[i]
          }
        }
        else{
          //console.log("Không có gì mới!")
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
        // console.log(data)
        this.content = data.results
        this.collectionSize = data.totalItem
        this.promoInfo = data.promoInfo
        // console.log(this.promoInfo)
        for (let i = 0; i < this.promoInfo.length; i++) {
          this.content[i].promoInfo = this.promoInfo[i]
        }
        this.isLoading = false
      },
      error => {
        this.toast.error("Kết nối với API không được!")
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
        this.collectionSize = data.totalItem
        this.promoInfo = data.promoInfo
        for (let i = 0; i < this.promoInfo.length; i++) {
          this.products[i].promoInfo = this.promoInfo[i]
        }
        // console.log(this.promoInfo)
        localStorage.setItem("products", JSON.stringify(this.products))
        this.isLoading = false
      },
      error => {
        this.toast.error("Kết nối với API không được!")
        this.isLoading = false
        console.log(error)
      }
    )
  }

  getSearchResult(keyword: string) {

  }
  newSearch() {

    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([`/search`], { queryParams: { keyword: this.keyword } }));
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
  productPageChange() {
    this.getProduct()
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

  toNumber(string: string): number {
    return Number(string)
  }
}
