import React from 'react'
import Router from 'next/router'
import copy from 'copy-to-clipboard';
import {Icon, Header} from '../../src/components'

export default () => (
    <div style={{position:'fixed',top:0,width:'100%',height:'100%',backgroundColor:'#fff',overflowY:'auto'}}>
        <Header theme="white" title="SVG 图标展示" left={(
            <div className="click" onClick={()=>Router.push('/')}>
                <Icon type="left" color="#bbb" size="lg" internal={true} />
            </div>
        )} />
        <div style={{display:'flex',flexWrap:'wrap'}}>
            {svgFiles.map((item, i) => (
                <div
                    key={i}
                    onClick={ () => copy(item) }
                    className="click"
                    style={{margin:'15px 0',width:'25%',textAlign:'center',color:'#444'}}
                >
                    <svg style={{width: 30, height: 30, fill:'currentColor'}}>
                        <use xlinkHref={require(`../../static/svg/${item}.svg`)}/>
                    </svg>
                    <div style={{color:'#666',fontSize:14,marginTop:8}}>{item}</div>
                </div>
            ))}
        </div>
    </div>
)

/* svg图标名称集合，是依据于static/svg文件夹里面的 */
const svgFiles = [
    'add'
];