import { Order } from "./order";
import { Product } from "./product";

export class User {
    id!:string;
    displayName!:string
    phoneNumber!:string
    coins!:number
    email!:string
    imgUrl!:string
    favoriteProducts!:Product[]
    roles!:string[];
    orders!:Order[];
    emailConfirmed!:boolean
    orderCount!:number
}
