export const limitedAssetRoutes: Array<RouteRecordRaw> = [
  {
    path: INDEX_ROUTE.LIMIT_ASSET,
    name: INDEX_ROUTE.LIMIT_ASSET,
    component: () => import("@/pages/limitAsset/index.vue"),
    meta: { title: "限量资产" }
  },
  // 上传限量藏品
  {
    path: `${INDEX_ROUTE.LIMIT_ASSET}${INDEX_ROUTE.UPLOAD}`,
    name: "uploadLimited",
    component: () => import("@/pages/uploadWork/uploadWork.vue"),
    meta: { title: "限量资产上传" },
    props: { isLimited: true }
  },
  {
    path: `${INDEX_ROUTE.LIMIT_ASSET}${INDEX_ROUTE.EDIT}`,
    name: "addLimited",
    component: () => import("@/pages/uploadWork/UploadWorkInfo.vue"),
    meta: { title: "限量资产添加" },
    props: { isLimited: true }
  },

  {
    path: `${INDEX_ROUTE.LIMIT_ASSET}${INDEX_ROUTE.EDIT}/:id`,
    name: "editLimited",
    component: () => import("@/pages/uploadWork/UploadWorkInfo.vue"),
    meta: { title: "限量资产编辑" },
    props: { isLimited: true }
  },
  {
    path: `${INDEX_ROUTE.LIMIT_ASSET}/:id`,
    name: "limitDetail",
    component: () => import("@/pages/modelAsset/limitDetail.vue"),
    meta: { title: "限量资产详情" }
  }
]
