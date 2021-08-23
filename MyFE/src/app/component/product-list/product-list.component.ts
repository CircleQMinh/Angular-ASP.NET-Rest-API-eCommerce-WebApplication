import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { Observable } from 'rxjs';
import { Product } from 'src/app/class/product';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  
  products!: Observable<Product[]>;
  content!: Product[];
  pageNumber: number = 1;
  pageSize: number = 10;
  collectionSize: number = 0;
  category: string = ""
  order:string=""
  searchMode: boolean = false;
  searchCount: number = 0

  isLoading:boolean=false
  
  constructor(private proService:ProductService,private toast:HotToastService) { }

  ngOnInit(): void {
    this.getProduct()

  }
  getProduct(){
    this.isLoading=true
    this.proService.getProduct(this.category,this.order,this.pageNumber,this.pageSize).subscribe(
      data=>{
        console.log(data)
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

  }
  productPageChange(){
    this.getProduct()
  }
}
