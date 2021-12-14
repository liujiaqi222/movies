// npm i -g cnpm --registry=https://registry.npm.taobao.org

const express = require('express');
const  { createProxyMiddleware }  = require('http-proxy-middleware');

const app = express();

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Headers', 'mytoken');
  next();
});

const url = 'https://api.wmdb.tv/api/v1/movie/search?q='

let options = { target: url, changeOrigin: true };

app.get('/api', (req, res,next) => {
  options.target = url + encodeURIComponent(req.query.query);
  const apiProxy = createProxyMiddleware(options);
  apiProxy(req, res,next);
});




app.listen(3000, () => {
  console.log('running at http://localhost:3000');
});


