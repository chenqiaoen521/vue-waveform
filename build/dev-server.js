require('./check-versions')()
var request = require("request")
var config = require('../config')
var fs = require('fs')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}
var myconfig = require('./host.config')
var bodyParser = require('body-parser')
var multipart = require('connect-multiparty')

var multipartMiddleware = multipart()

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')
var axios = require('axios')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()

app.use(bodyParser.urlencoded({ extended: false }))
var apiRoutes = express.Router()
apiRoutes.get('/d1', function (req, res, next) {
  const url = req.query.url;
  delete req.query.url;
  axios.get(url, {
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((err) => {
    if (err.response) {
      res.json(err.response)
    } else {
      res.json({code: err.code, error: err.errno})
    }
  })
})

apiRoutes.post('/d2',multipartMiddleware, function (req, res) {
  var r = request.post(req.body.url, function(err, resp, body){
    if (err) {
      if (err.response) {
        res.json(err.response)
      } else {
        res.json({code: err.code, error: err.errno})
      }
    }
    res.json(body)
  })
  delete req.body.url
  var form = r.form()
  if (req.body.stamps || req.body.stamps === '') {
    try {
        if( req.body.stamps === '') {
          req.body.stamps = []
        } else {
          req.body.stamps = [JSON.parse(req.body.stamps)]
        }
    } catch (e) {
    }
    
  }
  console.log(JSON.stringify(req.body))
  form.append('jsoninfo', JSON.stringify(req.body))
  for (let [key, value] of Object.entries(req.files)) {
    form.append(key,  fs.createReadStream(value.path), {filename: value.name})
  }})
app.use('/sdk', apiRoutes)
app.post('/ReturnComparedResult', multipartMiddleware, function (req, res, next){
  const {WSBH, BMSAH, JSRGH, JSRXM, XXNR, SFTSZXT, URL} = req.body
  if (!WSBH) {
    res.json({Flag: 0, Messages: '文书编号不能为空'})
    return
  }
  if (!BMSAH) {
    res.json({Flag: 0, Messages: '部门受案号不能为空'})
    return
  }
  if (!JSRGH) {
    res.json({Flag: 0, Messages: '接收人工号不能为空'})
    return
  }
  if (!JSRXM) {
    res.json({Flag: 0, Messages: '接收人姓名不能为空'})
    return
  }
  if (!XXNR) {
    res.json({Flag: 0, Messages: '消息内容不能为空'})
    return
  }
  console.log()
  if (!SFTSZXT || (SFTSZXT != 0 && SFTSZXT != 1)) {
    res.json({Flag: 0, Messages: '是否推送流程子系统不能为空或参数不正确'})
    return
  }
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
  res.json({Flag: 1, Messages: '成功'})
})

var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    // opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
