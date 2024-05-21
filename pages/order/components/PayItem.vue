<template>
  <div class="pay-item" :class="{ active: props.selected }">
    <span class="pay-icon" :class="[`${props.payType}-pay`]"></span>
    <div class="pl10"><slot></slot></div>
  </div>
</template>

<script setup lang="ts" name="PayItem">
interface payItemProps {
  payType: string | number | boolean
  selected: boolean
}
const props = withDefaults(defineProps<payItemProps>(), {})
</script>
<style lang="scss" scoped>
.pay-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 63px;
  padding: 18px 38px 18px 11px;
  margin: 0 1px;
  cursor: pointer;
  border: 1px solid $sub-title-color;
  border-radius: 4px;
  &:hover {
    opacity: 0.8;
  }
  &.active {
    margin: 0;
    background-image: url("/images//pay-active.png");
    background-repeat: no-repeat;
    background-position: calc(100% + 16px) 28px;
    border: 2px solid $primary-color;
  }
  .pay-icon {
    display: inline-block;
    width: 30px;
    height: 30px;
    background-repeat: no-repeat;
    background-position: center;
  }
  .wallet-pay {
    background-image: url("/images/metaPay.png");
  }
  .alipay_pc-pay {
    background-image: url("/images/aliPay.png");
  }
  .wx_bar-pay {
    background-image: url("/images/weixinPay.png");
  }
}
</style>
