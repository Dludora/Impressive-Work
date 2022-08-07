const { defineConfig } = require('@vue/cli-service')
module.exports = {
    configureWebpack: {
        resolve: {
            fallback: { path: require.resolve('path-browserify'),
                        assert: require.resolve("assert/"),
                        crypto: require.resolve("crypto-browserify"),
                        os: require.resolve("os-browserify/browser"),
                        stream: require.resolve("stream-browserify"),
                        util: require.resolve("util/"),
                        fs: require.resolve('fs'),
                        child_process: require.resolve("child_process"),
                        rimraf: require.resolve("rimraf"),
            }
        }
    }
},
    defineConfig({
  transpileDependencies: true,
})
