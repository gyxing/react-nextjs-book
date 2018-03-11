const express = require('express');
const proxy = require('http-proxy-middleware');

const app = express();

//指定启动服务器到哪个文件夹，我这边指的是dist文件夹
app.use(express.static('./dist'));

const apiProxy = proxy('/api', { target: 'http://120.77.178.13:8001',changeOrigin: true, pathRewrite: {'^/api': '/'} });//将服务器代理到localhost:8080端口上[本地服务器为localhost:3000]
app.use('/api/*', apiProxy);//api子目录下的都是用代理

// Render your site
app.get('/', function(req,res){
    res.sendFile(__dirname+'/dist/index.html');
});
app.get('/detail', function(req,res){
    res.sendFile(__dirname+'/dist/detail/index.html');
});
app.get('/read', function(req,res){
    res.sendFile(__dirname+'/dist/read/index.html');
});
app.get('/search', function(req,res){
    res.sendFile(__dirname+'/dist/search/index.html');
});

//监听端口为3000
const server = app.listen(3000, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});