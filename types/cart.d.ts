/**
 * 购物车模块
 */
interface CartState {
  validList: Array<Product.CartProductInterface>
  invalidList: Array<Product.CartProductInterface>
  total: number
  totalPrice: string
}
