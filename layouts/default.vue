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
          <div class="main-wrapper">
            <slot></slot>
          </div>
        </div>
 
      </el-config-provider>
    </a-config-provider>
  </a-extract-style>
</template>
<script setup lang="ts">
import zhCN from "ant-design-vue/es/locale/zh_CN"

const route = useRoute()
</script>
<style lang="scss" scoped>
.app-container {
  min-width: 1200px;
  .main-wrapper {
    min-height: calc(100vh - 155px);
  }
}
</style>
