<template>
  <div class="user-product w-full">
    <div class="mb-8 justify-between flex-items-center">
      <a-config-provider
        :theme="{
          components: {
            Input: {
              borderRadius: 9999,
              colorText: '#999999',
              colorBgContainer: '#F9F9F9'
            }
          }
        }">
        <a-input v-model:value="searchValue" @keyup.enter="onSearch" class="w-[330px]" placeholder="搜索您的作品">
          <template #prefix>
            <icon-search class="text-[#606266]"></icon-search>
          </template>
        </a-input>
      </a-config-provider>
      <el-button type="primary" text @click="$router.push('/record')">上传记录</el-button>
    </div>
    <div>
      <a-tabs v-model:activeKey="activeKey" class="user-product__tabs">
        <a-tab-pane v-for="e of USER_PRODUCTS_TABS" :key="e.name" :tab="e.label"></a-tab-pane>
      </a-tabs>
      <div v-loading="pending">
        <div v-for="(e, i) of data?.list" :key="e.id">
          <div class="user-product__item flex">
            <div class="mr-4 h-[180px] w-[208px] cursor-pointer overflow-hidden rounded-[6px]" @click="onJumpDetail(e)">
              <Image :pic-url="e.picUrl" class="h-full w-full"></Image>
            </div>
            <div class="flex-1 pr-[76px]">
              <div class="flex justify-between">
                <div class="flex-items-center">
                  <a-tooltip :title="e.name" placement="top">
                    <span
                      class="el-text-color mr-11 max-w-40 cursor-pointer text-base font-semibold text-hidden"
                      @click="onJumpDetail(e)">
                      {{ e.name }}
                    </span>
                  </a-tooltip>
                  <span class="mita-text-grey">{{ timeAgo(e.createTime) }}</span>
                  <span
                    class="ml-3 rounded bg-[#E8F3FF] px-2 font-medium leading-[22px] text-[#4EA1FE]"
                    v-if="ProductUpdateState[e.status].tagText">
                    {{ ProductUpdateState[e.status].tagText }}
                  </span>
                  <span
                    class="ml-3 rounded bg-[#E8F3FF] px-2 font-medium leading-[22px] text-[#4EA1FE]"
                    v-if="e.copyrightUserId !== e.craterUserId">
                    已购买版权
                  </span>
                  <span
                    v-if="authStatus && authStatus !== UserAuthEnum['已实名认证']"
                    class="ml-3 rounded bg-[#E8F3FF] px-2 font-medium leading-[22px] text-[#4EA1FE]">
                    {{ UserAuthEnum[authStatus] }}
                  </span>
                </div>
                <div class="relative w-[112px]">
                  <a-button
                    block
                    type="primary"
                    ghost
                    class="absolute right-0 top-0"
                    @click="toRealAuth"
                    v-if="authStatus !== UserAuthEnum['实名认证待审核'] && authStatus !== UserAuthEnum['已实名认证']">
                    去实名认证
                  </a-button>
                </div>
              </div>
              <div class="mt-4 leading-[22px] mita-text-grey-nd">分类：{{ e.categoryName }}</div>
              <div class="mt-[88px] flex justify-between">
                <div class="flex gap-2">
                  <span class="flex items-center">
                    <icon-visible></icon-visible>
                    <span class="text-10">{{ e.browseCount }}</span>
                  </span>
                  <span class="flex items-center">
                    <icon-comment-two></icon-comment-two>
                    <span class="text-10">{{ e.commentCount }}</span>
                  </span>
                  <span class="flex items-center">
                    <icon-star></icon-star>
                    <span class="text-10">{{ e.collectionCount }}</span>
                  </span>
                </div>
                <div class="flex">
                  <el-button v-if="e.status !== ProductListStateEnum.CHECKING" text @click="onUpdateStatus(e.id, e.status)">
                    <span class="gap-2 flex-items-center">
                      <icon-delisting></icon-delisting>
                      <span class="text-xs">{{ ProductUpdateState[e.status].label }}作品</span>
                    </span>
                  </el-button>

                  <el-button text :disabled="e.status === ProductListStateEnum.ENABLE" @click="$router.push(`/works/${e.id}`)">
                    <span class="flex gap-2">
                      <icon-edit-nd></icon-edit-nd>
                      <span class="text-xs">编辑属性</span>
                    </span>
                  </el-button>
                  <el-button
                    text
                    :disabled="e.status === ProductListStateEnum.ENABLE"
                    @click="$router.push(`/asset-editor/${e.fileResourceId}`)">
                    <span class="flex gap-2">
                      <icon-three-d></icon-three-d>
                      <span class="text-xs">编辑3D设置</span>
                    </span>
                  </el-button>
                </div>
              </div>
            </div>
          </div>
          <el-divider v-if="i < (data?.list.length || 0) - 1"></el-divider>
        </div>
        <empty-page v-if="data?.list.length === 0" message="暂无数据" class="pt-40" :is-action="false">
          <div class="img"><NuxtImg src="/images/search-empty.png"></NuxtImg></div>
        </empty-page>
      </div>
    </div>
    <el-pagination
      v-if="data?.list.length"
      class="mt-14 justify-center"
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="data?.total"></el-pagination>
  </div>
</template>
<script setup lang="ts">
const searchValue = ref("")
const pageNo = ref(1)
const pageSize = ref(10)
const route = useRoute()
const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)
const authStatus = computed(() => userInfo.value && userInfo.value.authStatus)
const type = userInfo.value?.userType
const toRealAuth = () => {
  if (type === UserType.PERSONAL) {
    navigateTo("/user/auth-personal")
  } else if (type === UserType.COMPANY) {
    navigateTo("/user/auth-company")
  }
}

const { loading: updateStatusLoading, runAsync: updateStatus } = useRequest(updateProductStatus, { manual: true })
const activeKey = ref(Number(route.query?.type as string) || ProductListStateEnum.ENABLE)

const { data, refresh, pending } = await useAsyncData(
  () =>
    getSpuList({
      pageNo: pageNo.value,
      pageSize: pageSize.value,
      name: searchValue.value,
      status: activeKey.value,
      spuType: ProductSpuType.ASSET
    }),
  {
    default: () => ({ list: [], total: 0 }),
    server: false,
    watch: [pageNo, pageSize, activeKey]
  }
)

const onSearch = () => {
  refresh()
}

const onJumpDetail = (e: GetSpuList.Item) => {
  if (e.status > ProductListStateEnum.CHECKING) {
    navigateTo(`/asset/${e.id}`)
  }
}

const onUpdateStatus = async (id: number, status: UserWorksStatus) => {
  if (!updateStatusLoading.value) {
    const res = await updateStatus({ status: ProductUpdateState[status].value, id })
    if (res) {
      message.success(`${ProductUpdateState[status].label}成功`)
      refresh()
    }
  }
}
onMounted(() => {
  authStore.updateUserInfo()
})
</script>
<style lang="scss" scoped>
.user-product {
  .user-product__item {
    margin-top: 36px;
  }
}
</style>
