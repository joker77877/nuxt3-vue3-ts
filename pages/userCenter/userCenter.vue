<template>
  <a-config-provider
    :theme="{
      token: { borderRadius: 4 },
      components: {
        Form: {
          marginLG: 20
        }
      }
    }">
    <div class="user-center bg-[#f5f5f5]">
      <NuxtImg src="/images/user-center-banner.png" class="w-full" alt=""></NuxtImg>
      <div class="detail-width mx-auto flex gap-5 p-7">
        <div class="w-[352px]">
          <div class="mb-5 rounded-xl bg-white p-4">
            <div class="mb-3 flex">
              <div class="user-center__avatar relative mr-4 h-[76px] w-[76px] cursor-pointer" @click="onJump">
                <NuxtImg :src="userInfo?.avatar" v-if="userInfo?.avatar" alt="" class="h-full w-full rounded-full"></NuxtImg>
                <icon-avatar-nd v-else class="h-full w-full"></icon-avatar-nd>
                <div class="user-center__mask absolute top-0 hidden h-full w-full rounded-full text-white">更改信息</div>
              </div>
              <div class="flex-1">
                <div class="mb-2 gap-4 text-xl flex-items-center">
                  <a-tooltip :title="userInfo?.nickname" placement="top">
                    <span class="max-w-[100px] text-hidden">{{ userInfo?.nickname }}</span>
                  </a-tooltip>
                  <icon-authorized v-if="authStatus === UserCertificationStatus.PASS"></icon-authorized>
                  <span class="auth-name" :class="authInfo.className" v-else @click="goAuthHandle">{{ authInfo.name }}</span>
                </div>

                <div class="flex justify-between gap-6 text-xs">
                  <div class="leading-5.5">
                    <p class="mita-text-grey">人气</p>
                    <p class="">{{ userInfo?.browseCount }}</p>
                  </div>
                  <div class="leading-5.5">
                    <p class="mita-text-grey">粉丝</p>
                    <p class="">{{ userInfo?.fansNum }}</p>
                  </div>
                  <div class="leading-5.5">
                    <p class="mita-text-grey">关注</p>
                    <p class="">{{ userInfo?.attentionNum }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="mb-6 text-xs flex-items-center justify-between">
              <div class="mr-4 w-[76px] leading-5.5">
                <a-tooltip :title="userInfo?.areaName?.split('/')?.[1] || ''" placement="top">
                  <p class="max-w-[100px] text-hidden">
                    {{ userInfo?.areaName?.split("/")?.[1] || "" }}
                  </p>
                </a-tooltip>
                <a-tooltip :title="USER_ROLES[role]" placement="top">
                  <p class="max-w-[100px] text-hidden">
                    {{ USER_ROLES[role] }}
                  </p>
                </a-tooltip>
              </div>
              <div class="flex text-sm">
                <a-button
                  v-if="role === UserRoles.ARTIST"
                  type="primary"
                  @click="$router.push(`${INDEX_ROUTE.LIMIT_ASSET}${INDEX_ROUTE.UPLOAD}`)"
                  ghost
                  class="design-btn">
                  <span>创作限量藏品</span>
                </a-button>
                <a-button v-if="role === UserRoles.DESIGNER" type="primary" ghost class="design-btn ml-3">
                  <span>申请推荐设计师</span>
                </a-button>
              </div>
            </div>

            <NuxtLink class="flex-justify-center" to="/upload">
              <a-button type="primary" size="large" class="w-full">上传作品</a-button>
            </NuxtLink>
            <a-divider style="margin: 16px 0"></a-divider>
            <div class="user-center__wallet w-full rounded-md py-5 flex-col-items-center">
              <div class="mb-1 text-blue">作品累计收益</div>
              <div class="text-3xl leading-9 text-blue">
                <span class="text-2xl">￥</span>
                <span>20000</span>
              </div>
              <div class="mt-5">
                <a-button type="primary" ghost size="large" class="w-24">提现</a-button>
                <a-button type="primary" ghost size="large" class="ml-7 w-24">充值</a-button>
              </div>
            </div>
          </div>
          <div class="rounded-xl bg-white py-9 pl-24">
            <a-menu v-model:selectedKeys="activeKeys" @click="onJumpNemu">
              <a-menu-item v-for="e of menuList" :key="e.key">
                <div class="flex-items-center">
                  <span class="w-[22px]"><component :is="e.icon"></component></span>
                  <span class="ml-6">{{ e.label }}</span>
                </div>
              </a-menu-item>
            </a-menu>
          </div>
        </div>
        <div class="flex-1 rounded-xl bg-white px-5 py-8">
          <NuxtPage></NuxtPage>
        </div>
      </div>
    </div>
  </a-config-provider>
</template>
<script setup lang="ts">
const route = useRoute()
const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)

