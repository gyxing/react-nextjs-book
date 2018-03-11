import { search } from '../services/book'
import { Toast } from 'antd-mobile'
import Router from 'next/router'
import {parse} from 'qs';
import {errorMsg, getHtmlObjectLong, removeTag, getHtmlObject, replaceAll} from '../utils'

export default {

    namespace: 'reptile',

    state: {
        searchList: [],    // 搜索结果
    },

    subscriptions: {
        setup({ dispatch, history }) {  // eslint-disable-line

        },
    },

    effects: {
        *search({ payload }, { call, put }) {
            let url = `//www.qidian.com/search?kw=${encodeURIComponent(payload.keyword)}&page=${payload.page||1}`;
            const {data, err} = yield call(search, {url});
            if(!err){
                let imgHTML = getHtmlObjectLong(data, 'div class="book-img-box"', 'div');
                let infoHTML = getHtmlObjectLong(data, 'div class="book-mid-info"', 'div');

                let searchList = [];
                imgHTML? imgHTML.map( (item,i) => {
                    let img = item.substring(item.indexOf('src="')+5, item.indexOf('"></a>'));
                    // let url = item.substring(item.indexOf('href="')+6, item.indexOf('" target'));
                    let name = removeTag(getHtmlObjectLong(infoHTML[i], 'h4', 'h4')[0]);
                    let info = removeTag(getHtmlObjectLong(infoHTML[i], 'p class="author"', 'p')[0]).split('|');
                    let author = info[0].trim();
                    let type = info[1].trim();
                    let status = info[2].trim();
                    let desc = removeTag(getHtmlObjectLong(infoHTML[i], 'p class="intro"', 'p')[0]).trim();

                    searchList.push({img, name, author, type, status, desc})
                }) : '';

                yield put({ type:'setParam', payload:{searchList}});
            }else{
                errorMsg(err, () => Toast.fail('请稍后再试'))
            }
        },
        *queryChapters({ payload }, { call, put }) {
            let {book, onSuccess, onError} = payload;
            try {
                let url = `http://zhannei.baidu.com/cse/search?s=1393206249994657467&q=${encodeURIComponent(book.name)}`;
                const {data, err} = yield call(search, {url});
                let booksHtml = getHtmlObjectLong(data, 'div class="result-game-item-detail"', 'div');
                if (booksHtml.length > 0) {
                    for (let div of booksHtml) {
                        let name = div.substring(div.indexOf('title="') + 7, div.indexOf('" class='));//书名
                        let chaptersUrl = div.substring(div.indexOf('href="') + 6, div.indexOf('" title='));//章节列表url
                        let author = removeTag(getHtmlObject(div, 'span')[0]).trim();//作者

                        if (name === book.name && author === book.author) {
                            const res = yield call(search, {url: `${chaptersUrl}?t=${new Date().getTime()}`});
                            let chapterList = [];
                            let chaptersHtml = getHtmlObjectLong(res.data, 'dd', 'dd');
                            if (chaptersHtml.length > 0) {
                                for (let dd of chaptersHtml) {
                                    let chUrl = dd.substring(dd.indexOf('href="') + 6, dd.indexOf('">'));
                                    if(chUrl.startsWith('/')){
                                        chapterList.push({
                                            url: chUrl,
                                            name: removeTag(dd).trim()
                                        });
                                    }
                                }
                            }
                            book.url = chaptersUrl;
                            onSuccess({book, chapterList});
                            return;
                        }
                    }
                }
            }catch (e){}
            onError()
        },
        *getContent({ payload }, { call, put }) {
            let {chapter, callback} = payload;
            const {data, err} = yield call(search, {url:`http://www.xs.la/${chapter.url}`});
            if(data){
                let list = getHtmlObjectLong(data, 'div id="content"', 'div');
                let content = removeTag(replaceAll(list[0].replace('<br/>','\n'), '<br/>', '\n'));
                content = replaceAll(content, '&nbsp;', '').trim();
                chapter.content = content;
                if(callback){ callback(chapter) }
            }
        },
        *getChapters({ payload }, { call, put }) {
            let {book, onSuccess} = payload;
            console.log(book.name)
            const {data, err} = yield call(search, {url: `${book.url}?t=${new Date().getTime()}`});
            let chapterList = [];
            let chaptersHtml = getHtmlObjectLong(data, 'dd', 'dd');
            if (chaptersHtml.length > 0) {
                for (let dd of chaptersHtml) {
                    let chUrl = dd.substring(dd.indexOf('href="') + 6, dd.indexOf('">'));
                    if(chUrl.startsWith('/')){
                        chapterList.push({
                            url: chUrl,
                            name: removeTag(dd).trim()
                        });
                    }
                }
            }
            if(onSuccess) onSuccess(chapterList);
        }
    },

    reducers: {
        setParam(state, {payload}) {
            return {...state, ...payload}
        }
    },

};
