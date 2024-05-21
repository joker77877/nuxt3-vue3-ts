export default async () => {
  const { data } = await useAsyncData(() => getAreaApi(), {
    default: () => [],
    transform: (e) =>
      e.map((city) => {
        const children = city.children.map((child) => {
          return {
            id: child.id,
            name: child.name,
            children: []
          }
        })
        return {
          ...city,
          children
        }
      })
  })
  const cityProps = {
    value: "id",
    label: "name",
    children: "children"
  }

  return { cityOptions: data, cityProps }
}
