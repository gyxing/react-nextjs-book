import React from 'react'
import '../../static/css/components.less'

/**
 * 页面固定底部容器
 *
 * @param children      element
 * @param style         object，自定义内嵌样式
 * @param className     string，自定义类名
 * @param onClick       function，点击事件
 */
export default ({ children, style={}, className='', onClick=null }) => {

    return (
        <div className={`dd-footer`}>
            <div
                className={`dd-footer-box ${className} ${onClick?'click':''}`}
                onClick={onClick}
                style={style}
            >
                {children}
            </div>
        </div>
    )

}
