import {
  Scene as e,
  Color3 as t,
  Effect as a,
  DracoCompression as i,
  Texture as r,
  Engine as n,
  Color4 as s,
  CubeTexture as o,
  ArcRotateCamera as l,
  Vector3 as h,
  Tools as c,
  Observable as u,
  PBRMaterial as m,
  MultiMaterial as d,
  SceneLoader as b,
  FilesInput as g,
  Layer as p,
  CreateBox as f,
  RenderTargetTexture as v,
  Matrix as P,
  Quaternion as w,
  DumpTools as y,
  FramingBehavior as M,
  ShadowGenerator as S,
  MeshBuilder as O,
  BoundingBox as x,
  DirectionalLight as T,
  TextureTools as I,
  GenerateBase64StringFromTexture as E,
  MeshDebugPluginMaterial as R,
  MeshDebugMode as k,
  DefaultRenderingPipeline as A,
  SSAORenderingPipeline as j,
  SSRRenderingPipeline as C,
  GizmoManager as L,
  TransformNode as B,
  HemisphericLight as G
} from "@babylonjs/core"
import { round as F, isNumber as z, merge as D } from "lodash-es"
import "@babylonjs/loaders"
import { ShadowOnlyMaterial as _ } from "@babylonjs/materials/shadowOnly"
import { GridMaterial as N } from "@babylonjs/materials"
;(e.prototype.getRootMesh = function () {
  return this.getMeshByName("__root__")
}),
  (t.prototype.setHexString = function (e) {
    return this.copyFrom(t.FromHexString(e)), this
  })
const U = "/textures/image/backgroundImage",
  V = [
    { id: 1, thumbnailUrl: `${U}/thumbnail/linearGradient.jpg`, url: `${U}/linearGradient.jpg`, name: "线性渐变背景" },
    { id: 2, thumbnailUrl: `${U}/thumbnail/darkSpotlight.jpg`, url: `${U}/thumbnail/darkSpotlight.jpg`, name: "暗聚光-强" },
    { id: 3, thumbnailUrl: `${U}/thumbnail/darkCeilingLight.jpg`, url: `${U}/thumbnail/darkCeilingLight.jpg`, name: "暗顶光-弱" },
    { id: 4, thumbnailUrl: `${U}/thumbnail/wireWrapBoard.jpg`, url: `${U}/thumbnail/wireWrapBoard.jpg`, name: "洞洞板" },
    { id: 5, thumbnailUrl: `${U}/thumbnail/coldLightSmoke.jpg`, url: `${U}/thumbnail/coldLightSmoke.jpg`, name: "冷光烟雾" },
    { id: 6, thumbnailUrl: `${U}/thumbnail/darkLava.jpg`, url: `${U}/thumbnail/darkLava.jpg`, name: "暗黑熔岩" }
  ],
  H = "/textures",
  W = [
    {
      name: "brown_photostudio",
      thumbnailUrl: `${H}/image/environmentImage/brown_photostudio_06.jpg`,
      id: 1,
      url: `${H}/environments/brown_photostudio_06_1k.env`
    },
    {
      name: "evening_road_puresky",
      thumbnailUrl: `${H}/image/environmentImage/evening_road_01_puresky.jpg`,
      id: 2,
      url: `${H}/environments/evening_road_01_puresky_1k.env`
    },
    {
      name: "lake_pier",
      thumbnailUrl: `${H}/image/environmentImage/lake_pier.jpg`,
      id: 3,
      url: `${H}/environments/lake_pier_1k.env`
    },
    {
      name: "symmetrical_garden",
      thumbnailUrl: `${H}/image/environmentImage/symmetrical_garden_02.jpg`,
      id: 4,
      url: `${H}/environments/symmetrical_garden_02_1k.env`
    },
    {
      name: "modern_buildings_night",
      thumbnailUrl: `${H}/image/environmentImage/modern_buildings_night.jpg`,
      id: 5,
      url: `${H}/environments/modern_buildings_night_1k.env`
    },
    {
      name: "environmentSpecular",
      thumbnailUrl: `${H}/image/environmentImage/environmentSpecular.jpg`,
      id: 6,
      url: `${H}/environments/environmentSpecular.env`
    }
  ]
;(a.ShadersStore.lodPixelShader =
  "\n#extension GL_EXT_shader_texture_lod : enable\nprecision highp float;\nconst float GammaEncodePowerApprox = 1.0 / 2.2;\nvarying vec2 vUV;\nuniform sampler2D textureSampler;\nuniform float lod;\nuniform vec2 texSize;\nuniform bool gamma;\nvoid main(void)\n{\n    gl_FragColor = textureLod(textureSampler,vUV,lod);\n    if (!gamma) {\n        gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(GammaEncodePowerApprox));\n    }\n}"),
  (i.Configuration = {
    decoder: {
      wasmUrl: "/draco/draco_wasm_wrapper_gltf.js",
      wasmBinaryUrl: "/draco/draco_decoder_gltf.wasm",
      fallbackUrl: "/draco/draco_decoder_gltf.js"
    }
  })
