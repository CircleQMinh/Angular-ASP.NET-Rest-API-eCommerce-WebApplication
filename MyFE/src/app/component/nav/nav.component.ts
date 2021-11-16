import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { HotToastService } from '@ngneat/hot-toast';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Product } from 'src/app/class/product';
import { User } from 'src/app/class/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  isCollapsed: boolean = true

  isLogin: boolean = false

  user!: User

  products: Product[] = []
  keyword: any
  priceRange: any = "0,999999"
  stringCate: string = "all"
  autoInterval:any
  constructor(private router: Router, private proService: ProductService, private toast: HotToastService, private authService: AuthenticationService
    ,private route: ActivatedRoute ) { }

  ngOnInit(): void {
    this.authService.getLocalStorage()

    this.user = this.authService.user
    this.isLogin = this.authService.isLogin
    if (localStorage.getItem("products")) {
      this.products = JSON.parse(localStorage.getItem("products")!)
    }
    else {
      this.getProductAll()
    }
    this.autoInterval=setInterval(()=>{
      this.authService.getLocalStorage()
      this.user = this.authService.user
      this.isLogin = this.authService.isLogin
    },1000)
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.autoInterval) {
      clearInterval(this.autoInterval);
      console.log("Xóa interval profile!")
    }
  }
  newSearch() {
    if(this.keyword==null){
      this.keyword=" "
   
    }
    localStorage.setItem("searchKeyWord",this.keyword)

    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([`/search`]));
  }

  searchProduct: OperatorFunction<string, readonly Product[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 1 ? []
        : this.products.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )
  selectedItem(item: any) {
    this.router.navigateByUrl(`/product/${item.item.id}`)

  }
  getProductAll() {
    this.proService.getProduct("all", "", 1, 999).subscribe(
      data => {
        //console.log(data)
        this.products = data.results
        localStorage.setItem("products", JSON.stringify(this.products))
      },
      error => {
        this.toast.error("Kết nối với API không được!")
        console.log(error)
      }
    )
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
        localStorage.removeItem("user-role")
      }
      else {
        this.isLogin = Boolean(localStorage.getItem('isLogin'))
        this.user = new User
        this.user.id = localStorage.getItem('user-id')!
        this.user.email = localStorage.getItem("user-email")!
        this.user.displayName = localStorage.getItem("user-disName")!
        this.user.imgUrl = localStorage.getItem("user-imgUrl")!
        this.user.roles = []
        this.user.roles.push(localStorage.getItem("user-role")!)
        //console.log("still login")
      }
    }
    else {
      // console.log("no login acc")
    }

  }
  signOut() {
    this.isLogin = false
    let a = this.router.url
    this.authService.signOut()
    this.isLogin = this.authService.isLogin
    this.user=this.authService.user
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigateByUrl(a))
  }

  goToSearch(cate:any){
    localStorage.setItem("searchCate",cate)
    window.open("/#/search")
  }

  goToLogin(){
    //console.log(this.router.url)
    localStorage.setItem("redirectURL",String(this.router.url))
    this.router.navigateByUrl("/login")
  }

  openDropDwon(drop:NgbDropdown){
    drop.open()
  }
  waitForDropDown(drop:NgbDropdown){

    setTimeout(()=>{

      drop.close()
    },1000)
  }
}
