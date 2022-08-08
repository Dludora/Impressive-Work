const { defineConfig } = require('@vue/cli-service')
module.exports = {
    configureWebpack: {
        resolve: {
            fallback: {
            }
        }
    }
},
    defineConfig({
  transpileDependencies: true,
})
