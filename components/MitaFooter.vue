<template>
  <div class="border-t border-solid border-[#EBEBED] px-[50px] py-10">
    <icon-logo class="mb-2 w-[138px]"></icon-logo>
    <div class="flex items-start justify-between leading-[24px]">
      <div>
        <p class="w-[652px] pb-[10px]">
          全球设计师3D资产虚实共生交易平台。打造空间计算时代,
          规模最大的3D数字资产，利用区块链技术将所有3D数字资产上链，使其具备唯一性，成为空间计算时代全球设计师原创作品的首发平台和确权认证平台
        </p>
        <div class="flex gap-x-3 text-[rgba(35,40,51,0.4)]">
          <span>Copyright © 2024 Mita 3D</span>
          <span>条款</span>
          <span>隐私</span>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-x-[60px] gap-y-2">
        <el-link :underline="false" class="justify-start" v-for="e in links" :key="e">{{ e }}</el-link>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const links = reactive(["中文", "侵权申诉", "关于我们", "English", "使用条款", "用户协议"])
</script>
