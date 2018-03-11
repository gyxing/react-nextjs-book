import React  from 'react'
import {NavBar} from 'antd-mobile'
import Icon from './Icon'
import Router from 'next/router'
import '../../static/css/components.less'

export default ({back, left, children, title, right, theme='white', style={}}) => {

    return (
        <div className="dd-header" style={style}>
            {back? (
                <div className="dd-header-left" onClick={()=>Router.back()} style={{lineHeight:0}}>
                    <Icon type="left" color={theme==='red'?'#ddd':'#bbb'} size="lg" internal={true} />
                </div>
            ) : (left? <div className="dd-header-left">{left}</div> : null)}
            <div className="dd-header-center">{children || title}</div>
            {back || left || right? <div className="dd-header-right">{right}</div> : null}
        </div>
    )
}
