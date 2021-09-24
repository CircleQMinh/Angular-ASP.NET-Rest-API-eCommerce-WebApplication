import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotToastService } from '@ngneat/hot-toast';
import { OperatorFunction, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Employee } from 'src/app/class/employee';
import { Order } from 'src/app/class/order';
import { Product } from 'src/app/class/product';
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

  active_tab = "employee"

  userList: User[] = []
  pagedUserList: User[] = []
  pageNumberUser = 1
  pageSizeUser = 5
  orderUser = "Id"
  role = "all"

  productList: Product[] = []
  pageNumberProduct = 1
  pageSizeProduct = 5
  orderProduct = "Id"
  category = "all"
  collectionSizeProduct = 0

  orderList: Order[] = []
  shippingInfos:any[]=[]
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
  selectedShippingInfo:any
  rf4!: FormGroup
  isEditingOrder: boolean = false
  isDeletingOrder: boolean = false

  orderDirOrder: any = "Asc"
  orderDirUser: any = "Asc"
  orderDirProduct: any = "Asc"
  orderDirEmployee: any = "Asc"

  news: any[] = []
  today: string = formatDate(Date.now(), 'dd-MM-yyyy', 'en');
  newLimit = 8
  newCategory: any[] = ["technology", "science", "business", "general", "entertainment", "health"]

  keyword: any;
  allProduct:Product[]=[]

  employeeList:Employee[]=[]
  pagedEmployeeList: Employee[] = []
  pageNumberEmployee = 1
  pageSizeEmployee = 5
  orderEmployee = "Id"
  roleEmployee = "all"

  formatterProduct = (x: Product) => x.name;

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
    this.rf1.controls["role"].setValue("User")

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
    this.adminService.getDashboardInfo().subscribe(
      data => {
        this.dashboardInfo = data
        //console.log(this.dashboardInfo)
      },
      error => {
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
    this.isLoading = true
    this.getLocalStorage()
    if(!this.isLogin){
      this.router.navigateByUrl("/error")
    }
    else{
      this.getUserInfo()
      
    }

  }
  selectedItemProduct(item: any,modal:any) {
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
  getSearchData(){
    this.productService.getProduct("all", "", 1, 999).subscribe(
      data => {
        //console.log(data)
        this.allProduct = data.results

      },
      error => {
        this.toast.error("Kết nối với API không được!")
        console.log(error)
      }
    )


  }

  signOut() {
    this.isLogin = false
    localStorage.removeItem("isLogin")
    localStorage.removeItem("user-id")
    localStorage.removeItem("user-email")
    localStorage.removeItem("login-timeOut")
    localStorage.removeItem("user-disName")
    localStorage.removeItem("user-imgUrl")
    localStorage.removeItem("user-role")
    this.router.navigateByUrl('/home')
  }
  getUserInfo() {
    this.isLoading = true
    this.authService.getUserInfo(this.user.id).subscribe(
      data => {

        this.user = data.user
        this.user.roles = data.roles
        if(this.user.roles[0]!="Administrator"){
          this.router.navigateByUrl("/error")
        }
        this.getNew()
        this.getUser()
        this.getProduct()
        this.getSearchData()
        this.getEmployee()
        this.getOrder()
        this.isLoading = false
      },
      error => {
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }
  getLocalStorage() {
    if(localStorage.getItem("isLogin")){
   
      let timeOut= new Date(localStorage.getItem("login-timeOut")!)
      let timeNow = new Date()
  
      if(timeOut.getTime()<timeNow.getTime()){
        //console.log("time out remove key")
        localStorage.removeItem("isLogin")
        localStorage.removeItem("user-id")
        localStorage.removeItem("user-email")
        localStorage.removeItem("login-timeOut")
        localStorage.removeItem("user-disName")
        localStorage.removeItem("user-imgUrl")
        localStorage.removeItem("user-role")
        localStorage.removeItem("user-info")
      }
      else{
        this.isLogin = Boolean(localStorage.getItem('isLogin'))
        this.user=new User
        this.user.id = localStorage.getItem('user-id')!
        this.user.email = localStorage.getItem("user-email")!
        this.user.displayName = localStorage.getItem("user-disName")!
        this.user.imgUrl=localStorage.getItem("user-imgUrl")!
        this.user.roles=[]
        this.user.roles.push(localStorage.getItem("user-role")!)
        //console.log("still login")
      }
    }
    else{
     // console.log("no login acc")
    }

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
    this.adminService.getUsers(this.orderUser, this.role, this.orderDirUser).subscribe(
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
        this.isLoading = false
      },
      error => {
        console.log(error)
        this.isLoading = false
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }
  switchTab(s: string) {
    this.active_tab = s
  }

  openEditUserModal(changeIMG: any, u: User) {
    this.editingUser = u
    this.newName = this.editingUser.displayName
    this.newPhone = this.editingUser.phoneNumber
    this.urlIMG = this.editingUser.imgUrl
    this.modalService.open(changeIMG, { ariaLabelledBy: 'modal-basic-title' })
  }
  openAddUserModal(newUser: any) {
    this.showFormError = false
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
        this.updateUserList()
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
  updateUserList() {
    this.isLoading = true
    this.adminService.getUsers(this.orderUser, this.role, this.orderDirUser).subscribe(
      data => {
        //console.log(data)
        this.userList = data.result
        this.userList.forEach((element, index: number) => {
          element.roles = data.roles[index]
        });
        this.getPagedUserList()
        this.isLoading = false
        //console.log(this.userList)
      },
      error => {
        console.log(error)
        this.isLoading = false
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
        this.rf1.controls['username'].value, this.rf1.controls['phone'].value, this.rf1.controls['role'].value).subscribe(
          data => {
            console.log(data)
            this.updateUserList()
            this.isCreatingUser = false
            this.toast.success("Thêm thành công!")
            this.modalService.dismissAll()
          },
          error => {
            this.toast.error(" An error has occurred ! Try again !")
            this.isCreatingUser = false
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
        this.updateUserList()
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
  getOrderShippingInfo(id:any){
    this.orderService.getShippingInfo(id).subscribe(
      data=>{
        this.selectedShippingInfo=data.result
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

  getNew() {
    let index = this.randomInteger(0, 5)

    this.adminService.getNew(this.newCategory[index]).subscribe(
      data => {
        this.news = data.articles
        //console.log(this.news)
      }
    )
  }

  getEmployee(){
    this.employeeList=[]
    this.adminService.getEmployees(this.orderEmployee,this.roleEmployee,this.orderDirEmployee).subscribe(
      data=>{
        console.log(data)
        for(let i=0;i<data.count;i++){
          let e = new Employee
          e=data.result[i]
          e.roles=data.roles[i]
          e.Address=data.employeeInfo[i].address
          e.CMND=data.employeeInfo[i].cmnd
          e.Salary=data.employeeInfo[i].salary
          e.Sex=data.employeeInfo[i].sex
          e.StartDate=data.employeeInfo[i].startDate
          e.Status=data.employeeInfo[i].status
          this.employeeList.push(e)
          
        }
        console.log(this.employeeList)
        this.getPagedEmployee()
      },
      error=>{
        console.log(error)
        this.toast.error(" An error has occurred ! Try again !")
      }
    )
  }
  getPagedEmployee(){
    this.pagedEmployeeList = []
    for (let i = 0; i < this.pageSizeEmployee; i++) {
      if (this.employeeList[i + this.pageSizeEmployee * (this.pageNumberEmployee - 1)]) {
        this.pagedEmployeeList.push(this.employeeList[i + this.pageSizeEmployee * (this.pageNumberEmployee - 1)])
      }

    }
  }
}
