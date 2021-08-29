import { OrderDetail } from "./order-detail"
import { User } from "./user"

export class Order {
    id!:number
    user!:User
    userID!:string
    contactName!:string
    address!:string
    phone!: string
    email!: string
    orderDate!:string
    paymentMethod!: string
    status!: number
    totalItem!:number
    totalPrice!:number
    shipper!:User
    note!:string
    orderDetails!:OrderDetail[]
}
