import { Product } from "./product"
import { Promotion } from "./promotion"

export class PromotionInfo {

    id!:number
    product!:Product
    productId!:number
    promotionId!: number
    promotion!:Promotion
    promotionAmount!:string
    promotionPercent!: string
}
