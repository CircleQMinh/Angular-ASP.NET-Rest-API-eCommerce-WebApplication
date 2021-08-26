import { Order } from "./order"
import { Product } from "./product"

export class OrderDetail {

    id!:number
    product!:Product
    quantity!:number
    order!:Order
}
