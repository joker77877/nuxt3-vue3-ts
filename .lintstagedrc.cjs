const fs = require("fs")
const JSON5 = require("json5")
const generateTSConfig = (fileName, type) => {
  const tsconfig = JSON5.parse(fs.readFileSync("tsconfig.json", "utf8"))
  const nuxtTsconfig = JSON5.parse(fs.readFileSync(".nuxt/tsconfig.json", "utf8"))
  // console.log(...nuxtTsconfig.include)
  const include = [...nuxtTsconfig.include, ...fileName]
  tsconfig.include = include
  fs.writeFileSync("tsconfig.lint.json", JSON.stringify(tsconfig))
  return `${type} --noEmit --project tsconfig.lint.json`
}

module.exports = {
  "**/*{js,jsx,ts,tsx,vue}": ["prettier --write --ignore-path ./.prettierignore", "eslint --fix"],
  "**/*{css,less,scss,vue}": ["stylelint --fix"]
  // "**/*.{ts,tsx}": [(fileName) => generateTSConfig(fileName, "tsc")],
  // "**/*.vue": [(fileName) => generateTSConfig(fileName, "vue-tsc")]
}
