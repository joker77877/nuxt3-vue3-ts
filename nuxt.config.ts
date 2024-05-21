// import https from "@vitejs/plugin-basic-ssl"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { FileSystemIconLoader } from "unplugin-icons/loaders"
import IconsResolver from "unplugin-icons/resolver"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"

const PROXY_URL = "http://192.168.110.191:48087"
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  routeRules: {
    "/limited/edit": { ssr: false }
  },
  runtimeConfig: {
    public: {}
  },
  app: {
    head: {
      title: { textContent: "Mita3D" }
    }
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        verbatimModuleSyntax: false,
        experimentalDecorators: true
      }
    }
  },
  nitro: {
    // preset: "node_cluster",
    compressPublicAssets: {
      gzip: true,
      brotli: true
    }
  },
  // build: {},
  plugins: [
    {
      src: "~/plugins/wangEditor",
      mode: "client"
    }
  ],
  // components: [
  //   { path: "~/components", extensions: ["vue"], pathPrefix: false },
  //   { path: "~/pages", pathPrefix: false }
  // ],
  antd: {
    extractStyle: true
    // icons: false
  },
  tailwindcss: {
    cssPath: ["~/assets/styles/tailwind.css", { injectPosition: "last" }],
    viewer: true
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    // "@unocss/nuxt",
    // "@nuxtjs/svg-sprite",
    "@nuxt/image",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore"]
      }
    ],
    "@pinia-plugin-persistedstate/nuxt",
    "@ant-design-vue/nuxt",
    "@element-plus/nuxt",
    [
      "unplugin-icons/nuxt",
      {
        customCollections: {
          icon: FileSystemIconLoader("assets/icons")
        },
        // iconCustomizer(_collection: any, _icon: any, props: any) {
        //   props.width = "2em"
        //   props.height = "2em"
        // },
        transform(svg: any) {
          const colors = svg.match(/(?<=(fill|stroke)=")[^n].*?(?=")/g) || []
          const { size } = new Set(colors)
          let newSvg = svg
          if (size === 1) {
            newSvg = svg.replace(/fill="[^n].+?"/g, `fill="currentColor"`)
            newSvg = newSvg.replace(/stroke="[^n].+?"/g, `stroke="currentColor"`)
          }
          return newSvg
        }
      }
    ]
  ],

  // svgSprite: {
  // input: "~/assets/icons/"
  // output: "~/assets/icons/gen/"
  // },
  components: false,
  css: ["@/assets/styles/common.scss", "@/assets/styles/element.scss", "@/assets/styles/antd-vue.scss"],
  postcss: {
    plugins: {
      "tailwindcss/nesting": {},
      // tailwindcss: {},
      autoprefixer: {}
    }
  },
  // imports: {
  //   autoImport: true,
  //   dirs: ["config/**", "composables/**", "enums/**", "api/**", "stores/**", "utils/**", "constants/**", "bus/**"]
  // },
  vite: {
    resolve: {
      alias: {
        "ant-design-vue/dist": "ant-design-vue/dist",
        "ant-design-vue/es": "ant-design-vue/es",
        "ant-design-vue/lib": "ant-design-vue/es",
        "ant-design-vue": "ant-design-vue/es"
      }
    },
    // optimizeDeps: {
    //   include: ["dayjs", "dayjs/plugin/*", "element-plus"]
    // },
    plugins: [
      Components({
        dirs: ["components", "pages/**/components/**"],
        dts: true,
        resolvers: [
          ElementPlusResolver({ importStyle: "sass" }),
          IconsResolver({
            prefix: false,
            customCollections: ["icon"]
          })
        ]
      }),
      AutoImport({
        include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/],
        dts: "./auto-imports.d.ts",
        imports: [
          "vue",
          "vue-router",
          "pinia",
          {
            vue: ["isVNode"],
            "@vueuse/core": ["useMouse", "useFullscreen", ["useStorage", "useMyStorage"]],
            "vue-router": ["createRouter", "createWebHistory"],
            "ant-design-vue": ["Form"],
            "vue-request": ["useRequest", "setGlobalOptions", ["usePagination", "useMyPagination"]],
            // "@/api": [["default", "http"]],
            "@/bus": [["default", "$bus"]],
            "lodash-es": ["debounce", "cloneDeep", "forEach", "omit", "isNil", "isNumber"],
            axios: [["default", "axios"]]
          },
          {
            from: "vue-router",
            imports: ["RouteRecordRaw", "RouteRecordName"],
            type: true
          },
          {
            from: "vue",
            imports: ["CSSProperties", "Directive", "DirectiveBinding", "VNodeArrayChildren"],
            type: true
          },
          {
            from: "ofetch",
            imports: ["FetchResponse", "SearchParameters", "FetchOptions"],
            type: true
          },
          {
            from: "element-plus",
            imports: [
              "TabsPaneContext",
              "UploadRequestOptions",
              "UploadUserFile",
              "UploadRawFile",
              "UploadInstance",
              "FormInstance",
              "FormItemInstance",
              "FormRules"
            ],
            type: true
          },
          {
            from: "ant-design-vue",
            imports: ["UploadProps", "UploadFile", "MenuProps"],
            type: true
          },
          {
            from: "ant-design-vue/es/form",
            imports: ["Rule"],
            type: true
          },
          {
            from: "ant-design-vue/es/button",
            imports: ["ButtonType"],
            type: true
          },
          {
            from: "axios",
            imports: ["AxiosInstance", "AxiosError", "AxiosRequestConfig", "InternalAxiosRequestConfig", "AxiosResponse"],
            type: true
          }
        ],
        dirs: [
          "config/**",
          "composables/**",
          "enums/**",
          "api/**",
          "stores/**",
          "utils/**",
          "constants/**",
          "bus/**",
          "components/**",
          "pages/**/components/**"
        ],
        vueTemplate: true,
        resolvers: [
          // ElementPlusResolver({ importStyle: "sass", ssr: true }),
          IconsResolver({
            prefix: false,
            enabledCollections: ["icon"]
          })
        ]
      })
    ],
    css: {
      preprocessorOptions: {
        scss: { additionalData: '@use "@/assets/styles/var.scss" as *; @use "@/assets/styles/element-var.scss" as *;' }
      }
    },
    server: {
      // https,
      proxy: {
        "^/app-api": {
          // target: "http://192.168.110.100:48087",
          target: PROXY_URL,
          ws: true,
          changeOrigin: true
        }
      }
    },
    esbuild: {
      pure: ["console.log"],
      drop: ["debugger"]
    },
    // build: {
    //   rollupOptions: {
    //     output: {
    //       entryFileNames: "assets/js/[name][hash].js",
    //       chunkFileNames: "assets/js/[name][hash].js",
    //       assetFileNames: "assets/[ext]/[name][hash].[ext]"
    //       // manualChunks: {
    //       //   "@babylonjs/core": ["@babylonjs/core"],
    //       //   "@babylonjs/loaders": ["@babylonjs/loaders"],
    //       //   "@babylonjs/materials": ["@babylonjs/materials"]
    //       // }
    //     }
    //   }
    // }
    build: {
      cssCodeSplit: false
      // rollupOptions: {
      //   output: {
      //     assetFileNames: "[name]-[hash][extname]",
      //     chunkFileNames: "[name][hash].js"
      //   }
      // }
    }
  },
  elementPlus: { importStyle: "scss", icon: "ElIcon" },
  // unocss: {
  //   uno: false,
  //   icons: true
  // }
  devServer: {
    host: "0.0.0.0",
    port: 3000
  }
})

