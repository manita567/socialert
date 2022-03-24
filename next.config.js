const webpack = require('webpack') 
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

const dotenv = require('dotenv').config({
  path: `${process.cwd()}/.${process.env}.env`
})

// withBundleAnalyzer({}),
module.exports = {
  webpack(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(dotenv))
    return config
  }
}