import React from 'react'
import dva  from 'dva'
import createLoading from 'dva-loading'
import lodash from 'lodash'
import Head from 'next/head'
import '../static/css/main.less'

import NProgress from 'nprogress'
import Router from 'next/router'

//引入页面跳转状态条
Router.onRouteChangeStart = (url) => {
    console.log(`Loading: ${url}`);
    NProgress.start()
};
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

export default ({models, component, cssFiles}) => {
    const app = dva({
        ...createLoading()
    });
    (models||[]).map( model => {
        //需深度克隆model，不然dva内会同步修改外部的model
        app.model(lodash.cloneDeep(model))
    });
    app.router(() => {
        if(cssFiles && cssFiles.length>0){
            return (
                <div>
                    <Head>
                        <title>小说阅读</title>
                        {cssFiles.map( (css,i) => (
                            <link key={i} rel='stylesheet' type='text/css' href={`/static/css/${css}.css`} />
                        ))}
                    </Head>
                    {component}
                </div>
            )
        }
        return component
    });

    return app;
}
