'use strict'
const fs = require('fs')
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const envConfig = require('../config/static.env.js')
const { VueLoaderPlugin } = require('vue-loader')
const vueLoaderConfig = require('./vue-loader.conf')
const namespace = envConfig.namespace || 'static_'
const entries = envConfig.entries || {}
const output = envConfig.output
const entry = {}
const include = []

Object.keys(entries).forEach(entryName => {
  const entryFile = entries[entryName]
  entry[namespace + entryName] = entryFile
  include.push(entryFile)
})

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const outpath = path.resolve(__dirname, config.build.assetsRoot, config.build.assetsSubDirectory, output)
const rules = [
  {
    test: /\.vue$/,
    loader: 'vue-loader',
    options: vueLoaderConfig
  },
  {
    test: /\.js$/,
    loader: 'babel-loader?cacheDirectory',
    include
  },
  {
    test: /\.svg$/,
    loader: 'svg-sprite-loader',
    include: [resolve('src/icons')],
    options: {
      symbolId: 'icon-[name]'
    }
  },
  {
    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    loader: 'url-loader',
    exclude: [resolve('src/icons')],
    options: {
      limit: 10000,
      name: utils.assetsPath('img/[name].[hash:7].[ext]')
    }
  },
  {
    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: utils.assetsPath('media/[name].[hash:7].[ext]')
    }
  },
  {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
    }
  }
]
rules.push(...utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true }))

module.exports = {
  mode: 'development',
  devtool: config.dev.devtool,
  entry,
  output: {
    path: outpath,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('src')
    }
  },
  module: { rules },
  plugins: [
    new VueLoaderPlugin()
  ]
}
