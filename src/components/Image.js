import React from 'react'

/**
 * 作用同img，避免img给定长宽时会变形
 *
 * @param source={uri,src}     object，图片地址，
 *                              uri是相对地址，需要拼接，src是详细地址，二选一，优先src
 * @param width         number/string，长
 * @param height        number/string，宽
 * @param square        boolean，正方形，长宽是否要等比例，若true，则height参数无效
 * @param resize        number/string，图片压缩值
 * @param className     string，自定义类名
 * @param style         object，自定义内嵌样式
 * @param children      element
 * @returns {XML}
 */
export default ({ source={}, width='auto', height='auto', square=false, className='', style={}, children, resize }) => {

    let squareStyle = square ? {paddingTop:width} : {height};

    let url = '';
    if( !source.src && !source.uri ){
        url = `/static/images/img-error.png`;
    }else {
        url = (source.src || `/static/images/${source.uri}`) + (resize ? `?x-oss-process=image/resize,m_lfit,w_${resize}` : '');
    }
    //组合内嵌样式
    let comboStyle = {
        background:`url(${url}) no-repeat 50% 50% / cover`,
        display: "inline-block",
        position: 'relative',
        backgroundColor: '#f9f9f9',
        width,
        ...squareStyle,
        ...style
    };

    return <div className={className} style={comboStyle} >{children}</div>
}
