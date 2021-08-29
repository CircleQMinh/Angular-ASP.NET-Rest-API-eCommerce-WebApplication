import { Order } from "./order"
import { Product } from "./product"

export class OrderDetail {

    id!:number
    product!:Product
    productID!:number
    quantity!:number
    order!:Order
    orderId!:number
}
