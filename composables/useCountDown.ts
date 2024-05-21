/**
 * 60秒倒计时
 */
export default (
  num: number,
  text = "获取验证码"
): { countdownText: Ref<string>; isDisabled: Ref<boolean>; sendCode: () => void } => {
  const countdownNum = ref(num)
  const isDisabled = ref(false)
  const countdownText = computed(() => (isDisabled.value ? `${countdownNum.value}s` : text))

  const sendCode = () => {
    isDisabled.value = true
    const timer = setInterval(() => {
      countdownNum.value -= 1
      if (countdownNum.value === 0) {
        clearInterval(timer)
        countdownNum.value = num
        isDisabled.value = false
      }
    }, 1000)
  }

  return { countdownText, isDisabled, sendCode }
}
