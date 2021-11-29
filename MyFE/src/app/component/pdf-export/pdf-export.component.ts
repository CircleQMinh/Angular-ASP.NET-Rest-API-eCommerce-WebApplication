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
import { formatDate } from '@angular/common';
import { Employee } from 'src/app/class/employee';
import { PromotionInfo } from 'src/app/class/promotion-info';
import { Promotion } from 'src/app/class/promotion';
import { DiscountCode } from 'src/app/class/discount-code';

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

  today: any

  @ViewChild('pdfTable')
  pdfTable!: ElementRef;

  category: any
  orderBy: any
  orderDir: any
  pageNumber: any
  pageSize: any

  promoId: any

  from: any
  to: any

  top!: number

  mode: any
  isLoading = true

  product: Product[] = []

  userList: User[] = []
  pagedUserList: User[] = []

  employeeList: Employee[] = []
  pagedEmployeeList: Employee[] = []

  promotion: any
  promotionInfos: PromotionInfo[] = []

  tkdtData: any[] = []

  topSaleProduct: any[] = []
  topCate: any[] = []

  discountCodeJustCreate:DiscountCode[]=[]

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
    this.today = formatDate(Date.now(), 'dd-MM-yyyy HH:mm:ss', 'en');

    switch (this.mode) {
      case null:
        this.router.navigateByUrl("/error")
        break
      case '4':
        this.promoExport()
        break
      case '5':
        this.tkdtExport()
        break
      case '6':
        this.tkspExport()
        break
      case '7':
        this.discountCodeExport()
        break
      default :
      this.normalExport()

    }


  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    localStorage.removeItem("promo")
    localStorage.removeItem("dclist")
  }

  reload(){
    switch (this.mode) {
      case null:
        this.router.navigateByUrl("/error")
        break
      case '4':
        this.promoExport()
        break
      case '5':
        this.tkdtExport()
        break
      case '6':
        this.tkspExport()
        break
      case '7':
        this.discountCodeExport()
        break
      default :
      this.normalExport()

    }
  }


  discountCodeExport(){
    this.discountCodeJustCreate=JSON.parse(localStorage.getItem("dclist")!)
    this.isLoading = false
  }

  tkdtExport() {
    this.from = this.route.snapshot.queryParamMap.get("from")
    this.to = this.route.snapshot.queryParamMap.get("to")

    this.adminService.getSalesChart(this.from, this.to).subscribe(
      data => {
        this.tkdtData = data.result
        console.log(this.tkdtData)
        this.isLoading = false
      },
      error => {
        console.log(error);
        this.toast.error(" An error has occurred ! Try again !");
      }
    )
  }
  tkspExport() {
    this.top = Number(this.route.snapshot.queryParamMap.get("top"))
    console.log(this.top)
    this.adminService.getTopProductChart(this.top).subscribe(
      data => {
        this.topSaleProduct = data.result
        var count = 0
        this.topSaleProduct.forEach(async element => {
          element.product.imgUrl = String(await this.toDataURL(element.product.imgUrl))
          count += 1
          if (count == this.topSaleProduct.length) {
            this.isLoading = false
          }
        });
        console.log(this.topSaleProduct)
        // console.log(data.cateCount)
        // console.log(data.cateCount[0])
        this.topCate = data.cateCount

      },
      error => {
        console.log(error);
        this.toast.error(" An error has occurred ! Try again !");
      }
    )
  }

  promoExport() {
    this.promoId = this.route.snapshot.queryParamMap.get("promoId")
    if (this.promoId == null) {

      this.router.navigateByUrl("/error")
    }
    this.getPromotionInfo(this.promoId)


  }
  normalExport() {
    if (this.category == null || this.orderBy == null || this.orderDir == null || this.pageNumber == null || this.pageSize == null) {
      this.router.navigateByUrl("/error")
    }
    switch (this.mode) {
      case '1':
        //console.log("sản phẩm")
        this.getProduct()
        break
      case "2":
        this.getUser()
        break
      case "3":
        this.getEmployee()
        break
    }
  }

  public async downloadAsPDF() {
    this.isLoading = true
    const pdfTable = this.pdfTable.nativeElement;
    var html = htmlToPdfmake(pdfTable.innerHTML, { tableAutoSize: true });
    const documentDefinition: any = { content: html };
    pdfMake.createPdf(documentDefinition).download();
    this.isLoading = false
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
  toDataURL = async (url: any) => {
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
  getProduct() {
    this.adminService.getProducts(this.category, this.orderBy, this.pageNumber, this.pageSize, this.orderDir).subscribe(
      data => {

        console.log(data.result)
        this.product = data.result
        var count = 0
        this.product.forEach(async element => {
          try {
            element.imgUrl = String(await this.toDataURL(element.imgUrl))
            count++
            if (count == this.product.length) {
              this.isLoading = false
            }
          }
          catch (e) {
            console.log(element.id)
          }

        });
        for (let i = 0; i < this.product.length; i++) {
          this.product[i].numSales = data.saleNum[i]
        }
      },
      error => {

      }
    )
  }
  getUser() {
    this.pageNumber = 1
    this.adminService.getUsers(this.orderBy, "User", this.orderDir).subscribe(
      data => {
        // console.log(data)

        this.userList = data.result
        this.userList.forEach(async (element, index: number) => {
          element.roles = data.roles[index]
          element.orderCount = data.orderCount[index]
          element.imgUrl = String(await this.toDataURL(element.imgUrl))
        });
        this.getPagedUserList()
        //console.log(this.userList)
        this.isLoading = false
      },
      error => {
        console.log(error)

      }
    )
  }
  getPagedUserList() {
    this.pagedUserList = []
    for (let i = 0; i < this.pageSize; i++) {
      if (this.userList[i + this.pageSize * (this.pageNumber - 1)]) {
        this.pagedUserList.push(this.userList[i + this.pageSize * (this.pageNumber - 1)])
      }

    }
  }
  getEmployee() {
    this.employeeList = []
    this.adminService.getEmployees(this.orderBy, this.category, this.orderDir).subscribe(
      async data => {

        for (let i = 0; i < data.count; i++) {
          let e = new Employee
          e = data.result[i]
          e.imgUrl = String(await this.toDataURL(e.imgUrl))
          e.roles = data.roles[i]
          e.Address = data.employeeInfo[i].address
          e.CMND = data.employeeInfo[i].cmnd
          e.Salary = data.employeeInfo[i].salary
          e.Sex = data.employeeInfo[i].sex
          e.StartDate = data.employeeInfo[i].startDate
          e.Status = data.employeeInfo[i].status
          this.employeeList.push(e)

        }
        this.getPagedEmployee()
        this.isLoading = false
      },
      error => {
        console.log(error)
      }
    )
  }
  getPagedEmployee() {
    this.pagedEmployeeList = []
    for (let i = 0; i < this.pageSize; i++) {
      if (this.employeeList[i + this.pageSize * (this.pageNumber - 1)]) {
        this.pagedEmployeeList.push(this.employeeList[i + this.pageSize * (this.pageNumber - 1)])
      }

    }
  }

  getPromotionInfo(promoId: any) {




    this.adminService.getPromotionInfo(promoId).subscribe(
      data => {
        this.promotionInfos = data.result;
        this.promotionInfos.forEach(async element => {
          element.product.imgUrl = String(await this.toDataURL(element.product.imgUrl))
        });
        console.log(this.promotionInfos)
        this.adminService.getOnePromotion(promoId).subscribe(
          async data => {
            this.promotion = data.result
            this.promotion.imgUrl = String(await this.toDataURL(this.promotion.imgUrl))
            console.log(this.promotion)
            this.isLoading = false
          },
          error => {
            console.log(error);
            this.toast.error(" An error has occurred ! Try again !");
          }
        )
      },
      error => {
        console.log(error);
        this.toast.error(" An error has occurred ! Try again !");
      }
    );

  }


}
