import { Order } from "./order";
import { Product } from "./product";

export class Employee {
    id!:string;
    displayName!:string
    phoneNumber!:string
    email!:string
    imgUrl!:string
    favoriteProducts!:Product[]
    roles!:string[];
    orders!:Order[];
    emailConfirmed!:boolean
    Address!:string
    Sex !:string
    Salary!:number
    CMND!:string
    StartDate!:string
    Status!:number
}
