import mitt from "mitt"
// mitt是一个函数，赋给命名为$bus的变量
const $bus = mitt()
// 向外暴露这个变量
export default $bus
