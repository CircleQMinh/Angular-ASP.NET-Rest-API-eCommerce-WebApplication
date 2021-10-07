import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HotToastService } from '@ngneat/hot-toast';
import { OperatorFunction, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Employee } from 'src/app/class/employee';
import { Order } from 'src/app/class/order';
import { Product } from 'src/app/class/product';
import { Promotion } from 'src/app/class/promotion';
import { PromotionInfo } from 'src/app/class/promotion-info';
import { User } from 'src/app/class/user';
import { AdminService } from 'src/app/service/admin.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { OrderService } from 'src/app/service/order.service';
import { ProductService } from 'src/app/service/product.service';

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
  orderOrder = "Id"
  status = 0
  collectionSizeOrder = 0

  isLoading = false

  dashboardInfo = {
    totalOrder: 7,
    totalProduct: 102,
    totalUser: 0
  }


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

  orderDirOrder: any = "Asc"
  orderDirUser: any = "Asc"
  orderDirProduct: any = "Asc"
  orderDirEmployee: any = "Asc"

  keyword: any;
  allProduct: Product[] = []

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
      "name": "Số đơn hàng",
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
      "name": "Số đơn hàng",
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
    this.addRForm();

    this.authService.getLocalStorage()
    this.user = this.authService.user
    this.isLogin = this.authService.isLogin
    if (!this.isLogin) {
      this.router.navigateByUrl("/error")
    }
    else {
      this.getAdminInfo()

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

    let to = new Date;
    let from = new Date;
    from.setDate(from.getDate() - 7);
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
    this.productService.getProduct("all", "", 1, 999).subscribe(
      data => {
        //console.log(data)
        this.allProduct = data.results
        this.isGettingPromoInfo = false
      },
      error => {
        this.isGettingPromoInfo = false
        this.toast.error("Kết nối với API không được!")
        console.log(error)
      }
    )


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
        this.dashboardInfo = data
        //console.log(this.dashboardInfo)
        this.isLoading = false
      },
      error => {
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
    let from = this.rf7.controls["from"].value
    let to = this.rf7.controls["to"].value
    this.dbSaleChartData[0]["series"] = []
    this.adminService.getSalesChart(from, to).subscribe(
      data => {
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
        this.toast.error("Có lỗi xảy ra! Xin hãy thử lại.")
      }
    )
    this.adminService.getTopProductChart(5).subscribe(
      data => {
        this.DBtopSaleProductCount = data.maxCount
        data.result.forEach((element: any) => {
          this.DBtopSaleProduct.push({ name: element.product.name, count: element.quantity })

        });
        data.cateCount.forEach((element: any) => {
          this.DBcategoryChart.push({ name: element["name"], value: element["value"] })
        });
        this.DBcategoryChart = [...this.DBcategoryChart]
      },
      error => {
        console.log(error)
        this.toast.error("Có lỗi xảy ra! Xin hãy thử lại.")
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
        //console.log(data)
        this.productList = data.result
        this.collectionSizeProduct = data.count

      },
      error => {
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }
  onPageSizeStatusChage() {

    this.pageNumberOrder = 1
    this.getOrder()
  }
  getUser() {

    this.pageNumberUser = 1
    this.adminService.getUsers(this.orderUser, "User", this.orderDirUser).subscribe(
      data => {
        //console.log(data)
        this.userList = data.result
        this.userList.forEach((element, index: number) => {
          element.roles = data.roles[index]
        });
        this.getPagedUserList()
        //console.log(this.userList)
      },
      error => {
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
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
      },
      error => {
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }
  switchTab(s: string) {
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
  selectFile(event: any) { //Angular 11, for stricter type
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      this.msg = 'Bạn phải chọn 1 hình ảnh';
      return;
    }

    var mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.msg = "File phải là hình ảnh";
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
        this.toast.success("Chỉnh sửa thành công")
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
            console.log(data)
            this.getUser()
            this.isCreatingUser = false
            this.toast.success("Thêm thành công!")
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
      this.toast.error("Dữ liệu nhập chưa hợp lệ. Xin hãy thử lại!")
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
        this.toast.success("Xóa thành công")
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
    this.rf2.controls["category"].setValue("Fruit")
    this.modalService.open(add_product, { ariaLabelledBy: 'modal-basic-title' })
  }
  openEditProductModal(newPro: any, p: Product) {
    this.showFormError = false
    this.editingProduct = p
    this.rf3.controls["name"].setValue(this.editingProduct.name)
    this.rf3.controls["price"].setValue(this.editingProduct.price)
    this.rf3.controls["des"].setValue(this.editingProduct.description)
    this.rf3.controls["uis"].setValue(this.editingProduct.unitInStock)
    this.rf3.controls["category"].setValue(this.editingProduct.category)
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
      // console.log(this.rf2.controls['name'].value)
      // console.log(this.rf2.controls['price'].value)
      // console.log(this.rf2.controls['des'].value)
      // console.log(this.rf2.controls['uis'].value)
      // console.log(this.rf2.controls['category'].value)
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
      this.toast.error("Dữ liệu nhập chưa hợp lệ. Xin hãy thử lại!")
    }

  }
  createProduct() {
    let today = formatDate(Date.now(), 'dd-MM-yyyy hh:mm:ss', 'en');
    this.adminService.createProduct(this.rf2.controls['name'].value, this.rf2.controls['price'].value, this.rf2.controls['des'].value,
      this.rf2.controls['uis'].value, this.rf2.controls['category'].value, this.proImgUrl, today).subscribe(
        data => {
          this.toast.success("Thêm thành công!")
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
      this.toast.error("Dữ liệu nhập chưa hợp lệ. Xin hãy thử lại!")
    }

  }
  editProduct() {
    let today = formatDate(Date.now(), 'dd-MM-yyyy hh:mm:ss', 'en');
    this.adminService.editProduct(this.editingProduct.id, this.rf3.controls['name'].value, this.rf3.controls['price'].value, this.rf3.controls['des'].value,
      this.rf3.controls['uis'].value, this.rf3.controls['category'].value, this.proImgUrl, today).subscribe(
        data => {
          this.toast.success("Chỉnh sửa thành công!")
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

        this.toast.success("Xóa thành công!")
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
      this.msg = 'Bạn phải chọn hình ảnh';
      return;
    }

    var mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.msg = "File phải là hình ảnh";
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
    this.orderService.getOrderDetails(o.id).subscribe(
      data => {
        this.selectedOrder.orderDetails = data.orderDetails
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
        this.toast.success("Chỉnh sửa thành công!")
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

        this.toast.success("Xóa thành công!")
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
        this.toast.error(" An error has occurred ! Try again !")
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
        this.toast.error("Có lỗi xảy ra! Xin hãy thử lại.")
        console.log(error)
      }
    )
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
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
            this.toast.error("Up ảnh không được")
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
      this.toast.error("Thông tin nhập chưa hợp lệ")
    }
  }
  createEmployee(e: Employee, p: any) {

    this.adminService.createEmployee(e, p).subscribe(
      data => {
        //console.log(data)
        this.toast.success("Thêm nhân viên thành công!")
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
            this.toast.error("Up ảnh không được")
            console.log(error)
          }
        )
      }
      else {
        this.updateEmployee()
      }
    }
    else {
      this.toast.error("Dữ liệu nhập chưa hợp lệ!")
    }
  }
  updateEmployee() {
    this.adminService.editEmployee(this.editingEmployee, this.editingEmployee.id).subscribe(
      data => {
        // console.log(data)
        this.toast.success("Chỉnh sửa nhân viên thành công!")
        this.getEmployee()
        this.isEditingEmployee = false

        this.modalService.dismissAll()
      },
      error => {
        this.toast.error("Có lỗi xảy ra ! Xin hãy sửa lại!")
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
        this.toast.success("Xóa nhân viên thành công")!
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
        data.result.forEach((element: any) => {
          this.saleChart[0]["series"].push(
            { name: element.Date, value: Number(element.Total) }
          )

        });
        this.saleChart = [...this.saleChart]
      },
      error => {
        console.log(error)
        this.toast.error("Có lỗi xảy ra! Xin hãy thử lại.")
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
        this.toast.error("Có lỗi xảy ra! Xin hãy thử lại.")
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
        this.toast.error("Có lỗi xảy ra! Xin hãy thử lại.")
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
        this.toast.error("Có lỗi xảy ra! Xin hãy thử lại.")
      }
    )
  }

  getTopSaleProduct() {
    this.topSaleProduct = []
    this.adminService.getTopProductChart(this.numberOfTopProduct).subscribe(
      data => {
        this.topSaleProductCount = data.maxCount
        data.result.forEach((element: any) => {
          this.topSaleProduct.push({ name: element.product.name, count: element.quantity })

        });
        //console.log(topSaleProductCount)
      },
      error => {
        console.log(error)
        this.toast.error("Có lỗi xảy ra! Xin hãy thử lại.")
      }
    )
  }
  // prepareSaleChartData(data:any[]):any[]{
  //   var result:any[]=[]
  //   for(let i=0;i<data.length;i++){
  //     var exist=false
  //     for(let j=0;j<result.length;j++){
  //       if(data[i].name==result[j].name){
  //         exist=true
  //       }
  //     }
  //     if(exist){
  //       for(let j=0;j<result.length;j++){
  //         if(data[i].name==result[j].name){

  //           result[j].value+=data[i].value
  //           break
  //         }
  //       }
  //     }
  //     else{
  //       result.push( { name: data[i].name, value: Number(data[i].value) })
  //     }
  //   }
  //   return result
  // }



  // -------------Example-------------------------------------------------

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
          this.promoList = data.result
          this.collectionSizePromo = data.count
        },
        error => {
          console.log(error)
          this.toast.error(" An error has occurred ! Try again !")
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
      if (this.urlIMG != this.defaultProImgUrl) {
        this.authService.upLoadIMG(this.proImgUrl).subscribe(
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
    else {
      this.isCreatingPromo = false
      this.toast.error("Dữ liệu nhập chưa hợp lệ. Xin hãy thử lại!")
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
        this.toast.success("Thêm khuyến mãi thành công!")
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
      this.isEditingPromo = true
      this.editingPromo.name = this.rf10.controls["name"].value
      this.editingPromo.description = this.rf10.controls["description"].value
      this.editingPromo.endDate = this.rf10.controls["endDate"].value
      this.editingPromo.startDate = this.rf10.controls["startDate"].value
      this.editingPromo.status = this.rf10.controls["status"].value

      if (this.urlIMG != this.editingPromo.imgUrl) {
        this.authService.upLoadIMG(this.urlIMG).subscribe(
          data => {
            // console.log(data)
            this.editingPromo.imgUrl = data.secure_url
            this.updatePromo()
          },
          error => {
            this.toast.error("Up ảnh không được")
            console.log(error)
          }
        )
      }
      else {
        this.updatePromo()
      }
    }
    else {
      this.toast.error("Dữ liệu nhập chưa hợp lệ!")
    }
  }
  updatePromo() {
    this.adminService.editPromotion(this.editingPromo).subscribe(
      data => {
        //console.log(data)
        this.toast.success("Chỉnh sửa khuyến mãi thành công!")
        this.getPromotion()
        this.isEditingPromo = false

        this.modalService.dismissAll()
      },
      error => {
        this.toast.error("Có lỗi xảy ra ! Xin hãy sửa lại!")
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
        this.toast.success("Xóa khuyến mãi thành công!")
        this.getPromotion()
        this.isDeletingPromo = false

        this.modalService.dismissAll()
      },
      error => {
        this.toast.error("Có lỗi xảy ra ! Xin hãy sửa lại!")
        this.isDeletingPromo = false
        console.log(error)
      }
    )
  }

  openChooseProductPromoModal(modal: any, promo: Promotion) {
    this.showFormError = false
    this.selectedPromotion = promo
    this.getSearchData()
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
  openEditPromoInfo(promo:PromotionInfo,pro: Product, modal: any) {
    this.editingPromoInfo=promo
    //console.log(this.editingPromoInfo)
    this.rf12.controls["nameSP"].setValue(pro.name)
    this.rf12.controls["idSP"].setValue(pro.id)
    this.rf12.controls["priceSP"].setValue(pro.price)
    if(promo.promotionAmount!='null'){
      this.rf12.controls["type"].setValue("1")
      this.rf12.controls["number"].setValue(promo.promotionAmount)
    }
    if(promo.promotionPercent!='null'){
      this.rf12.controls["type"].setValue("0")
      this.rf12.controls["number"].setValue(promo.promotionPercent)
    }
 
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
  }
  openDeletePromoInfo(promo:PromotionInfo,pro: Product, modal: any) {
    this.deletingPromoInfo=promo
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
  }
  selectedItemPromomo(item: any, modal: any) {
    let pro:Product = item.item
    this.rf11.controls["nameSP"].setValue(pro.name)
    this.rf11.controls["idSP"].setValue(pro.id)
    this.rf11.controls["priceSP"].setValue(pro.price)
    this.rf11.controls["type"].setValue("0")
    this.rf11.controls["number"].setValue("10")
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title',size: 'xl' })
  }
  addPromoInfo(modal: any) {

    let valid = true
    try{
      let type = this.rf11.controls["type"].value
      let price = this.rf11.controls["priceSP"].value
      if (type == 0) {
        if (this.rf11.controls["number"].value > 100 || this.rf11.controls["number"].value <= 0) {
          valid=false
        }
      }
  
      if (type == 1) {
        if (this.rf11.controls["number"].value > price||this.rf11.controls["number"].value<=0) {
        
          valid=false
        }
      }
    }
    catch(e){
      valid=false
    }
 

    if(valid){
      this.isCreatingPromoInfo=true
      let promoInfo = new PromotionInfo
      promoInfo.productId=this.rf11.controls["idSP"].value
      promoInfo.promotionId=this.selectedPromotion.id
  
      if(this.rf11.controls["type"].value==0){
        promoInfo.promotionPercent=this.rf11.controls["number"].value
        promoInfo.promotionAmount="null"
      }
      else{
        promoInfo.promotionAmount=this.rf11.controls["number"].value
        promoInfo.promotionPercent="null"
      }
      this.adminService.createPromotionInfo(promoInfo).subscribe(
        data=>{
          if(data.success){
            this.toast.success("Thêm thông tin khuyến mãi thành công!")
          }
          else{
            this.toast.error(data.error)
          }

          this.isCreatingPromoInfo=false
          this.modalService.dismissAll()
          this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', size: 'xl' })
        },
        error=>{
          this.toast.error("Có lỗi xảy ra ! Xin hãy sửa lại!")
          this.isCreatingPromoInfo=false
          console.log(error)
        }
      )

    }
    else{
      this.toast.error("Giá trị nhập không hợp lệ")
    }


  }

  editPromoInfo(modal: any){
 
    let valid = true
    try{
      let type = this.rf12.controls["type"].value
      let price = this.rf12.controls["priceSP"].value
      if (type == 0) {
        if (this.rf12.controls["number"].value > 100 || this.rf12.controls["number"].value <= 0) {
          valid=false
        }
      }
  
      if (type == 1) {
        if (this.rf12.controls["number"].value > price||this.rf12.controls["number"].value<=0) {
        
          valid=false
        }
      }
    }
    catch(e){
      valid=false
    }
 

    if(valid){
      this.isEditingPromoInfo=true
      let promoInfo = new PromotionInfo
      promoInfo.productId=this.rf12.controls["idSP"].value
      promoInfo.promotionId=this.selectedPromotion.id
      promoInfo.id=this.editingPromoInfo.id

      if(this.rf12.controls["type"].value==0){
        promoInfo.promotionPercent=this.rf12.controls["number"].value
        promoInfo.promotionAmount="null"
      }
      else{
        promoInfo.promotionAmount=this.rf12.controls["number"].value
        promoInfo.promotionPercent="null"
      }
      this.adminService.editPromotionInfo(promoInfo).subscribe(
        data=>{
          if(data.success){
            this.getPromotionInfo(this.selectedPromotion)
            this.toast.success("Chỉnh sửa thông tin khuyến mãi thành công!")
          }
          else{
            this.toast.error(data.error)
          }

          this.isEditingPromoInfo=false
          this.modalService.dismissAll()
          this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', size: 'xl' })
        },
        error=>{
          this.toast.error("Có lỗi xảy ra ! Xin hãy sửa lại!")
          this.isEditingPromoInfo=false
          console.log(error)
        }
      )
    }
    else{
      this.toast.error("Giá trị nhập không hợp lệ")
    }
  }

  deletePromoInfo(modal:any){
    this.isDeletingPromoInfo=true
    this.adminService.deletePromotionInfo(this.deletingPromoInfo.id).subscribe(
      data=>{
        if(data.success){
          this.getPromotionInfo(this.selectedPromotion)
          this.toast.success("Xóa thông tin khuyến mãi thành công!")
        }
        else{
          this.toast.error(data.error)
        }

        this.isDeletingPromoInfo=false
        this.modalService.dismissAll()
        this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', size: 'xl' })
      },
      error=>{
        this.toast.error("Có lỗi xảy ra ! Xin hãy sửa lại!")
        this.isDeletingPromoInfo=false
        console.log(error)
      }
    )
  }
}
