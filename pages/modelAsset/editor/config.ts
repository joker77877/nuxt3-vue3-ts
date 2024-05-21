import { childDisabledHandle } from "./utils"

export const modelConfig: ModelConfigItem = {
  title: "3D设置",
  key: "model-config",
  type: "tab",
  tabType: "border-card",
  className: "demo-tabs",
  activeTab: "scene",
  changeHandle: (engine: Meta3DEngineType) => {
    engine.showSceneGizmo(false)
  },
  children: [
    {
      key: "scene",
      type: "tab-pane",
      icon: markRaw(IconScene),
      activeCollapse: ["routine", "camera", "wireframe"],
      tips: "场景",
      children: [
        {
          title: "常规",
          key: "routine",
          type: "collapse",
          activeCollapse: ["routine"],
          tips: "设置模型的方向",
          children: [
            {
              title: "高级旋转",
              key: "showAdvancedRotation",
              type: "checkbox",
              changeHandle: (engine: Meta3DEngineType, value: any) => {
                console.log("显示辅助坐标系", value)
                engine.showSceneGizmo(value)
              },
              value: false
            }
          ]
        },
        {
          title: "相机",
          key: "camera",
          tips: "调整视野和相机限制",
          type: "collapse",
          activeCollapse: ["camera"],
          children: [
            {
              title: "视野",
              key: "fov",
              type: "slider",
              category: "camera.fov",
              changeHandle: (engine: Meta3DEngineType, val: number) => {
                engine.setCameraParam("fov", val)
              },
              value: 40,
              min: 1,
              max: 179,
              step: 0.001
            },
            {
              title: "显示相机高级设置",
              key: "showNearDistance",
              type: "checkbox",
              className: "mt16",
              changeHandle: (engine: Meta3DEngineType, val: boolean, data?: ModelConfigItem) => {
                if (!data) return
                data.hide = !val
              },
              value: false
            },
            {
              title: "近裁剪距离",
              key: "nearDistance",
              category: "camera.nearDistance",
              type: "slider",
              value: 0,
              hide: true,
              changeHandle: (engine: Meta3DEngineType, val: number) => {
                engine.setCameraParam("nearDistance", val)
              },
              min: 0.0001,
              max: 0.5,
              step: 0.0001
            }
          ]
        },
        {
          title: "线框",
          key: "wireframe",
          tips: "是否默认显示线框",
          enable: false,
          changeHandle: (engine: Meta3DEngineType, val: boolean, data?: ModelConfigItem) => {
            console.log("更改线框可用", val, data)
            engine.setWireframeParam("enable", val)
            childDisabledHandle(data!, !val)
          },
          category: "wireframe.enable",
          type: "collapse",
          activeCollapse: ["wireframe"],
          children: [
            {
              // 线框颜色
              key: "color",
              type: "color",
              disabled: false,
              changeHandle: (engine: Meta3DEngineType, val: string) => {
                engine.setWireframeParam("color", val)
              },
              category: "wireframe.color",
              value: ""
            },
            {
              // title: "线框透明度",
              key: "factor",
              type: "slider",
              className: "mt20",
              disabled: false,
              category: "wireframe.factor",
              changeHandle: (engine: Meta3DEngineType, val: number) => {
                engine.setWireframeParam("factor", val)
              },
              value: 0,
              min: 0,
              max: 1,
              step: 0.001
            }
          ]
        },
        {
          title: "背景",
          key: "background",
          tips: "设置模型的背景",
          enable: false,
          changeHandle: (engine: Meta3DEngineType, val: boolean, data?: ModelConfigItem) => {
            // engine.setEnvironmentParam("blur", val)
            console.log("更新背景可用 setBackgroundEnable")
            engine.setBackgroundEnable(val)
            childDisabledHandle(data!, !val)
          },
          category: "background.enable",
          type: "collapse",
          activeCollapse: ["background"],
          children: [
            {
              title: "背景类型",
              key: "type",
              type: "tab",
              activeTab: "environment",
              category: "background.bgType",
              changeHandle: (engine: Meta3DEngineType, tabName: string, data?: ModelConfigItem) => {
                if (!data) return
                switch (tabName) {
                  case "environment":
                    engine.setBackground("environment", true)
                    break
                  case "image": {
                    const [TargetNode] = getSubNodesByKey(data, "category", "background.id")
                    engine.setBackground("image", TargetNode.selectedOptionId)
                    break
                  }
                  case "color": {
                    const [TargetNode] = getSubNodesByKey(data, "category", "background.color")
                    engine.setBackground("color", TargetNode.value)
                    break
                  }
                  default:
                    break
                }
              },
              children: [
                {
                  title: "环境",
                  key: "environment",
                  type: "tab-pane",
                  className: "p-[15px]",
                  children: [
                    {
                      title: "当前环境：",
                      key: "currentEnvironment",
                      type: "link",
                      linkTarget: {
                        key: "model-config",
                        value: "light"
                      },
                      text: ""
                    },
                    {
                      title: "模糊",
                      key: "blur",
                      type: "slider",
                      disabled: false,
                      category: "environment.blur",
                      changeHandle: (engine: Meta3DEngineType, val: number) => {
                        engine.setEnvironmentParam("blur", val)
                      },
                      value: 0,
                      min: 0,
                      max: 1,
                      step: 0.01
                    },
                    {
                      title: "亮度",
                      key: "backgroundExposure",
                      category: "environment.backgroundExposure",
                      type: "slider",
                      disabled: false,
                      changeHandle: (engine: Meta3DEngineType, val: number) => {
                        engine.setEnvironmentParam("backgroundExposure", val)
                      },
                      value: 0,
                      min: 0,
                      max: 1,
                      step: 0.001
                    }
                  ]
                },
                {
                  title: "图像",
                  key: "image",
                  type: "tab-pane",
                  className: "card-img-list",
                  children: [
                    {
                      key: "bg-image-list",
                      type: "select-list",
                      category: "background.id",
                      changeHandle: (engine: Meta3DEngineType, val: number) => {
                        engine.setBackground("image", val)
                      },
                      disabled: false,
                      options: [
                        {
                          id: 1,
                          thumbnailUrl: "http://meta3dlocal.oss-cn-hangzhou.aliyuncs.com/20240424/1709532730548953922.jpeg",
                          name: " 暗黑熔岩"
                        },
                        {
                          id: 2,
                          thumbnailUrl: "http://meta3dlocal.oss-cn-hangzhou.aliyuncs.com/20240424/1709532730548953922.jpeg",
                          name: " 背景冷光"
                        }
                      ],
                      selectedOptionId: 1
                    }
                  ]
                },
                {
                  title: "颜色",
                  key: "color",
                  type: "tab-pane",
                  children: [
                    {
                      key: "color",
                      type: "big-color",
                      className: "sketch-color",
                      disabled: false,
                      category: "background.color",
                      changeHandle: (engine: Meta3DEngineType, val: string) => {
                        engine.setBackground("color", val)
                      },
                      value: ""
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      key: "light",
      type: "tab-pane",
      icon: markRaw(IconLight),
      activeCollapse: ["shadowGround", "environment"],
      tips: "照明",
      children: [
        {
          title: "地面阴影",
          key: "shadowGround",
          type: "collapse",
          activeCollapse: ["shadowGround"],
          tips: "添加一个地面阴影，使模型看起来像是放在一个表面上",
          subTitle: "阴影捕捉器",
          enable: false,
          changeHandle: (engine: Meta3DEngineType, val: boolean, data?: ModelConfigItem) => {
            engine.setShadowGroundParam("enable", val)
            childDisabledHandle(data!, !val)
          },
          category: "shadowGround.enable",
          children: [
            {
              title: "阴暗程度",
              key: "darkness",
              type: "slider",
              disabled: false,
              category: "shadowGround.darkness",
              changeHandle: (engine: Meta3DEngineType, val: number) => {
                engine.setShadowGroundParam("darkness", val)
              },
              value: 0,
              min: 0,
              max: 1,
              step: 0.001
            },
            {
              title: "高度",
              key: "height",
              type: "slider",
              disabled: false,
              category: "shadowGround.height",
              changeHandle: (engine: Meta3DEngineType, val: number) => {
                engine.setShadowGroundParam("height", val)
              },
              value: 0,
              min: -1,
              max: 1,
              step: 0.001
            },
            {
              title: "大小",
              key: "size",
              type: "slider",
              disabled: false,
              category: "shadowGround.size",
              changeHandle: (engine: Meta3DEngineType, val: number) => {
                engine.setShadowGroundParam("size", val)
              },
              value: 0,
              min: 0,
              max: 5,
              step: 0.01
            }
          ]
        },
        {
          title: "环境",
          key: "environment",
          category: "environment.enable",
          type: "collapse",
          activeCollapse: ["environment"],
          tips: "选择一个环境作为背景或照明源",
          enable: false,
          changeHandle: (engine: Meta3DEngineType, val: boolean, data?: ModelConfigItem) => {
            engine.setEnvironmentParam("enable", val)
            childDisabledHandle(data!, !val)
          },
          children: [
            {
              key: "img",
              type: "select-img",
              className: "mb20",
              optionsTitle: "选择环境光",
              category: "environment.id",
              disabled: false,
              changeHandle: (engine: Meta3DEngineType, val: number) => {
                engine.setEnvironmentHDRId(val)
              },
              options: [
                {
                  id: 1,
                  thumbnailUrl: "http://meta3dlocal.oss-cn-hangzhou.aliyuncs.com/20240424/1709532730548953922.jpeg",
                  name: "工业房"
                }
              ],
              selectedOption: {
                id: 1,
                thumbnailUrl: "http://meta3dlocal.oss-cn-hangzhou.aliyuncs.com/20240424/1709532730548953922.jpeg",
                name: "工业房"
              }
            },
            {
              title: "角度",
              key: "rotation",
              type: "slider",
              disabled: false,
              category: "environment.rotation",
              changeHandle: (engine: Meta3DEngineType, val: number) => {
                engine.setEnvironmentParam("rotation", val)
              },
              value: 0,
              min: 0,
              max: 360,
              step: 0.001
            },
            {
              title: "亮度",
              key: "intensity",
              type: "slider",
              disabled: false,
              category: "environment.intensity",
              changeHandle: (engine: Meta3DEngineType, val: number) => {
                engine.setEnvironmentParam("intensity", val)
              },
              value: 0,
              min: 0,
              max: 5,
              step: 0.001
            },
            {
              title: "阴影",
              key: "lightEnable",
              type: "collapse",
              className: "mt25",
              disabled: false,
              activeCollapse: ["lightEnable"],
              enable: false,
              changeHandle: (engine: Meta3DEngineType, val: number, data?: ModelConfigItem) => {
                engine.setEnvironmentLightShadowParam("enable", val)
                childDisabledHandle(data!, !val)
              },
              category: "environment.lightEnable",
              children: [
                {
                  title: "灯光强度",
                  key: "lightIntensity",
                  category: "environment.lightIntensity",
                  changeHandle: (engine: Meta3DEngineType, val: number) => {
                    engine.setEnvironmentLightShadowParam("lightIntensity", val)
                  },
                  type: "slider",
                  disabled: false,
                  value: 0,
                  min: 0,
                  max: 5,
                  step: 0.1
                },
                {
                  title: "阴影偏移",
                  key: "shadowBias",
                  category: "environment.shadowBias",
                  changeHandle: (engine: Meta3DEngineType, val: number) => {
                    engine.setEnvironmentLightShadowParam("shadowBias", val)
                  },
                  type: "slider",
                  disabled: false,
                  value: 0,
                  min: 0,
                  max: 1,
                  step: 0.0001
                }
              ]
            }
          ]
        }
      ]
    },
    {
      key: "postFilter",
      type: "tab-pane",
      icon: markRaw(IconFilter),
      activeCollapse: ["postProcess"],
      tips: "后期滤镜",
      children: [
        {
          title: "后期滤镜",
          key: "postProcess",
          type: "collapse",
          activeCollapse: ["postProcess"],
          enable: false,
          changeHandle: (engine: Meta3DEngineType, val: boolean, data?: ModelConfigItem) => {
            engine.setPostProcessingTotalEnable(val)
            childDisabledHandle(data!, !val)
          },
          category: "postProcess.enable",
          children: [
            {
              title: "屏幕空间反射",
              tips: "实时调整以近似反射物体的效果",
              type: "collapse",
              activeCollapse: ["ssr"],
              enable: false,
              disabled: false,
              changeHandle: (engine: Meta3DEngineType, val: boolean, data?: ModelConfigItem) => {
                engine.setSSRParam("enable", val)
                childDisabledHandle(data!, !val)
              },
              category: "postProcess.ssr.enable",
              key: "ssr",
              children: [
                {
                  key: "factor",
                  type: "slider",
                  category: "postProcess.ssr.factor",
                  changeHandle: (engine: Meta3DEngineType, val: number) => {
                    engine.setSSRParam("factor", val)
                  },
                  disabled: false,
                  value: 0,
                  min: 0,
                  max: 1,
                  step: 0.001
                }
              ]
            },
            {
              key: "ssao",
              title: "屏幕空间环境光遮蔽",
              type: "collapse",
              activeCollapse: ["ssao"],
              tips: "调整设置以改变或增强模型中被遮挡部分的外观",
              enable: false,
              disabled: false,
              changeHandle: (engine: Meta3DEngineType, val: boolean, data?: ModelConfigItem) => {
                engine.setSSAOParam("enable", val)
                childDisabledHandle(data!, !val)
              },
              category: "postProcess.ssao.enable",
              children: [
                {
                  title: "强度",
                  key: "factor",
                  type: "slider",
                  className: "mb12",
                  category: "postProcess.ssao.factor",
                  changeHandle: (engine: Meta3DEngineType, val: number) => {
                    engine.setSSAOParam("factor", val)
                  },
                  disabled: false,
                  value: 0,
                  min: 0,
                  max: 1,
                  step: 0.001
                },
                {
                  title: "半径",
                  key: "radius",
                  type: "slider",
                  category: "postProcess.ssao.radius",
                  changeHandle: (engine: Meta3DEngineType, val: number) => {
                    engine.setSSAOParam("radius", val)
                  },
                  disabled: false,
                  value: 0,
                  min: 0.00001,
                  max: 0.5,
                  step: 0.00001
                }
              ]
            },
            {
              title: "泛光效果",
              tips: "调整使亮点发光，并增强自发光表面的外观",
              type: "collapse",
              activeCollapse: ["bloom"],
              enable: false,
              disabled: false,
              changeHandle: (engine: Meta3DEngineType, val: boolean, data?: ModelConfigItem) => {
                engine.setBloomParam("enable", val)
                childDisabledHandle(data!, !val)
              },
              category: "postProcess.bloom.enable",
              key: "bloom",
              children: [
                {
                  title: "阈值",
                  key: "threshold",
                  type: "slider",
                  className: "mb12",
                  category: "postProcess.bloom.threshold",
                  changeHandle: (engine: Meta3DEngineType, val: number) => {
                    engine.setBloomParam("threshold", val)
                  },
                  disabled: false,
                  value: 0,
                  min: 0,
                  max: 1,
                  step: 0.001
                },
                {
                  title: "强度",
                  key: "factor",
                  type: "slider",
                  category: "postProcess.bloom.factor",
                  changeHandle: (engine: Meta3DEngineType, val: number) => {
                    engine.setBloomParam("factor", val)
                  },
                  disabled: false,
                  value: 0,
                  min: 0,
                  max: 2,
                  step: 0.001
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
