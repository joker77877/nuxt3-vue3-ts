import plugin from "tailwindcss/plugin"
import type { Config } from "tailwindcss"

export default {
  // corePlugins: {
  //   preflight: false
  // },
  content: [
    "components/**/*.{vue,js,ts}",
    "layouts/**/*.vue",
    "pages/**/*.vue",
    "composables/**/*.{js,ts}",
    "plugins/**/*.{js,ts}",
    "App.{js,ts,vue}",
    "app.{js,ts,vue}",
    "Error.{js,ts,vue}",
    "error.{js,ts,vue}",
    "content/**/*.md"
  ],
  theme: {
    extend: {
      colors: {
        blue: "#115ee8",
        green: "#0CC399",
        regular: "#232833"
      },
      borderRadius: {
        "3.5xl": "1.25rem"
      },
      lineHeight: {
        5.5: "22px"
      }
    },
    screens: {
      // sm: { min: "640px", max: "767px" },
      // // => @media (min-width: 640px and max-width: 767px) { ... }

      // md: { min: "768px", max: "1023px" },
      // // => @media (min-width: 768px and max-width: 1023px) { ... }

      // lg: { min: "1024px", max: "1199px" },
      // // => @media (min-width: 1024px and max-width: 1279px) { ... }

      // xl: { min: "1200px", max: "1559px" },
      // // => @media (min-width: 1280px and max-width: 1535px) { ... }

      // "2xl": { min: "1560px", max: "1919px" },
      // "3xl": { min: "1920px", max: "1919px" },
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1190px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1560px",
      // => @media (min-width: 1536px) { ... }

      "3xl": "1920px",
      // => @media (min-width: 1920px) { ... }

      "4xl": "2400px"
      // => @media (min-width: 2400px) { ... }
    }
  },
  plugins: [
    plugin(({ addUtilities, addComponents }) => {
      addComponents({
        ".detail-width": {
          maxWidth: "1512px",
          minWidth: "1200px"
        }
      })
      addUtilities({
        ".flex-col-items-center": {
          display: "flex",
          "flex-direction": "column",
          "align-items": "center"
        },
        ".mita-border-dashed": {
          border: "1px dashed #EBEEF5"
        },
        ".mita-border": {
          border: "1px solid #EBEEF5"
        },
        ".mita-border-l": {
          borderLeft: "1px solid #EBEEF5"
        },
        ".mita-border-r": {
          borderRight: "1px solid #EBEEF5"
        },
        ".mita-border-t": {
          borderTop: "1px solid #EBEEF5"
        },
        ".mita-border-b": {
          borderBottom: "1px solid #EBEEF5"
        },
        ".flex-col-justify-center": {
          display: "flex",
          "flex-direction": "column",
          "justify-content": "center"
        },
        ".flex-col-center": {
          display: "flex",
          "flex-direction": "column",
          "align-items": "center",
          "justify-content": "center"
        },
        ".flex-center": {
          display: "flex",
          "align-items": "center",
          "justify-content": "center"
        },
        ".flex-items-center": {
          display: "flex",
          "align-items": "center"
        },
        ".flex-justify-center": {
          display: "flex",
          "justify-content": "center"
        },
        ".mita-border-color": {
          "border-color": "var(--el-border-color)"
        },
        ".mita-bg-gray": {
          "background-color": "#F5F5F5"
        },
        ".mita-text-grey": {
          color: "#999999"
        },
        ".mita-text-grey-nd": {
          color: "#666666"
        },
        ".text-10": {
          "transform-origin": "left center",
          transform: "scale(calc(10/14))"
        },
        ".el-button-h-48": {
          "--el-button-size": "48px"
        },
        ".mita-text-regular": {
          color: "var(--el-text-color-regular)"
        },
        ".mita-text-red": {
          color: "#E54850"
        },
        ".app-container": {
          ".el-button-bg-white": {
            "--el-button-hover-text-color": "var(--el-color-primary)",
            "--el-button-bg-color": "#ffffff",
            "--el-button-hover-bg-color": "#ffffff",
            "--el-button-border-color": "var(--el-color-primary)",
            "--el-button-text-color": "var(--el-color-primary)"
          }
        },
        ".text-hidden": {
          overflow: "hidden",
          "text-overflow": "ellipsis",
          "white-space": "nowrap"
        }
      })
    })
  ]
} satisfies Config
