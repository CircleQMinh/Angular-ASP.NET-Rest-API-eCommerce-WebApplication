import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotToastService } from '@ngneat/hot-toast';
import { Product } from 'src/app/class/product';
import { AdminService } from 'src/app/service/admin.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { OrderService } from 'src/app/service/order.service';
import { ProductService } from 'src/app/service/product.service';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { Observable } from 'rxjs';
import { User } from 'src/app/class/user';

const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-pdf-export',
  templateUrl: './pdf-export.component.html',
  styleUrls: ['./pdf-export.component.css']
})
export class PdfExportComponent implements OnInit {
  isLogin: boolean = false
  user!: User

  @ViewChild('pdfTable')
  pdfTable!: ElementRef;

  category:any
  orderBy:any
  orderDir:any
  pageNumber:any
  pageSize:any

  mode:any
  isLoading=true

  product:Product[]=[]
  constructor(private router: Router, private route: ActivatedRoute, private toast: HotToastService, private adminService: AdminService,
    private productService: ProductService, private orderService: OrderService, private authService: AuthenticationService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.authService.getLocalStorage()
    this.user = this.authService.user
    this.isLogin = this.authService.isLogin

    this.mode = this.route.snapshot.queryParamMap.get("mode")
    this.category = this.route.snapshot.queryParamMap.get("category")
    this.orderBy = this.route.snapshot.queryParamMap.get("orderBy")
    this.orderDir = this.route.snapshot.queryParamMap.get("orderDir")!
    this.pageNumber = this.route.snapshot.queryParamMap.get("pageNumber")
    this.pageSize = this.route.snapshot.queryParamMap.get("pageSize")!

    if(this.mode==null||this.category==null||this.orderBy==null||this.orderDir==null||this.pageNumber==null||this.pageSize==null){
      this.router.navigateByUrl("/error")
    }

    switch(this.mode){
      case '1':
        console.log("sản phẩm")
        this.getProduct()
        break
    }
  }
  public async downloadAsPDF() {
    this.isLoading=true
    const pdfTable = this.pdfTable.nativeElement;
    var html = htmlToPdfmake(pdfTable.innerHTML);
    const documentDefinition:any = { content: html };
    pdfMake.createPdf(documentDefinition).download(); 
    this.isLoading=false
    //console.log(await this.toDataURL( 'https://www.gravatar.com/avatar/d50c83cc0c6523b4d3f6085295c953e0'))

  }
  getDisplayCategory(cate: string): string {
    switch (cate) {
      case "Fruit":
        return "Trái cây"
      case "Vegetable":
        return "Rau củ"
      case "Snack":
        return "Snack"
      case "Confectionery":
        return "Bánh kẹo"
      case "CannedFood":
        return "Đồ hộp"
      case "AnimalProduct":
        return "Thịt tươi sống"
      default:
        return ""
    }
  }
  toDataURL = async (url:any) => {
    //console.log("Downloading image...");
    var res = await fetch(url);
    var blob = await res.blob();

    const result = await new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener("load", function () {
        resolve(reader.result);
      }, false);

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
    return result
  };
  getProduct(){
    this.adminService.getProducts(this.category,this.orderBy,this.pageNumber,this.pageSize,this.orderDir).subscribe(
      data=>{
        
        console.log(data.result)
        this.product=data.result
        var count=0
        this.product.forEach(async element => {
          try{
            element.imgUrl =String( await this.toDataURL(element.imgUrl))
            count++
            if(count==this.product.length){
              this.isLoading=false
            }
          }
          catch(e){
            console.log(element.id)
          }
         
        });
        for(let i=0;i<this.product.length;i++){
          this.product[i].numSales=data.saleNum[i]
        }
      },
      error=>{

      }
    )
  }
}
