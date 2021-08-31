import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { Observable, OperatorFunction } from 'rxjs';
import { Product } from 'src/app/class/product';
import { CartService } from 'src/app/service/cart.service';
import { ProductService } from 'src/app/service/product.service';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication.service';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products!: Product[];
  content!: Product[];
  pageNumber: number = 1;
  pageSize: number = 8;
  collectionSize: number = 0;
  category: string = "all"
  order: string = ""
  searchMode: boolean = false;
  searchCount: number = 0

  isLoading: boolean = false
  @ViewChild('top', { static: true }) contentPage!: ElementRef;
  constructor(private proService: ProductService, private toast: HotToastService, private cartService: CartService,
    private router: Router,private authService:AuthenticationService) { }


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


  }
  getProduct() {
    this.isLoading = true
    this.proService.getProduct(this.category, this.order, this.pageNumber, this.pageSize).subscribe(
      data => {
        // console.log(data)
        this.content = data.results
        this.collectionSize = data.totalItem
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

  addToFav(pro: Product) {
    if(localStorage.getItem("isLogin")){
      this.authService.addToFav(localStorage.getItem('user-id')!,pro.id).subscribe(
        data=>{
          if(data.success){
            this.toast.success("Product added to favorite list successfully")
          }
          else{
            this.toast.info("This product is already on your favorite list")
          }
        },
        error=>{
          console.log(error)
          this.toast.error(" An error has occurred ! Try again !")
        }
      )
    }
    else{
      this.toast.info("Login to add this product to your favorite list")
    }

  }
  addToCart(pro: Product) {
    this.cartService.addToCart(pro)
    this.toast.success("Product added to cart!")
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
}
