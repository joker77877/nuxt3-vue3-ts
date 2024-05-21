// uno.config.ts
// import fs from "node:fs/promises"
import { defineConfig, presetIcons, presetUno } from "unocss"
import transformerDirectives from "@unocss/transformer-directives"
import { FileSystemIconLoader } from "@iconify/utils/lib/loader/node-loaders"

export default defineConfig({
  // rules: [
  //   ["mita-text-regular", { color: "var(--el-text-color-regular)" }],
  //   [
  //     "flex-col-items-center",
  //     {
  //       display: "flex",
  //       "flex-direction": "column",
  //       "align-items": "center"
  //     }
  //   ],
  //   [
  //     "flex-col-justify-center",
  //     {
  //       display: "flex",
  //       "flex-direction": "column",
  //       "justify-content": "center"
  //     }
  //   ],
  //   [
  //     "flex-col-center",
  //     {
  //       display: "flex",
  //       "flex-direction": "column",
  //       "align-items": "center",
  //       "justify-content": "center"
  //     }
  //   ],
  //   [
  //     "flex-center",
  //     {
  //       display: "flex",
  //       "align-items": "center",
  //       "justify-content": "center"
  //     }
  //   ],
  //   [
  //     "flex-items-center",
  //     {
  //       display: "flex",
  //       "align-items": "center"
  //     }
  //   ],
  //   [
  //     "flex-justify-center",
  //     {
  //       display: "flex",
  //       "justify-content": "center"
  //     }
  //   ],
  //   [
  //     "mita-border-color",
  //     {
  //       "border-color": "var(--el-border-color)"
  //     }
  //   ],
  //   [
  //     "mita-bg-gray",
  //     {
  //       "background-color": "#F5F5F5"
  //     }
  //   ],
  //   [
  //     "mita-text-grey",
  //     {
  //       color: "#999999"
  //     }
  //   ],
  //   [
  //     "mita-text-grey-nd",
  //     {
  //       color: "#666666"
  //     }
  //   ],
  //   [
  //     "text-10",
  //     {
  //       "transform-origin": "left center",
  //       transform: "scale(calc(10/14))"
  //     }
  //   ],
  //   [
  //     "el-button-h-48",
  //     {
  //       "--el-button-size": "48px"
  //     }
  //   ],
  //   [
  //     "mita-text-regular",
  //     {
  //       color: "var(--el-text-color-regular)"
  //     }
  //   ],
  //   [
  //     "mita-text-red",
  //     {
  //       color: "#E54850"
  //     }
  //   ],
  //   [
  //     "app-container .el-button-bg-white",
  //     {
  //       "background-color": "#ffffff",
  //       "--el-button-hover-text-color": "var(--el-color-primary)",
  //       "--el-button-border-color": "var(--el-color-primary)",
  //       "--el-button-text-color": "var(--el-color-primary)"
  //     }
  //   ],
  //   [
  //     "text-hidden",
  //     {
  //       overflow: "hidden",
  //       "text-overflow": "ellipsis",
  //       "white-space": "nowrap"
  //     }
  //   ]
  // ],
  // transformers: [transformerDirectives()],
  presets: [
    // presetUno(),
    presetIcons({
      collections: {
        // a helper to load icons from the file system
        // files under `./assets/icons` with `.svg` extension will be loaded as it's file name
        // you can also provide a transform callback to change each icon (optional)
        mita: FileSystemIconLoader(
          "./assets/icons"
          // (svg) => svg.replace(/stroke="(\S+)"/, "stroke='currentColor'")
          // .replace(/fill="none"/, 'fill="currentColor" ')
        )
      }
    })
  ]
})
