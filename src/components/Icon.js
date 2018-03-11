import React from 'react'
import { Icon } from 'antd-mobile'

/**
 * 作用同 antd-mobie的Icon
 *
 * @param type  内置的名称 或 svg文件名
 * @param className  样式名
 * @param size  大小
 * @param color  颜色，只对非内置图标有效
 * @param internal  是否使用antd-mobile内置的图标
 * @constructor
 */
export default ({ type, className = '', size = 'md', internal, color = '#000',  ...restProps }) => {
    //使用内置的图标
    if(internal){
        return <Icon type={type} size={size} color={color} />
    }
    // return <span>{type}</span>
    //使用外部svg图标
    let svgObj = require(`../../static/svg/${type}.svg`);
    return (
        <span style={{display:'inline-block', verticalAlign:'middle', color:color, lineHeight:0}}>
            <svg className={`am-icon am-icon-${svgObj.substr(1)} am-icon-${size} ${className}`} {...restProps}>
                <use xlinkHref={svgObj}/>
            </svg>
        </span>
    )
};
