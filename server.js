require('babel-register')
const express = require('express')
const next = require('next')
const LRUCache = require('lru-cache')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()


// 页面缓存配置，以减少服务器压力
const ssrCache = new LRUCache({
    max: 100,
    maxAge: 1000 * 60 * 60 // 1hour
});

// 代理配置
const devProxy = {
    '/api': {
        target: 'http://120.77.178.13:8001',
        pathRewrite: {'^/api': '/'},
        changeOrigin: true
    }
};

app.prepare()
.then(() => {
    const server = express()

    // 设置代理
    if (devProxy) {
        const proxyMiddleware = require("http-proxy-middleware");
        Object.keys(devProxy).forEach(function(context) {
            server.use(proxyMiddleware(context, devProxy[context]));
        });
    }

    /* 需要重定向的url，就需要在此设置 */
    const addServer = (url, actualPage) => {
        server.get(url, (req, res)=> {
            // app.render(req, res, actualPage, req.params)
            renderAndCache(req, res, actualPage, req.params)
        });
    };

    // 商品详情页
    addServer('/detail/:id', '/detail');

    /* 以根目录访问static静态文件 */
    const rootStaticFiles = [
        '/MP_verify_iIRTsgiWXoXc2egE.txt'
    ];
    for(let item of rootStaticFiles){
        server.get(item, (req, res) => (
            res.status(200).sendFile(item, {
                root: __dirname + '/static/',
                headers: {
                    'Content-Type': 'text/plain;charset=UTF-8',
                }
            })
        ));
    }

    // 其他页面
    server.all('*', (req, res) => handle(req, res));

    server.listen(port, (err) => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`)
    })
})
.catch((ex)=> {
    console.error(ex.stack);
    process.exit(0)
});

function getCacheKey (req) {
    return `${req.url}`
}

async function renderAndCache (req, res, pagePath, queryParams) {
    const key = getCacheKey(req)

    // If we have a page in the cache, let's serve it
    if (ssrCache.has(key)) {
        res.setHeader('x-cache', 'HIT')
        res.send(ssrCache.get(key))
        return
    }

    try {
        // If not let's render the page into HTML
        const html = await app.renderToHTML(req, res, pagePath, queryParams)

        // Something is wrong with the request, let's skip the cache
        if (res.statusCode !== 200) {
            res.send(html)
            return
        }

        // Let's cache this page
        ssrCache.set(key, html)

        res.setHeader('x-cache', 'MISS')
        res.send(html)
    } catch (err) {
        app.renderError(err, req, res, pagePath, queryParams)
    }
}