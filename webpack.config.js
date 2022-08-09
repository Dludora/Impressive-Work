//
var webpack = require('webpack')
//
'use strict'
const path = require('path')
const utils = require('./utils')

module.export = {
    module: {
        rules: [
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass']
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $:'jquery',
            jQuery:"jquery",
            "windows.jQuery":'jquery'
        })
    ],
}