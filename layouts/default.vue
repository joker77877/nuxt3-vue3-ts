<template>
  <a-extract-style>
    <a-config-provider
      :locale="zhCN"
      :theme="{
        token: {
          colorPrimary: '#115ee8',
          colorText: '#232833',
          wireframe: true
        },
        components: {
          Tabs: {
            fontSize: 16,
            colorText: '#666'
          },
          Button: {
            borderRadius: 4,
            borderRadiusLG: 4,
            fontSize: 14,
            controlHeightSM: 28,
            controlHeight: 40,
            controlHeightLG: 48,
            fontSizeLG: 16,
            colorBorder: '#EBEBED'
          },
          Input: {
            // borderRadiusLG: 9999,
            fontSizeLG: 14,
            controlHeightLG: 56,
            controlHeight: 40,
            controlHeightXS: 32
          },
          Select: {
            controlHeightLG: 56,
            controlHeight: 40,
            controlHeightXS: 32
          },
          List: {
            paddingContentHorizontal: 0,
            paddingContentVertical: 0,
            paddingContentHorizontalLG: 0
          },
          Form: {
            controlHeight: 40
          },
          Pagination: {
            controlHeight: 40
          }
        }
      }">
      <el-config-provider :locale="zhCn">
        <div class="app-container">
          <MitaHeader class="app-header" v-if="!isSimpleHeader"></MitaHeader>
          <div class="main-wrapper">
            <slot></slot>
          </div>
          <MitaFooter v-if="!isHideFooter"></MitaFooter>
        </div>
        <DialogLogin></DialogLogin>
      </el-config-provider>
    </a-config-provider>
  </a-extract-style>
</template>
<script setup lang="ts">
import zhCn from "element-plus/es/locale/lang/zh-cn"
import zhCN from "ant-design-vue/es/locale/zh_CN"

const route = useRoute()
const isSimpleHeader = computed(() => NO_HEADER_PAGES.some((e) => route.path.includes(e)))
const isHideFooter = computed(() => NO_FOOTER_PAGES.some((e) => route.path.includes(e)))
</script>
<style lang="scss" scoped>
.app-container {
  min-width: 1200px;
  .main-wrapper {
    min-height: calc(100vh - 155px);
  }
}
</style>
