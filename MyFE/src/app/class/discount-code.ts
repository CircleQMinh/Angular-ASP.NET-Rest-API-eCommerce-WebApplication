import { Order } from "./order"

export class DiscountCode {
    id!:number
    order!:Order
    orderId!:number
    discountAmount!:string
    discountPercent!: string
    status!:number
    code!:string
    startDate!:string 
    endDate!:string 
}
