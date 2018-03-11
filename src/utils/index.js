/**
 * 工具类
 */
import React from 'react';
import lodash from 'lodash'
import {Toast} from 'antd-mobile'

/* 请求时返回的错误信息 */
const errorMsg = (err, callback) => {
    try{
        err.response.json().then( ({msg}) => {
            if(callback){
                callback(msg);
            }else{
                Toast.fail(msg)
            }
        })
    }catch(e){}
};

const removeTag = (str) => {
    return str.replace(/<.*?>/ig,"");
};

const replaceAll = (str, s1, s2) => {
    let reg = new RegExp(s1,"g");
    return str.replace(reg, s2);
};

const getHtmlObject = (html, tag) => {
    let reg = new RegExp(`<${tag}>[\\s\\S]*?<\\/${tag}>`,'ig');
    return html.match(reg);
};

const getHtmlObjectSimple = (html, tag) => {
    let reg = new RegExp(`<${tag}.*?>`, 'ig');
    return html.match(reg);
};

const getHtmlObjectLong = (html, start, end) => {
    let reg = new RegExp(`<${start}.*?>[\\s\\S]*?<\\/${end}>`,'ig');
    return html.match(reg);
};

const fullScreen = (element) => {
    if(element.requestFullScreen) {
        element.requestFullScreen();
    } else if(element.webkitRequestFullScreen ) {
        element.webkitRequestFullScreen();
    } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    }
};

const getUrlParameter = (name) => {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r !== null)
        return unescape(decodeURIComponent(r[2]));
    return null;
};

module.exports = {
    errorMsg,
    removeTag,
    replaceAll,
    getHtmlObject,
    getHtmlObjectSimple,
    getHtmlObjectLong,
    fullScreen,
    getUrlParameter
};