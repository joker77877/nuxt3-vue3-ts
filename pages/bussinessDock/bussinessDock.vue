<template>
  <a-config-provider
    :theme="{
      components: {
        Input: {
          borderRadiusLG: 9999,
          fontSizeLG: 14
        }
      }
    }">
    <div class="bussiness-dock">
      <MitaFilterPage recommend-btn-text="Mita推荐企业" :total="total">
        <template #banner>
          <NuxtImg preload src="/images/asset-index-banner@2px.png" class="w-full object-cover" alt="banner"></NuxtImg>
        </template>
        <template #default="slotProps">
          <BussinessDockList
            :set-total="setTotal"
            :recommend="slotProps.recommend"
            :sort-field-type="slotProps.sortFieldType"
            :recent-works-num="3"
            :area-ids="slotProps.areaIds"
            :keyword="slotProps.keyword"
            :industry-id="slotProps.industryId"></BussinessDockList>
        </template>
      </MitaFilterPage>
      <div class="tip fixed bottom-7 left-7 z-30 h-[142px] w-[264px] p-6 text-white" v-if="tipVisible">
        <IconCloseOutlined
          class="absolute right-2 top-2 z-50 cursor-pointer text-sm"
          @click="tipVisible = false"></IconCloseOutlined>
        <p>欢迎使用 商务对接！</p>
        <p class="pt-2 text-xs">通过展示企业信息，充分提高企业曝光率</p>
        <nuxt-link :to="USER_CENTER_MENUS_MAP.enterpriseInfo">
          <a-button type="default" class="mt-5 w-full text-blue">填写企业信息</a-button>
        </nuxt-link>
      </div>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)
const tipVisible = ref(!userInfo.value?.makerFlag)
const total = ref(0)

const setTotal = (val: number) => {
  total.value = val
}
</script>
<style lang="postcss" scoped>
.tip {
  background: linear-gradient(257deg, rgb(68 176 255 / 73%) 7.3%, rgb(72 138 255 / 89%) 84.3%);
  backdrop-filter: blur(2px);
  border-radius: 6px;
}
</style>
