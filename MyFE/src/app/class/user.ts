import { Order } from "./order";

export class User {
    id!:string;

   
    displayName!:string
    phoneNumber!:string
    email!:string
    imgUrl!:string


    roles!:string[];
    orders!:Order[];
}
