import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { Observable } from 'rxjs';
import { Product } from 'src/app/class/product';
import { CartService } from 'src/app/service/cart.service';
import { ProductService } from 'src/app/service/product.service';

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
  order:string=""
  searchMode: boolean = false;
  searchCount: number = 0

  isLoading:boolean=false
  @ViewChild('top', { static: true }) contentPage!: ElementRef;
  constructor(private proService:ProductService,private toast:HotToastService,private cartService:CartService) { }

  ngOnInit(): void {
    this.getProduct()
    this.products=this.content
    
  }
  getProduct(){
    this.isLoading=true
    this.proService.getProduct(this.category,this.order,this.pageNumber,this.pageSize).subscribe(
      data=>{
       // console.log(data)
        this.content=data.results
        this.collectionSize=data.totalItem
        this.isLoading=false
      },
      error=>{
        this.toast.error("Kết nối với API không được!")
        this.isLoading=false
        console.log(error)
      }
    )
  }

  getSearchResult(keyword: string){

  }

  addToFav(pro:Product){
    
  }
  addToCart(pro:Product){
    this.cartService.addToCart(pro)
    this.toast.success("Product added to cart!")
  }
  productPageChange(){
    this.getProduct()
  }
  scroll(el: HTMLParagraphElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
  switchCategory(category:string){
    this.category=category
    this.pageNumber=1
    this.getProduct()
  }
  nextProPage(){
    if(this.collectionSize/this.pageSize>this.pageNumber){
      this.pageNumber+=1
      this.getProduct()
    }
  }
  prevPropage(){
    if(1<this.pageNumber){
      this.pageNumber-=1
      this.getProduct()
     
    }
  }
}
