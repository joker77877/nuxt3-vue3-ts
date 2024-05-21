import {
  Tuple,
  Nullable,
  AbstractMesh,
  Color3,
  Engine,
  Scene,
  ArcRotateCamera,
  Observable,
  ISceneLoaderProgressEvent
} from "@babylonjs/core"

/**
 * 三维向量接口
 */
interface IVector3Interface {
  x: number
  y: number
  z: number
}

/**
 * 相机信息接口
 */
interface ICameraInfoInterface {
  /**视野角度 */
  fov: number
  /**近裁剪截面值 */
  nearDistance: number
  /**相机position坐标 */
  position: IVector3Interface
  /**相机target坐标 */
  target: IVector3Interface
}

/**
 * 环境球信息接口
 */
interface IEnvironmentInfoInterface {
  /**环境球的开启关闭 */
  enable: boolean
  /**环境球资源的id */
  id: number
  /**环境球的强度 */
  intensity: number
  /**背景强度 */
  backgroundExposure: number
  /**旋转角度 */
  rotation: number
  /**模糊程度 */
  blur: number
  /**平行光的开关 */
  lightEnable: boolean
  /**灯光强度 */
  lightIntensity: number
  /**偏移量 */
  shadowBias: number
}

/**
 * 模型的方向与位置接口
 */
interface IOrientationInfoInterface {
  /**矩阵 */
  matrix: Tuple<number, 16>
}

/**后处理信息接口 */
interface IPostProcessInfoInterface {
  /**后处理总开关 */
  enable: boolean
  bloom: IBloomInterface
  ssao: ISSAOInterface
  ssr: ISSRInterface
}
/**
 * bloom类型接口
 */
interface IBloomInterface {
  /**开关 */
  enable: boolean
  /**强度 */
  factor: number
  /**阈值 */
  threshold: number
}
/**
 * SSR类型接口
 */
interface ISSRInterface {
  /**开关 */
  enable: boolean
  /**强度 */
  factor: number
}
/**
 * SSAO类型接口
 */
interface ISSAOInterface {
  /**开关 */
  enable: boolean
  /**强度 */
  factor: number
  /**强度的半径 */
  radius: number
}

/**背景类型定义 */
type IBackgroundType = "color" | "image" | "environment"
/**阴影类型 */
type IShadowType = "shadowCaster" | "bakedAO"

/**
 * 背景信息接口
 */
interface IBackgroundInfoInterface {
  /**是否开启背景，否则背景则是透明的 */
  enable: boolean
  /**背景类型 */
  bgType: IBackgroundType
  /**背景颜色 */
  color: string
  /**背景图片id */
  id: number
}

/**阴影信息接口 */
interface IShadowInfoInterface {
  /**开关 */
  enable: boolean
  /**阴暗程度 */
  darkness: number
  /**高度 */
  height: number
  /**大小 */
  size: number
  /**阴影类型 */
  shadowType: IShadowType
}

/**
 * 线框信息接口
 */
interface IWireframeInfoInterface {
  /**线框开启关闭 */
  enable: boolean
  /**线框颜色 */
  color: string
  /**线框透明度 */
  factor: number
}

/**
 * 给前端的设置参数
 */
interface ISettingParamInfoInterface {
  orientation: IOrientationInfoInterface
  background: IBackgroundInfoInterface
  environment: IEnvironmentInfoInterface
  camera: ICameraInfoInterface
  wireframe: IWireframeInfoInterface
  shadowGround: IShadowInfoInterface
  postProcess: IPostProcessInfoInterface
}

/**
 * 本地资源接口
 */
interface ILocalResourcesInterface {
  /**资源id */
  id: number
  /**资源名称 */
  name: string
  /**缩略图 */
  thumbnailUrl: string
  /**资源路径 */
  url: string
}

/**
 * 动画信息接口
 */
