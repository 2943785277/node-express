
const express = require('express')
const app = express()

module.exports = function () {
  console.log('这里是route config')
  const index = require('../routes/web/index')
  const photoView = require('../routes/api/photo/photo_view')
  app.use('/', index)
  app.use('/photo_view', photoView)
}
