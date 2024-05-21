module.exports = {
  apps: [
    {
      name: "mita3d",
      port: "8000",
      exec_mode: "cluster",
      instances: "max",
      script: "./.output/server/index.mjs"
    }
  ]
}