interface IAnimationInfoInterface {
  /**动画初始帧 */
  from: number
  /**动画结束帧 */
  to: number
  /**是否在播放 */
  isPlaying: boolean
  /**当前帧 */
  currentFrame: number
}
/**
 * 监听回调函数的参数
 */
interface IAnimationListenParamInterface {
  /**动画运动的当前帧 */
  currentFrame: number
}
/**
 * 动画的监听函数类型
 */
type AnimationListenFunctionType = (obj: IAnimationListenParamInterface) => void

interface ISelectType {
  key: string
  value: string | number
}

/**
 * 材质集合数据类型
 */
interface IMaterialCollectData {
  /**材质名称 */
  name: string
  /**材质id */
  id: number
}
/**
 * PBR材质的工作流
 */
declare enum IPBRWorkFlow {
  /**金属工作流 */
  Metallic = "Metallic",
  /**高光工作流 */
  Specular = "Specular"
}
/**
 * 颜色值类型
 */
type IColorValueType = [number, number, number]
/**
 * Transform值类型
 */
type ITransformValueType = [number, number]
/**
 * UV Transform类型
 */
interface IUVTransformType {
  /**scale缩放 */
  scale: ITransformValueType
  /**offset偏移 */
  offset: ITransformValueType
  /**旋转度数(弧度) */
  rotation: number
}
/**贴图类型 */
interface ITextureValueType {
  /**最大采样 */
  magFilter: string
  /**最小采样 */
  minFilter: string
  /**U包裹 */
  wrapU: string
  /**V包裹 */
  wrapV: string
  /**texture的格式 */
  textureFormat: string
  /**第几套UV */
  texCoordUnit: number
  /**贴图的的uid */
  uid: number
  /**贴图的服务端id，有新增或者修改时图片的id */
  id: number
}
/**
 * 通道类型
 */
interface IChannelType {
  /**是否开启 */
  enable: boolean
  /**强度 */
  factor: number
  /**uv变换 */
  UVTransforms?: IUVTransformType
  /**颜色 */
  color?: IColorValueType
  /**贴图 */
  texture?: ITextureValueType
  /**类型 */
  type?: string
}
/**
 * 通道信息类型集合
 */
interface IChannelInfoType {
  [k: string]: IChannelType
}
/**
 * 材质信息收集类型
 */
interface IMaterialCollectInfoType {
  /**材质名称 */
  materialName: string
  /**材质的index,对应gltf中materials里的下标 */
  materialIndex: number
  /**工作流模式类型 */
  workFlowType: IPBRWorkFlow
  /**alpha模式 */
  alphaMode: string
  /**alpha剔除 */
  alphaCutOff: number
  /**是否是双面 */
  doubleSided: boolean
  /**通道信息 */
  channels: IChannelInfoType
}
/**
 * 通道设置类型
 */
interface IChannelSetValueType {
  /**通道名称 */
  channelName: string
  /**通道属性 */
  property: string
  /**通道值 */
  value: number | string | boolean
}
/**
 * 贴图图片资源类型
 */
interface IImageSourcesType {
  /**对应贴图的id */
  uid: number
  /**图片名称 */
  name: string
  /**图片对象 */
  images: {
    /**图片路径 */
    url: string
    /**图片宽度 */
    width: number
    /**图片高度 */
    height: number
  }
}

/**
 * 模型信息的类型接口
 */
interface IModelInfo {
  /**
   * 面数
   */
  faces: number
  /**
   * 顶点数量
   */
  vertices: number
  /**
   * 贴图数量
   */
  textures: number
  /**
   * 材质数量
   */
  materials: number
  /**
   * 是否含有PBR通道
   */
  isPBR: boolean
  /**
   * 动画的数量
   */
  animations: number
}

/**
 * 自定义Scene
 */
interface CustomScene {
  /**
   * 获取场景中__root__节点的mesh
   */
  getRootMesh(): Nullable<AbstractMesh>
}
declare module "@babylonjs/core" {
  interface Scene extends CustomScene {}
}

