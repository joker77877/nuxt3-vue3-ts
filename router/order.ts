export const orderRoutes: Array<RouteRecordRaw> = [
  {
    path: "/order/list",
    name: "order",
    component: () => import("@/pages/order/index.vue"),
    meta: {
      title: "订单页"
    }
  },
  {
    path: `${INDEX_ROUTE.LIMIT_ASSET}/order/list`,
    name: "orderLimited",
    component: () => import("@/pages/order/index.vue"),
    props: { isLimited: true },
    meta: {
      title: "订单页"
    }
  },
  {
    path: "/order/success",
    name: "orderSuccess",
    component: () => import("@/pages/order/success.vue"),
    meta: {
      title: "订单完成"
    }
  }
]
