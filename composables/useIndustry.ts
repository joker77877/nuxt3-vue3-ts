export default async () => {
  const { data: industry } = await useAsyncData(() => getListByTypeApi({ tagType: ListByTypeEnum.PROFESSION }), {
    default: () => [],
    transform: (e) => [
      {
        value: 0,
        label: "全部"
      },
      ...e.map((v) => ({ value: v.id, label: v.name }))
    ]
  })
  return { industry }
}
