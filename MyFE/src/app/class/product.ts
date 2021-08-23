export class Product {

    id!:number;
    name!:string;
    price!:number;
    description!:string;
    unitsInStock!:number;
    category!:string;
    imgUrl!:string;
    lastUpdate!:string;


	constructor(id:number,name:string,price:number,des:string,unit:number,cate:string,img:string,last:string) {
        this.id=id;
        this.name=name;
        this.description=des;
        this.price=price
        this.unitsInStock=unit;
        this.category=cate;
        this.imgUrl=img;
        this.lastUpdate=last;
	}
}