const authInfo = ref({
  className: "unAuth",
  name: "未认证"
})

const role = computed(() => userInfo.value?.userRole || 1)
const authStatus = ref()
const activeKey = ref([USER_CENTER_MENUS_MAP.product])
const activeKeys = computed(() => (route.path ? [route.path] : activeKey.value))

// 根据角色筛选菜单
const menuList = USER_CENTER_MENUS.filter((item) => {
  if (item.label === "企业信息") {
    return role.value === UserRoles.MAKER
  }
  return true
})

const authInfos = {
  PASS: {
    className: "PASS",
    name: "PASS"
  },
  UN_AUTH: {
    className: "unAuth",
    name: "未认证"
  },
  NO_PASS: {
    className: "no-pass",
    name: "认证未通过"
  },
  PASSING: {
    className: "passing",
    name: "认证中"
  },
  EXPIRED: {
    className: "expired",
    name: "认证已过期"
  }
}
const onJump = () => {
  navigateTo("/user/set-info")
}
const onJumpNemu: MenuProps["onClick"] = ({ key }) => {
  if (key) {
    navigateTo(key as string)
  }
}

const goAuthHandle = () => {
  if (
    !authStatus.value ||
    [UserCertificationStatus.UN_AUTH, UserCertificationStatus.NO_PASS, UserCertificationStatus.EXPIRED].includes(authStatus.value)
  ) {
    if (authStore.userInfo?.userType === UserType.PERSONAL) {
      navigateTo("/user/auth-personal")
    } else {
      navigateTo("/user/auth-company")
    }
  }
}

const getUserAuthHandle = async () => {
  const data = await getUserAuth()
  if (data?.status) {
    authInfo.value = authInfos[data.status]
    authStatus.value = data.status
  }
}

onMounted(() => {
  // active.value = "/"
  getUserAuthHandle()
})
</script>
<style scoped lang="postcss">
.user-center {
  --el-menu-base-level-padding: 0;
  &__wallet {
    background: linear-gradient(277deg, rgb(241 249 255 / 45%) -34.23%, rgb(203 229 251 / 45%) 138.76%);
    backdrop-filter: blur(4.85px);
    border: 1px solid #9ad5ff73;
  }
  &__avatar {
    &:hover {
      .user-center__mask {
        @apply flex-center;

        background: rgb(0 0 0 / 65%);
        transition: 0.25s;
      }
    }
  }
  .auth-name {
    padding-right: 15px;
    padding-left: 15px;
    font-size: 12px;
    font-weight: 400;
    line-height: 24px;
    border: 1px solid #a6a6a6;
    border-radius: 24px;
    &.unAuth {
      color: #a6a6a6;
      cursor: pointer;
      border-color: #a6a6a6;
    }
    &.no-pass {
      color: #e54850;
      cursor: pointer;
      border-color: #e54850;
    }
    &.passing {
      color: #4ea1fe;
      border-color: #4ea1fe;
    }
    &.expired {
      color: #9a74c0;
      cursor: pointer;
      border-color: #9a74c0;
    }
  }
  :deep(.el-menu) {
    --el-menu-hover-bg-color: none;

    border: none;
  }
  :deep(.is-active) {
    color: var(--el-color-primary);
  }
  .design-btn {
    padding: 0 8px;
  }
  :deep(.ant-tabs .ant-tabs-tab + .ant-tabs-tab) {
    margin-left: 80px;
  }
  :deep(.ant-tabs-ink-bar) {
    width: 64px;
  }
}
</style>
