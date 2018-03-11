import { queryBooks, getBook, addBook, updateBook, getChapters, addChapters, deleteBook } from '../services/book'
import { Toast } from 'antd-mobile'
import Router from 'next/router'
import {errorMsg} from '../utils'

export default {

    namespace: 'book',

    state: {
        bookList: [],
        chapterList: [],
        curChapter: {},
        curBook: {}
    },

    subscriptions: {
        setup({ dispatch, history }) {  // eslint-disable-line

        },
    },

    effects: {
        *queryBooks({ payload }, { call, put }) {
            const data = yield call(queryBooks, payload);
            if(data){
                yield put({ type:'setParam', payload:{bookList:data}});
                if(payload && payload.callback){ payload.callback(data) }
            }
        },
        *getBook({ payload }, { call, put }) {
            const data = yield call(getBook, payload);
            if(data){
                if(payload.callback) {
                    payload.callback(data);
                }else{
                    yield put({ type:'setParam', payload:{curBook:data}});
                }
            }
        },
        *addBook({ payload }, { call, put }) {
            const data = yield call(addBook, payload);
            if(data){
                yield put({ type:'setParam', payload:{bookList:data}});
                if(payload && payload.callback){ payload.callback(payload.book) }
            }
        },
        *updateBook({ payload }, { call, put }) {
            const data = yield call(updateBook, payload);
            if(payload.callback){
                payload.callback(data)
            }
        },
        *getChapters({ payload }, { call, put }) {
            const data = yield call(getChapters, payload);
            if(data){
                if(payload.callback) {
                    payload.callback(data);
                }else{
                    yield put({ type:'setParam', payload:{chapterList:data}});
                }
            }
        },
        *addChapters({ payload }, { call, put }) {
            const data = yield call(addChapters, payload);
            if(payload.callback){ payload.callback() }
        },
        *deleteBook({ payload }, { call, put }) {
            const data = yield call(deleteBook, payload);
            if(payload.callback){ payload.callback() }
        }
    },

    reducers: {
        setParam(state, {payload}) {
            return {...state, ...payload}
        }
    }
};
