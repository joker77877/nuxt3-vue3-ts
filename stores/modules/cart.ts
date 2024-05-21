export const useCartStore = defineStore({
  id: "meta3d-cart",
  state: (): CartState => ({
    // 有效作品列表
    validList: [],
    // 无效作品列表
    invalidList: [],
    total: 0,
    totalPrice: ""
  }),
  getters: {
    validProductListGet: (state) => state.validList,
    invalidProductListGet: (state) => state.invalidList,
    countGet: (state) => state.validList.length + state.invalidList.length,
    totalPriceGet: (state) => state.totalPrice
  },
  actions: {
    // 添加作品
    async addProduct(product: Product.ReqAddProductToCart) {
      await addProductToCart(product)
      this.getCartDetail()
    },
    // 删除作品
    async delProduct(id: number) {
      await delProductOfCart([id])
      this.getCartDetail()
    },
    // 清除购物车
    async clearCart() {
      const ids = [...this.validList.map((item) => item.id), ...this.invalidList.map((item) => item.id)]
      await delProductOfCart(ids)
      this.getCartDetail()
    },
    // 获得购物车详情
    async getCartDetail() {
      const data = await getProductOfCart()
      this.validList = data.validList
      this.invalidList = data.invalidList
      this.totalPrice = data.totalPrice
    },
    // 更新版权
    async updateCopyRight(cartId: number, value: number) {
      await updateCopyright({
        cartId,
        rightType: value
      })
      this.getCartDetail()
    },
    async logout() {
      this.validList = []
      this.invalidList = []
      this.totalPrice = ""
    }
  }
})
