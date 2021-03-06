import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HotToastService } from '@ngneat/hot-toast';
import { OperatorFunction, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { DiscountCode } from 'src/app/class/discount-code';
import { Employee } from 'src/app/class/employee';
import { Order } from 'src/app/class/order';
import { Product } from 'src/app/class/product';
import { Category } from 'src/app/class/category';
import { Promotion } from 'src/app/class/promotion';
import { PromotionInfo } from 'src/app/class/promotion-info';
import { Tag } from 'src/app/class/tag';
import { User } from 'src/app/class/user';
import { AdminService } from 'src/app/service/admin.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { OrderService } from 'src/app/service/order.service';
import { ProductService } from 'src/app/service/product.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  isCollapsed: boolean = true

  isLogin: boolean = false
  user!: User

  active_tab = "db"

  userList: User[] = []
  pagedUserList: User[] = []
  pageNumberUser = 1
  pageSizeUser = 5
  orderUser = "Id"
  role = "User"

  productList: Product[] = []
  pageNumberProduct = 1
  pageSizeProduct = 5
  orderProduct = "Id"
  category = "all"
  collectionSizeProduct = 0

  orderList: Order[] = []
  shippingInfos: any[] = []
  pageNumberOrder = 1
  pageSizeOrder = 5
  orderOrder = "OrderDate"
  status = 0
  collectionSizeOrder = 0

  isLoading = false

  dashboardInfo = {
    totalUser: 5,
    totalProduct: 142,
    totalOrder: 0,
    totalEmp: 5,
    totalPromo: 1
  }

  numberOfNewOrder = 0
  showNewOrderNotify = false

  urlIMG: any = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/450px-No_image_available.svg.png"
  defaultImgUrl: any = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/450px-No_image_available.svg.png"
  uploadedUrlImg: any
  msg = "";
  newName!: string
  newPhone!: string
  isUpdateProfile: boolean = false
  editingUser!: User

  isCreatingUser: boolean = false

  rf1!: FormGroup;
  showFormError: boolean = false

  isDeletingUser: boolean = false
  selectedUserId = ""

  selectedUser!:User
  selectedUserOrderFilter:Order[]=[]

  defaultProImgUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"
  proImgUrl: any = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"
  rf2!: FormGroup;
  rf3!: FormGroup;
  isCreatingProduct: boolean = false
  editingProduct!: Product
  isEditingProduct: boolean = false
  isDeletingProduct: boolean = false
  deletingProductId = 0


  isGettingOrderDetail: boolean = false
  selectedOrder!: Order
  selectedShippingInfo: any
  rf4!: FormGroup
  isEditingOrder: boolean = false
  isDeletingOrder: boolean = false

  orderDirOrder: any = "Desc"
  orderDirUser: any = "Asc"
  orderDirProduct: any = "Asc"
  orderDirEmployee: any = "Asc"

  keyword: any;


  employeeList: Employee[] = []
  pagedEmployeeList: Employee[] = []
  pageNumberEmployee = 1
  pageSizeEmployee = 5
  orderEmployee = "Id"
  roleEmployee = "Employee"
  rf5!: FormGroup
  rf6!: FormGroup
  isCreatingEmployee = false
  isEditingEmployee = false
  isDeletingEmployee = false
  editingEmployee!: Employee
  deletingEmployee!: Employee

  isGettingShipperHistory = false
  selectedShipperId: any
  selectedShipperHistory: any[] = []

  saleChart: any[] = [
    {
      "name": "Doanh thu",
      "series": [

      ]
    }
  ];
  orderChart: any[] = [
    {
      "name": "S??? ????n h??ng",
      "series": [

      ]
    }
  ];
  productChart: any[] = []

  categoryChart: any[] = []

  numberOfTopProduct = 10
  topSaleProduct: any[] = []
  topSaleProductCount = 1

  rf7!: FormGroup
  rf8!: FormGroup

  dbSaleChartData: any[] = [
    {
      "name": "Doanh thu",
      "series": [

      ]
    }
  ];
  dbOrderChart: any[] = [
    {
      "name": "S??? ????n h??ng",
      "series": [

      ]
    }
  ];
  DBcategoryChart: any[] = []

  DBtopSaleProduct: any[] = []
  DBtopSaleProductCount = 1


  promoList: Promotion[] = []
  pageNumberPromo = 1
  pageSizePromo = 5
  orderPromo = "Id"
  statusPromo = 99
  collectionSizePromo = 0
  orderDirPromo: any = "Asc"

  isCreatingPromo = false
  isEditingPromo = false
  isDeletingPromo = false
  editingPromo!: Promotion
  deletingPromo!: Promotion

  rf9!: FormGroup
  rf10!: FormGroup

  isGettingPromoInfo = false
  selectedPromotion!: Promotion
  selectedPromotionInfo: PromotionInfo[] = []

  isCreatingPromoInfo = false
  isEditingPromoInfo = false
  isDeletingPromoInfo = false
  editingPromoInfo!: PromotionInfo
  deletingPromoInfo!: PromotionInfo

  rf11!: FormGroup
  rf12!: FormGroup

  isGettingSearchResult = false
  searchBy_Order = "Id"
  searchKey_Order!: string
  searchResult_Order: Order[] = []
  allOrder: Order[] = []
  allShippingInfo: any[] = []

  searchBy_User = "Name"
  searchKey_User!: string
  searchResult_User: User[] = []
  allUser: User[] = []

  searchBy_Employee = "Name"
  searchKey_Employee!: string
  searchResult_Employee: Employee[] = []
  allEmployee: Employee[] = []

  searchBy_Product = "Name"
  searchKey_Product!: string
  searchResult_Product: Product[] = []
  allProduct: Product[] = []

  tkdtDayFrom:any
  tkdtDayTo:any
  tkTop:any=10

  rf13!: FormGroup
  rf14!: FormGroup
  isAddingTag=false
  isEditTag=false
  isDeleteTag=false
  edittingTag!:Tag
  deletingTag!:Tag


  isAddingDiscountCode=false
  isEditDiscountCode=false
  isDeleteDiscountCode=false
  rf15!: FormGroup
  rf16!: FormGroup
  orderDiscountCode = "Id"
  orderDirDiscountCode = "Asc"
  pageSizeDiscountCode  = 5
  pageNumberDiscountCode  = 1
  collectionSizeDiscountCode = 0
  discountCodeList:DiscountCode[]=[]
  editingDCode!:DiscountCode
  deletingDCode!:DiscountCode

  searchBy_DCode = "Code"
  searchKey_DCode!: string
  searchResult_DCode: DiscountCode[] = []
  allDCode: DiscountCode[] = []

  shippingFee:number=0

  rf17!:FormGroup
  isEdittingUserCoins = false

  productWithNoPromo:Product[]=[]
  searchProductWithNoPromo:Product[]=[]

  category_productWithNoPromo="all"
  keyword_PWNP:string=""

  rf18!:FormGroup
  discountCodeJustCreate:DiscountCode[]=[]


  categoryList:Category[]=[]

  isCreatingProductCategory=false
  isDeletingProductCategory=false
  isEditingProductCategory=false

  deletingCategory!:Category

  rf19!:FormGroup
  rf20!:FormGroup

  @ViewChild('TABLE', { static: false })
  TABLE!: ElementRef;



  isDisconnect = false

  autoInterval: any
  newOrderInterval: any
  searchDataInterval: any

  constructor(private router: Router, private route: ActivatedRoute, private toast: HotToastService, private adminService: AdminService,
    private productService: ProductService, private orderService: OrderService, private authService: AuthenticationService,
    private modalService: NgbModal) { }
  searchProduct: OperatorFunction<string, readonly Product[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.allProduct.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )
  ngOnInit(): void {
    window.scrollTo(0,0)
    this.addRForm();
    this.getCategory()
    this.authService.getLocalStorage()
    this.user = this.authService.user
    this.isLogin = this.authService.isLogin
    if (!this.isLogin) {
      this.router.navigateByUrl("/error")
    }
    else {
      this.getAdminInfo()
      //check new order
      this.newOrderInterval = setInterval(() => {
        this.adminService.getDashboardInfo().subscribe(
          data => {
            this.isDisconnect = false
            // console.log("---------")
            // console.log(data)
            // console.log(this.dashboardInfo)
            if (data.totalOrder > this.dashboardInfo.totalOrder) {
            
              this.showNewOrderNotify = true
              this.numberOfNewOrder += data.totalOrder - this.dashboardInfo.totalOrder
              this.dashboardInfo = data
            }
          },
          error => {
            console.log(error)
            this.isDisconnect = true
          }
        )
      }, 5000)
    }

  }
  getCategory(){
    this.productService.getCategory().subscribe(
      data=>{
        this.categoryList=data.cate
      },
      error=>{
        console.log(error)
      }
    )
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.autoInterval) {
      clearInterval(this.autoInterval);
     // console.log("X??a interval admin!")
    }
    if (this.newOrderInterval) {
      clearInterval(this.newOrderInterval);
     // console.log("X??a interval admin!")
    }
    if (this.searchDataInterval) {
      clearInterval(this.searchDataInterval);
     // console.log("X??a interval admin!")
    }
  }
  addRForm() {
    this.rf1 = new FormGroup({
      email: new FormControl('',
        [Validators.required, Validators.email]),
      password: new FormControl('',
        [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]),
      username: new FormControl('',
        [Validators.required, Validators.minLength(3)]),
      phone: new FormControl("",
        [Validators.required, Validators.pattern('[- +()0-9]+')]),
      role: new FormControl('',
        [Validators.required])
    });
    this.rf1.controls["role"].setValue("User");
    this.rf2 = new FormGroup({
      name: new FormControl('',
        [Validators.required]),
      price: new FormControl('',
        [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]),
      des: new FormControl('',
        [Validators.required]),
      uis: new FormControl('',
        [Validators.required, Validators.pattern('^[0-9]*$')]),
      category: new FormControl('',
        [Validators.required]),
      status: new FormControl('',
        [Validators.required])
    });
    this.rf3 = new FormGroup({
      name: new FormControl('',
        [Validators.required]),
      price: new FormControl('',
        [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]),
      des: new FormControl('',
        [Validators.required]),
      uis: new FormControl('',
        [Validators.required, Validators.pattern('^[0-9]*$')]),
      category: new FormControl('',
        [Validators.required]),
      status: new FormControl('',
        [Validators.required])
    });
    this.rf4 = new FormGroup({
      status: new FormControl('',
        [Validators.required]),
      note: new FormControl('',
        [Validators.required])
    });
    this.rf5 = new FormGroup({
      email: new FormControl('',
        [Validators.required, Validators.email]),
      password: new FormControl('',
        [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]),
      username: new FormControl('',
        [Validators.required, Validators.minLength(3)]),
      phone: new FormControl("",
        [Validators.required, Validators.pattern('[- +()0-9]+')]),
      role: new FormControl('',
        [Validators.required]),
      address: new FormControl('',
        [Validators.required]),
      sex: new FormControl('',
        [Validators.required]),
      salary: new FormControl('',
        [Validators.required, Validators.pattern("^[0-9]*$")]),
      startDate: new FormControl('',
        [Validators.required]),
      cmnd: new FormControl('',
        [Validators.pattern('^[0-9]{12}$'), Validators.required]),
    });
    this.rf5.controls["role"].setValue("Employee");
    this.rf5.controls["sex"].setValue("M");
    this.rf6 = new FormGroup({
      username: new FormControl('',
        [Validators.required, Validators.minLength(3)]),
      phone: new FormControl("",
        [Validators.required, Validators.pattern('[- +()0-9]+')]),
      role: new FormControl('',
        [Validators.required]),
      address: new FormControl('',
        [Validators.required]),
      sex: new FormControl('',
        [Validators.required]),
      salary: new FormControl('',
        [Validators.required, Validators.pattern("^[0-9]*$")]),
      startDate: new FormControl('',
        [Validators.required]),
      cmnd: new FormControl('',
        [Validators.pattern('^[0-9]{12}$'), Validators.required]),
    });
    this.rf7 = new FormGroup({
      from: new FormControl('',
        [Validators.required]),
      to: new FormControl('',
        [Validators.required])
    });
    this.rf8 = new FormGroup({
      from: new FormControl('',
        [Validators.required]),
      to: new FormControl('',
        [Validators.required])
    });
    this.rf9 = new FormGroup({
      name: new FormControl('',
        [Validators.required]),
      description: new FormControl('',
        [Validators.required]),
      startDate: new FormControl('',
        [Validators.required])
      ,
      endDate: new FormControl('',
        [Validators.required])
    });
    this.rf10 = new FormGroup({
      name: new FormControl('',
        [Validators.required]),
      description: new FormControl('',
        [Validators.required]),
      startDate: new FormControl('',
        [Validators.required])
      ,
      endDate: new FormControl('',
        [Validators.required]),
      status: new FormControl('',
        [Validators.required]),
      visible: new FormControl('',
        [Validators.required])
    });
    this.rf11 = new FormGroup({
      idSP: new FormControl('',
        [Validators.required]),
      nameSP: new FormControl('',
        [Validators.required]),
      priceSP: new FormControl('',
        [Validators.required]),
      type: new FormControl('',
        [Validators.required]),
      number: new FormControl('',
        [Validators.required, Validators.pattern('^[0-9]*$')])
    });
    this.rf12 = new FormGroup({
      idSP: new FormControl('',
        [Validators.required]),
      nameSP: new FormControl('',
        [Validators.required]),
      priceSP: new FormControl('',
        [Validators.required]),
      type: new FormControl('',
        [Validators.required]),
      number: new FormControl('',
        [Validators.required, Validators.pattern('^[0-9]*$')])
    });
    this.rf13 = new FormGroup({
      name: new FormControl('',
        [Validators.required])
    });
    this.rf14 = new FormGroup({
      name: new FormControl('',
        [Validators.required])
    });
    this.rf15 = new FormGroup({
      code: new FormControl('',
        [Validators.required]),
      type: new FormControl('',
        [Validators.required]),
      number: new FormControl('',
        [Validators.required, Validators.pattern('^[0-9]*$')]),
      startDate: new FormControl('',
        [Validators.required]),
      endDate: new FormControl('',
        [Validators.required]),
    });
    this.rf16 = new FormGroup({
      code: new FormControl('',
        [Validators.required]),
      type: new FormControl('',
        [Validators.required]),
      number: new FormControl('',
        [Validators.required, Validators.pattern('^[0-9]*$')]),
      status: new FormControl('',
        [Validators.required]),
      startDate: new FormControl('',
        [Validators.required]),
      endDate: new FormControl('',
        [Validators.required]),
    });
    this.rf17 = new FormGroup({
      userID: new FormControl('',
        [Validators.required]),
      coins: new FormControl('',
        [Validators.required, Validators.pattern('^[0-9]*$')]),
    });
    this.rf18 = new FormGroup({
      type: new FormControl('',
        [Validators.required]),
      time: new FormControl('',
        [Validators.required, Validators.pattern('^[0-9]*$')]),
      number: new FormControl('',
        [Validators.required, Validators.pattern('^[0-9]*$')]),
      startDate: new FormControl('',
        [Validators.required]),
      endDate: new FormControl('',
        [Validators.required]),
    });

    this.rf19 = new FormGroup({
      name: new FormControl('',
        [Validators.required]),
    });
    this.rf20 = new FormGroup({
      id: new FormControl('',
        [Validators.required]),
      name: new FormControl('',
        [Validators.required]),
    });

    let to = new Date;
    let from = new Date;
    from.setDate(from.getDate() - 7);
    this.tkdtDayFrom=formatDate(from, 'yyyy-MM-dd', 'en')
    this.tkdtDayTo=formatDate(to, 'yyyy-MM-dd', 'en')
    this.rf7.controls["from"].setValue(formatDate(from, 'yyyy-MM-dd', 'en'));
    this.rf7.controls["to"].setValue(formatDate(to, 'yyyy-MM-dd', 'en'));
    this.rf8.controls["from"].setValue(formatDate(from, 'yyyy-MM-dd', 'en'));
    this.rf8.controls["to"].setValue(formatDate(to, 'yyyy-MM-dd', 'en'));
    this.rf9.controls["startDate"].setValue(formatDate(to, 'yyyy-MM-dd', 'en'));
    this.rf9.controls["endDate"].setValue(formatDate(to, 'yyyy-MM-dd', 'en'));
    this.rf10.controls["startDate"].setValue(formatDate(to, 'yyyy-MM-dd', 'en'));
    this.rf10.controls["endDate"].setValue(formatDate(to, 'yyyy-MM-dd', 'en'));
  }

  selectedItemProduct(item: any, modal: any) {
    this.showFormError = false
    this.editingProduct = item.item
    this.rf3.controls["name"].setValue(this.editingProduct.name)
    this.rf3.controls["price"].setValue(this.editingProduct.price)
    this.rf3.controls["des"].setValue(this.editingProduct.description)
    this.rf3.controls["uis"].setValue(this.editingProduct.unitInStock)
    this.rf3.controls["category"].setValue(this.editingProduct.category)
    this.proImgUrl = this.editingProduct.imgUrl
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
  }
  getSearchData() {

    this.searchDataInterval = setInterval(() => {
      this.adminService.getProducts("all", "Id", 1, 999, "Asc").subscribe(
        data => {
          this.allProduct = data.result
          for(let i=0;i<this.allProduct.length;i++){
            this.allProduct[i].numSales=data.saleNum[i]
            this.allProduct[i].tags=data.productTags[i]
            //console.log(this.productList[i])
          }
          //console.log(this.allProduct)
          this.isDisconnect = false
        },
        error => {

          this.isDisconnect = true
          console.log(error)
        }
      )
      this.adminService.getOrders(99, "OrderDate", 1, 99, "Desc").subscribe(
        data => {
          //console.log(data)
          this.isDisconnect = false
          this.allOrder = data.result
          this.allShippingInfo = data.shippingInfos
        },
        error => {

          this.isDisconnect = true
          console.log(error)
        }
      )
      this.adminService.getUsers(this.orderUser, "User", this.orderDirUser).subscribe(
        data => {
          //console.log(data)
          this.isDisconnect = false
          this.allUser = data.result
          this.allUser.forEach((element, index: number) => {
            element.roles = data.roles[index]
            element.orderCount = data.orderCount[index]
          });
          //console.log(this.allUser)
        },
        error => {
          console.log(error)
          this.isDisconnect = true
        }
      )
      this.adminService.getEmployees(this.orderEmployee, "all", this.orderDirEmployee).subscribe(
        data => {
          this.isDisconnect = false
          for (let i = 0; i < data.count; i++) {
            let e = new Employee
            e = data.result[i]
            e.roles = data.roles[i]
            e.Address = data.employeeInfo[i].address
            e.CMND = data.employeeInfo[i].cmnd
            e.Salary = data.employeeInfo[i].salary
            e.Sex = data.employeeInfo[i].sex
            e.StartDate = data.employeeInfo[i].startDate
            e.Status = data.employeeInfo[i].status
            this.allEmployee.push(e)

          }
        },
        error => {
          console.log(error)
          this.isDisconnect = true
        }
      )
      this.adminService.getDiscountCode("Id",1,999,"Asc").subscribe(
        data=>{
          this.isDisconnect = false
          this.allDCode=data.result
        },
        error=>{
          console.log(error)
          this.isDisconnect = true
        }
      )
    }, 10000)
  }

  signOut() {

    this.authService.signOut()
    this.isLogin = this.authService.isLogin
    this.user = this.authService.user
    this.router.navigateByUrl('/home')
  }
  getDBInfo() {
    this.adminService.getDashboardInfo().subscribe(
      data => {
        if(this.dashboardInfo.totalOrder==0){
          this.dashboardInfo = data
        }
        if (data.totalOrder > this.dashboardInfo.totalOrder) {
            
          this.showNewOrderNotify = true
          this.numberOfNewOrder += data.totalOrder - this.dashboardInfo.totalOrder
          this.dashboardInfo = data
        }
        //console.log(this.dashboardInfo)
        
        this.isLoading = false
        this.isDisconnect = false
      },
      error => {
        console.log(error)
        this.isDisconnect = true
      }
    )

    let from = this.rf7.controls["from"].value
    let to = this.rf7.controls["to"].value
    this.dbSaleChartData[0]["series"] = []
    this.dbOrderChart[0]["series"] = []
    this.adminService.getSalesChart(from, to).subscribe(
      data => {
        this.isDisconnect = false
        data.result.forEach((element: any) => {
          this.dbSaleChartData[0]["series"].push(
            { name: element.Date, value: Number(element.Total) }
          )
          this.dbOrderChart[0]["series"].push(
            { name: element.Date, value: Number(element.NumberOfOrder) }
          )
        });
        this.dbOrderChart = [...this.dbOrderChart]
        this.dbSaleChartData = [...this.dbSaleChartData]
      },
      error => {
        console.log(error)
        this.isDisconnect = true
      }
    )
    this.adminService.getTopProductChart(5).subscribe(
      data => {
        this.isDisconnect = false
        this.DBtopSaleProductCount = data.maxCount
        this.DBtopSaleProduct = []
        this.DBcategoryChart = []
        data.result.forEach((element: any) => {
          this.DBtopSaleProduct.push({ name: element.product.name, count: element.quantity,imgUrl: element.product.imgUrl })

        });
        data.cateCount.forEach((element: any) => {
          this.DBcategoryChart.push({ name: element["name"], value: element["value"] })
        });
        this.DBcategoryChart = [...this.DBcategoryChart]
      },
      error => {
        console.log(error)
        this.isDisconnect = true
      }
    )
  }
  getAdminInfo() {
    this.isLoading = true
    this.authService.getUserInfo(this.user.id).subscribe(
      data => {

        this.user = data.user
        this.user.roles = data.roles
        if (this.user.roles[0] != "Administrator") {
          this.router.navigateByUrl("/error")
        }
        this.getSearchData()
        this.getDBInfo()
        
        this.autoInterval = setInterval(() => {
          this.autoReload()
        }, 3000)
      },
      error => {
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }
  randomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  onPageSizeCategoryChange() {
    this.pageNumberProduct = 1
    this.getProduct()
  }
  getProduct() {
    this.adminService.getProducts(this.category, this.orderProduct, this.pageNumberProduct, this.pageSizeProduct, this.orderDirProduct).subscribe(
      data => {
  
        for(let i=0;i<data.result.length;i++){
          data.result[i].numSales=data.saleNum[i]
          data.result[i].tags=data.productTags[i]
        }
        //console.log(this.arraysEqual(this.productList,data.result))
        if(!this.arraysEqual(this.productList,data.result)){
          this.productList = data.result
          this.collectionSizeProduct = data.count
          for(let i=0;i<this.productList.length;i++){
            this.productList[i].numSales=data.saleNum[i]
            this.productList[i].tags=data.productTags[i]
            //console.log(this.productList[i])
          }
        }

        this.isDisconnect = false
      },
      error => {
        console.log(error)
        this.isDisconnect = true
      }
    )
  }
  getDisplayCategory(cate: string): string {
    switch (cate) {
      case "Fruit":
        return "Tr??i c??y"
      case "Vegetable":
        return "Rau c???"
      case "Snack":
        return "Snack"
      case "Confectionery":
        return "B??nh k???o"
      case "CannedFood":
        return "????? h???p"
      case "AnimalProduct":
        return "Th???t t????i s???ng"
      default:
        return ""
    }
  }
  onPageSizeStatusChage() {

    this.pageNumberOrder = 1
    this.getOrder()
  }
  getUser() {

    this.pageNumberUser = 1
    this.adminService.getUsers(this.orderUser, "User", this.orderDirUser).subscribe(
      data => {
       // console.log(data)
        this.isDisconnect = false
        this.userList = data.result
        this.userList.forEach((element, index: number) => {
          element.roles = data.roles[index]
          element.orderCount = data.orderCount[index]
        });
        this.getPagedUserList()
        //console.log(this.userList)
      },
      error => {
        console.log(error)
        this.isDisconnect = true
      }
    )
  }
  getPagedUserList() {
    this.pagedUserList = []
    for (let i = 0; i < this.pageSizeUser; i++) {
      if (this.userList[i + this.pageSizeUser * (this.pageNumberUser - 1)]) {
        this.pagedUserList.push(this.userList[i + this.pageSizeUser * (this.pageNumberUser - 1)])
      }

    }
  }
  getOrder() {
    this.adminService.getOrders(this.status, this.orderOrder, this.pageNumberOrder, this.pageSizeOrder, this.orderDirOrder).subscribe(
      data => {
        //console.log(data)
        this.orderList = data.result
        this.shippingInfos = data.shippingInfos
        this.collectionSizeOrder = data.count
        this.isDisconnect = false
      },
      error => {
        console.log(error)
        this.isDisconnect = true
      }
    )
  }
  autoReload() {
    switch (this.active_tab) {
      case "db":
        this.isLoading = false
        //this.getDBInfo()
        break
      case "order":
        this.getOrder()
        this.isLoading = false
        break
      case "product":
        this.getProduct()
        this.isLoading = false
        break
      case "user":
       this.getUser()
        this.isLoading = false
        break
      case "employee":
        this.getEmployee()
        this.isLoading = false
        break
      case "tk":
        
        this.isLoading = false
        break
      case "pm":
        this.getPromotion()
        this.isLoading = false
        break
      case "dc":
        this.getDiscountCodes()
        this.isLoading = false
        break
    }
  }
  switchTab(s: string) {
    window.scrollTo(0, 0)
    this.active_tab = s
    this.isLoading = true
    switch (s) {
      case "db":
        this.isLoading = false
        this.getDBInfo()
        break
      case "order":
        this.getOrder()
        this.isLoading = false
        break
      case "product":
        this.getProduct()
        this.isLoading = false
        break
      case "user":
        this.getUser()
        this.isLoading = false
        break
      case "employee":
        this.getEmployee()
        this.isLoading = false
        break
      case "tk":
        this.getSaleChart()
        this.getOrderChart()
        this.getProductChart()
        this.getCateChart()
        this.getTopSaleProduct()
        this.isLoading = false
        break
      case "pm":
        this.getPromotion()
        this.isLoading = false
        break
      case "dc":
        this.getDiscountCodes()
        this.isLoading = false
        break
    }
  }
  openEditUserModal(changeIMG: any, u: User) {
    this.editingUser = u
    this.newName = this.editingUser.displayName
    this.newPhone = this.editingUser.phoneNumber
    this.urlIMG = this.editingUser.imgUrl
    this.modalService.open(changeIMG, { ariaLabelledBy: 'modal-basic-title' })
  }
  openAddUserModal(newUser: any) {
    this.urlIMG = this.defaultImgUrl
    this.showFormError = false
    this.rf1.reset()
    this.rf1.controls["role"].setValue("User")
    this.modalService.open(newUser, { ariaLabelledBy: 'modal-basic-title' })
  }
  openDeleteUserModal(deleteUser: any, id: string) {
    this.selectedUserId = id
    this.modalService.open(deleteUser, { ariaLabelledBy: 'modal-basic-title' })
  }
  openUserOrderModal(user_order: any, user: User) {
    this.selectedUser = user
   // this.selectedUserOrderFilter=this.selectedUser.orders
   // console.log(this.selectedUser)
    this.modalService.open(user_order,  { size: 'xl', ariaLabelledBy: 'modal-basic-title' })
  }
  selectFile(event: any) { //Angular 11, for stricter type
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      this.msg = 'B???n ph???i ch???n 1 h??nh ???nh';
      return;
    }

    var mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.msg = "File ph???i l?? h??nh ???nh";
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      this.msg = "";
      this.urlIMG = reader.result;
    }
  }
  saveProfile() {
    this.upLoadAndUpdateProfile()

  }
  upLoadAndUpdateProfile() {
    this.isUpdateProfile = true
    if (this.urlIMG == this.editingUser.imgUrl) {
      this.uploadedUrlImg = this.urlIMG
      this.updateProfile()

    }
    else {
      this.authService.upLoadIMG(this.urlIMG).subscribe(
        data => {
          //console.log(data)
          this.uploadedUrlImg = data.secure_url
          //console.log(this.uploadedUrlImg)
          this.updateProfile()
          this.isUpdateProfile = false
        },
        error => {
          this.isUpdateProfile = false
          console.log(error)
          this.toast.error(" An error has occurred ! Try again !")
        }
      )
    }

  }
  updateProfile() {
    this.authService.updateProfile(this.uploadedUrlImg, this.newPhone, this.newName, this.editingUser.id).subscribe(
      data => {
        //console.log(data)
        this.modalService.dismissAll()
        this.getUser()
        this.toast.success("Ch???nh s???a th??nh c??ng")
        this.isUpdateProfile = false
      },
      error => {
        this.isUpdateProfile = false
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }
  createProfile() {
    this.isCreatingUser = true
    this.showFormError = true
    if (this.rf1.valid) {

      // console.log(this.rf1.controls['email'].value)
      // console.log(this.rf1.controls['password'].value)
      // console.log(this.rf1.controls['username'].value)
      // console.log(this.rf1.controls['phone'].value)
      // console.log(this.rf1.controls['role'].value)
      this.adminService.createUser(this.rf1.controls['email'].value, this.rf1.controls['password'].value,
        this.rf1.controls['username'].value, this.rf1.controls['phone'].value, this.rf1.controls['role'].value, this.urlIMG).subscribe(
          data => {
            //console.log(data)
            this.getUser()
            this.isCreatingUser = false
            this.toast.success("Th??m th??nh c??ng!")
            this.modalService.dismissAll()
          },
          error => {
            console.log(error.error.error)
            this.toast.error(error.error.error)
            this.isCreatingUser = false
            //this.modalService.dismissAll()
          }
        )


    }
    else {
      this.isCreatingUser = false
      this.toast.error("D??? li???u nh???p ch??a h???p l???. Xin h??y th??? l???i!")
    }

  }
  deleteProfile() {

    //console.log(this.selectedUserId)
    this.isDeletingUser = true
    this.adminService.deleteUser(this.selectedUserId).subscribe(
      data => {
        console.log(data)
        this.isDeletingUser = false
        this.getUser()
        this.toast.success("X??a th??nh c??ng")
        this.modalService.dismissAll()
      },
      error => {
        this.toast.error(" An error has occurred ! Try again !")
        this.isDeletingUser = false
      }
    )
  }
  openAddProductModal(add_product: any) {
    this.showFormError = false
    this.proImgUrl = this.defaultProImgUrl
    this.rf2.reset()
    this.rf2.controls["category"].setValue("1")
    this.rf2.controls["status"].setValue("1")
    this.rf2.controls["uis"].setValue(100)
    
    this.modalService.open(add_product, { ariaLabelledBy: 'modal-basic-title' })
  }
  openEditProductModal(newPro: any, p: Product) {
    this.showFormError = false
    this.editingProduct = p
    this.rf3.controls["name"].setValue(this.editingProduct.name)
    this.rf3.controls["price"].setValue(this.editingProduct.price)
    this.rf3.controls["des"].setValue(this.editingProduct.description)
    this.rf3.controls["uis"].setValue(this.editingProduct.unitInStock)
    this.rf3.controls["category"].setValue(this.editingProduct.category.id)
    this.rf3.controls["status"].setValue(this.editingProduct.status)
    this.proImgUrl = this.editingProduct.imgUrl
    this.modalService.open(newPro, { ariaLabelledBy: 'modal-basic-title' })
  }
  openDeleteProductModal(deletePro: any, id: number) {
    this.deletingProductId = id
    this.modalService.open(deletePro, { ariaLabelledBy: 'modal-basic-title' })
  }
  addProduct() {
    this.showFormError = true
    this.isCreatingProduct = true
    if (this.rf2.valid) {

      if (this.proImgUrl != this.defaultProImgUrl) {
        this.authService.upLoadIMG(this.proImgUrl).subscribe(
          data => {
            this.proImgUrl = data.secure_url
            this.createProduct()
          },
          error => {
            this.isCreatingProduct = false
            console.log(error)
            this.toast.error(" An error has occurred ! Try again !")
          }
        )
      }
      else {
        this.createProduct()
      }
    }
    else {
      this.isCreatingProduct = false
      this.toast.error("D??? li???u nh???p ch??a h???p l???. Xin h??y th??? l???i!")
    }

  }
  createProduct() {
    let today = formatDate(Date.now(), 'dd-MM-yyyy HH:mm:ss', 'en');
    this.adminService.createProduct(this.rf2.controls['name'].value, this.rf2.controls['price'].value, this.rf2.controls['des'].value,
      this.rf2.controls['uis'].value, this.rf2.controls['category'].value, this.proImgUrl, today, this.rf2.controls["status"].value).subscribe(
        data => {
          this.toast.success("Th??m th??nh c??ng!")
          this.isCreatingProduct = false
          this.modalService.dismissAll()
          this.getProduct()
        },
        error => {
          console.log(error)
          this.isCreatingProduct = false
          this.toast.error(" An error has occurred ! Try again !")
        }
      )
  }
  tryEditProduct() {
    this.showFormError = true
    this.isEditingProduct = true
    if (this.rf3.valid) {
      if (this.proImgUrl != this.editingProduct.imgUrl) {
        this.authService.upLoadIMG(this.proImgUrl).subscribe(
          data => {
            this.proImgUrl = data.secure_url
            this.editProduct()
          },
          error => {
            console.log(error)
            this.isEditingProduct = false
            this.toast.error(" An error has occurred ! Try again !")
          }
        )
      }
      else {
        this.editProduct()
      }
    }
    else {
      this.isEditingProduct = false
      this.toast.error("D??? li???u nh???p ch??a h???p l???. Xin h??y th??? l???i!")
    }

  }
  editProduct() {
    let today = formatDate(Date.now(), 'dd-MM-yyyy HH:mm:ss', 'en');
    this.adminService.editProduct(this.editingProduct.id, this.rf3.controls['name'].value, this.rf3.controls['price'].value, this.rf3.controls['des'].value,
      this.rf3.controls['uis'].value, this.rf3.controls['category'].value, this.proImgUrl, today, this.rf3.controls["status"].value).subscribe(
        data => {
          this.toast.success("Ch???nh s???a th??nh c??ng!")
          this.isEditingProduct = false
          this.modalService.dismissAll()
          this.getProduct()
        },
        error => {
          console.log(error)
          this.isEditingProduct = false
          this.toast.error(" An error has occurred ! Try again !")
        }
      )
  }
  deleteProduct() {
    this.isDeletingProduct = true
    this.adminService.deleteProduct(this.deletingProductId).subscribe(
      data => {

        this.toast.success("X??a th??nh c??ng!")
        this.getProduct()
        this.modalService.dismissAll()
        this.isDeletingProduct = false
      },
      error => {
        console.log(error)
        this.isDeletingProduct = false
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }
  selectFileProduct(event: any) { //Angular 11, for stricter type
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      this.msg = 'B???n ph???i ch???n h??nh ???nh';
      return;
    }

    var mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.msg = "File ph???i l?? h??nh ???nh";
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      this.msg = "";
      this.proImgUrl = reader.result;

    }
  }
  openOrderInfoModal(info: any, o: Order) {
    this.showFormError = false
    this.isGettingOrderDetail = true
    this.selectedOrder = o
    //console.log( this.selectedOrder)
    this.orderService.getOrderDetails(o.id).subscribe(
      data => {
        this.selectedOrder.orderDetails = data.orderDetails
        this.selectedOrder.discountCode = data.discountCode
        console.log(this.selectedOrder.orderDetails)
        this.getOrderShippingInfo(o.id)
        this.isGettingOrderDetail = false
      },
      error => {
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
    this.modalService.open(info, { ariaLabelledBy: 'modal-basic-title' })
  }
  getOrderShippingInfo(id: any) {
    this.orderService.getShippingInfo(id).subscribe(
      data => {
        this.selectedShippingInfo = data.result
      },
      error => {
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }
  openEditOrderInfoModal(info: any, o: Order) {
    this.showFormError = false
    this.selectedOrder = o
    this.rf4.controls["status"].setValue(o.status)
    this.rf4.controls["note"].setValue(o.note)
    this.modalService.open(info, { ariaLabelledBy: 'modal-basic-title' })
  }
  openDeleteOrderInfoModal(info: any, o: Order) {
    this.showFormError = false
    this.selectedOrder = o
    this.modalService.open(info, { ariaLabelledBy: 'modal-basic-title' })
  }
  editOrder() {
    this.isEditingOrder = true
    this.selectedOrder.status = this.rf4.controls["status"].value
    this.selectedOrder.note = this.rf4.controls["note"].value
    this.adminService.editOrder(this.selectedOrder).subscribe(
      data => {
        this.getOrder()
        this.isEditingOrder = false
        this.toast.success("Ch???nh s???a th??nh c??ng!")
        this.modalService.dismissAll()
      },
      error => {
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }
  deleteOrder() {
    this.isDeletingOrder = true
    this.adminService.deleteOrder(this.selectedOrder.id).subscribe(
      data => {

        this.toast.success("X??a th??nh c??ng!")
        this.getOrder()
        this.modalService.dismissAll()
        this.isDeletingOrder = false
      },
      error => {
        console.log(error)
        this.isDeletingOrder = false
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }
  getEmployee() {
    this.employeeList = []
    this.adminService.getEmployees(this.orderEmployee, this.roleEmployee, this.orderDirEmployee).subscribe(
      data => {
        //console.log(data)
        this.isDisconnect = false
        for (let i = 0; i < data.count; i++) {
          let e = new Employee
          e = data.result[i]
          e.roles = data.roles[i]
          e.Address = data.employeeInfo[i].address
          e.CMND = data.employeeInfo[i].cmnd
          e.Salary = data.employeeInfo[i].salary
          e.Sex = data.employeeInfo[i].sex
          e.StartDate = data.employeeInfo[i].startDate
          e.Status = data.employeeInfo[i].status
          this.employeeList.push(e)

        }
        //console.log(this.employeeList)
        this.getPagedEmployee()
      },
      error => {
        console.log(error)
        this.isDisconnect = true
      }
    )
  }
  getPagedEmployee() {
    this.pagedEmployeeList = []
    for (let i = 0; i < this.pageSizeEmployee; i++) {
      if (this.employeeList[i + this.pageSizeEmployee * (this.pageNumberEmployee - 1)]) {
        this.pagedEmployeeList.push(this.employeeList[i + this.pageSizeEmployee * (this.pageNumberEmployee - 1)])
      }

    }
  }
  openAddEmployeeModal(modal: any) {
    this.showFormError = false
    this.urlIMG = this.defaultImgUrl
    this.rf5.reset()
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
  }
  openEditEmployeeModal(modal: any, e: Employee) {
    this.editingEmployee = e
    this.showFormError = false
    this.urlIMG = e.imgUrl
    this.rf6.controls["address"].setValue(e.Address)
    this.rf6.controls["cmnd"].setValue(e.CMND)
    this.rf6.controls["salary"].setValue(e.Salary)
    this.rf6.controls["sex"].setValue(e.Sex)
    this.rf6.controls["startDate"].setValue(e.StartDate)
    this.rf6.controls["username"].setValue(e.displayName)
    this.rf6.controls["role"].setValue(e.roles[0])
    this.rf6.controls["phone"].setValue(e.phoneNumber)
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
  }
  openDeleteEmployeeModal(modal: any, e: Employee) {
    this.deletingEmployee = e
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
  }
  openShipperHistoryModal(modal: any, id: any) {
    this.selectedShipperId = id
    this.selectedShipperHistory = []
    this.orderService.getShipperOrderHistory(this.selectedShipperId).subscribe(
      data => {
        console.log(data)
        this.selectedShipperHistory = data.sil
      },
      error => {
        this.toast.error("C?? l???i x???y ra! Xin h??y th??? l???i.")
        console.log(error)
      }
    )
    this.modalService.open(modal, {  size: 'xl',ariaLabelledBy: 'modal-basic-title' })
  }
  addEmployee() {
    this.showFormError = true
    this.isCreatingEmployee = true
    if (this.rf5.valid) {
      let e = new Employee
      let p = this.rf5.controls["password"].value
      e.phoneNumber = this.rf5.controls["phone"].value
      e.Address = this.rf5.controls["address"].value
      e.CMND = this.rf5.controls["cmnd"].value
      e.Salary = this.rf5.controls["salary"].value
      e.Sex = this.rf5.controls["sex"].value
      e.StartDate = this.rf5.controls["startDate"].value
      e.Status = 0
      e.displayName = this.rf5.controls["username"].value
      e.email = this.rf5.controls["email"].value
      e.roles = []
      e.roles.push(this.rf5.controls["role"].value)
      //console.log(e)
      //console.log(this.urlIMG)
      // this.toast.success("valid")
      if (this.urlIMG != this.defaultImgUrl) {
        this.authService.upLoadIMG(this.urlIMG).subscribe(
          data => {
            //console.log(data)
            e.imgUrl = data.secure_url
            this.createEmployee(e, p)
          },
          error => {
            this.toast.error("Up ???nh kh??ng ???????c")
            console.log(error)
          }
        )
      }
      else {
        e.imgUrl = this.defaultImgUrl
        this.createEmployee(e, p)
      }
    }
    else {
      this.toast.error("Th??ng tin nh???p ch??a h???p l???")
    }
  }
  createEmployee(e: Employee, p: any) {

    this.adminService.createEmployee(e, p).subscribe(
      data => {
        //console.log(data)
        this.toast.success("Th??m nh??n vi??n th??nh c??ng!")
        this.getEmployee()
        this.isCreatingEmployee = false

        this.modalService.dismissAll()
      },
      error => {
        console.log(error.error.error)
        this.toast.error(error.error.error)
        this.isCreatingEmployee = false
        console.log(error)
      }
    )
  }
  editEmployee() {
    this.showFormError = true
    if (this.rf6.valid) {
      this.isEditingEmployee = true
      this.editingEmployee.Address = this.rf6.controls["address"].value
      this.editingEmployee.CMND = this.rf6.controls["cmnd"].value
      this.editingEmployee.Salary = this.rf6.controls["salary"].value
      this.editingEmployee.Sex = this.rf6.controls["sex"].value
      this.editingEmployee.StartDate = this.rf6.controls["startDate"].value
      this.editingEmployee.Status = 0
      this.editingEmployee.displayName = this.rf6.controls["username"].value
      this.editingEmployee.roles = []
      this.editingEmployee.roles.push(this.rf6.controls["role"].value)
      if (this.urlIMG != this.editingEmployee.imgUrl) {
        this.authService.upLoadIMG(this.urlIMG).subscribe(
          data => {
            // console.log(data)
            this.editingEmployee.imgUrl = data.secure_url
            this.updateEmployee()
          },
          error => {
            this.toast.error("Up ???nh kh??ng ???????c")
            console.log(error)
          }
        )
      }
      else {
        this.updateEmployee()
      }
    }
    else {
      this.toast.error("D??? li???u nh???p ch??a h???p l???!")
    }
  }
  updateEmployee() {
    this.adminService.editEmployee(this.editingEmployee, this.editingEmployee.id).subscribe(
      data => {
        // console.log(data)
        this.toast.success("Ch???nh s???a nh??n vi??n th??nh c??ng!")
        this.getEmployee()
        this.isEditingEmployee = false

        this.modalService.dismissAll()
      },
      error => {
        this.toast.error("C?? l???i x???y ra ! Xin h??y s???a l???i!")
        this.isEditingEmployee = false
        console.log(error)
      }
    )
  }
  deleteEmployee() {

    //console.log(this.selectedUserId)
    this.isDeletingEmployee = true
    this.adminService.deleteEmployee(this.deletingEmployee.id).subscribe(
      data => {
        //console.log(data)
        this.getEmployee()
        this.isDeletingEmployee = false
        this.toast.success("X??a nh??n vi??n th??nh c??ng")!
        this.modalService.dismissAll()
      },
      error => {
        this.toast.error(" An error has occurred ! Try again !")
        console.log(error)
        this.isDeletingEmployee = false
      }
    )
  }
  getSaleChart() {
    let from = this.rf7.controls["from"].value
    let to = this.rf7.controls["to"].value
    this.saleChart[0]["series"] = []
    this.adminService.getSalesChart(from, to).subscribe(
      data => {
        console.log(data)
        data.result.forEach((element: any) => {
          this.saleChart[0]["series"].push(
            { name: element.Date, value: Number(element.Total) }
          )

        });
        this.saleChart = [...this.saleChart]
      },
      error => {
        console.log(error)
        this.toast.error("C?? l???i x???y ra! Xin h??y th??? l???i.")
      }
    )
  }
  getOrderChart() {
    let from = this.rf8.controls["from"].value
    let to = this.rf8.controls["to"].value
    this.orderChart[0]["series"] = []
    this.adminService.getSalesChart(from, to).subscribe(
      data => {
        data.result.forEach((element: any) => {
          this.orderChart[0]["series"].push(
            { name: element.Date, value: Number(element.NumberOfOrder) }
          )
        });
        this.orderChart = [...this.orderChart]

      },
      error => {
        console.log(error)
        this.toast.error("C?? l???i x???y ra! Xin h??y th??? l???i.")
      }
    )
  }
  getProductChart() {
    this.productChart = []
    this.adminService.getProductChart().subscribe(
      data => {
        //console.log(data.result)
        this.productChart = data.result

        this.productChart = [...this.productChart]
      },
      error => {
        console.log(error)
        this.toast.error("C?? l???i x???y ra! Xin h??y th??? l???i.")
      }
    )
  }
  getCateChart() {
    this.categoryChart = []
    this.adminService.getTopProductChart(10).subscribe(
      data => {
        //console.log(data)
        data.cateCount.forEach((element: any) => {
          //console.log(element)
          this.categoryChart.push({ name: element["name"], value: element["value"] })
        });
        this.categoryChart = [...this.categoryChart]
      },
      error => {
        console.log(error)
        this.toast.error("C?? l???i x???y ra! Xin h??y th??? l???i.")
      }
    )
  }

  getTopSaleProduct() {
    this.topSaleProduct = []
    this.adminService.getTopProductChart(this.numberOfTopProduct).subscribe(
      data => {
        this.topSaleProductCount = data.maxCount
        data.result.forEach((element: any) => {
          this.topSaleProduct.push({ name: element.product.name, count: element.quantity,imgUrl:element.product.imgUrl })

        });
        //console.log(topSaleProductCount)
      },
      error => {
        console.log(error)
        this.toast.error("C?? l???i x???y ra! Xin h??y th??? l???i.")
      }
    )
  }

  onSelect(data: any): void {
    //console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    //console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  getPromotion() {
    this.adminService.getPromotion(this.statusPromo, this.orderPromo, this.pageNumberPromo, this.pageSizePromo
      , this.orderDirPromo).subscribe(
        data => {
          // console.log(data)
          this.isDisconnect = false
          this.promoList = data.result
          this.collectionSizePromo = data.count
        },
        error => {
          console.log(error)
          this.isDisconnect = true
        }
      )
  }

  openCreatePromoModal(modal: any) {
    this.showFormError = false
    this.rf9.reset()
    let to = new Date;
    let from = new Date;
    from.setDate(from.getDate() - 7);
    this.rf9.controls["startDate"].setValue(formatDate(to, 'yyyy-MM-dd', 'en'));
    this.rf9.controls["endDate"].setValue(formatDate(to, 'yyyy-MM-dd', 'en'));
    this.urlIMG = this.defaultImgUrl
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
  }

  openEditPromoModal(modal: any, promo: Promotion) {
    this.showFormError = false
    this.urlIMG = promo.imgUrl
    this.editingPromo = promo
    this.rf10.controls["name"].setValue(promo.name);
    this.rf10.controls["description"].setValue(promo.description);
    this.rf10.controls["startDate"].setValue(promo.startDate);
    this.rf10.controls["endDate"].setValue(promo.endDate);
    this.rf10.controls["status"].setValue(promo.status);
    this.rf10.controls["visible"].setValue(promo.visible);
    this.urlIMG = promo.imgUrl;
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
  }

  openDeletePromoModal(modal: any, promo: Promotion) {
    this.showFormError = false
    this.deletingPromo = promo
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
  }

  openPromoInfo(modal: any, promo: Promotion) {
    this.selectedPromotion = promo
    this.isGettingPromoInfo = true
    this.getPromotionInfo(promo);
    this.modalService.open(modal, { size: 'xl', ariaLabelledBy: 'modal-basic-title' })
  }

  getPromotionInfo(promo: Promotion) {
    this.adminService.getPromotionInfo(promo.id).subscribe(
      data => {
        //console.log(data)
        this.selectedPromotionInfo = data.result;
        this.isGettingPromoInfo = false;
      },
      error => {
        this.isGettingPromoInfo = false;
        console.log(error);
        this.toast.error(" An error has occurred ! Try again !");
      }
    );
  }

  addPromo() {
    this.showFormError = true
    this.isCreatingPromo = true
    if (this.rf9.valid) {
      let valid = true
      var start = new  Date (this.rf9.controls["startDate"].value)
      var end = new  Date (this.rf9.controls["endDate"].value)
      if(end<=start){
        valid=false
      }
      // console.log(start)
      // console.log(end)
      // console.log(valid)
      if(valid){
        if (this.urlIMG != this.defaultProImgUrl) {
          this.authService.upLoadIMG(this.urlIMG).subscribe(
            data => {
              this.urlIMG = data.secure_url
              this.createPromo()
            },
            error => {
              this.isCreatingPromo = false
              console.log(error)
              this.toast.error(" An error has occurred ! Try again !")
            }
          )
        }
        else {
          this.createPromo()
        }
      }
      else{
        this.toast.error("D??? li???u nh???p ch??a h???p l???!")
        this.isCreatingPromo = false
      }
 
    }
    else {
      this.isCreatingPromo = false
      this.toast.error("D??? li???u nh???p ch??a h???p l???. Xin h??y th??? l???i!")
    }

  }
  createPromo() {
    let promo = new Promotion
    promo.name = this.rf9.controls["name"].value
    promo.description = this.rf9.controls["description"].value
    promo.endDate = this.rf9.controls["endDate"].value
    promo.imgUrl = this.urlIMG
    promo.startDate = this.rf9.controls["startDate"].value
    promo.status = 0
    this.adminService.createPromotion(promo).subscribe(
      data => {
        this.toast.success("Th??m khuy???n m??i th??nh c??ng!")
        this.getPromotion()
        this.isCreatingPromo = false

        this.modalService.dismissAll()
      },
      error => {
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }
  editPromo() {
    this.showFormError = true
    if (this.rf10.valid) {
      let valid = true
      var start = new  Date (this.rf10.controls["startDate"].value)
      var end = new  Date (this.rf10.controls["endDate"].value)
      if(end<=start){
        valid=false
      }
      if(valid){
        this.isEditingPromo = true
        this.editingPromo.name = this.rf10.controls["name"].value
        this.editingPromo.description = this.rf10.controls["description"].value
        this.editingPromo.endDate = this.rf10.controls["endDate"].value
        this.editingPromo.startDate = this.rf10.controls["startDate"].value
        this.editingPromo.status = this.rf10.controls["status"].value
        this.editingPromo.visible = this.rf10.controls["visible"].value
        if (this.urlIMG != this.editingPromo.imgUrl) {
          this.authService.upLoadIMG(this.urlIMG).subscribe(
            data => {
              // console.log(data)
              this.editingPromo.imgUrl = data.secure_url
              this.updatePromo()
            },
            error => {
              this.toast.error("Up ???nh kh??ng ???????c")
              console.log(error)
            }
          )
        }
        else {
          this.updatePromo()
        }
      }
      else{
        this.toast.error("D??? li???u nh???p ch??a h???p l???!")
      }
 
    }
    else {
      this.toast.error("D??? li???u nh???p ch??a h???p l???!")
    }
  }
  updatePromo() {
    this.adminService.editPromotion(this.editingPromo).subscribe(
      data => {
        //console.log(data)
        this.toast.success("Ch???nh s???a khuy???n m??i th??nh c??ng!")
        this.getPromotion()
        this.isEditingPromo = false

        this.modalService.dismissAll()
      },
      error => {
        this.toast.error("C?? l???i x???y ra ! Xin h??y s???a l???i!")
        this.isEditingPromo = false
        console.log(error)
      }
    )
  }
  deletePromo() {
    this.isDeletingPromo = true
    this.adminService.deletePromotion(this.deletingPromo.id).subscribe(
      data => {
        //console.log(data)
        this.toast.success("X??a khuy???n m??i th??nh c??ng!")
        this.getPromotion()
        this.isDeletingPromo = false

        this.modalService.dismissAll()
      },
      error => {
        this.toast.error("C?? l???i x???y ra ! Xin h??y s???a l???i!")
        this.isDeletingPromo = false
        console.log(error)
      }
    )
  }
  openChooseProductPromoModal(modal: any, promo: Promotion) {
    this.showFormError = false
    this.selectedPromotion = promo
    this.category_productWithNoPromo="all"
    this.getProductWithNoPromo(this.category_productWithNoPromo)
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', size: 'xl' })
  }
  openAddPromoInfo(pro: Product, modal: any) {
    this.rf11.controls["nameSP"].setValue(pro.name)
    this.rf11.controls["idSP"].setValue(pro.id)
    this.rf11.controls["priceSP"].setValue(pro.price)
    this.rf11.controls["type"].setValue("0")
    this.rf11.controls["number"].setValue("10")
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
  }
  openEditPromoInfo(promo: PromotionInfo, pro: Product, modal: any) {
    this.editingPromoInfo = promo
    //console.log(this.editingPromoInfo)
    this.rf12.controls["nameSP"].setValue(pro.name)
    this.rf12.controls["idSP"].setValue(pro.id)
    this.rf12.controls["priceSP"].setValue(pro.price)
    if (promo.promotionAmount != 'null') {
      this.rf12.controls["type"].setValue("1")
      this.rf12.controls["number"].setValue(promo.promotionAmount)
    }
    if (promo.promotionPercent != 'null') {
      this.rf12.controls["type"].setValue("0")
      this.rf12.controls["number"].setValue(promo.promotionPercent)
    }

    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
  }
  openDeletePromoInfo(promo: PromotionInfo, pro: Product, modal: any) {
    this.deletingPromoInfo = promo
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
  }
  selectedItemPromomo(item: any, modal: any) {
    let pro: Product = item.item
    this.rf11.controls["nameSP"].setValue(pro.name)
    this.rf11.controls["idSP"].setValue(pro.id)
    this.rf11.controls["priceSP"].setValue(pro.price)
    this.rf11.controls["type"].setValue("0")
    this.rf11.controls["number"].setValue("10")
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', size: 'xl' })
  }
  addPromoInfo(modal: any) {

    let valid = true
    try {
      let type = this.rf11.controls["type"].value
      let price = this.rf11.controls["priceSP"].value
      if (type == 0) {
        if (this.rf11.controls["number"].value > 100 || this.rf11.controls["number"].value <= 0) {
          valid = false
        }
      }

      if (type == 1) {
        if (this.rf11.controls["number"].value > price || this.rf11.controls["number"].value <= 0) {

          valid = false
        }
      }
    }
    catch (e) {
      valid = false
    }


    if (valid) {
      this.isCreatingPromoInfo = true
      let promoInfo = new PromotionInfo
      promoInfo.productId = this.rf11.controls["idSP"].value
      promoInfo.promotionId = this.selectedPromotion.id

      if (this.rf11.controls["type"].value == 0) {
        promoInfo.promotionPercent = this.rf11.controls["number"].value
        promoInfo.promotionAmount = "null"
      }
      else {
        promoInfo.promotionAmount = this.rf11.controls["number"].value
        promoInfo.promotionPercent = "null"
      }
      this.adminService.createPromotionInfo(promoInfo).subscribe(
        data => {
          if (data.success) {
            this.toast.success("Th??m th??ng tin khuy???n m??i th??nh c??ng!")
            this.getProductWithNoPromo(this.category_productWithNoPromo)
          }
          else {
            this.toast.error(data.error)
          }

          this.isCreatingPromoInfo = false

          // this.modalService.dismissAll()
          // this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', size: 'xl' })
        },
        error => {
          this.toast.error("C?? l???i x???y ra ! Xin h??y s???a l???i!")
          this.isCreatingPromoInfo = false
          console.log(error)
        }
      )

    }
    else {
      this.toast.error("Gi?? tr??? nh???p kh??ng h???p l???")
    }


  }
  editPromoInfo(modal: any) {

    let valid = true
    try {
      let type = this.rf12.controls["type"].value
      let price = this.rf12.controls["priceSP"].value
      if (type == 0) {
        if (this.rf12.controls["number"].value > 100 || this.rf12.controls["number"].value <= 0) {
          valid = false
        }
      }

      if (type == 1) {
        if (this.rf12.controls["number"].value > price || this.rf12.controls["number"].value <= 0) {

          valid = false
        }
      }
    }
    catch (e) {
      valid = false
    }


    if (valid) {
      this.isEditingPromoInfo = true
      let promoInfo = new PromotionInfo
      promoInfo.productId = this.rf12.controls["idSP"].value
      promoInfo.promotionId = this.selectedPromotion.id
      promoInfo.id = this.editingPromoInfo.id

      if (this.rf12.controls["type"].value == 0) {
        promoInfo.promotionPercent = this.rf12.controls["number"].value
        promoInfo.promotionAmount = "null"
      }
      else {
        promoInfo.promotionAmount = this.rf12.controls["number"].value
        promoInfo.promotionPercent = "null"
      }
      this.adminService.editPromotionInfo(promoInfo).subscribe(
        data => {
          if (data.success) {
            this.getPromotionInfo(this.selectedPromotion)
            this.toast.success("Ch???nh s???a th??ng tin khuy???n m??i th??nh c??ng!")
          }
          else {
            this.toast.error(data.error)
          }

          this.isEditingPromoInfo = false
          this.modalService.dismissAll()
          this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', size: 'xl' })
        },
        error => {
          this.toast.error("C?? l???i x???y ra ! Xin h??y s???a l???i!")
          this.isEditingPromoInfo = false
          console.log(error)
        }
      )
    }
    else {
      this.toast.error("Gi?? tr??? nh???p kh??ng h???p l???")
    }
  }
  deletePromoInfo(modal: any) {
    this.isDeletingPromoInfo = true
    this.adminService.deletePromotionInfo(this.deletingPromoInfo.id).subscribe(
      data => {
        if (data.success) {
          this.getPromotionInfo(this.selectedPromotion)
          this.toast.success("X??a th??ng tin khuy???n m??i th??nh c??ng!")
        }
        else {
          this.toast.error(data.error)
        }

        this.isDeletingPromoInfo = false
        this.modalService.dismissAll()
        this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', size: 'xl' })
      },
      error => {
        this.toast.error("C?? l???i x???y ra ! Xin h??y s???a l???i!")
        this.isDeletingPromoInfo = false
        console.log(error)
      }
    )
  }
  getSearchResultOrder(modal: any) {
    this.searchResult_Order = []
    switch (this.searchBy_Order) {
      case "Id":
        try {
          this.searchResult_Order = this.allOrder.filter(t => String(t.id).includes(this.searchKey_Order))

        }
        catch (e) {
          this.toast.error("Id kh??ng h???p l???!")
          console.log(e)
        }
        break
      case "Email":
        try {
          this.searchResult_Order = this.allOrder.filter(t => String(t.email).includes(this.searchKey_Order))

        }
        catch (e) {
          this.toast.error("Email kh??ng h???p l???!")
          console.log(e)
        }
        break
      case "Name":
        try {
          this.searchResult_Order = this.allOrder.filter(t => String(t.contactName).includes(this.searchKey_Order))

        }
        catch (e) {
          this.toast.error("T??n kh??ng h???p l???!")
          console.log(e)
        }
        break
      case "TotalPrice":
        try {
          let a = Number(this.searchKey_Order)
          this.searchResult_Order = this.allOrder.filter(t => t.totalPrice == a)
        }
        catch (e) {
          this.toast.error("T???ng ti???n kh??ng h???p l???!")
          console.log(e)
        }
        break
    }
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', size: 'xl' })

  }
  getSearchResultUser(modal: any) {
    this.searchResult_User = []
    switch (this.searchBy_User) {
      case "Id":
        try {
          this.searchResult_User = this.allUser.filter(t => String(t.id).includes(this.searchKey_User))
        }
        catch (e) {
          this.toast.error("Id kh??ng h???p l???!")
          console.log(e)
        }
        break
      case "Email":
        try {
          this.searchResult_User = this.allUser.filter(t => String(t.email).includes(this.searchKey_User))
        }
        catch (e) {
          this.toast.error("Email kh??ng h???p l???!")
          console.log(e)
        }
        break
      case "Phone":
        try {
          this.searchResult_User = this.allUser.filter(t => String(t.phoneNumber).includes(this.searchKey_User))
        }
        catch (e) {
          this.toast.error("SDT kh??ng h???p l???!")
          console.log(e)
        }
        break
      case "Name":
        try {
          this.searchResult_User = this.allUser.filter(t => String(t.displayName).includes(this.searchKey_User))
        }
        catch (e) {
          this.toast.error("T??n kh??ng h???p l???!")
          console.log(e)
        }
        break
    }
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', size: 'xl' })

  }
  getSearchResultEmployee(modal: any) {
    this.searchResult_Employee = []
    switch (this.searchBy_Employee) {
      case "Id":
        try {
          this.searchResult_Employee = this.allEmployee.filter(t => String(t.id).includes(this.searchKey_Employee))
        }
        catch (e) {
          this.toast.error("Id kh??ng h???p l???!")
          console.log(e)
        }
        break
      case "Email":
        try {
          this.searchResult_Employee = this.allEmployee.filter(t => String(t.email).includes(this.searchKey_Employee))
        }
        catch (e) {
          this.toast.error("Email kh??ng h???p l???!")
          console.log(e)
        }
        break
      case "Phone":
        try {
          this.searchResult_Employee = this.allEmployee.filter(t => String(t.phoneNumber).includes(this.searchKey_Employee))
        }
        catch (e) {
          this.toast.error("SDT kh??ng h???p l???!")
          console.log(e)
        }
        break
      case "Name":
        try {
          this.searchResult_Employee = this.allEmployee.filter(t => String(t.displayName).includes(this.searchKey_Employee))
        }
        catch (e) {
          this.toast.error("T??n kh??ng h???p l???!")
          console.log(e)
        }
        break
    }
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', size: 'xl' })

  }
  getSearchResultProduct(modal: any) {
    this.searchResult_Product = []
    switch (this.searchBy_Product) {
      case "Id":
        try {
          this.searchResult_Product = this.allProduct.filter(t => String(t.id).includes(this.searchKey_Product))
        }
        catch (e) {
          this.toast.error("Id kh??ng h???p l???!")
          console.log(e)
        }
        break
      case "Price":
        try {
          this.searchResult_Product = this.allProduct.filter(t => String(t.price).includes(this.searchKey_Product))
        }
        catch (e) {
          this.toast.error("Gi?? kh??ng h???p l???!")
          console.log(e)
        }
        break
      case "Name":
        try {
          this.searchResult_Product = this.allProduct.filter(t => String(t.name).toLowerCase().includes(this.searchKey_Product.toLowerCase()))
        }
        catch (e) {
          this.toast.error("T??n kh??ng h???p l???!")
          console.log(e)
        }
        break
      case "Tag":
        try {
          this.searchResult_Product=[]
          this.allProduct.forEach(element => {
            for(let i=0;i<element.tags.length;i++){
              if(element.tags[i].name.toLowerCase().includes(this.searchKey_Product.toLowerCase())){
                this.searchResult_Product.push(element)
                break
              }
            }
          });
        }
        catch (e) {
          this.toast.error("T??n th??? kh??ng h???p l???!")
          console.log(e)
        }
        break
    }
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', size: 'xl' })

  }
  toNumber(string: string): number {
    return Number(string)
  }
  openProductExport() {
    window.open(`/#/xuatpdf?mode=${1}&category=${this.category}&orderBy=${this.orderProduct}&pageNumber=${this.pageNumberProduct}&pageSize=${this.pageSizeProduct}&orderDir=${this.orderDirProduct}`, '_blank');
  }
  openUserExport() {
    window.open(`/#/xuatpdf?mode=${2}&category=User&orderBy=${this.orderUser}&pageNumber=${this.pageNumberUser}&pageSize=${this.pageSizeUser}&orderDir=${this.orderDirUser}`, '_blank');
  }
  openEmployeeExport() {
    window.open(`/#/xuatpdf?mode=${3}&category=${this.roleEmployee}&orderBy=${this.orderEmployee}&pageNumber=${this.pageNumberEmployee}&pageSize=${this.pageSizeEmployee}&orderDir=${this.orderDirEmployee}`, '_blank');
  }
  openPromoExport(promo:Promotion) {
    localStorage.setItem("promo",JSON.stringify(promo))
    window.open(`/#/xuatpdf?mode=4&promoId=${promo.id}`, '_blank');
  }
  openTKDTExport() {
    window.open(`/#/xuatpdf?mode=5&from=${this.tkdtDayFrom}&to=${this.tkdtDayTo}`, '_blank');
  }
  openTKSPExport() {
    window.open(`/#/xuatpdf?mode=6&top=${this.tkTop}`, '_blank');
  }
  openProductTagModal(modal: any,pro:Product) {
    this.editingProduct=pro
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
  }
  openAddProductTagModal(modal: any) {
    this.showFormError=false

    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
  }
  openEditProductTagModal(modal: any,t:Tag) {

    this.showFormError=false
    this.edittingTag = t
    this.rf14.controls["name"].setValue(t.name)
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
  }
  openDeleteProductTagModal(modal: any,t:Tag) {

    this.showFormError=false
    this.deletingTag=t
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
  }
  addProductTag(){
    this.showFormError=true
    if(this.rf13.valid){
      this.isAddingTag=true
      let t = new Tag()
      t.name=this.rf13.controls["name"].value
      t.productId=this.editingProduct.id
      this.adminService.createProductTag(t).subscribe(
        data=>{
          this.toast.success("Th??m th??nh c??ng")
          this.isAddingTag=false
          this.modalService.dismissAll()
        },
        error=>{
          this.isAddingTag=false
          this.toast.error("C?? l???i x???y ra! Xin h??y th??? l???i.")
        }
      )
    }
    else{
      this.toast.error("Gi?? tr??? nh???p kh??ng h???p l???")
    }
  }
  editProductTag(){
    this.showFormError=true
    if(this.rf14.valid){
      this.isEditTag=true
      this.edittingTag.name=this.rf14.controls["name"].value
      this.adminService.editProductTag(this.edittingTag).subscribe(
        data=>{
          this.toast.success("Ch???nh s???a th??nh c??ng")
          this.isEditTag=false
          this.modalService.dismissAll()
        },
        error=>{
          this.isEditTag=false
          this.toast.error("C?? l???i x???y ra! Xin h??y th??? l???i.")
        }
      )
    }
    else{
      this.toast.error("Gi?? tr??? nh???p kh??ng h???p l???")
    }
  }
  deleteProductTag(){
    this.adminService.deleteProductTag(this.deletingTag.id).subscribe(
      data=>{
        this.toast.success("Ch???nh s???a th??nh c??ng")
        this.isDeleteTag=false
        this.modalService.dismissAll()
      }
      ,error=>{
        this.isDeleteTag=false
        this.toast.error("C?? l???i x???y ra! Xin h??y th??? l???i.")
      }
    )
  }
  arraysEqual(a:any[], b:any[]) {
    // console.log(JSON.stringify(a))
    // console.log(JSON.stringify(b))
    return JSON.stringify(a)==JSON.stringify(b);
  }
  addDiscountCode(){
    if(this.rf15.valid){
      // console.log(this.rf15.controls)
      // console.log("???? th??m")
      let valid = true
      try {
        let type = this.rf15.controls["type"].value
        if (type == 0) {
          if (this.rf15.controls["number"].value > 100 || this.rf15.controls["number"].value <= 0) {
            valid = false
          }
        }
      }
      catch (e) {
        valid = false
      }
      var start = new  Date (this.rf15.controls["startDate"].value)
      var end = new  Date (this.rf15.controls["endDate"].value)
      if(end<=start){
        valid=false
      }
      if(valid){
        let dc:DiscountCode = new DiscountCode
        dc.code=this.rf15.controls["code"].value
        dc.startDate=this.rf15.controls["startDate"].value
        dc.endDate=this.rf15.controls["endDate"].value
        if(this.rf15.controls["type"].value==0){
          dc.discountPercent=this.rf15.controls["number"].value
          dc.discountAmount="null"
        }
        else{
          dc.discountAmount=this.rf15.controls["number"].value
          dc.discountPercent="null"
        }
        this.isAddingDiscountCode=true
        this.adminService.createDisCountCode(dc).subscribe(
          data=>{
            this.isAddingDiscountCode=false
            this.modalService.dismissAll()
            this.toast.success("Th??m m?? gi???m gi?? th??nh c??ng!")
          },
          error=>{
            this.isAddingDiscountCode=false
            //console.log(error)
            this.toast.error(error.error.msg)
          }
        )
      }
      else{
        this.toast.error("Th??ng tin nh???p ch??a h???p l???!")
      }
    }
    else{
      this.toast.error("Th??ng tin nh???p ch??a h???p l???!")
    }
  }
  editDiscountCode(){
    if(this.rf16.valid){
      // console.log(this.rf15.controls)
      // console.log("???? th??m")
      let valid = true
      try {
        let type = this.rf16.controls["type"].value
        if (type == 0) {
          if (this.rf16.controls["number"].value > 100 || this.rf16.controls["number"].value <= 0) {
            valid = false
          }
        }
      }
      catch (e) {
        valid = false
      }
      var start = new  Date (this.rf16.controls["startDate"].value)
      var end = new  Date (this.rf16.controls["endDate"].value)
      if(end<=start){
        valid=false
      }
      if(valid){
        let dc:DiscountCode = this.editingDCode
        dc.code=this.rf16.controls["code"].value
        dc.startDate=this.rf16.controls["startDate"].value
        dc.endDate=this.rf16.controls["endDate"].value
        dc.status=this.rf16.controls["status"].value
        if(this.rf16.controls["type"].value==0){
          dc.discountPercent=this.rf16.controls["number"].value
          dc.discountAmount="null"
        }
        else{
          dc.discountAmount=this.rf16.controls["number"].value
          dc.discountPercent="null"
        }
        this.isEditDiscountCode=true
        this.adminService.editDisCountCode(dc).subscribe(
          data=>{
            this.isEditDiscountCode=false
            this.modalService.dismissAll()
            this.toast.success("Ch???nh s???a m?? gi???m gi?? th??nh c??ng!")
          },
          error=>{
            this.isEditDiscountCode=false
            //console.log(error)
            this.toast.error(error.error.msg)
          }
        )
      }
      else{
        this.toast.error("Th??ng tin nh???p ch??a h???p l???!")
      }
    }
    else{
      this.toast.error("Th??ng tin nh???p ch??a h???p l???!")
    }
  }
  deleteDiscountCode(){
    this.isDeleteDiscountCode=true
    this.adminService.deleteDisCountCode(this.deletingDCode).subscribe(
      data=>{
        this.isDeleteDiscountCode=false
        this.toast.success("X??a m?? gi???m gi?? th??nh c??ng!")
        this.modalService.dismissAll()
      },
      error=>{
        console.log(error)
        this.isDeleteDiscountCode=false
        this.toast.error("C?? l???i x???y ra! Xin h??y th??? l???i.")
      }
    )
  }
  codeToUppercase(){
    let s:string =  this.rf15.controls["code"].value
    this.rf15.controls["code"].setValue(s.toUpperCase().replace(/\s/g, ""))
  }
  openAddDiscountCodeModal(modal:any){
    this.rf15.controls["type"].setValue(0)
    this.rf15.controls["number"].setValue(10)
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
  }
  openAutoAddDiscountCodeModal(modal:any){
    this.rf18.controls["type"].setValue(0)
    this.rf18.controls["number"].setValue(10)
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
  }
  openEditDiscountCodeModal(modal:any,dc:DiscountCode){
    this.editingDCode=dc
    console.log(this.editingDCode)
    if(dc.discountAmount!='null'){
      this.rf16.controls["type"].setValue(1)
      this.rf16.controls["number"].setValue(this.editingDCode.discountAmount)
    }
    else{
      this.rf16.controls["type"].setValue(0)
      this.rf16.controls["number"].setValue(this.editingDCode.discountPercent)
    }
    this.rf16.controls["code"].setValue(this.editingDCode.code)
    this.rf16.controls["startDate"].setValue(this.editingDCode.startDate)
    this.rf16.controls["endDate"].setValue(this.editingDCode.endDate)
    this.rf16.controls["status"].setValue(this.editingDCode.status)

    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
  }
  openDeleteDiscountCodeModal(modal: any,dc:DiscountCode) {

    this.showFormError=false
    this.deletingDCode=dc
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
  }
  onChangeFilterDiscountCode(){
    this.pageNumberDiscountCode=1
    this.getDiscountCodes()
  }
  getDiscountCodes(){
    this.adminService.getDiscountCode(this.orderDiscountCode,this.pageNumberDiscountCode,
      this.pageSizeDiscountCode,this.orderDirDiscountCode).subscribe(
      data=>{
        //console.log(data)
        this.isDisconnect=false
        this.discountCodeList=data.result
        this.collectionSizeDiscountCode=data.count
      },
      error=>{
        console.log(error)
        this.isDisconnect = true
      }
    )
  }
  getSearchResultDCode(modal: any) {
    this.searchResult_DCode = []
    console.log(this.allDCode)
    switch (this.searchBy_DCode) {
      case "Code":
        try {
          this.searchResult_DCode = this.allDCode.filter(t => String(t.code).includes(this.searchKey_DCode))
          // console.log(this.searchResult_DCode)
          // console.log(this.searchKey_DCode)
        }
        catch (e) {
          this.toast.error("Code kh??ng h???p l???!")
          console.log(e)
        }
        break
    }
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', size: 'xl' })

  }
  calculateTotalPrice(o:Order):number{
    let shippingFee=0
    if(o.shippingFee==1){
      shippingFee=15000
    }
    if(o.discountCode){
      if(o.discountCode.discountAmount!='null'){
        if(o.totalPrice+shippingFee-Number(o.discountCode.discountAmount)<0){
          return 0
        }
        return o.totalPrice+shippingFee-Number(o.discountCode.discountAmount)
      }
      return (o.totalPrice+shippingFee)-(o.totalPrice+shippingFee)*Number(o.discountCode.discountPercent)/100
    }
    else{
      return o.totalPrice+shippingFee
    }
  }
  openEditUserCoinModal(modal: any, u: User) {

    this.rf17.controls["userID"].setValue(u.id)
    this.rf17.controls["coins"].setValue(u.coins)

    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
  }
  editUserCoin()
  {
    if(this.rf17.valid){
      this.isEdittingUserCoins=true
      this.adminService.editUserCoins(this.rf17.controls["userID"].value,this.rf17.controls["coins"].value).subscribe(
        data=>{
          this.isEdittingUserCoins=false
          this.modalService.dismissAll()
          this.toast.success("Ch???nh s???a th??nh c??ng!")
        },
        error=>{
          this.isEdittingUserCoins=false
          this.toast.error("C?? l???i x???y ra! Xin h??y th??? l???i.")
        }
      )
    }
    else{
      this.toast.error("Th??ng tin nh???p ch??a h???p l???!")
    }

  }

  getProductWithNoPromo(category:any){
    this.adminService.getProductWithNoPromotion(category).subscribe(
      data=>{
        this.productWithNoPromo=data.result
        this.searchProductWithNoPromo = data.result
      },
      error=>{
        console.log(error)
        this.toast.error("Kh??ng k???t n???i ???????c v???i API!")
      }
    )
  }
  filterProductWithNoPromo(){
    this.searchProductWithNoPromo = this.productWithNoPromo.filter(t => String(t.name.toLowerCase()).includes(this.keyword_PWNP.toLowerCase()))
  }


  autoAddDiscountCode(){
    if(this.rf18.valid){
      let valid = true
      try {
        let type = this.rf18.controls["type"].value
        if (type == 0) {
          if (this.rf18.controls["number"].value > 100 || this.rf18.controls["number"].value <= 0) {
            valid = false
          }
        }
      }
      catch (e) {
        valid = false
      }
      var start = new  Date (this.rf18.controls["startDate"].value)
      var end = new  Date (this.rf18.controls["endDate"].value)
      if(end<=start){
        valid=false
      }
      if(valid){
        let dc:DiscountCode = new DiscountCode
        dc.startDate=this.rf18.controls["startDate"].value
        dc.endDate=this.rf18.controls["endDate"].value
        if(this.rf18.controls["type"].value==0){
          dc.discountPercent=this.rf18.controls["number"].value
          dc.discountAmount="null"
        }
        else{
          dc.discountAmount=this.rf18.controls["number"].value
          dc.discountPercent="null"
        }
        this.isAddingDiscountCode=true
        this.adminService.autoCreateDisCountCode(dc,this.rf18.controls["time"].value).subscribe(
          data=>{
            this.discountCodeJustCreate=data.dclist
            console.log(this.discountCodeJustCreate)
            console.log(data)
            this.openDiscountExport(this.discountCodeJustCreate)
            this.isAddingDiscountCode=false
            this.toast.success("Th??m th??nh c??ng!")
            this.modalService.dismissAll()
          },
          error=>{
            this.toast.error("C?? l???i x???y ra! Xin h??y th??? l???i.")
            this.isAddingDiscountCode=false
          }
        )
      }
      else{
        this.toast.error("Th??ng tin nh???p ch??a h???p l???!")
      }
    }
    else{
      this.toast.error("Th??ng tin nh???p ch??a h???p l???!")
    }
  }

  openDiscountExport(dclist:DiscountCode[]) {
    localStorage.setItem("dclist",JSON.stringify(dclist))
    window.open(`/#/xuatpdf?mode=7`, '_blank');
  }


  ExportTOExcel(name: string) {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, name);
    XLSX.writeFile(wb, name + '.xlsx');
  }

  ExportProductToExcel(name: string){
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);
    ws['!cols']![5] = { hidden: true }
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, name);
    XLSX.writeFile(wb, name + '.xlsx');
  }

  openAddCategoryModal( modal: any) {
    this.showFormError=false
    this.rf19.reset()
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
  }
  openManageCategoryModal( modal: any) {

    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
  }
  openEditCategoryModal(cate: Category, modal: any) {
    this.rf20.controls["name"].setValue(cate.name)
    this.rf20.controls["id"].setValue(cate.id)

    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
  }
  openDeleteCategoryModal(cate: Category, modal: any) {

    this.deletingCategory=cate
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
  }

  addCategory(){
    if(this.rf19.valid){
      this.isCreatingProductCategory=true
      let a = new Category
      a.name=this.rf19.controls["name"].value
      this.adminService.createProductCategory(a).subscribe(
        data=>{
          this.isCreatingProductCategory=false
          this.modalService.dismissAll()
          this.toast.success("Th??m th??nh c??ng!")
          this.getCategory()
        },
        error=>{
          this.isCreatingProductCategory=false
          this.toast.error("C?? l???i x???y ra! Xin h??y th??? l???i.")
        }
      )
    }
    else{
      this.toast.error("Th??ng tin nh???p ch??a h???p l???!")
    }
  }
  editCategory(){
    if(this.rf20.valid){
      this.isEditingProductCategory=true
      let a = new Category
      a.name=this.rf20.controls["name"].value
      a.id=this.rf20.controls["id"].value

      this.adminService.editProductCategory(a).subscribe(
        data=>{
          this.isEditingProductCategory=false
          this.modalService.dismissAll()
          this.toast.success("Ch???nh s???a th??nh c??ng!")
          this.getCategory()
        },
        error=>{
          this.isEditingProductCategory=false
          this.toast.error("C?? l???i x???y ra! Xin h??y th??? l???i.")
        }
      )
    }
    else{
      this.toast.error("Th??ng tin nh???p ch??a h???p l???!")
    }
  }

  deleteCategory(){
    this.isDeletingProductCategory=true
    this.adminService.deleteProductCategory(this.deletingCategory).subscribe(
      data=>{
        this.isDeletingProductCategory=false
        this.getCategory()
        this.toast.success("X??a  th??nh c??ng!")
        this.modalService.dismissAll()
      },
      error=>{
        console.log(error)
        this.isDeletingProductCategory=false
        this.toast.error("C?? l???i x???y ra! Xin h??y th??? l???i.")
      }
    )
  }
}
