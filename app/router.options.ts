import type { RouterConfig } from "@nuxt/schema"
import { orderRoutes } from "@/router/order"
import { errorRouter } from "@/router/error"
import { limitedAssetRoutes } from "@/router/limitAsset"
// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterConfig>{
  routes: () => [
    {
      path: "/",
      name: "home",
      component: () => import("@/pages/home/home.vue"),
      meta: { title: "首页" }
    },
    {
      path: INDEX_ROUTE.HOME,
      redirect: { name: "home" },
      children: [],
      name: "index"
    },
    {
      path: `${INDEX_ROUTE.ASSET}/:id`,
      name: "asdetail",
      component: () => import("@/pages/modelAsset/detail.vue"),
      meta: { title: "3D资产详情" }
    },
    {
      path: INDEX_ROUTE.ASSET,
      name: INDEX_ROUTE.ASSET,
      component: () => import("@/pages/modelAsset/index.vue"),
      meta: { title: "3D资产" }
    },
    {
      path: "/asset-editor/:id",
      name: "assetsEditor",
      component: () => import("@/pages/modelAsset/editor/index.vue"),
      meta: { title: "编辑3D资产" }
    },
    {
      path: "/asset-error",
      name: "assetsError",
      component: () => import("@/pages/modelAsset/error.vue"),
      meta: { title: "3D资产" }
    },
    {
      path: "/user/set-info",
      name: "setInfo",
      component: () => import("@/pages/user/SetUserInfo.vue"),
      meta: { title: "创建个人信息" }
    },
    {
      path: "/user/choose-preference",
      name: "choosePreference",
      component: () => import("@/pages/user/ChoosePreference.vue"),
      meta: { title: "选择个人兴趣" }
    },
    {
      path: "/user/agreement",
      name: "agreement",
      component: () => import("@/pages/user/Agreement.vue")
    },
    {
      path: "/user/auth-personal",
      name: "authPersonal",
      component: () => import("@/pages/user/AuthPersonal.vue")
    },
    {
      path: "/user/auth-company",
      name: "authCompany",
      component: () => import("@/pages/user/AuthCompany.vue")
    },
    {
      path: INDEX_ROUTE.DESIGNER,
      name: INDEX_ROUTE.DESIGNER,
      meta: { title: "设计师" },
      component: () => import("@/pages/designer/index.vue")
    },
    {
      path: `${INDEX_ROUTE.DESIGNER}:id`,
      meta: { title: "设计师" },
      name: "designerDetail",
      component: () => import("@/pages/designer/detail.vue")
    },
    {
      path: INDEX_ROUTE.BUSINESS_DOCK,
      meta: { title: "商业对接" },
      name: INDEX_ROUTE.BUSINESS_DOCK,
      component: () => import("@/pages/bussinessDock/bussinessDock.vue")
    },
    {
      path: `${INDEX_ROUTE.BUSINESS_DOCK_DETAIL}/:id`,
      meta: { title: "商业对接详情" },
      name: INDEX_ROUTE.BUSINESS_DOCK_DETAIL,
      component: () => import("@/pages/bussinessDock/bussinessDockDetail.vue")
    },
    {
      path: "/search",
      name: "search",
      component: () => import("@/pages/search/index.vue"),
      meta: { title: "搜索" }
    },
    {
      path: INDEX_ROUTE.UPLOAD_WORK,
      name: INDEX_ROUTE.UPLOAD_WORK,
      component: () => import("@/pages/uploadWork/uploadWork.vue"),
      meta: { title: INDEX_ROUTE.UPLOAD_WORK }
    },
    {
      path: `${INDEX_ROUTE.WORKS}/:id(\\d+)*`,
      name: INDEX_ROUTE.WORKS,
      component: () => import("~/pages/uploadWork/UploadWorkInfo.vue"),
      meta: { title: INDEX_ROUTE.WORKS }
    },
    {
      path: `${INDEX_ROUTE.ORDER_DETAIL}/:id`,
      name: INDEX_ROUTE.ORDER_DETAIL,
      component: () => import("~/pages/userCenter/userOrder/orderDetail.vue"),
      meta: { title: INDEX_ROUTE.ORDER_DETAIL }
    },
    {
      path: `${INDEX_ROUTE.USER_UPLOAD_RECORD}`,
      name: INDEX_ROUTE.USER_UPLOAD_RECORD,
      component: () => import("@/pages/record/index.vue"),
      meta: { title: "上传记录" }
    },
    {
      path: INDEX_ROUTE.USER_CENTER,
      name: INDEX_ROUTE.USER_CENTER,
      component: () => import("@/pages/userCenter/userCenter.vue"),
      children: [
        {
          path: INDEX_ROUTE.USER_ORDER_LIST,
          name: INDEX_ROUTE.USER_ORDER_LIST,
          component: () => import("~/pages/userCenter/userOrder/userOrder.vue")
        },
        {
          path: INDEX_ROUTE.USER_PRODUCTS,
          name: INDEX_ROUTE.USER_PRODUCTS,
          component: () => import("~/pages/userCenter/userProducts/userProducts.vue")
        },
        {
          path: INDEX_ROUTE.EnterpriseInfo,
          name: INDEX_ROUTE.EnterpriseInfo,
          component: () => import("~/pages/userCenter/enterpriseInfo/enterpriseInfo.vue")
        },
        {
          path: INDEX_ROUTE.USER_LIMIT_ASSET,
          name: INDEX_ROUTE.USER_LIMIT_ASSET,
          component: () => import("@/pages/userCenter/limitAsset/index.vue")
        },
        {
          path: `${INDEX_ROUTE.USER_LIMIT_ASSET}/${INDEX_ROUTE.USER_LIMIT_ASSET_QUERY}`,
          name: INDEX_ROUTE.USER_LIMIT_ASSET_QUERY,
          component: () => import("@/pages/userCenter/limitAsset/query.vue")
        },
        {
          path: `${INDEX_ROUTE.USER_LIMIT_ASSET}/${INDEX_ROUTE.USER_LIMIT_ASSET_QUERY}/${INDEX_ROUTE.USER_LIMIT_ASSET_QUERY_ACCOUNT}`,
          name: INDEX_ROUTE.USER_LIMIT_ASSET_QUERY_ACCOUNT,
          component: () => import("@/pages/userCenter/limitAsset/account.vue")
        },
        {
          path: `${INDEX_ROUTE.USER_LIMIT_ASSET}/${INDEX_ROUTE.USER_LIMIT_ASSET_QUERY}/${INDEX_ROUTE.USER_LIMIT_ASSET_QUERY_COLLECTION}`,
          name: INDEX_ROUTE.USER_LIMIT_ASSET_QUERY_COLLECTION,
          component: () => import("@/pages/userCenter/limitAsset/collection.vue")
        }
      ]
    },
    ...orderRoutes,
    ...limitedAssetRoutes,
    ...errorRouter
  ]
}
