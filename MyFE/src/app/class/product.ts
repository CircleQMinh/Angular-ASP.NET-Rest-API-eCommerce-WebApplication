import { Review } from "./review";
import { User } from "./user";

export class Product {

    id!:number;
    name!:string;
    price!:number;
    description!:string;
    unitInStock!:number;
    category!:string;
    imgUrl!:string;
    lastUpdate!:string;
    favoritedUsers!:User[]
    reviews!:Review[]


	constructor(id:number,name:string,price:number,des:string,unit:number,cate:string,img:string,last:string) {
        this.id=id;
        this.name=name;
        this.description=des;
        this.price=price
        this.unitInStock=unit;
        this.category=cate;
        this.imgUrl=img;
        this.lastUpdate=last;
	}
}