/**
 * 自定义拓展Color3
 */
interface CustomColor3 {
  /**
   * 设置hex颜色
   */
  setHexString(hex: string): Color3
}
declare module "@babylonjs/core" {
  interface Color3 extends CustomColor3 {}
}

/**
 * 基础引擎
 */
declare class BasicEngine {
  protected canvasDom: HTMLCanvasElement | null
  protected engine?: Engine
  protected scene?: Scene
  /**主相机 */
  protected camera?: ArcRotateCamera
  /**是否在进行渲染 */
  protected doRender: boolean
  /**有canvas的情况下，渲染成功 */
  protected renderSuccess: boolean
  private _engineResize
  /**初始默认的hdr的id */
  private _initDefaultHDRId
  constructor(canvasId: string)
  init(): void
  /**
   * 初始化Engine
   */
  private initEngine
  /**
   * 初始化场景
   */
  private initScene
  /**
   * 初始化场景环境HDR
   */
  private initSceneEnvironment
  private initCamera
  private renderLoop
  private bindEngineResize
  private removeEngineResize
  /**
   * 设置渲染器大小(canvas)
   * @param width 宽度
   * @param height 高度
   */
  setRenderSize(width: number, height: number): void
  /**
   * 设置默认的hdr的id
   * @param id
   */
  setDefaultHDRId(id: number): void
  /**
   * 销毁场景
   */
  dispose(): void
}

/**
 * 资源加载错误报错
 */
interface ILoadedErrorType {
  /**提示信息 */
  message: string
  /**加载资源的类型 */
  loadType: string
}

/**
 * 内部场景监听接口
 */
interface IOnInternalSceneLoadedInterface {
  /**当前使用的加载插件名称 */
  currentPluginName: string
  /**加载的Mesh */
  loadMesh: AbstractMesh
}
/**
 * 全局状态数据
 */
declare class GlobalState {
  /**是否进行过预设值,默认为false */
  hasBeenPresets: boolean
  /**预设初始参数 */
  presetsInitParam?: ISettingParamInfoInterface
  /**当前场景 */
  currentScene?: Scene
  /**场景加载完毕订阅 */
  onSceneLoaded: Observable<unknown>
  /**场景加载进度订阅 */
  onSceneProgressed: Observable<ISceneLoaderProgressEvent>
  /**场景加载文件报错订阅 */
  onLoadedError: Observable<ILoadedErrorType>
  /**报错回调 */
  onError: Observable<unknown>
  /**
   * @internal
   * 内部使用的场景加载模型监听
   */
  onInternalSceneLoaded: Observable<IOnInternalSceneLoadedInterface>
}

/**
 * 深度遍历所有属性并设为可选
 */
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[] ? DeepPartial<U>[] : T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/**
 * 觅她3D引擎
 */
