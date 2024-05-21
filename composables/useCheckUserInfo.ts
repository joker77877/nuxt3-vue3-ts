export default () => {
  const checkUserInfo = async () => {
    try {
      const data = await getUserInfoApi()
      return data
    } catch (err) {
      return null
    }
  }
  return { checkUserInfo }
}
