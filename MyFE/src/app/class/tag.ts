import { Product } from "./product";

export class Tag {
    id!:number;
    productId!:number;
    product!:Product;
    name!:string;
}
