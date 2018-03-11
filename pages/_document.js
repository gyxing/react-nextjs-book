import React from 'react'
import Document, {Head, Main, NextScript} from 'next/document'

/**
 * 自定义html模板
 */
export default class extends Document {

    render() {
        return (
            <html data-scale="true">
            <Head>
                <meta name="viewport"
                      content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=0"/>
                <title>小说阅读</title>
                <link href="/static/images/favicon.ico" rel="shortcut icon"/>
                <link rel='stylesheet' type='text/css' href='//unpkg.com/antd-mobile/dist/antd-mobile.min.css' />
                <link rel='stylesheet' type='text/css' href='/static/css/nprogress.css'/>
                <link rel="stylesheet" href="/_next/static/style.css" />
            </Head>
            <body style={{margin:0,position:'absolute',width:'100%',height:'100%',backgroundColor:'#fff'}}>
            <Main />
            <NextScript />
            </body>
            </html>
        )
    }
}