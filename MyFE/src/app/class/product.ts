import { Category } from "./category";
import { PromotionInfo } from "./promotion-info";
import { Review } from "./review";
import { Tag } from "./tag";
import { User } from "./user";

export class Product {

    id!:number;
    name!:string;
    price!:number;
    description!:string;
    unitInStock!:number;
    category!:Category;
    imgUrl!:string;
    lastUpdate!:string;
    favoritedUsers!:User[]
    reviews!:Review[]
    promoInfo!:PromotionInfo
    status!:number
    numSales!:number
    tags!:Tag[]

	constructor(id:number,name:string,price:number,des:string,unit:number,cate:string,img:string,last:string) {
        this.id=id;
        this.name=name;
        this.description=des;
        this.price=price
        this.unitInStock=unit;
        this.category.name=cate;
        this.imgUrl=img;
        this.lastUpdate=last;
	}
}
