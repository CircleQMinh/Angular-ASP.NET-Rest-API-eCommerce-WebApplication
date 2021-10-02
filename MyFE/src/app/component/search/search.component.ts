import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Product } from 'src/app/class/product';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CartService } from 'src/app/service/cart.service';
import { ProductService } from 'src/app/service/product.service';

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

  priceRange:any = "0,999999"
  stringCate:string = ""


  products: Product[] = []
  constructor(private router: Router, private route: ActivatedRoute, private productService: ProductService, private toast: HotToastService,
    private cartService: CartService, private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.keyword = this.route.snapshot.queryParamMap.get("keyword")
    this.priceRange = this.route.snapshot.queryParamMap.get("priceRange")
    this.stringCate = this.route.snapshot.queryParamMap.get("category")!
    if(this.keyword&&this.priceRange&&this.stringCate){
      let listCate = this.stringCate.split(",")
      for(let i=0;i<this.cate.length;i++){
        if(listCate.includes(this.cate[i].value)){
          this.cate[i].checked=true
        }
      }
      this.findProduct()
    }
    else{
      this.priceRange="0,999999"
      this.stringCate=""
    }
    //console.log(this.keyword)
 
    window.scrollTo(0, 0)
  }
  findProduct() {
    this.isLoading = true
    this.productService.getSearchProductResult(this.keyword, this.priceRange, this.stringCate).subscribe(
      data => {
        this.products = data.result
        //console.log(this.products)
        this.isLoading = false
      },
      error => {
        console.log(error)
        this.toast.error("Kết nối API không được!")
        this.isLoading = false
      }
    )
  }



  filterChange() {
    this.stringCate=""
    let listCate = this.cate.filter(opt => opt.checked).map(opt => opt.value)
    // console.log(this.priceRange)
    // console.log(listCate)
 
    if(listCate.length==0){
      listCate.push("all")
    }

    for(let i=0;i<listCate.length;i++){
      this.stringCate+=listCate[i]+","
    }

    this.stringCate=this.stringCate.slice(0,this.stringCate.length-1)
    console.log(this.stringCate)
    this.newSearch()

  }



  newSearch() {

    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([`/search`], { queryParams: { keyword: this.keyword,category: this.stringCate,priceRange:this.priceRange } }));
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
}
