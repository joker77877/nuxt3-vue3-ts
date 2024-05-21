<template>
  <div class="bg-[#f5f5f5] pb-[30px]">
    <NuxtImg src="/images/user-center-banner.png" class="w-full" alt="banner"></NuxtImg>
    <div class="fixed-width mt-[30px] rounded-[14px] bg-white px-[50px] py-[48px]">
      <div class="pb-3 text-[18px] font-medium leading-[24px]">上传记录</div>
      <div class="custom-table mt-4">
        <a-table
          table-layout="fixed"
          :loading="loading"
          v-if="list.length"
          :data-source="list"
          :columns="columns"
          :pagination="false">
          <template #bodyCell="{ column, record }">
            <div v-if="column.key === 'status'" class="flex justify-between">
              <div v-if="record.productId === 0" class="text-[#E54850] flex-items-center">
                <span class="mr-[10px] h-3 w-3 rounded-full bg-[#E54850]"></span>
                上传未成功
              </div>
              <div v-else-if="record.spuStatus === AssetStatusEnum.DRAFT" class="text-[#818181] flex-items-center">
                <span class="mr-[10px] h-3 w-3 rounded-full bg-[#818181]"></span>
                草稿
              </div>
              <div v-else class="text-[#0CC399] flex-items-center">
                <span class="mr-[10px] h-3 w-3 rounded-full bg-[#0CC399]"></span>
                上传成功
              </div>
              <a-dropdown>
                <span class="text-blue" v-if="record.productId === 0 || record.spuStatus === AssetStatusEnum.DRAFT">
                  编辑并发布
                </span>
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="handlerAssetPublish(record as UpLoadRecord.Item)">3d资产发布</a-menu-item>
                    <a-menu-item @click="handlerLimitedPublish(record as UpLoadRecord.Item)">限量藏品发布</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
            <!-- <div v-if="column.key === 'name'">
              <a-tooltip :title="record.name" placement="top">
                <span>{{ record.name }}</span>
              </a-tooltip>
            </div>
            <div v-if="column.key === 'spuName'">
              <a-tooltip :title="record.spuName" placement="top">
                <div class="inline-block rounded bg-[#EDEDED] px-3 py-[5px] leading-[22px] text-[#666666]">
                  {{ record.spuName }}
                </div>
              </a-tooltip>
            </div> -->
          </template>
        </a-table>
        <empty-page v-else message="暂无数据" class="pt-40" :is-action="false">
          <div class="img"><nuxt-img src="/images/search-empty.png"></nuxt-img></div>
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
  </div>
</template>
<script setup lang="ts">
const columns = [
  {
    title: "时间",
    dataIndex: "createTime",
    key: "createTime",
    width: 180
  },
  {
    title: "文件名",
    dataIndex: "name",
    key: "name",
    ellipsis: true
  },
  {
    title: "标题",
    dataIndex: "spuName",
    key: "spuName",
    ellipsis: true
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status"
  }
]

// 列表请求
const {
  data: list,
  paging,
  loading
} = usePaginationPro((page) =>
  getUploadRecord({
    ...page
  }).then((res) => {
    res.list.forEach((e) => {
      e.createTime = dayjs(e.createTime).format("YYYY-MM-DD HH:mm:ss")
    })
    return res
  })
)
const handlerAssetPublish = (record: UpLoadRecord.Item) => {
  if (record.productId === 0) {
    // 未保存
    navigateTo(`${INDEX_ROUTE.WORKS}?fileResourceId=${record.id}`)
  } else {
    // 草稿
    navigateTo(`${INDEX_ROUTE.WORKS}/${record.productId}`)
  }
}
const handlerLimitedPublish = (record: UpLoadRecord.Item) => {
  if (record.productId === 0) {
    // 未保存
    navigateTo(`${INDEX_ROUTE.LIMIT_ASSET}${INDEX_ROUTE.EDIT}?fileResourceId=${record.id}`)
  } else {
    // 草稿
    navigateTo(`${INDEX_ROUTE.LIMIT_ASSET}${INDEX_ROUTE.EDIT}/${record.productId}`)
  }
}
</script>
<style lang="scss" scoped>
.custom-table {
  :deep(.ant-table) {
    .ant-table-container .ant-table-content {
      .ant-table-thead th,
      .ant-table-tbody td {
        background-color: transparent;
        border-color: #cccccc;
      }
    }
    .ant-table-tbody .ant-table-cell {
      padding: 20px 16px;
    }
  }
}
</style>
