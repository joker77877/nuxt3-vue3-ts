<template>
  <div>
    <div class="code">
      <wxlogin
        v-if="state.weChat.appid && state.weChat.redirect_uri"
        :appid="state.weChat.appid"
        scope="snsapi_login"
        :redirect_uri="state.weChat.redirect_uri"
        :href="state.weChat.href"
        :state="state.weChat.state"
        :style="state.weChat.style"></wxlogin>
    </div>
    <p class="agreement-tips">
      登录即代表您已同意
      <el-link class="mr5 ml5" :underline="false" type="primary">用户协议</el-link>
      和
      <el-link class="mr5 ml5" :underline="false" type="primary">隐私政策</el-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import wxlogin from "vue-wxlogin"

interface State {
  weChat: {
    appid: string
    redirect_uri: string
    state: string
    style: string
    href: string
  }
}
const state = reactive<State>({
  weChat: {
    appid: "wx827225356b689e24", // 是开发者在微信开房平台提交申请后，获得appid和一个秘钥
    redirect_uri: decodeURIComponent(
      "https%3A%2F%2Fqq.jd.com%2Fnew%2Fwx%2Fcallback.action%3F%26uuid%3Dfd5674b57d5d4219ab990d51a57c25db"
    ), // 这个是扫码后要跳转的页面，这个路径要urlEncode转码的，转码地址为  https://tool.chinaz.com/tools/urlencode.aspx 注意，要跳转的地址必须在申请的域名下面。
    state: Math.ceil(Math.random() * 1000).toString(),
    style: "", // 代表二维码的样式，有black和white可选，
    href: "data:text/css;base64,LmltcG93ZXJCb3ggLnRpdGxlIHsNCiAgZGlzcGxheTogbm9uZTsNCn0NCi5pbXBvd2VyQm94IC5xcmNvZGUgew0KICBib3JkZXI6IG5vbmU7DQogIHdpZHRoOiAyMjBweDsNCiAgaGVpZ2h0OiAyMjBweDsNCn0NCi5pbXBvd2VyQm94LnN0YXR1cyB7DQogIGRpc3BsYXk6IG5vbmUNCn0=" // 自定义样式链接
  }
})

// 获取微信appid和回调地址redirect_uri，指定内嵌的路由地址weChatLogin
const getWeChatUrl = async () => {
  try {
    // const res = await getWechatQRApi()
    // state.weChat.appid = res.appId || "wx827225356b689e24"
    // state.weChat.redirect_uri = res.wxCallbackUrl + "weChatLogin"
  } catch (err) {
    console.log("获取微信二维码错误", err)
  }
}

// 页面挂载
onMounted(() => {
  getWeChatUrl()
})
</script>

<style lang="scss" scoped>
.code {
  height: 310px;
}
.tips {
  font-weight: 500;
  line-height: 22px;
  color: var(--el-text-color-regular);
  text-align: center;
}
</style>
