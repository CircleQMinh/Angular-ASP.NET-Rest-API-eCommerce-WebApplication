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
  selector: 'app-nhanvien',
  templateUrl: './nhanvien.component.html',
  styleUrls: ['./nhanvien.component.css']
})
export class NhanvienComponent implements OnInit {

  isLoading = false
  isCollapsed: boolean = true

  isLogin: boolean = false

  user!: User

  productList: Product[] = []
  pageNumberProduct = 1
  pageSizeProduct = 5
  orderProduct = "Id"
  orderDirProduct: any = "Asc"
  category = "all"
  collectionSizeProduct = 0
  allProduct: Product[] = []
  keyword: any;
  active_tab = "db"


  orderList: Order[] = []
  shippingInfos: any[] = []
  pageNumberOrder = 1
  pageSizeOrder = 5
  orderOrder = "Id"
  status = 0
  collectionSizeOrder = 0
  orderDirOrder: any = "Asc"

  dashboardInfo = {
    totalOrder: 7,
    totalProduct: 102,
    totalUser: 0
  }

  showFormError: boolean = false
  msg:any
  
  defaultProImgUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"
  proImgUrl: any = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"
  rf2!: FormGroup;
  rf3!: FormGroup;
  rf4!: FormGroup

  isCreatingProduct: boolean = false
  editingProduct!: Product
  isEditingProduct: boolean = false
  isDeletingProduct: boolean = false
  deletingProductId = 0

  isGettingOrderDetail: boolean = false
  selectedOrder!: Order
  selectedShippingInfo: any
  isEditingOrder: boolean = false
  isDeletingOrder: boolean = false


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
    this.authService.getLocalStorage()
    this.user=this.authService.user
    this.isLogin=this.authService.isLogin

    console.log(this.isLogin)
    if (!this.isLogin) {
      this.router.navigateByUrl("/error")
    }
    else {
      this.getAdminInfo()

    }

  }
  getAdminInfo() {
    this.isLoading = true
    this.authService.getUserInfo(this.user.id).subscribe(
      data => {
        this.user = data.user
        this.user.roles = data.roles
        if (this.user.roles[0] != "Employee") {
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
  }
  getSearchData() {
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
    }
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
  onPageSizeCategoryChange() {
    this.pageNumberProduct = 1
    this.getProduct()
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
  onPageSizeStatusChage() {

    this.pageNumberOrder = 1
    this.getOrder()
  }

  signOut() {
    this.isLogin = false
    this.authService.signOut()
    this.isLogin = this.authService.isLogin
    this.user=this.authService.user
    this.router.navigateByUrl('/home')
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
      this.rf2.controls['uis'].value, this.rf2.controls['category'].value, this.proImgUrl, today,"0").subscribe(
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
      this.rf3.controls['uis'].value, this.rf3.controls['category'].value, this.proImgUrl, today,String(this.editingProduct.status)).subscribe(
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
}


