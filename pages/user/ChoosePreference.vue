<template>
  <div class="prefession-content flx-align-center flx-column pt64">
    <div class="logo-wrapper mb60 flx-center flx-column">
      <p class="info mt20">选择感兴趣的3D类别，觅她网为您推荐精选作品</p>
      <span class="skip-btn primary-color" @click="skipHandle">跳过</span>
    </div>
    <el-checkbox-group v-if="preferenceList.length > 0" class="preference-list" v-model="checkList" :max="4">
      <el-checkbox class="preference-item" v-for="item in preferenceList" :key="item.id" label="" :value="item.id">
        <Image class="preference-img" :pic-url="item.picUrl"></Image>
        <span class="name pl8 pr8">{{ item.name }}</span>
      </el-checkbox>
    </el-checkbox-group>
    <div v-else-if="isLoading" class="loading-more">数据加载中...</div>
    <empty-page v-else message="暂无数据" class="w-[100%] border-box" :is-action="false">
      <NuxtImg src="/images/empty-works.png"></NuxtImg>
    </empty-page>
    <el-button
      :disabled="checkList.length === 0"
      :type="checkList.length === 0 ? 'info' : 'primary'"
      class="submit-btn mb30"
      v-debounce="submitForm">
      下一步
    </el-button>
  </div>
</template>
<script setup lang="ts">
const authStore = useAuthStore()

const isLoading = ref(true)
const checkList = ref(authStore.userInfo?.tagIds || [])
const preferenceList = ref<System.ResListByType[]>([])

const getProfessionHandle = async () => {
  try {
    isLoading.value = true
    const data = await getListByTypeApi({
      tagType: ListByTypeEnum.PRODUCT
    })

    preferenceList.value = data as any
    isLoading.value = false
  } catch (err) {
    console.log("获取推荐列表失败", err)
    isLoading.value = false
  }
}

onMounted(() => {
  getProfessionHandle()
})

const submitForm = async () => {
  try {
    await setUserProfessionApi({
      tagIds: [...checkList.value]
    })

    await authStore.updateUserInfo()
    navigateTo("/", { replace: true })
  } catch (err) {
    console.log("保存用户信息失败")
  }
}

const skipHandle = () => {
  navigateTo("/", { replace: true })
}
</script>
<style lang="scss" scoped>
.logo-wrapper {
  position: relative;
  width: 100%;
  .skip-btn {
    position: absolute;
    top: 20px;
    right: 0;
    cursor: pointer;
  }
  .info {
    font-size: 20px;
    font-weight: 600;
    line-height: 22px;
    color: var(--el-text-color-regular);
  }
}
.prefession-content {
  display: flex;
  flex-wrap: wrap;
  width: 1325px;
  min-height: calc(100vh - 220px);
  margin-right: auto;
  margin-left: auto;
}
.preference-list {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  .preference-item {
    position: relative;
    width: 200px;
    height: 150px;
    margin-bottom: 40px;
    .preference-img {
      display: block;
      width: auto;
      height: auto;
    }
    .name {
      position: absolute;
      bottom: 8px;
      left: 11px;
      height: 24px;
      font-size: 14px;
      line-height: 24px;
      color: #ffffff;
      background: rgb(0 0 0 / 20%);
      border-radius: 2px;
    }
    .checkbox {
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }
}
.submit-btn {
  width: 362px;
  height: 49px;
}
.skip-btn {
  font-size: var(--el-font-size-medium);
  font-weight: 500;
  color: #115ee8;
  cursor: pointer;
}
</style>
<style>
.preference-item {
  .el-checkbox__input {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .el-checkbox__label {
    height: 100%;
    padding-left: 0;
    line-height: 100%;
  }
}
.prefession-content {
  .el-checkbox {
    margin-right: 25px;
    &:nth-child(6n) {
      margin-right: 0;
    }
  }
}
</style>