declare class Meta3DEngine extends BasicEngine {
  /**引擎版本 */
  readonly version: string
  /**加载操作类 */
  private loader?
  private screenShot?
  /**相机操作类 */
  private cameraOperate?
  /**场景操作类 */
  private sceneOperate?
  /**灯光操作类 */
  private lightOperate?
  /**材质操作类 */
  private materialOperate?
  /**线框操作类 */
  private wireframeOperate?
  /**后处理操作类 */
  private postProcessOperate?
  private modelInteractiveOperate?
  private animationOperate?
  private globalState
  /**预设初始参数 */
  private presetsInitParam
  /**是否进行过预设值,默认为false */
  private hasBeenPresets
  /**
   * 场景加载完毕订阅
   * @description 用于监听场景模型是否加载完毕
   * @example
   * ```
   * //示例
   * meta3DEngine.onSceneLoaded.add(()=>{
   *    //do someting
   * })
   * ```
   */
  onSceneLoaded: GlobalState["onSceneLoaded"]
  /**
   * 场景加载进度订阅
   * @description 用于监听场景模型加载的进度
   * @example
   * ```
   * //示例
   * meta3DEngine.onSceneProgressed.add((progress)=>{
   *    //do someting
   * })
   * ```
   */
  onSceneProgressed: GlobalState["onSceneProgressed"]
  /**
   * 场景加载报错订阅
   * @description 用于监听场景模型报错时监听
   * @example
   * ```
   * //示例
   * meta3DEngine.onLoadedError.add((res)=>{
   *    //do someting
   * })
   * ```
   */
  onLoadedError: GlobalState["onLoadedError"]
  /**
   * Meta3D引擎的实例化
   * @param canvasId 页面上canvas的id
   */
  constructor(canvasId: string)
  /**
   * 引擎初始化调用
   * @description 必须在dom加载完成之后调用
   */
  init(): void
  /**
   * 显示调试工具
   */
  showInspector(): void
  /**
   * 加载File文件模型
   * @param file File类型
   */
  loadFile(file: File): void
  /**
   * 加载url型模型
   * @param modelURL 模型的url
   * @param extension 格式
   */
  loadModelUrl(modelURL: string, extension?: string): void
  /**
   * drop时读取的File文件
   * @param event DragEvent事件
   */
  dropLoadFiles(event: DragEvent): void
  /**************************************设置******************************************/
  /**
   * 设置背景
   * @param type 类型 color | image | enviroment
   * @param value  背景值，color的话是十六进制字符串，image的话为id, enviroment的话为true或者false
   * ```
   * //示例1 设置场景背景颜色值
   * meta3DEngine.setBackground("color", "#dddddd")
   * //示例2 设置场景背景图片的id
   * meta3DEngine.setBackground("image", 2)
   * //示例3 设置环境球的展示
   * meta3DEngine.setBackground("enviroment", true)
   * ```
   */
  setBackground(type: IBackgroundType, value: string | number | boolean): void
  /**
   * 设置场景的开启关闭
   * @param value true为开启，false为关闭,关闭时背景是透明的
   */
  setBackgroundEnable(value: boolean): void
  /**
   * 设置线框参数,开关和线框宽度与颜色
   * @param property 属性名称
   * @param value 属性值
   */
  setWireframeParam(property: string, value: boolean | number | string): void
  /**
   * 设置阴影地面的参数,包含环境球灯光的开关与参数值
   * @param property 属性名称
   * @param value 属性值
   * ```
   * //设置阴暗程度
   * meta3DEngine.setShadowGroundParam("darkness", 0.5)
   * ```
   */
  setShadowGroundParam(property: string, value: boolean | number): void
  /**
   * 设置环境球参数
   * @param property 属性名称
   * @param value 属性值
   * ```
   * //设置环境球强度
   * meta3DEngine.setShadowGroundParam("intensity", 0.5)
   * ```
   */
  setEnvironmentParam(property: string, value: number | boolean): void
  /**
   * 设置环境球的hdr的id
   * @param id 环境球hdr的id,切换hdr环境球时使用
   */
  setEnvironmentHDRId(id: number): void
  /**
   * 设置环境球下灯光阴影的参数
   * @param property 属性名称
   * @param value 属性值
   * ```
   * //示例设置环境球灯光阴影的参数
   * meta3DEngine.setShadowGroundParam("lightIntensity", 0.5)
   * ```
   */
  setEnvironmentLightShadowParam(property: string, value: number | boolean): void
  /**
   * 设置相机参数
   * @param property 属性名称
   * @param value 属性值
   */
  setCameraParam(property: string, value: number): void
  /**
     * 设置播放动画的参数
     * @param property 属性名称 isPlaying | currentFrame
     * @param value 属性值
     * @example
     * ```
     * //暂停
     * meta3DEngine.setAnimationParam('isPlaying', false);
     
     * //设置某帧
     * meta3DEngine.setAnimationParam('currentFrame', 5);
     * ```
     */
  setAnimationParam(property: string, value: boolean | number): void
  /**
   * 公有调用
   * @param value 值
   * @param callBackName 调用的函数名
   */
  pulicCalls(value: number | string, callBackName?: string): void
  /**
   * 设置材质通道参数
   * @param id 材质id
   * @param datas 属性和值
   */
  setChannelParam(id: number, datas: IChannelSetValueType): void
  /**
   * 设置后处理总开关
   * @param value 开启或关闭
   */
  setPostProcessingTotalEnable(value: boolean): void
  /**
   * 设Bloom参数,包含开关与参数值
   * @param property 属性名称
   * @param value 属性值
   */
  setBloomParam(property: string, value: number | boolean): void
  /**
   * 设SSAO参数,包含开关与参数值
   * @param property 属性名称
   * @param value 属性值
   */
  setSSAOParam(property: string, value: number | boolean): void
  /**
   * 设SSR参数,包含开关与参数值
   * @param property 属性名称
   * @param value 属性值
   */
  setSSRParam(property: string, value: number | boolean): void
  /**
   * 预设初始化参数,在初始化之前
   * @param initParam
   */
  presetsInitialParam(initParam: DeepPartial<ISettingParamInfoInterface>): void
  /**
   * 设置预设参数
   * @param presetsParam
   */
  private setPresetParam
  /**
   * 显示场景的小工具
   * @param visible true为显示，false为隐藏
   */
  showSceneGizmo(visible?: boolean): void
  /**
   * 添加动画监听函数
   * @param fn
   * @example
   * ```
   * //示例
   * meta3DEngine.addAnimationListen(({currentFrame})=>{
   *    //do something
   * });
   * ```
   */
  addAnimationListen(fn: AnimationListenFunctionType): void
  /*************************************获取********************************************************/
  /**
   * 获取预览图像
   */
  private getPreviewImage
  /**
   * 获取六视图图片
   */
  private getSixViewsImage
  /**
   * 获取屏幕截图
   * @param width 默认960宽度
   * @param height 默认540宽度
   * @returns 返回图片base64数据
   */
  getScreenshot(width?: number, height?: number): Promise<string> | undefined
  /**
   * 获取模型基础信息，如顶点数量、面数、贴图数量等..
   * @returns
   */
  getModelInfo(): IModelInfo | undefined
  /**
   * 获取材质集合列表
   * @returns
   */
  getCollectMaterialList(): IMaterialCollectData[]
  /**
   * 获取材质的信息
   * @param id 材质的id
   * @returns
   */
  getMaterialCollectInfo(id: number): IMaterialCollectInfoType | undefined
  /**
   * 获取所有Images资源列表
   * @returns
   */
  getAllImagesListAsync(): Promise<IImageSourcesType[]>
  /**
   * 获取贴图Filtering的选项
   * @returns
   */
  getFilteringOptions(): ISelectType[]
  /**
   * 获取Filtering的选项
   * @returns
   */
  getWrapOptions(): ISelectType[]
  /**
   * 获取贴图Format的选项
   * @returns
   */
  getFormatOptions(): ISelectType[] | undefined
  /**
   *获取编辑设置参数到前端使用
   * @returns
   */
  getEditorSettingParamToFrontEnd(): ISettingParamInfoInterface
  /**
   * 获取模型动画信息
   */
  getModelAnimationInfo(): IAnimationInfoInterface | undefined
  /**
   * 场景背景图片资源数据
   * @returns
   */
  getSceneBackgroundImageResourcesData(): ILocalResourcesInterface[]
  /**
   * 场景环境球资源数据
   * @returns
   */
  getSceneEnvironmentResourcesData(): ILocalResourcesInterface[]
  /**
   * 用于场景的销毁
   * @description 须在组件销毁之前调用
   */
  dispose(): void
  private initTest
}
/**
 * Meta3DEngine引擎的类型
 */
type Meta3DEngineType = InstanceType<typeof Meta3DEngine>

export { type Meta3DEngineType, Meta3DEngine as default }