class q {
  constructor(e) {
    Object.defineProperty(this, "canvasDom", { enumerable: !0, configurable: !0, writable: !0, value: null }),
      Object.defineProperty(this, "engine", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "scene", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "camera", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "doRender", { enumerable: !0, configurable: !0, writable: !0, value: !0 }),
      Object.defineProperty(this, "renderSuccess", { enumerable: !0, configurable: !0, writable: !0, value: !1 }),
      Object.defineProperty(this, "_engineResize", { enumerable: !0, configurable: !0, writable: !0, value: () => {} }),
      Object.defineProperty(this, "_initDefaultHDRId", { enumerable: !0, configurable: !0, writable: !0, value: -1 })
    let t = document.getElementById(e)
    t
      ? t instanceof HTMLCanvasElement && ((this.canvasDom = t), (this.renderSuccess = !0))
      : console.error("请检查canvasId是否正确，没有正确的canvasid将无法渲染")
  }
  init() {
    if (this.canvasDom)
      try {
        this.initEngine(),
          this.initScene(),
          this.initSceneEnvironment(),
          this.initCamera(),
          this.renderLoop(),
          this.bindEngineResize()
      } catch (e) {
        console.error("error:::", e)
      }
  }
  initEngine() {
    this.engine = new n(this.canvasDom)
  }
  initScene() {
    this.scene = new e(this.engine)
  }
  initSceneEnvironment() {
    if (this.scene) {
      this.scene.clearColor = s.FromHexString("#DDDDDD")
      let e = "/textures/environments/brown_photostudio_06_1k.env"
      if (this._initDefaultHDRId > -1) {
        let t = W.find((e) => e.id == this._initDefaultHDRId)
        t && (e = t.url)
      }
      let t = o.CreateFromPrefilteredData(e, this.scene)
      this.scene.environmentTexture = t
    }
  }
  initCamera() {
    ;(this.camera = new l("mainCamera", 0, 0.4 * Math.PI, 10, new h(0, 0, 0), this.scene)),
      (this.camera.minZ = 0.01),
      (this.camera.fov = c.ToRadians(45)),
      (this.camera.lowerRadiusLimit = 0.01),
      (this.camera.wheelDeltaPercentage = 0.01),
      (this.camera.wheelPrecision = 0.02),
      this.camera?.attachControl(this.canvasDom, !1),
      new l("sixViewCamera", Math.PI / 2, 0.8, 10, h.Zero(), this.scene)
  }
  renderLoop() {
    0 == this.doRender && this.scene?.render(),
      this.engine?.runRenderLoop(() => {
        this.doRender && this.scene?.render()
      })
  }
  bindEngineResize() {
    ;(this._engineResize = () => {
      this.engine?.resize()
    }),
      window.addEventListener("resize", this._engineResize)
  }
  removeEngineResize() {
    window.removeEventListener("resize", this._engineResize)
  }
  setRenderSize(e, t) {
    "number" == typeof e && "number" == typeof t ? this.engine?.setSize(e, t) : console.error("请设置正确的宽高数字...")
  }
  setDefaultHDRId(e) {
    this._initDefaultHDRId = e
  }
  dispose() {
    this.removeEngineResize(),
      this.scene?.meshes.forEach((e) => e.dispose()),
      this.scene?.lights.forEach((e) => e.dispose()),
      this.scene?.cameras.forEach((e) => e.dispose()),
      this.scene?.textures.forEach((e) => e.dispose()),
      this.scene?.dispose(),
      this.engine?.dispose()
  }
}
r.OnTextureLoadErrorObservable.add((e) => {
  console.error("贴图加载错误...", e.name)
})
class $ {
  constructor() {
    Object.defineProperty(this, "hasBeenPresets", { enumerable: !0, configurable: !0, writable: !0, value: !1 }),
      Object.defineProperty(this, "presetsInitParam", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "currentScene", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "onSceneLoaded", { enumerable: !0, configurable: !0, writable: !0, value: new u() }),
      Object.defineProperty(this, "onSceneProgressed", { enumerable: !0, configurable: !0, writable: !0, value: new u() }),
      Object.defineProperty(this, "onLoadedError", { enumerable: !0, configurable: !0, writable: !0, value: new u() }),
      Object.defineProperty(this, "onError", { enumerable: !0, configurable: !0, writable: !0, value: new u() }),
      Object.defineProperty(this, "onInternalSceneLoaded", { enumerable: !0, configurable: !0, writable: !0, value: new u() })
  }
}
const Y = 3
function Z(e, t) {
  let a = (function (e) {
      let t = 0
      return (
        e.getChildMeshes().forEach(function (e) {
          t += e.getTotalIndices()
        }),
        t / 3 / Y
      )
    })(e),
    i = (function (e) {
      let t = 0
      return (
        e.getChildMeshes().forEach(function (e) {
          t += e.getTotalVertices()
        }),
        t
      )
    })(e),
    r = (function (e) {
      return e.textures.length - 4
    })(t),
    n = (function (e) {
      let t = 0
      return (
        e.getChildMeshes().forEach(function (e) {
          t += (function (e) {
            let t = 0
            e.material && (t = Array.isArray(e.material) ? e.material.length : 1)
            return t
          })(e)
        }),
        t
      )
    })(e),
    s = (function (e) {
      let t = !1,
        a = e.getChildMeshes()
      for (let e = 0; e < a.length; e++) {
        const i = a[e]
        if (Array.isArray(i.material))
          for (let e = 0; e < i.material.length; e++) {
            if (((t = J(i.material[e])), t)) return t
          }
        else if (i.material && ((t = J(i.material)), t)) return t
      }
      return t
    })(e),
    o = (function (e, t) {
      return t.animationGroups.length
    })(0, t)
  return { faces: a, vertices: i, textures: r, materials: n, isPBR: s, animations: o }
}
function Q(e, t, a = !0) {
  let i = e.getChildMeshes()
  a && X(e, t),
    i.forEach((e) => {
      X(e, t)
    })
}
function X(e, t) {
  e.material &&
    (e.material instanceof d
      ? e.material.subMaterials.forEach((a) => {
          a && t?.(a, e)
        })
      : t?.(e.material, e))
}
function K(e) {
  return e.getHierarchyBoundingVectors(!0, (e) => e.isEnabled() && e.isVisible)
}
function J(e) {
  return e instanceof m && !!e.metallicTexture
}
b.ShowLoadingScreen = !1
class ee {
  constructor(e, t) {
    Object.defineProperty(this, "scene", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "filesInput", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "globalState", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "currentPluginName", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      (this.scene = e),
      (this.globalState = t)
    let a = this.scene.getEngine()
    ;(this.filesInput = new g(
      a,
      this.scene,
      () => {
        this.onSceneLoaded()
      },
      (e) => {
        this.onSceneProgressed(e)
      },
      null,
      null,
      null,
      null,
      (e, t, a) => {
        this.onModelLoadError(a)
      },
      !0
    )),
      b.OnPluginActivatedObservable.add((e) => {
        this.currentPluginName = e.name
      })
  }
  loadURL(e, t = () => {}, a = (e) => {}, i = () => {}, r) {
    this.disposeExistingRootMesh(),
      b.Append(
        e,
        "",
        this.scene,
        () => {
          this.onSceneLoaded(), t()
        },
        (e) => {
          this.onSceneProgressed(e), a(e)
        },
        (e, t, a) => {
          this.onModelLoadError(t)
        },
        r
      )
  }
  loadFile(e, t = () => {}, a = (e) => {}, i = () => {}) {
    b.Append(
      "",
      e,
      this.scene,
      (e) => {
        t()
      },
      a,
      i
    )
  }
  dropLoadFiles(e) {
    this.disposeExistingRootMesh(), this.filesInput?.loadFiles(e)
  }
  onSceneLoaded() {
    let e = this.scene?.getRootMesh()
    e &&
      this.currentPluginName &&
      this.globalState.onInternalSceneLoaded.notifyObservers({ loadMesh: e, currentPluginName: this.currentPluginName }),
      (this.currentPluginName = void 0),
      this.scene?.executeWhenReady(() => {
        this.globalState.onSceneLoaded.notifyObservers({ load: !0 })
      })
  }
  onSceneProgressed(e) {
    this.globalState.onSceneProgressed.notifyObservers(e)
  }
  onModelLoadError(e) {
    this.globalState.onLoadedError.notifyObservers({ message: "加载文件错误", loadType: "model" }), console.error(e)
  }
  disposeExistingRootMesh() {
    let e = this.scene?.getRootMesh()
    e &&
      (e.getChildMeshes().forEach((e) => {
        e.dispose(!1, !0)
      }),
      this.scene?.removeMesh(e, !0))
  }
}
function te(e, t) {
  let a = []
  var i
  ;(i = e), Object.keys(i).length !== t.length && console.warn("请检查对应的数据类型是否正确")
  for (const i in e)
    if (Object.prototype.hasOwnProperty.call(e, i)) {
      const r = e[i]
      let n = t.find((e) => e.key == i)
      n
        ? a.push({
            keyName: i,
            keyValue: r,
            valueType: n.valueType,
            slider: n.slider,
            select: n.select,
            describe: n.describe || i,
            setCallBackName: n.setCallBackName
          })
        : console.warn(`缺少${i}属性的数据描述`)
    }
  return a
}
const ae = "hdrSkyBox"
let ie = (e) => null !== e,
  re = (e) => "number" == typeof e,
  ne = (e) => "boolean" == typeof e,
  se = (e) => "string" == typeof e
class oe {
  constructor(e, t) {
    Object.defineProperty(this, "scene", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "environmentBlur", { enumerable: !0, configurable: !0, writable: !0, value: 0.3 }),
      Object.defineProperty(this, "hdrSkybox", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "skyBoxMaterial", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "environmentTexture", { enumerable: !0, configurable: !0, writable: !0, value: null }),
      Object.defineProperty(this, "bgType", { enumerable: !0, configurable: !0, writable: !0, value: "color" }),
      Object.defineProperty(this, "imageId", { enumerable: !0, configurable: !0, writable: !0, value: 1 }),
      Object.defineProperty(this, "environmentId", { enumerable: !0, configurable: !0, writable: !0, value: 1 }),
      Object.defineProperty(this, "sceneTransparent", { enumerable: !0, configurable: !0, writable: !0, value: !1 }),
      Object.defineProperty(this, "bgColor", { enumerable: !0, configurable: !0, writable: !0, value: "#dddddd" }),
      Object.defineProperty(this, "environmentMapList", { enumerable: !0, configurable: !0, writable: !0, value: new Map() }),
      Object.defineProperty(this, "globalState", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "staticPoseForScreenshot", { enumerable: !0, configurable: !0, writable: !0, value: !0 }),
      (this.scene = e),
      (this.globalState = t),
      (this.environmentTexture = this.scene.environmentTexture)
  }
  init() {
    this.createHDRSkyBox()
  }
  initBindListener() {
    this.globalState.onInternalSceneLoaded.add(({ loadMesh: e }) => {
      this.globalState.hasBeenPresets &&
        this.globalState.presetsInitParam &&
        this.setModelOrientationInfo(e, this.globalState.presetsInitParam.orientation)
    })
  }
  setPresetsEnvironmentId(e) {
    this.environmentId = e
  }
  setBackgroundPresetsParam(e) {
    "color" == e.bgType
      ? this.setBackground("color", e.color)
      : "image" == e.bgType
        ? this.setBackground("image", e.id)
        : this.setBackground("environment", !0)
  }
  setEnvironmentPresetsParam(e) {
    for (const t in e)
      if (Object.prototype.hasOwnProperty.call(e, t)) {
        const a = e[t]
        this.setEnvironmentParam(t, a)
      }
  }
  setBackground(e, t) {
    "color" == e && se(t)
      ? ((this.bgColor = t),
        this.showHDRSkeyBox(!1),
        this.hideSceneLayer(),
        (this.scene.clearColor = s.FromHexString(t)),
        (this.bgType = e),
        this.refreshGridColor(this.bgColor))
      : "image" == e
        ? (this.showHDRSkeyBox(!1), re(t) && this.setBackgroundImageId(t), (this.bgType = e))
        : "environment" == e && ne(t) && (this.hideSceneLayer(), this.showHDRSkeyBox(t), (this.bgType = e))
  }
  setBackgroundEnable(e) {
    1 == e
      ? "color" == this.bgType
        ? this.setBackground(this.bgType, this.bgColor)
        : "image" == this.bgType
          ? this.setBackground(this.bgType, this.imageId)
          : "environment" == this.bgType && this.setBackground(this.bgType, !0)
      : (this.scene.clearColor.set(0, 0, 0, 0), this.hideSceneLayer(), this.showHDRSkeyBox(!1))
  }
  setEnvironmentBlurStrength(e) {
    let t = this.hdrSkybox?.material
    if (t) {
      ;(this.environmentBlur = e), (t.microSurface = 1 - this.environmentBlur)
    }
  }
  setBackgroundImageId(e) {
    this.hideSceneLayer(), this.scene.layers?.forEach((e) => (e.isEnabled = !1))
    let t = V.find((t) => e == t.id)
    if (t) {
      let a = this.scene.layers?.find((e) => e.name == t.url)
      if (a) a.isEnabled = !0
      else {
        new p("", t.url, this.scene, !0).name = t.url
      }
      this.imageId = e
    }
  }
  setBackgroundImage(e) {
    this.hideSceneLayer(), this.scene.layers?.forEach((e) => (e.isEnabled = !1))
    let t = this.scene.layers?.find((t) => t.name == e)
    if (t) t.isEnabled = !0
    else {
      new p("", e, this.scene, !0).name = e
    }
  }
  hideSceneLayer() {
    this.scene.layers?.forEach((e) => (e.isEnabled = !1))
  }
  createHDRSkyBox() {
    let e = this.scene.activeCamera,
      t = this.scene.environmentTexture
    if (e && t) {
      let a = e.maxZ
      const i = f(ae, { size: a }, this.scene),
        n = new m("skyBoxMaterial", this.scene)
      ;(n.backFaceCulling = !1),
        (n.reflectionTexture = t.clone()),
        n.reflectionTexture && (n.reflectionTexture.coordinatesMode = r.SKYBOX_MODE),
        (n.microSurface = 1 - this.environmentBlur),
        (n.disableLighting = !0),
        (n.twoSidedLighting = !0),
        (i.material = n),
        (this.skyBoxMaterial = n),
        (i.isPickable = !1),
        (i.ignoreCameraMaxZ = !0),
        (i.infiniteDistance = !0),
        i.setEnabled(!1),
        (this.hdrSkybox = i),
        this.environmentMapList.set(this.environmentId, { environment: t, skyBoxReflection: n.reflectionTexture })
    }
  }
  setEnvironmentEnable(e = !0) {
    this.scene.environmentTexture
      ? (this.scene.environmentTexture = e ? this.environmentTexture : null)
      : e && (this.scene.environmentTexture = this.environmentTexture)
  }
  setEnvironmentHDRId(e) {
    const t = W.find((t) => e == t.id)
    if (t) {
      let a = this.environmentMapList.get(e),
        i = null,
        n = null
      if (a) (i = a.environment), (n = a.skyBoxReflection)
      else {
        let e = o.CreateFromPrefilteredData(t.url, this.scene)
        ;(i = e), (n = e.clone())
      }
      i &&
        n &&
        ((this.scene.environmentTexture = i),
        this.skyBoxMaterial && ((n.coordinatesMode = r.SKYBOX_MODE), (this.skyBoxMaterial.reflectionTexture = n)),
        (this.environmentTexture = i)),
        re(e) && (this.environmentId = e)
    }
  }
  setEnvironmentHDRURL(e, t) {
    let a = o.CreateFromPrefilteredData(e, this.scene)
    ;(this.scene.environmentTexture = a),
      this.skyBoxMaterial && (this.skyBoxMaterial.reflectionTexture = a.clone()),
      (this.environmentTexture = a),
      re(t) && (this.environmentId = t)
  }
  setEnvironmentParam(e, t) {
    if ("enable" == e && ne(t)) this.setEnvironmentEnable(t)
    else if (re(t))
      switch (e) {
        case "intensity":
          this.setIntensity(t)
          break
        case "backgroundExposure":
          this.setEnvironmentBackgroundIntensity(t)
          break
        case "rotation":
          this.setEnvironmentOrientation(c.ToRadians(t))
          break
        case "blur":
          this.setEnvironmentBlurStrength(t)
      }
  }
  setEnvironmentBackgroundIntensity(e) {
    this.skyBoxMaterial?.reflectionTexture && (this.skyBoxMaterial.reflectionTexture.level = e)
  }
  setEnvironmentOrientation(e) {
    if (this.environmentTexture) {
      if (((this.environmentTexture.rotationY = e), this.skyBoxMaterial?.reflectionTexture)) {
        let t = this.skyBoxMaterial?.reflectionTexture
        t.rotationY = e
      }
    }
  }
  setIntensity(e) {
    this.scene.environmentIntensity = e
  }
  getBackgroundInfo() {
    return { enable: !this.sceneTransparent, bgType: this.bgType, id: this.imageId, color: this.bgColor }
  }
  getEnvironmentInfo() {
    let e = 0,
      t = 1
    if (this.scene.environmentTexture) {
      let t = this.scene.environmentTexture
      e = c.ToDegrees(t.rotationY)
    }
    return (
      this.skyBoxMaterial?.reflectionTexture && (t = this.skyBoxMaterial?.reflectionTexture.level),
      {
        enable: !!this.scene.environmentTexture,
        id: this.environmentId,
        rotation: e,
        intensity: this.scene.environmentIntensity,
        blur: this.environmentBlur,
        backgroundExposure: t
      }
    )
  }
  getTransformEnvironmentInfo() {
    return te(this.getEnvironmentInfo(), [
      {
        key: "orientation",
        describe: "orientation",
        valueType: "slider",
        slider: { min: 0, max: 360, step: 0.001 },
        setCallBackName: "SceneEnvironment-setEnvironmentOrientation"
      },
      {
        key: "intensity",
        describe: "intensity",
        valueType: "slider",
        slider: { min: 0, max: 5, step: 0.001 },
        setCallBackName: "SceneEnvironment-setIntensity"
      }
    ])
  }
  getScreenshot(e, t) {
    let a = this.scene.getEngine()
    ;(e = e || a.getRenderWidth(!0)), (t = t || a.getRenderHeight(!0))
    const i = this.scene.activeCamera
    let r = this.scene.activeCamera?.clone("screenShotCamera"),
      n = new v("screenShotRender", { width: e, height: t }, this.scene, !1, !1),
      s = !1
    if (r && ((r.outputRenderTarget = n), i)) {
      if (this.staticPoseForScreenshot && this.scene.animationGroups.length > 0) {
        let e = this.scene.animationGroups[0]
        ;(s = e.isPlaying),
          s &&
            (e.pause(),
            this.scene.skeletons.forEach(function (e) {
              e.returnToRest()
            }))
      }
      ;(this.scene.activeCameras = [r]),
        this.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("basicPipeline", r)
    }
    return new Promise((i) => {
      const o = () => {
        n.isReadyForRendering() && r?.isReady(!0)
          ? (a.onEndFrameObservable.addOnce(() => {
              n.readPixels(void 0, void 0, void 0, !1)?.then((a) => {
                this.scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline("basicPipeline", r),
                  r?.dispose(),
                  n.dispose(),
                  (this.scene.activeCameras = []),
                  this.staticPoseForScreenshot &&
                    this.scene.animationGroups.length > 0 &&
                    s &&
                    this.scene.animationGroups[0].play(!0),
                  y.DumpData(
                    e,
                    t,
                    a,
                    (e) => {
                      i(e)
                    },
                    "image/jpeg",
                    void 0,
                    !0,
                    void 0,
                    0.92
                  )
              })
            }),
            this.scene.incrementRenderId(),
            this.scene.resetCachedMaterial(),
            n.render(!0),
            this.scene.render())
          : setTimeout(() => {
              o()
            }, 16)
      }
      o()
    })
  }
  showHDRSkeyBox(e = !0) {
    this.hdrSkybox?.setEnabled(e)
  }
  getModelOrientationInfo() {
    let e,
      t = this.scene.getRootMesh()
    return (
      t && t.rotationQuaternion ? (new P(), (e = t.rotationQuaternion.toRotationMatrix(P.Identity()))) : (e = P.Identity()),
      { matrix: Array.from(e.asArray()) }
    )
  }
  setModelOrientationInfo(e, t) {
    if (t.matrix) {
      let a = P.FromArray(t.matrix),
        i = new w()
      a.decompose(h.Zero(), i), (e.rotationQuaternion = i)
    }
  }
  refreshGridColor(e) {
    let a = this.scene.getMaterialByName("bottomGridMaterial")
    if (a) {
      let i = a,
        r = new t(1, 1, 1).subtract(new t().setHexString(e))
      ;(i.mainColor = r), (i.lineColor = r)
    }
  }
  dispose() {
    this.environmentMapList.forEach((e) => {
      e.environment.dispose(), e.skyBoxReflection.dispose()
    }),
      this.environmentMapList.clear()
  }
  getModelStatistics() {
    this.scene.getMeshByName("")
  }
}
const le = (e) => ({ x: e.x, y: e.y, z: e.z })
class he {
  constructor(e, t) {
    Object.defineProperty(this, "scene", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "camera", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "presetsParam", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "globalState", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "nearRatio", { enumerable: !0, configurable: !0, writable: !0, value: 0.01 }),
      (this.scene = e),
      (this.camera = this.scene.activeCamera),
      (this.globalState = t),
      this.init()
  }
  init() {
    this.globalState.onInternalSceneLoaded.add(({ loadMesh: e, currentPluginName: t }) => {
      this.loadingSlefAdaption(e, t)
    })
  }
  getCameraInfo() {
    let e = this.camera.position,
      t = this.camera.target
    return { fov: F(c.ToDegrees(this.camera.fov), 5), nearDistance: F(this.nearRatio, 5), position: le(e), target: le(t) }
  }
  setCameraParam(e, t) {
    switch (e) {
      case "fov":
        this.camera.fov = c.ToRadians(t)
        break
      case "nearDistance":
        ;(this.nearRatio = t), (this.camera.minZ = this.nearRatio * this.camera.radius)
    }
  }
  setPresetsParam(e) {
    this.setCameraParam("fov", e.fov), this.setCameraParam("nearDistance", e.nearDistance), (this.presetsParam = e)
  }
  loadingSlefAdaption(e, t) {
    this.adaptiveCameraDistance(e, t)
  }
  adaptiveCameraDistance(e, t) {
    let a = this.camera
    this.atuoArcRotateCameraParam(a, e), "gltf" == t && (a.alpha += Math.PI)
    const i = new M()
    if ((a.addBehavior(i, !0), (i.framingTime = 0), (i.elevationReturnTime = -1), this.scene.meshes.length)) {
      ;(a.lowerRadiusLimit = null), (a.upperRadiusLimit = null)
      const t = this.getWorldExtends(e)
      if (this.presetsParam) {
        this.presetsParam.position &&
          a.setPosition(new h(this.presetsParam.position.x, this.presetsParam.position.y, this.presetsParam.position.z)),
          this.presetsParam.target &&
            a.setTarget(new h(this.presetsParam.target.x, this.presetsParam.target.y, this.presetsParam.target.z))
        const e = t.max.subtract(t.min).length()
        a.panningSensibility = 5e3 / e
      } else i.zoomOnBoundingInfo(t.min, t.max)
      a.lowerRadiusLimit = 0.1 * a.radius
    }
    ;(a.pinchPrecision = 200 / a.radius),
      (a.upperRadiusLimit = 8 * a.radius),
      (a.wheelDeltaPercentage = 0.01),
      (a.pinchDeltaPercentage = 0.01)
  }
  atuoArcRotateCameraParam(e, t) {
    if (this.scene) {
      const a = this.getWorldExtends(t),
        i = a.max.subtract(a.min),
        r = a.min.add(i.scale(0.5))
      let n = 1.5 * i.length()
      isFinite(n) || ((n = 1), r.copyFromFloats(0, 0, 0)),
        (e.alpha = -Math.PI / 2),
        (e.beta = Math.PI / 2),
        e.position.copyFrom(r),
        (e.lowerRadiusLimit = 0.01 * n),
        (e.wheelPrecision = 100 / n),
        (e.minZ = n * this.nearRatio),
        (e.maxZ = 1e3 * n),
        (e.speed = 0.2 * n)
    }
  }
  getWorldExtends(e) {
    return e.getHierarchyBoundingVectors(!0, (e) => e.isEnabled() && e.isVisible)
  }
}
class ce {
  constructor(e, t) {
    Object.defineProperty(this, "scene", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "light", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "_groundName", { enumerable: !0, configurable: !0, writable: !0, value: "ground" }),
      Object.defineProperty(this, "groundMesh", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "offsetY", { enumerable: !0, configurable: !0, writable: !0, value: 0.001 }),
      Object.defineProperty(this, "sizeFactor", { enumerable: !0, configurable: !0, writable: !0, value: 3 }),
      Object.defineProperty(this, "boxSize", { enumerable: !0, configurable: !0, writable: !0, value: 0 }),
      Object.defineProperty(this, "planeHeightRatio", { enumerable: !0, configurable: !0, writable: !0, value: 0 }),
      Object.defineProperty(this, "shadowGenerator", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      (this.scene = e),
      (this.light = t),
      this.setShadowEnable(!1),
      (this.shadowGenerator = new S(1024, this.light)),
      (this.shadowGenerator.useContactHardeningShadow = !0),
      (this.shadowGenerator.contactHardeningLightSizeUVRatio = 0.05),
      this.shadowGenerator.setDarkness(0.5),
      this.init()
  }
  init() {
    this.groundMesh = O.CreateGround(this._groundName, { width: 1, height: 1 }, this.scene)
    let e = new _("groundMaterial", this.scene)
    this.groundMesh.material = e
  }
  addShadowObject(e) {
    let t = this.shadowGenerator.getShadowMap()
    t && (t.renderList = [])
    let a = this.scene.getRootMesh()
    if (a) {
      a.getChildMeshes().forEach((e) => {
        e.name !== this._groundName &&
          e.name !== ae &&
          (e.material && e.material.disableLighting, this.shadowGenerator.addShadowCaster(e))
      })
    }
    this.loadAutoGround(e)
  }
  loadAutoGround(e) {
    let t = { min: h.Zero(), max: h.Zero() }
    t = K(e)
    let a = new x(t.min, t.max)
    const i = Math.max(t.max.x - t.min.x, t.max.z - t.min.z)
    ;(this.boxSize = i), this.setPlaneSize(this.sizeFactor)
    const r = t.min.y
    ;(this.groundMesh.metadata = { objectBottomPosY: r, objectHeightSize: t.max.y - t.min.y }),
      this.groundMesh.position.set(a.center.x, r - this.offsetY, a.center.z),
      (this.groundMesh.receiveShadows = !0),
      (this.groundMesh.isPickable = !1)
    let n = new h().copyFrom(t.max).scaleInPlace(2)
    this.light.position.copyFrom(n), (this.light.shadowMinZ = 0.1), (this.light.shadowMaxZ = 3 * this.boxSize)
  }
  setDarkness(e = 0.5) {
    this.shadowGenerator.setDarkness(e)
  }
  setShadowEnable(e = !1) {
    this.light.shadowEnabled = e
  }
  setPlaneHeight(e = 0) {
    if (
      this.groundMesh.metadata &&
      re(this.groundMesh.metadata.objectBottomPosY) &&
      re(this.groundMesh.metadata.objectHeightSize)
    ) {
      let t = this.groundMesh.metadata.objectBottomPosY,
        a = this.groundMesh.metadata.objectHeightSize
      this.planeHeightRatio = e
      const i = e * a
      this.groundMesh.position.y = t + i - this.offsetY
    }
  }
  setShadowBias(e) {
    this.shadowGenerator.bias = e
  }
  setShadowCasterParam(e, t) {
    if ("enable" == e && ne(t)) this.setShadowEnable(t)
    else if (re(t))
      switch (e) {
        case "darkness":
          this.setDarkness(t)
          break
        case "height":
          this.setPlaneHeight(t)
          break
        case "size":
          this.setPlaneSize(t)
      }
  }
  setPlaneSize(e = 3) {
    const t = e * this.boxSize
    ;(this.sizeFactor = e), this.groundMesh.scaling.set(t, 1, t)
  }
  getShadowCasterInfo() {
    return {
      enable: this.light.shadowEnabled,
      darkness: this.shadowGenerator.darkness,
      height: this.planeHeightRatio,
      size: this.sizeFactor
    }
  }
  getTransformShadowInfo() {
    return te(this.getShadowCasterInfo(), [
      {
        key: "darkness",
        describe: "darkness",
        valueType: "slider",
        slider: { min: 0, max: 1, step: 0.01 },
        setCallBackName: "LightShadowCaster-setDarkness"
      },
      {
        key: "height",
        describe: "height",
        valueType: "slider",
        slider: { min: -5, max: 5, step: 0.01 },
        setCallBackName: "LightShadowCaster-setPlaneHeight"
      },
      {
        key: "size",
        describe: "size",
        valueType: "slider",
        slider: { min: 0, max: 10, step: 0.01 },
        setCallBackName: "LightShadowCaster-setPlaneSize"
      }
    ])
  }
  dispose() {
    this.shadowGenerator.dispose()
  }
}
class ue {
  constructor(e, t) {
    Object.defineProperty(this, "scene", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "shadowType", { enumerable: !0, configurable: !0, writable: !0, value: "shadowCaster" }),
      Object.defineProperty(this, "light", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "shadowCaster", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "internalIntensity", { enumerable: !0, configurable: !0, writable: !0, value: 1 }),
      Object.defineProperty(this, "internalLightEnable", { enumerable: !0, configurable: !0, writable: !0, value: !0 }),
      Object.defineProperty(this, "globalState", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      (this.scene = e),
      (this.globalState = t),
      (this.light = new T("shadowLight", new h(-1, -2, -1), this.scene)),
      (this.light.position = new h(1, 1, 1)),
      (this.light.intensity = this.internalIntensity),
      (this.shadowCaster = new ce(this.scene, this.light)),
      this.init()
  }
  init() {
    this.globalState.onInternalSceneLoaded.add(({ loadMesh: e }) => {
      this.shadowCaster.addShadowObject(e),
        this.globalState.hasBeenPresets &&
          this.globalState.presetsInitParam &&
          this.setShadowPresetsParam(this.globalState.presetsInitParam.shadowGround)
    })
  }
  setShadowPresetsParam(e) {
    for (const t in e)
      if (Object.prototype.hasOwnProperty.call(e, t)) {
        const a = e[t]
        this.setShadowGroundParam(t, a)
      }
  }
  setEnvironmentLightShadowPresetsParam(e) {
    for (const t in e)
      if (Object.prototype.hasOwnProperty.call(e, t)) {
        const a = e[t]
        this.setEnvironmentLightShadowParam(t, a)
      }
  }
  setDarkness(e) {
    this.shadowCaster.setDarkness(e)
  }
  setShadowEnable(e = !1) {
    "shadowCaster" == this.shadowType && this.shadowCaster.setShadowEnable(e)
  }
  setShadowGroundParam(e, t) {
    "shadowCaster" == this.shadowType && this.shadowCaster.setShadowCasterParam(e, t)
  }
  setEnvironmentLightShadowParam(e, t) {
    "lightEnable" == e && ne(t)
      ? ((this.light.intensity = 1 == t ? this.internalIntensity : 0), (this.internalLightEnable = t))
      : "lightIntensity" == e && re(t)
        ? this.internalLightEnable && ((this.light.intensity = t), (this.internalIntensity = t))
        : "shadowBias" == e && re(t) && "shadowCaster" == this.shadowType && this.shadowCaster.setShadowBias(t)
  }
  getShadowInfo() {
    return "shadowCaster" == this.shadowType
      ? { ...this.shadowCaster.getShadowCasterInfo(), shadowType: this.shadowType }
      : { shadowType: "bakedAO", enable: !1, height: 0, darkness: 0.5, size: 1.5 }
  }
  getEnvironmentShadowInfo() {
    return {
      lightEnable: this.internalLightEnable,
      lightIntensity: this.internalIntensity,
      shadowBias: this.shadowCaster.shadowGenerator.bias
    }
  }
  dispose() {
    this.shadowCaster.dispose()
  }
}
var me
!(function (e) {
  ;(e.Metallic = "Metallic"), (e.Specular = "Specular")
})(me || (me = {}))
class de {
  constructor(e) {
    Object.defineProperty(this, "scene", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }), (this.scene = e)
  }
  transformMetallicRoughness(e) {
    e.getChildMeshes().forEach((e) => {
      if (e.material && e.material instanceof m) {
        let t = e.material
        t.metadata || (t.metadata = {}),
          (t.metadata = {
            ...t.metadata,
            microSurface: t.microSurface,
            reflectivityTexture: t.reflectivityTexture,
            workFlowType: me.Metallic
          }),
          t.metadata &&
            ("number" == typeof t.metadata.roughness ? (t.roughness = t.metadata.roughness) : (t.roughness = 1),
            "number" == typeof t.metadata.metallic ? (t.metallic = t.metadata.metallic) : (t.metallic = 1),
            t.metadata.metallicTexture instanceof r
              ? (t.metallicTexture = t.metadata.metallicTexture)
              : (t.metallicTexture = null)),
          (t.reflectivityTexture = null)
      }
    })
  }
  transformSpecularGlossiness(e) {
    e.getChildMeshes().forEach((e) => {
      if (e.material && e.material instanceof m) {
        let t = e.material
        t.metadata || (t.metadata = {}),
          (t.metadata = {
            ...t.metadata,
            roughness: t.roughness,
            metallic: t.metallic,
            metallicTexture: t.metallicTexture,
            workFlowType: me.Specular
          }),
          "number" == typeof t.roughness && ((t.microSurface = t.roughness), (t.roughness = null)),
          (t.metallicTexture = null),
          (t.metallic = null),
          t.metadata &&
            (t.metadata.reflectivityTexture instanceof r
              ? (t.reflectivityTexture = t.metadata.reflectivityTexture)
              : (t.reflectivityTexture = null))
      }
    })
  }
}
class be {
  constructor(e) {
    Object.defineProperty(this, "textureOperate", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      (this.textureOperate = e)
  }
  getChannelInfo(e) {
    return {
      AlbedoMap: this.getAlbedoMapInfo(e),
      MetallicMap: this.getMetallicMapInfo(e),
      RoughnessMap: this.getRoughnessMapInfo(e),
      OcclusionMap: this.getOcclusionMapInfo(e),
      NormalMap: this.getNormalMapInfo(e),
      EmissivelMap: this.getEmissivelMapInfo(e),
      OpacityMap: this.getOpacityMapInfo(e)
    }
  }
  getAlbedoMapInfo(e) {
    let t = { enable: !1, factor: 1 }
    return (
      e.albedoTexture instanceof r &&
        ((t.enable = !0),
        (t.factor = e.albedoTexture.level),
        (t.color = e.albedoColor.asArray()),
        (t.UVTransforms = this.getUVTransformsInfo(e.albedoTexture)),
        (t.texture = this.getTextureInfo(e.albedoTexture))),
      t
    )
  }
  getMetallicMapInfo(e) {
    let t = { enable: !0, factor: 1 }
    return (
      e.metadata &&
        (e.metadata.workFlowType == me.Specular && (t.enable = !1),
        "number" == typeof e.metallic && (t.factor = e.metallic),
        e.metallicTexture instanceof r &&
          ((t.UVTransforms = this.getUVTransformsInfo(e.metallicTexture)), (t.texture = this.getTextureInfo(e.metallicTexture)))),
      t
    )
  }
  getRoughnessMapInfo(e) {
    let t = { enable: !0, factor: 1 }
    return (
      e.metadata &&
        (e.metadata.workFlowType == me.Specular && (t.enable = !1), "number" == typeof e.roughness && (t.factor = e.roughness)),
      e.metallicTexture instanceof r &&
        ((t.UVTransforms = this.getUVTransformsInfo(e.metallicTexture)), (t.texture = this.getTextureInfo(e.metallicTexture))),
      t
    )
  }
  getOcclusionMapInfo(e) {
    let t = { enable: !1, factor: 1 }
    return (
      (t.factor = e.ambientTextureStrength),
      e.ambientTexture instanceof r &&
        ((t.enable = !0),
        (t.UVTransforms = this.getUVTransformsInfo(e.ambientTexture)),
        (t.texture = this.getTextureInfo(e.ambientTexture))),
      t
    )
  }
  getNormalMapInfo(e) {
    let t = { enable: !1, factor: 1 }
    return (
      e.bumpTexture instanceof r &&
        ((t.factor = e.bumpTexture.level),
        (t.enable = !0),
        (t.UVTransforms = this.getUVTransformsInfo(e.bumpTexture)),
        (t.texture = this.getTextureInfo(e.bumpTexture))),
      t
    )
  }
  getEmissivelMapInfo(e) {
    let t = { enable: !1, factor: 1 }
    return (
      (t.factor = e.emissiveIntensity),
      (t.color = e.emissiveColor.asArray()),
      e.emissiveTexture instanceof r &&
        ((t.enable = !0),
        (t.UVTransforms = this.getUVTransformsInfo(e.emissiveTexture)),
        (t.texture = this.getTextureInfo(e.emissiveTexture))),
      t
    )
  }
  getOpacityMapInfo(e) {
    let t = { enable: !1, factor: 1, type: "Blend" }
    return (
      (t.factor = e.alpha),
      e.opacityTexture instanceof r &&
        ((t.enable = !0),
        (t.UVTransforms = this.getUVTransformsInfo(e.opacityTexture)),
        (t.texture = this.getTextureInfo(e.opacityTexture))),
      t
    )
  }
  getAlphaMode(e) {
    let t = "OPAQUE"
    switch (e.transparencyMode) {
      case m.PBRMATERIAL_OPAQUE:
        t = "OPAQUE"
        break
      case m.PBRMATERIAL_ALPHABLEND:
        t = "BLEND"
        break
      case m.PBRMATERIAL_ALPHATEST:
        t = "MASK"
    }
    return t
  }
  getUVTransformsInfo(e) {
    return { scale: [e.uScale, e.vScale], offset: [e.uOffset, e.vOffset], rotation: 0 !== e.wAng ? -e.wAng : 0 }
  }
  getTextureInfo(e) {
    let { minFilter: t, magFilter: a } = this.textureOperate.getFilteringInfo(e),
      { wrapU: i, wrapV: r } = this.textureOperate.getWrapInfo(e),
      n = this.textureOperate.getFormatInfo(e)
    return {
      magFilter: a,
      minFilter: t,
      wrapU: i,
      wrapV: r,
      texCoordUnit: e.coordinatesIndex,
      textureFormat: n,
      uid: e.uniqueId,
      id: -1
    }
  }
}
class ge {
  constructor(e) {
    Object.defineProperty(this, "scene", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "textureMap", { enumerable: !0, configurable: !0, writable: !0, value: new Map() }),
      (this.scene = e)
  }
  collectTextureMap(e) {
    e.metallicTexture && this.textureMap.set(e.metallicTexture.uniqueId, e.metallicTexture),
      e.albedoTexture && this.textureMap.set(e.albedoTexture.uniqueId, e.albedoTexture),
      e.bumpTexture && this.textureMap.set(e.bumpTexture.uniqueId, e.bumpTexture),
      e.ambientTexture && this.textureMap.set(e.ambientTexture.uniqueId, e.ambientTexture),
      e.emissiveTexture && this.textureMap.set(e.emissiveTexture.uniqueId, e.emissiveTexture),
      e.opacityTexture && this.textureMap.set(e.opacityTexture.uniqueId, e.opacityTexture)
  }
  getFilteringInfo(e) {
    let t = "LINEAR",
      a = "LINEAR_MIPMAP_LINEAR"
    switch (e.samplingMode) {
      case r.TRILINEAR_SAMPLINGMODE:
        ;(t = "LINEAR"), (a = "LINEAR_MIPMAP_LINEAR")
        break
      case r.BILINEAR_SAMPLINGMODE:
        ;(t = "LINEAR"), (a = "LINEAR")
        break
      case r.NEAREST_SAMPLINGMODE:
        ;(t = "Nearest"), (a = "Nearest")
    }
    return { magFilter: t, minFilter: a }
  }
  setTextureFilter(e, t) {
    switch (e) {
      case "Trilinear":
        t.updateSamplingMode(r.TRILINEAR_SAMPLINGMODE)
        break
      case "Bilinear":
        t.updateSamplingMode(r.BILINEAR_SAMPLINGMODE)
        break
      case "Nearest":
        t.updateSamplingMode(r.NEAREST_SAMPLINGMODE)
    }
  }
  setTextureFormat(e, t) {}
  setTextureWrapParam(e, t, a) {
    switch (t) {
      case "REPEAT":
        "wrapU" == e ? (a.wrapU = r.WRAP_ADDRESSMODE) : "wrapV" == e && (a.wrapV = r.WRAP_ADDRESSMODE)
        break
      case "CLAMP":
        "wrapU" == e ? (a.wrapU = r.CLAMP_ADDRESSMODE) : "wrapV" == e && (a.wrapV = r.CLAMP_ADDRESSMODE)
        break
      case "MIRROR":
        "wrapU" == e ? (a.wrapU = r.MIRROR_ADDRESSMODE) : "wrapV" == e && (a.wrapV = r.MIRROR_ADDRESSMODE)
    }
  }
  setUVTransformParam(e, t, a) {
    switch (e) {
      case "uvTransformScaleX":
        a.uScale = t
        break
      case "uvTransformScaleY":
        a.vScale = t
        break
      case "uvTransformRotation":
        a.wAng = c.ToRadians(t)
        break
      case "uvTransformOffsetX":
        a.uOffset = t
        break
      case "uvTransformOffsetY":
        a.vOffset = t
    }
  }
  getFilterValue(e, t) {
    let a = "Trilinear"
    return (
      "LINEAR_MIPMAP_LINEAR" == e && "LINEAR" == t
        ? (a = "Trilinear")
        : "LINEAR" == e && "LINEAR" == t
          ? (a = "Bilinear")
          : "Nearest" == e && "Nearest" == t && (a = "Nearest"),
      a
    )
  }
  getFilteringOptions() {
    return [
      { key: "Trilinear", value: "Trilinear" },
      { key: "Bilinear", value: "Bilinear" },
      { key: "Nearest", value: "Nearest" }
    ]
  }
  getWrapInfo(e) {
    let t = "REPEAT"
    switch (e.wrapU) {
      case r.WRAP_ADDRESSMODE:
        t = "REPEAT"
        break
      case r.CLAMP_ADDRESSMODE:
        t = "CLAMP"
        break
      case r.MIRROR_ADDRESSMODE:
        t = "MIRROR"
    }
    let a = "REPEAT"
    switch (e.wrapV) {
      case r.WRAP_ADDRESSMODE:
        a = "REPEAT"
        break
      case r.CLAMP_ADDRESSMODE:
        a = "CLAMP"
        break
      case r.MIRROR_ADDRESSMODE:
        a = "MIRROR"
    }
    return { wrapU: t, wrapV: a }
  }
  getWrapOptions() {
    return [
      { key: "REPEAT", value: "REPEAT" },
      { key: "CLAMP", value: "CLAMP" },
      { key: "MIRROR", value: "MIRROR" }
    ]
  }
  getFormatInfo(e) {
    let t = "RGBA"
    switch (e.textureFormat) {
      case n.TEXTUREFORMAT_ALPHA:
        t = "ALPHA"
        break
      case n.TEXTUREFORMAT_LUMINANCE:
        t = "LUMINANCE"
        break
      case n.TEXTUREFORMAT_RGBA:
        t = "RGB"
        break
      case n.TEXTUREFORMAT_RGB:
        t = "RGBA"
    }
    return t
  }
  getFormatOptions() {
    return [
      { key: "RGBA", value: "RGBA" },
      { key: "RGB", value: "RGB" },
      { key: "ALPHA", value: "ALPHA" },
      { key: "LUMINANCE", value: "LUMINANCE" }
    ]
  }
  getTexture(e) {
    return this.textureMap.get(e)
  }
  getTextureMap() {
    return this.textureMap
  }
  dispose() {
    this.textureMap.clear()
  }
}
class pe {
  constructor(e) {
    Object.defineProperty(this, "scene", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "transformPBRWorkFlow", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "channelExtraction", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "textureOperate", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "materialMap", { enumerable: !0, configurable: !0, writable: !0, value: new Map() }),
      Object.defineProperty(this, "materialInfoStore", { enumerable: !0, configurable: !0, writable: !0, value: new Map() }),
      (this.scene = e),
      (this.transformPBRWorkFlow = new de(e)),
      (this.textureOperate = new ge(e)),
      (this.channelExtraction = new be(this.textureOperate))
  }
  initalMaterialPreparation() {
    let e = this.scene.getRootMesh()
    e &&
      Q(
        e,
        (e) => {
          e instanceof m && (this.recordPBRWorkFlowType(e), this.collectTextureMap(e), this.collectMaterialInfoStore(e))
        },
        !1
      )
  }
  recordPBRWorkFlowType(e) {
    ie(e.metallic) && ie(e.roughness) && ie(e.metallicTexture)
      ? (e.metadata || (e.metadata = {}), (e.metadata = { ...e.metadata, workFlowType: me.Metallic }))
      : (e.metadata || (e.metadata = {}), (e.metadata = { ...e.metadata, workFlowType: me.Specular }))
  }
  collectTextureMap(e) {
    this.textureOperate.collectTextureMap(e)
  }
  collectMaterialInfoStore(e) {
    this.materialInfoStore.set(e.uniqueId, {
      emissiveIntensity: e.emissiveIntensity,
      emissiveColor: e.emissiveColor.clone(),
      emissiveTextureId: e.emissiveTexture ? e.emissiveTexture.uniqueId : null,
      bumpFactor: e.bumpTexture ? e.bumpTexture.level : 1,
      bumpTextureId: e.bumpTexture ? e.bumpTexture.uniqueId : null,
      ambientFactor: e.ambientTextureStrength,
      ambientTextureId: e.ambientTexture ? e.ambientTexture.uniqueId : null,
      opacityTextureId: e.opacityTexture ? e.opacityTexture.uniqueId : null,
      alpha: e.alpha
    })
  }
  setMaterialInfoStoreParam(e, t, a) {
    let i = this.materialInfoStore.get(e)
    i && this.materialInfoStore.set(e, { ...i, [t]: a })
  }
  setChannelParam(e, t) {
    let a = this.materialMap.get(e)
    if (a && a instanceof m)
      switch (t.channelName) {
        case "AlbedoMap":
          this.setAlbedoMapParam(a, t.property, t.value)
          break
        case "MetallicMap":
          this.setMetallicMapParam(a, t.property, t.value)
          break
        case "RoughnessMap":
          this.setRoughnessMapParam(a, t.property, t.value)
          break
        case "OcclusionMap":
          this.setOcclusionMapParam(a, t.property, t.value)
          break
        case "NormalMap":
          this.setNormalMapParam(a, t.property, t.value)
          break
        case "EmissivelMap":
          this.setEmissivelMapParam(a, t.property, t.value)
          break
        case "OpacityMap":
          this.setOpacityMapParam(a, t.property, t.value)
      }
  }
  setAlbedoMapParam(e, t, a) {
    switch (t) {
      case "factor":
        e.albedoTexture && re(a) && (e.albedoTexture.level = a)
        break
      case "color":
        se(a) && e.albedoColor.setHexString(a)
    }
  }
  setMetallicMapParam(e, t, a) {
    if ("factor" === t) e.metallic = a
  }
  setRoughnessMapParam(e, t, a) {
    if ("factor" === t) e.roughness = a
  }
  setOcclusionMapParam(e, t, a) {
    switch (t) {
      case "factor":
        re(a) && ((e.ambientTextureStrength = a), this.setMaterialInfoStoreParam(e.uniqueId, "ambientFactor", a))
        break
      case "enable":
        if (ne(a)) {
          let t = this.getMaterialInfoStoreValue(e.uniqueId)
          if (t && ((e.ambientTextureStrength = t.ambientFactor), re(t.ambientTextureId))) {
            let a = this.textureOperate.getTexture(t.ambientTextureId)
            a && (e.ambientTexture = a)
          }
        } else (e.ambientTexture = null), (e.ambientTextureStrength = 0)
    }
  }
  setNormalMapParam(e, t, a) {
    switch (t) {
      case "factor":
        re(a) && (e.bumpTexture && (e.bumpTexture.level = a), this.setMaterialInfoStoreParam(e.uniqueId, "bumpFactor", a))
        break
      case "enable":
        if (ne(a)) {
          let t = this.getMaterialInfoStoreValue(e.uniqueId)
          if (t && re(t.bumpTextureId)) {
            let a = this.textureOperate.getTexture(t.bumpTextureId)
            a && ((e.bumpTexture = a), (e.bumpTexture.level = t.bumpFactor))
          }
        } else e.bumpTexture = null
    }
  }
  setEmissivelMapParam(e, t, a) {
    switch (t) {
      case "factor":
        re(a) && ((e.emissiveIntensity = a), this.setMaterialInfoStoreParam(e.uniqueId, "emissiveIntensity", a))
        break
      case "color":
        se(a) &&
          (e.emissiveColor.setHexString(a), this.setMaterialInfoStoreParam(e.uniqueId, "emissiveColor", e.emissiveColor.clone()))
        break
      case "enable":
        if (ne(a)) {
          let t = this.getMaterialInfoStoreValue(e.uniqueId)
          if (
            t &&
            (e.emissiveColor.copyFrom(t.emissiveColor), (e.emissiveIntensity = t.emissiveIntensity), re(t.emissiveTextureId))
          ) {
            let a = this.textureOperate.getTexture(t.emissiveTextureId)
            a && (e.emissiveTexture = a)
          }
        } else (e.emissiveTexture = null), e.emissiveColor.set(0, 0, 0), (e.emissiveIntensity = 0)
    }
  }
  setOpacityMapParam(e, t, a) {
    switch (t) {
      case "factor":
        re(a) && ((e.alpha = a), this.setMaterialInfoStoreParam(e.uniqueId, "alpha", a))
        break
      case "enable":
        if (ne(a)) {
          let t = this.getMaterialInfoStoreValue(e.uniqueId)
          if (t && ((e.alpha = t.alpha), re(t.opacityTextureId))) {
            let a = this.textureOperate.getTexture(t.opacityTextureId)
            a && (e.opacityTexture = a)
          }
        } else (e.opacityTexture = null), (e.alpha = 1)
    }
  }
  getCollectMaterialList() {
    let e = [],
      t = this.scene.getRootMesh()
    return (
      t &&
        Q(t, (e) => {
          this.materialMap.set(e.uniqueId, e)
        }),
      this.materialMap.forEach((t, a) => {
        e.push({ name: t.name, id: a })
      }),
      e
    )
  }
  transformMetallicRoughness(e) {
    this.transformPBRWorkFlow.transformMetallicRoughness(e)
  }
  transformSpecularGlossiness(e) {
    this.transformPBRWorkFlow.transformSpecularGlossiness(e)
  }
  testTranformSpecularGlossiness(e) {
    e.getChildMeshes().forEach((e) => {
      if (e.material && e.material instanceof m) {
        let t = e.material
        if ("BottleMat_MR" == t.name) {
          const e = "/models/SpecGlossVsMetalRough/metalRough-blender/"
          let a = new r(e + "WaterBottle_specularGlossiness.png", this.scene, !1, !1)
          ;(t.reflectivityTexture = a),
            (t.useMicroSurfaceFromReflectivityMapAlpha = !0),
            (t.albedoTexture = new r(e + "WaterBottle_diffuse.png", this.scene, !1, !1)),
            t.roughness && ((t.microSurface = t.roughness), (t.roughness = null)),
            (t.metallicTexture = null),
            (t.metallic = null)
        }
      }
    })
  }
  getMaterialCollectInfo(e) {
    let t = this.materialMap.get(e)
    if (t && t instanceof m) {
      let e = this.channelExtraction.getChannelInfo(t)
      return {
        materialName: t.name,
        materialIndex: this.getMaterialsIndexFromGltf(t),
        workFlowType: this.getPBRWorkFlow(t),
        alphaMode: this.channelExtraction.getAlphaMode(t),
        alphaCutOff: e.OpacityMap.factor ?? 0.4,
        doubleSided: !t.backFaceCulling,
        channels: e
      }
    }
  }
  setTextureParam(e, t) {
    let a = this.textureOperate.getTexture(e)
    if (a) {
      let e = t.property
      switch (e) {
        case "filter":
          this.textureOperate.setTextureFilter(t.property, a)
          break
        case "wrapU":
          se(t.value) && this.textureOperate.setTextureWrapParam("wrapU", t.value, a)
          break
        case "wrapV":
          se(t.value) && this.textureOperate.setTextureWrapParam("wrapV", t.value, a)
      }
      re(t.value) && this.textureOperate.setUVTransformParam(e, t.value, a)
    }
  }
  getMaterialInfoToFrontend(e) {
    let a = this.materialMap.get(e)
    if (a && a instanceof m) {
      let e = this.channelExtraction.getChannelInfo(a),
        i = {}
      for (const a in e)
        if (Object.prototype.hasOwnProperty.call(e, a)) {
          let r = e[a]
          ;(i[a] = { enable: r.enable, factor: r.factor }),
            r.color && (i[a].color = t.FromArray(r.color).toHexString()),
            r.texture &&
              r.UVTransforms &&
              (i[a].texture = {
                id: r.texture.uid,
                filter: this.textureOperate.getFilterValue(r.texture.minFilter, r.texture.magFilter),
                wrapU: r.texture.wrapU,
                wrapV: r.texture.wrapV,
                uvTransformOffsetX: r.UVTransforms.offset[0],
                uvTransformOffsetY: r.UVTransforms.offset[1],
                uvTransformScaleX: r.UVTransforms.scale[0],
                uvTransformScaleY: r.UVTransforms.offset[1],
                uvTransformRotation: c.ToDegrees(r.UVTransforms.rotation)
              })
        }
      return { id: a.uniqueId, workFlowType: this.getPBRWorkFlow(a), doubleSided: !a.backFaceCulling, channels: i }
    }
  }
  getMaterialCollectInfoToUI(e) {
    let a = this.materialMap.get(e)
    if (a && a instanceof m) {
      let e = this.channelExtraction.getChannelInfo(a)
      for (const a in e) {
        let i = e[a]
        for (const e in i)
          if (Object.prototype.hasOwnProperty.call(i, e)) {
            let a = e
            i[a] && ("factor" == a ? i[a] : "color" == a && t.FromArray(i[a]).toHexString())
          }
      }
    }
    return []
  }
  getTextureToUI(e) {
    this.getFilteringOptions(), this.getFilteringOptions()
  }
  async getAllImagesList() {
    let e = [],
      t = this.textureOperate.getTextureMap()
    for (const a of t) {
      a[0]
      let t = a[1]
      const i = t.getSize()
      let r = (32 / (i.width / i.height)) | 1,
        n = document.createElement("canvas")
      ;(n.width = 32), (n.height = r)
      const s = n.getContext("2d")
      let o = ""
      if (s)
        if (t.isReady()) {
          const e = await I.GetTextureDataAsync(t, 32, r)
          o = E(t) ?? ""
          const a = s.createImageData(32, r)
          a.data.set(e), s.putImageData(a, 0, 0), (o = n.toDataURL())
        } else console.log("未准备就绪")
      let l = t.getBaseSize()
      e.push({ uid: t.uniqueId, name: t.name, images: { url: o, width: l.width, height: l.height } })
    }
    return e
  }
  getMaterialsIndexFromGltf(e) {
    const t = e._internalMetadata.gltf.pointers[0].split("/"),
      a = t[t.length - 1]
    return void 0 !== a ? Number(a) : 0
  }
  getFilteringOptions() {
    return this.textureOperate.getFilteringOptions()
  }
  getWrapOptions() {
    return this.textureOperate.getWrapOptions()
  }
  getFormatOptions() {
    return this.textureOperate.getFormatOptions()
  }
  getPBRWorkFlow(e) {
    let t = me.Metallic
    return e.metadata && e.metadata.workFlowType === me.Specular && (t = me.Specular), t
  }
  getMaterialInfoStoreValue(e) {
    return this.materialInfoStore.get(e)
  }
  dispose() {
    this.materialMap.clear()
  }
}
class fe {
  constructor(e, t) {
    Object.defineProperty(this, "scene", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "globalState", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "plugMaterialListMap", { enumerable: !0, configurable: !0, writable: !0, value: new Map() }),
      Object.defineProperty(this, "wireframeColor", { enumerable: !0, configurable: !0, writable: !0, value: "#000000" }),
      Object.defineProperty(this, "wireframeThickness", { enumerable: !0, configurable: !0, writable: !0, value: 1 }),
      Object.defineProperty(this, "wireframeEnable", { enumerable: !0, configurable: !0, writable: !0, value: !1 }),
      (this.scene = e),
      (this.globalState = t),
      this.init()
  }
  init() {
    this.globalState.onInternalSceneLoaded.add(({ loadMesh: e }) => {
      this.dispose(),
        e.getChildMeshes().forEach((e) => {
          this.prepareDebugMode(e), e.refreshBoundingInfo(!0)
        })
    })
  }
  getWireframeInfo() {
    return { enable: this.wireframeEnable, factor: this.wireframeThickness, color: this.wireframeColor }
  }
  setWireframeParam(e, t) {
    this.traverseDebugPlugMaterial((a) => {
      switch (e) {
        case "enable":
          ne(t) && (a.isEnabled = t)
          break
        case "factor":
          re(t) && (a.wireframeThickness = t)
          break
        case "color":
          se(t) && a.wireframeTrianglesColor.setHexString(t)
      }
    })
  }
  prepareDebugMode(e) {
    this.setTempStoreVertices(e),
      R.PrepareMeshForTrianglesAndVerticesMode(e),
      X(e, (e) => {
        if (e instanceof m) {
          if (!this.plugMaterialListMap.has(e.uniqueId)) {
            let t = new R(e, { mode: k.TRIANGLES })
            ;(t.isEnabled = this.wireframeEnable),
              (t.wireframeThickness = this.wireframeThickness),
              t.wireframeTrianglesColor.setHexString(this.wireframeColor),
              this.plugMaterialListMap.set(e.uniqueId, t)
          }
        }
      })
  }
  traverseDebugPlugMaterial(e) {
    this.plugMaterialListMap.forEach((t) => {
      e?.(t)
    })
  }
  setTempStoreVertices(e) {
    let t = e.getTotalVertices()
    e.metadata ? (e.metadata = { ...e.metadata, originalVertices: t }) : (e.metadata = { originalVertices: t })
  }
  dispose() {
    this.traverseDebugPlugMaterial((e) => {
      e.dispose()
    }),
      this.plugMaterialListMap.clear()
  }
}
class ve {
  constructor(e) {
    Object.defineProperty(this, "scene", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "basicPipeline", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "camera", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      (this.scene = e),
      (this.camera = this.scene.activeCamera),
      (this.basicPipeline = new A("basicPipeline", !0, this.scene, [this.camera])),
      (this.basicPipeline.bloomWeight = 0.5),
      (this.basicPipeline.bloomThreshold = 0.2),
      (this.basicPipeline.fxaaEnabled = !0),
      (this.basicPipeline.samples = 2)
  }
  getBloomInfo() {
    return {
      enable: this.basicPipeline.bloomEnabled,
      factor: this.basicPipeline.bloomWeight,
      threshold: this.basicPipeline.bloomThreshold
    }
  }
  setBloomParam(e, t) {
    switch (e) {
      case "enable":
        ne(t) && (this.basicPipeline.bloomEnabled = t)
        break
      case "factor":
        re(t) && (this.basicPipeline.bloomWeight = t)
        break
      case "threshold":
        re(t) && (this.basicPipeline.bloomThreshold = t)
    }
  }
}
const Pe = "ssaopipeline"
class we {
  constructor(e) {
    Object.defineProperty(this, "scene", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "ssaoRenderingPipeline", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "_enable", { enumerable: !0, configurable: !0, writable: !0, value: !1 }),
      Object.defineProperty(this, "camera", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      (this.scene = e),
      (this.camera = this.scene.activeCamera),
      (this.ssaoRenderingPipeline = new j(Pe, e, { ssaoRatio: 0.5, combineRatio: 1 }, [this.camera])),
      (this.ssaoRenderingPipeline.totalStrength = 0.5),
      e.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline(Pe, this.camera)
  }
  getSSAOInfo() {
    return { enable: this._enable, factor: this.ssaoRenderingPipeline.totalStrength, radius: this.ssaoRenderingPipeline.radius }
  }
  setSSAOParam(e, t) {
    switch (e) {
      case "enable":
        ne(t) &&
          (t
            ? this.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(Pe, this.camera)
            : this.scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline(Pe, this.camera),
          (this._enable = t))
        break
      case "factor":
        re(t) && (this.ssaoRenderingPipeline.totalStrength = t)
        break
      case "radius":
        re(t) && (this.ssaoRenderingPipeline.radius = t)
    }
  }
}
class ye {
  constructor(e) {
    Object.defineProperty(this, "scene", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "camera", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "_enable", { enumerable: !0, configurable: !0, writable: !0, value: !1 }),
      Object.defineProperty(this, "ssrRenderingPipeline", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      (this.scene = e),
      (this.camera = this.scene.activeCamera),
      (this.ssrRenderingPipeline = new C("ssrpipeline", this.scene, [this.camera])),
      (this.ssrRenderingPipeline.isEnabled = this._enable)
  }
  getSSRInfo() {
    return { enable: this._enable, factor: this.ssrRenderingPipeline.strength }
  }
  setSSRParam(e, t) {
    switch (e) {
      case "enable":
        ne(t) && ((this.ssrRenderingPipeline.isEnabled = t), (this._enable = t))
        break
      case "factor":
        re(t) && (this.ssrRenderingPipeline.strength = t)
    }
  }
}
class Me {
  constructor(e) {
    Object.defineProperty(this, "basicPostProcessing", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "ssaoPostProcessing", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "ssrPostProcessing", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "enable", { enumerable: !0, configurable: !0, writable: !0, value: !1 }),
      (this.basicPostProcessing = new ve(e)),
      (this.ssaoPostProcessing = new we(e)),
      (this.ssrPostProcessing = new ye(e))
  }
  getPostProcessingInfo() {
    return {
      enable: !0,
      bloom: this.basicPostProcessing.getBloomInfo(),
      ssr: this.ssrPostProcessing.getSSRInfo(),
      ssao: this.ssaoPostProcessing.getSSAOInfo()
    }
  }
  setBloomParam(e, t) {
    this.basicPostProcessing.setBloomParam(e, t)
  }
  setSSAOParam(e, t) {
    this.ssaoPostProcessing.setSSAOParam(e, t)
  }
  setSSRParam(e, t) {
    this.ssrPostProcessing.setSSRParam(e, t)
  }
  setPresetsParam(e) {
    this.enable = e.enable
    for (const t in e.bloom)
      if (Object.prototype.hasOwnProperty.call(e.bloom, t)) {
        const a = e.bloom[t]
        this.setBloomParam(t, a)
      }
    for (const t in e.ssao)
      if (Object.prototype.hasOwnProperty.call(e.ssao, t)) {
        const a = e.ssao[t]
        this.setSSAOParam(t, a)
      }
    for (const t in e.ssr)
      if (Object.prototype.hasOwnProperty.call(e.ssr, t)) {
        const a = e.ssr[t]
        this.setSSAOParam(t, a)
      }
  }
}
class Se {
  constructor(e, t) {
    Object.defineProperty(this, "scene", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "bottomGrid", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "bottomGridMaterial", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "offsetY", { enumerable: !0, configurable: !0, writable: !0, value: 0.001 }),
      Object.defineProperty(this, "gridScaleFactor", { enumerable: !0, configurable: !0, writable: !0, value: 1.5 }),
      Object.defineProperty(this, "globalState", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "gizmoManager", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "loadMesh", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "gizmoTransformNode", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "bottomGridEnable", { enumerable: !0, configurable: !0, writable: !0, value: !1 }),
      (this.scene = e),
      (this.globalState = t),
      this.initGizmoManager(),
      this.initBottomGrid()
  }
  initBottomGrid() {
    ;(this.bottomGrid = O.CreateGround("bottomGrid", { width: 1, height: 1 }, this.scene)),
      (this.bottomGrid.isPickable = !1),
      this.bottomGrid.setEnabled(this.bottomGridEnable),
      (this.bottomGridMaterial = new N("bottomGridMaterial", this.scene)),
      (this.bottomGridMaterial.backFaceCulling = !1),
      (this.bottomGridMaterial.majorUnitFrequency = 1),
      (this.bottomGridMaterial.gridRatio = 0.1),
      this.bottomGridMaterial.mainColor.set(1, 1, 1),
      this.bottomGridMaterial.lineColor.set(1, 1, 1),
      (this.bottomGridMaterial.opacity = 0.98),
      (this.bottomGridMaterial.minorUnitVisibility = 0),
      (this.bottomGridMaterial.useMaxLine = !0),
      (this.bottomGrid.material = this.bottomGridMaterial),
      this.globalState.onInternalSceneLoaded.add(({ loadMesh: e }) => {
        ;(this.loadMesh = e),
          this.adaptiveModelGrid(e),
          this.gizmoTransformNode.position.copyFrom(this.bottomGrid.position),
          e && this.loadMesh.rotationQuaternion && (this.gizmoTransformNode.rotationQuaternion = this.loadMesh.rotationQuaternion)
      })
  }
  initGizmoManager() {
    ;(this.gizmoManager = new L(this.scene)),
      (this.gizmoManager.usePointerToAttachGizmos = !1),
      (this.gizmoManager.positionGizmoEnabled = !0),
      (this.gizmoManager.rotationGizmoEnabled = !0),
      (this.gizmoTransformNode = new B("gizmoTransformNode")),
      this.gizmoManager.gizmos.positionGizmo &&
        ((this.gizmoManager.gizmos.positionGizmo.scaleRatio = 1.6),
        (this.gizmoManager.gizmos.positionGizmo.zGizmo.isEnabled = !1),
        (this.gizmoManager.gizmos.positionGizmo.xGizmo.isEnabled = !1),
        (this.gizmoManager.gizmos.positionGizmo.updateGizmoRotationToMatchAttachedMesh = !1)),
      this.gizmoManager.gizmos.rotationGizmo &&
        (this.gizmoManager.gizmos.rotationGizmo.updateGizmoRotationToMatchAttachedMesh = !1),
      this.gizmoManager.gizmos.positionGizmo?.onDragObservable.add(() => {
        this.bottomGrid.position.copyFrom(this.gizmoTransformNode.position)
      }),
      this.gizmoManager.gizmos.rotationGizmo?.onDragObservable.add(() => {
        this.loadMesh && (this.loadMesh.rotationQuaternion = this.gizmoTransformNode.rotationQuaternion)
      })
  }
  showSceneGizmo(e = !0) {
    this.bottomGridEnable !== e &&
      (this.bottomGrid.setEnabled(e),
      this.gizmoManager.gizmos.positionGizmo &&
        this.gizmoManager.gizmos.rotationGizmo &&
        (e
          ? ((this.gizmoManager.gizmos.positionGizmo.attachedNode = this.gizmoTransformNode),
            (this.gizmoManager.gizmos.rotationGizmo.attachedNode = this.gizmoTransformNode))
          : ((this.gizmoManager.gizmos.positionGizmo.attachedNode = null),
            (this.gizmoManager.gizmos.rotationGizmo.attachedNode = null))),
      (this.bottomGridEnable = e))
  }
  adaptiveModelGrid(e) {
    const t = K(e)
    let a = new x(t.min, t.max)
    const i = Math.max(t.max.x - t.min.x, t.max.z - t.min.z)
    let r = this.gridScaleFactor
    this.bottomGrid.scaling.set(i * r, 1, i * r)
    const n = t.min.y
    this.bottomGrid.position.copyFrom(a.centerWorld), (this.bottomGrid.position.y = n - this.offsetY)
  }
}
class Oe {
  constructor(e, t) {
    Object.defineProperty(this, "scene", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "from", { enumerable: !0, configurable: !0, writable: !0, value: 0 }),
      Object.defineProperty(this, "to", { enumerable: !0, configurable: !0, writable: !0, value: 0 }),
      Object.defineProperty(this, "loop", { enumerable: !0, configurable: !0, writable: !0, value: !1 }),
      Object.defineProperty(this, "currentFrame", { enumerable: !0, configurable: !0, writable: !0, value: 0 }),
      Object.defineProperty(this, "isPlaying", { enumerable: !0, configurable: !0, writable: !0, value: !1 }),
      Object.defineProperty(this, "animationGroup", { enumerable: !0, configurable: !0, writable: !0, value: null }),
      Object.defineProperty(this, "globalState", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "onAnimationObersve", { enumerable: !0, configurable: !0, writable: !0, value: new u() }),
      (this.scene = e),
      (this.globalState = t)
  }
  init() {
    this.globalState.onInternalSceneLoaded.add(() => {
      this.scene.animationGroups.length > 0 &&
        ((this.animationGroup = this.scene.animationGroups[0]),
        (this.loop = this.animationGroup.loopAnimation),
        (this.to = this.animationGroup.to),
        (this.isPlaying = this.animationGroup.isPlaying),
        (this.currentFrame = this.getCurrentFrame(this.animationGroup)))
    }),
      this.scene.onBeforeRenderObservable.add(() => {
        this.animationGroup &&
          ((this.currentFrame = this.getCurrentFrame(this.animationGroup)),
          this.onAnimationObersve.notifyObservers({ currentFrame: this.currentFrame }))
      })
  }
  setCurrentFrame(e) {
    this.animationGroup &&
      (this.isPlaying
        ? this.animationGroup.goToFrame(e)
        : (this.animationGroup.play(!0), this.animationGroup.goToFrame(e), this.animationGroup.pause())),
      (this.currentFrame = e)
  }
  getCurrentFrame(e) {
    let t = 0
    const a = e.targetedAnimations
    if (a.length > 0) {
      const i = e.targetedAnimations[0].animation.runtimeAnimations.find((e) => e.target === a[0].target)
      i && (t = i.currentFrame)
    }
    return t
  }
  setAnimationParam(e, t) {
    switch (e) {
      case "isPlaying":
        ne(t) &&
          (this.isPlaying !== t && (t ? this.animationGroup?.play(!0) : this.animationGroup?.pause()), (this.isPlaying = t))
        break
      case "currentFrame":
        re(t) && this.setCurrentFrame(t)
    }
  }
  getAnimationInfo() {
    return { to: this.to, from: this.from, isPlaying: this.isPlaying, currentFrame: this.currentFrame }
  }
  addAnimationListen(e) {
    this.onAnimationObersve.add(e)
  }
}
const xe = {
  background: { enable: !0, bgType: "color", id: 1, color: "#dddddd" },
  environment: {
    enable: !0,
    id: 4,
    intensity: 1,
    backgroundExposure: 1,
    rotation: 0,
    blur: 0.3,
    lightEnable: !0,
    lightIntensity: 1,
    shadowBias: 5e-4
  },
  camera: { fov: 45, nearDistance: 0.001, position: { x: 10, y: 10, z: 10 }, target: { x: 0, y: 0, z: 0 } },
  wireframe: { enable: !1, color: "#000000", factor: 1 },
  shadowGround: { enable: !1, darkness: 0.1, height: 0, size: 1.5, shadowType: "shadowCaster" },
  postProcess: {
    enable: !1,
    bloom: { enable: !1, factor: 0.5, threshold: 0.2 },
    ssao: { enable: !1, radius: 6e-4, factor: 0.5 },
    ssr: { enable: !1, factor: 1 }
  },
  orientation: { matrix: Array.from(P.Identity().asArray()) }
}
class Te extends q {
  constructor(e) {
    super(e),
      Object.defineProperty(this, "version", { enumerable: !0, configurable: !0, writable: !0, value: "0.01" }),
      Object.defineProperty(this, "loader", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "screenShot", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "cameraOperate", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "sceneOperate", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "lightOperate", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "materialOperate", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "wireframeOperate", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "postProcessOperate", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "modelInteractiveOperate", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "animationOperate", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "globalState", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "presetsInitParam", { enumerable: !0, configurable: !0, writable: !0, value: xe }),
      Object.defineProperty(this, "hasBeenPresets", { enumerable: !0, configurable: !0, writable: !0, value: !1 }),
      Object.defineProperty(this, "onSceneLoaded", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "onSceneProgressed", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      Object.defineProperty(this, "onLoadedError", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }),
      (this.globalState = new $()),
      (this.onSceneLoaded = this.globalState.onSceneLoaded),
      (this.onSceneProgressed = this.globalState.onSceneProgressed),
      (this.onLoadedError = this.globalState.onLoadedError)
  }
  init() {
    this.hasBeenPresets && z(this.presetsInitParam.environment.id) && this.setDefaultHDRId(this.presetsInitParam.environment.id),
      super.init(),
      this.renderSuccess &&
        this.scene &&
        ((this.globalState.currentScene = this.scene),
        (this.sceneOperate = new oe(this.scene, this.globalState)),
        this.hasBeenPresets &&
          z(this.presetsInitParam.environment.id) &&
          this.sceneOperate.setPresetsEnvironmentId(this.presetsInitParam.environment.id),
        this.sceneOperate.init(),
        (this.cameraOperate = new he(this.scene, this.globalState)),
        (this.lightOperate = new ue(this.scene, this.globalState)),
        (this.materialOperate = new pe(this.scene)),
        (this.wireframeOperate = new fe(this.scene, this.globalState)),
        (this.modelInteractiveOperate = new Se(this.scene, this.globalState)),
        (this.animationOperate = new Oe(this.scene, this.globalState)),
        this.animationOperate.init(),
        (this.postProcessOperate = new Me(this.scene)),
        (this.loader = new ee(this.scene, this.globalState)),
        this.sceneOperate.initBindListener(),
        this.hasBeenPresets ? this.setPresetParam(this.presetsInitParam) : this.setBackground("image", 1))
  }
  showInspector() {}
  loadFile(e) {
    this.loader?.loadFile(e, () => {
      console.log("加载成功")
    })
  }
  loadModelUrl(e, t) {
    "string" == typeof e && e
      ? this.loader?.loadURL(
          e,
          () => {
            this.materialOperate?.initalMaterialPreparation()
          },
          () => {},
          () => {},
          t
        )
      : console.error("非合法路径，请检查", e)
  }
  dropLoadFiles(e) {
    this.loader?.dropLoadFiles(e)
  }
  setBackground(e, t) {
    this.sceneOperate?.setBackground(e, t)
  }
  setBackgroundEnable(e) {
    this.sceneOperate?.setBackgroundEnable(e)
  }
  setWireframeParam(e, t) {
    this.wireframeOperate?.setWireframeParam(e, t)
  }
  setShadowGroundParam(e, t) {
    this.lightOperate?.setShadowGroundParam(e, t)
  }
  setEnvironmentParam(e, t) {
    this.sceneOperate?.setEnvironmentParam(e, t), "enable" == e && this.setEnvironmentLightShadowParam("lightEnable", t)
  }
  setEnvironmentHDRId(e) {
    this.sceneOperate?.setEnvironmentHDRId(e)
  }
  setEnvironmentLightShadowParam(e, t) {
    this.lightOperate?.setEnvironmentLightShadowParam(e, t)
  }
  setCameraParam(e, t) {
    this.cameraOperate?.setCameraParam(e, t)
  }
  setAnimationParam(e, t) {
    this.animationOperate?.setAnimationParam(e, t)
  }
  pulicCalls(e, t) {
    if (t) {
      let a = t.split("-"),
        i = a[0],
        r = a[1]
      if (i && r)
        switch (i) {
          case "LightShadowCaster":
            ;(this.lightOperate?.shadowCaster[r])(e)
            break
          case "SceneEnvironment":
            ;(this.sceneOperate?.[r])(e)
        }
    }
  }
  setChannelParam(e, t) {
    this.materialOperate?.setChannelParam(e, t)
  }
  setPostProcessingTotalEnable(e) {}
  setBloomParam(e, t) {
    this.postProcessOperate?.setBloomParam(e, t)
  }
  setSSAOParam(e, t) {
    this.postProcessOperate?.setSSAOParam(e, t)
  }
  setSSRParam(e, t) {
    this.postProcessOperate?.setSSRParam(e, t)
  }
  presetsInitialParam(e) {
    ;(this.presetsInitParam = D(this.presetsInitParam, e)),
      (this.hasBeenPresets = !0),
      (this.globalState.hasBeenPresets = !0),
      (this.globalState.presetsInitParam = this.presetsInitParam)
  }
  setPresetParam(e) {
    this.sceneOperate?.setBackgroundPresetsParam(e.background),
      this.sceneOperate?.setEnvironmentPresetsParam(e.environment),
      this.cameraOperate?.setPresetsParam(e.camera),
      this.lightOperate?.setEnvironmentLightShadowPresetsParam(e.environment),
      this.postProcessOperate?.setPresetsParam(e.postProcess)
  }
  showSceneGizmo(e = !0) {
    this.modelInteractiveOperate?.showSceneGizmo(e)
  }
  addAnimationListen(e) {
    this.animationOperate?.addAnimationListen(e)
  }
  async getPreviewImage() {
    return this.screenShot?.getPreviewImage()
  }
  getSixViewsImage() {
    return this.screenShot?.getSixViewsImage()
  }
  getScreenshot(e = 960, t = 540) {
    return this.sceneOperate?.getScreenshot(e, t)
  }
  getModelInfo() {
    let e = this.scene?.getRootMesh()
    if (e && this.scene) return Z(e, this.scene)
  }
  getCollectMaterialList() {
    return this.materialOperate?.getCollectMaterialList() ?? []
  }
  getMaterialCollectInfo(e) {
    return this.materialOperate?.getMaterialCollectInfo(e)
  }
  getAllImagesListAsync() {
    return this.materialOperate?.getAllImagesList() ?? Promise.resolve([])
  }
  getFilteringOptions() {
    return this.materialOperate?.getFilteringOptions() ?? []
  }
  getWrapOptions() {
    return this.materialOperate?.getWrapOptions() ?? []
  }
  getFormatOptions() {
    return this.materialOperate?.getFormatOptions()
  }
  getEditorSettingParamToFrontEnd() {
    if (this.renderSuccess) {
      return {
        background: this.sceneOperate.getBackgroundInfo(),
        wireframe: this.wireframeOperate.getWireframeInfo(),
        camera: this.cameraOperate.getCameraInfo(),
        shadowGround: this.lightOperate.getShadowInfo(),
        postProcess: this.postProcessOperate.getPostProcessingInfo(),
        environment: { ...this.sceneOperate.getEnvironmentInfo(), ...this.lightOperate.getEnvironmentShadowInfo() },
        orientation: this.sceneOperate.getModelOrientationInfo()
      }
    }
    return xe
  }
  getModelAnimationInfo() {
    return this.animationOperate?.getAnimationInfo()
  }
  getSceneBackgroundImageResourcesData() {
    return V
  }
  getSceneEnvironmentResourcesData() {
    return W
  }
  dispose() {
    this.materialOperate?.dispose(), this.lightOperate?.dispose(), this.sceneOperate?.dispose(), super.dispose()
  }
  initTest() {
    new G("light", new h(0, 1, 0), this.scene).intensity = 0.7
    O.CreateSphere("sphere", { diameter: 2, segments: 32 }, this.scene).position.y = 1
    ;(O.CreateGround("ground", { width: 6, height: 6 }, this.scene).name = "ground"),
      this.globalState.onSceneLoaded.notifyObservers({})
  }
}
export { Te as default }
