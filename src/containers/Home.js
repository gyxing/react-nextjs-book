import React, {Component} from 'react'
import {connect} from 'dva'
import Link from 'next/link'
import Router from 'next/router'
import {Toast, Modal} from 'antd-mobile'
import {Header, Icon, Image} from '../components'

let timeOutEvent = 0;

@connect(({book, loading}) => ({book, loading}))
export default class extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        Router.prefetch('/detail');
        Router.prefetch('/read');
        this.props.dispatch({type:'book/queryBooks', payload: {
            callback: (bookList) => {
                bookList.map( book => {
                    if(book.chapters && book.chapters.length > 0) {
                        this.props.dispatch({
                            type: 'reptile/getChapters', payload: {
                                book,
                                onSuccess: (chapterList) => {
                                    let {chapters} = book, flag = false;
                                    chapterList.map(chp => {
                                        let temp = chapters.filter(item => item.name === chp.name);
                                        if (temp.length === 0) {
                                            flag = true;
                                            book.chapters.push(chp)
                                        }
                                    });
                                    if (flag) {
                                        book.hasNew = true;
                                        this.props.dispatch({
                                            type: 'book/updateBook', payload: {
                                                book,
                                                callback: (res) => {
                                                    this.props.dispatch({type: 'book/queryBooks'})
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        })
                    }
                });
            }
        }});
    }

    onGoRead = (item) => {
        if(!item.chapters || item.chapters.length === 0){
            Toast.loading('初次阅读，正在加载章节列表...', 0);
            this.props.dispatch({type:'reptile/queryChapters', payload:{
                book: item,
                onSuccess: ({book, chapterList}) => {
                    this.props.dispatch({type:'book/updateBook', payload:{
                        book: {
                            ...book,
                            chapters: chapterList,
                            hasNew: false
                        },
                        callback: (res) => {
                            Router.push(`/read?name=${res.name}`);
                            Toast.hide();
                        }
                    }});
                },
                onError: () => {
                    Toast.hide();
                    console.log('error')
                }
            }})
        }else{
            this.props.dispatch({type:'book/updateBook', payload:{
                book: {...item, hasNew: false},
                callback: (res) => {
                    Router.push(`/read?name=${item.name}`)
                }
            }});
        }
    };

    onItemTouchStart = (event, item) => {
        timeOutEvent = setTimeout(()=>{
            timeOutEvent = 0;
            Modal.operation([
                { text: '详情', onPress: () => {
                    sessionStorage.setItem('bookDetail', JSON.stringify(item));
                    Router.push('/detail')
                }},
                { text: '删除', onPress: () => {
                    this.props.dispatch({type:'book/deleteBook', payload:{
                        bookName: item.name,
                        callback: () => {
                            this.props.dispatch({type:'book/queryBooks'})
                        }
                    }});
                }},
            ])
        },500);
        event.preventDefault();
    };

    onItemTouchMove = () => {
        clearTimeout(timeOutEvent);
        timeOutEvent = 0;
    };

    onItemTouchEnd = (item) => {
        clearTimeout(timeOutEvent);
        if(timeOutEvent !== 0){
            this.onGoRead(item)
        }
        return false
    };

    render() {
        const {book:{bookList}} = this.props;
        return (
            <div>
                <Header title="书架"/>
                <div className="book-boxes">
                    {bookList.map( (item,i) => (
                        <div key={i} className="item click"
                             onTouchStart={(e)=>this.onItemTouchStart(e,item)}
                             onTouchMove={this.onItemTouchMove}
                             onTouchEnd={()=>this.onItemTouchEnd(item)}
                        >
                            <div className="book">
                                <Image source={{src:item.img}} width="100%" style={{paddingTop:'132%', position:'relative'}}>
                                    {item.hasNew? (<span className="new"><span>new</span></span>) : null}
                                </Image>
                                <div className="name">{item.name}</div>
                                <div className="ratio">{(item.chapters? (item.chapterIndex||0)/(item.chapters.length-1)*100 : 0).toFixed(2)}%</div>
                            </div>
                        </div>
                    ))}
                    <div className="item click">
                        <Link prefetch href="/search" >
                            <div className="add"><Icon type="add" size="xxl" color="#eee" /></div>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}
