import { User } from "./user";

export class Review {

    id!:number;
    star!:number;
    content!:string;
    date!:string;
    productId!:number;
    userID!:string;
    user!:User
}
