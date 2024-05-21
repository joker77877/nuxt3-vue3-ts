<template>
  <div @click="$router.back()" class="flex cursor-pointer text-[18px] leading-[24px]">
    <icon-back class="h-[24px] w-[24px]"></icon-back>
    <span class="ml-2">返回</span>
  </div>
  <div class="mt-[140px] flex flex-col items-center">
    <p class="pb-5 text-[16px] font-medium">请输入哈希值或区块链地址</p>
    <a-textarea
      class="rounded-[10px] bg-white px-[14px] py-[12px]"
      v-model:value="textarea"
      style="width: 442px"
      :rows="6"
      placeholder="输入后可查询藏品和账户区块链信息"></a-textarea>
    <a-button
      :loading="loading"
      :disabled="!textarea"
      @click="run"
      class="mt-6 h-[48px] w-[362px] text-[16px]"
      type="primary"
      size="large">
      确定
    </a-button>
  </div>
</template>
<script setup lang="ts">
const textarea = ref("")
const router = useRouter()

const { run, loading } = useMyRequest(
  () =>
    queryBlackChainAccount({
      trainAddress: textarea.value
    })
      .then(() => {
        router.push({
          path: "/user-center/limit-asset/query/account",
          query: {
            hash: textarea.value
          }
        })
      })
      .catch(() => {
        message.warn("查询失败，请检查地址是否有误！")
      }),
  {
    manual: true
  }
)
</script>
