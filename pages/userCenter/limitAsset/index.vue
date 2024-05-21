<template>
  <div>
    <div class="mb-8 justify-between flex-items-center">
      <a-input
        @keyup.enter="onSearch"
        class="a-input w-[330px] rounded-[10px]"
        v-model:value="searchValue"
        placeholder="搜索您的限量藏品">
        <template #prefix>
          <icon-search class="h-5 w-5 text-[#606266]"></icon-search>
        </template>
      </a-input>
      <div class="flex-items-center">
        <el-button type="primary" text @click="$router.push('/record')">上传记录</el-button>
        <el-button
          type="primary"
          text
          @click="$router.push('/user-center/limit-asset/query')"
          class="font-medium text-blue flex-items-center">
          <icon-blockchain class="mr-2" :style="{ width: '12px', height: '12px' }"></icon-blockchain>
          <span>区块链查询</span>
        </el-button>
      </div>
    </div>
    <div class="tabs">
      <a-tabs v-model:activeKey="activeKey" class="user-product__tabs">
        <a-tab-pane v-for="e in USER_LIMIT_TAB" :tab="e.label" :key="e.value"></a-tab-pane>
      </a-tabs>
      <div v-loading="loading">
        <div v-for="e in list" :key="e.id" class="flex border-b border-solid border-[#eee] py-[36px]">
          <div @click="onJumpDetail(e)" class="mr-[18px] h-[180px] w-[210px] cursor-pointer overflow-hidden rounded-[6px]">
            <Image :pic-url="e.picUrl" class="h-full"></Image>
          </div>
          <div class="flex-1">
            <div class="flex items-start justify-between">
              <div class="pr-8 flex-items-center">
                <a-tooltip :title="e.name" placement="top">
                  <span
                    @click="onJumpDetail(e)"
                    class="truncate max-w-[460px] mr-[30px] flex-1 cursor-pointer text-base font-medium">
                    {{ e.name }}
                  </span>
                </a-tooltip>
                <span class="text-xs text-[#999]">{{ timeAgo(e.createTime) }}</span>
                <span
                  v-if="ProductUpdateState[e.status].tagText"
                  class="ml-3 rounded bg-[#E8F3FF] px-2 font-medium leading-[22px] text-[#4EA1FE]">
                  {{ ProductUpdateState[e.status].tagText }}
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
              <!-- 藏品编码 -->
              <!-- <div class="flex flex-shrink-0 cursor-pointer overflow-hidden rounded text-xs leading-[20px]">
              <span class="bg-gradient-to-r from-[#573D22] to-[#B18758] px-1 text-[#FBE5B8]">藏品编码</span>
              <span class="max-w-[130px] truncate bg-gradient-to-r from-[#FFDA8B] to-[#FFEFCD] px-1 text-[#62472B]">
                1232131231231232132131232
              </span>
            </div> -->
            </div>
            <div class="mt-4 leading-[22px] mita-text-grey-nd">分类：{{ e.categoryName }}</div>
            <div class="mt-4 leading-[22px] mita-text-grey-nd">发行方：{{ e.publisher }}</div>
            <div class="mt-[48px] flex justify-between">
              <div class="flex gap-2 text-[#666666]">
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
                <a-button
                  v-if="e.status !== ProductListStateEnum.CHECKING"
                  @click="onUpdateStatus(e.id, e.status)"
                  :loading="updateStatusLoading"
                  type="text"
                  class="text-regular flex-items-center">
                  <icon-delisting class="mr-2"></icon-delisting>
                  <span class="text-xs">{{ ProductUpdateState[e.status].label }}藏品</span>
                </a-button>
                <a-button
                  @click="$router.push(`${INDEX_ROUTE.LIMIT_ASSET}${INDEX_ROUTE.EDIT}/${e.id}`)"
                  :disabled="e.status === ProductListStateEnum.ENABLE"
                  type="text"
                  class="text-regular flex-items-center">
                  <icon-edit-nd class="mr-2"></icon-edit-nd>
                  <span class="text-xs">编辑属性</span>
                </a-button>
                <a-button
                  @click="$router.push(`/asset-editor/${e.fileResourceId}`)"
                  type="text"
                  class="text-regular flex-items-center"
                  :disabled="e.status === ProductListStateEnum.ENABLE">
                  <icon-three-d class="mr-2"></icon-three-d>
                  <span class="text-xs">编辑3D设置</span>
                </a-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <empty-page v-if="list.length === 0" message="暂无数据" class="pt-40" :is-action="false">
        <NuxtImg class="w-[150px]" src="/images/search-empty.png"></NuxtImg>
      </empty-page>
      <a-pagination
        v-if="list.length"
        class="mt-14 flex-justify-center"
        v-model:current="paging.pageNo"
        v-model:page-size="paging.pageSize"
        :show-size-changer="true"
        show-quick-jumper
        :total="paging.total"></a-pagination>
    </div>
  </div>
  <!-- 暂时不做 -->
  <!-- <cert v-model="certVisible"></cert> -->
</template>
<script setup lang="ts">
import { USER_LIMIT_TAB } from "@/constants/userCenter"

const { userInfo } = storeToRefs(useAuthStore())
const authStatus = userInfo.value && userInfo.value.authStatus
const type = userInfo.value?.userType
const toRealAuth = () => {
  if (type === UserType.PERSONAL) {
    navigateTo("/user/auth-personal")
  } else if (type === UserType.COMPANY) {
    navigateTo("/user/auth-company")
  }
}

const searchValue = ref("")
const route = useRoute()

const activeKey = ref(Number(route.query?.type as string) || ProductListStateEnum.ENABLE)

const onJumpDetail = (e: GetSpuList.Item) => {
  if (e.status > ProductListStateEnum.CHECKING) {
    window.open(`/limit-asset/${e.id}`, "_blank")
  }
}

// 列表请求
const {
  data: list,
  paging,
  loading,
  run
} = usePaginationPro(
  (page) =>
    getSpuList({
      ...page,
      name: searchValue.value,
      status: activeKey.value,
      spuType: ProductSpuType.LIMIT
    }),
  {
    refreshDeps: [activeKey]
  }
)

const onSearch = () => {
  run()
}

const { loading: updateStatusLoading, run: onUpdateStatus } = useMyRequest(
  (id: number, status: UserWorksStatus) =>
    updateProductStatus({ status: ProductUpdateState[status].value, id }).then((res) => {
      if (res) {
        message.success(`${ProductUpdateState[status].label}成功`)
        run()
      }
    }),
  { manual: true }
)
</script>
<style lang="scss" scoped>
.tabs {
  :deep(.ant-tabs-nav) {
    margin: 0;
  }
}
.a-input {
  background-color: #f9f9f9;
  :deep(.ant-input) {
    background-color: #f9f9f9;
  }
}
</style>
