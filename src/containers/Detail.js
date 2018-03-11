import React, {Component} from 'react'
import {connect} from 'dva'
import Router from 'next/router'
import {Button, Toast} from 'antd-mobile'
import {Header, Icon, Image, Footer} from '../components'

@connect(({book, loading}) => ({book, loading}))
export default class extends Component {

    constructor(props) {
        super(props);
        this.state = {
            book: {},
            isHas: false
        };
    }

    componentDidMount() {
        this.props.dispatch({type:'book/queryBooks', payload: {
            callback: (bookList) => {
                let book = JSON.parse(sessionStorage.getItem('bookDetail'));
                let isHas = false;
                let temp = bookList.filter( item => item.name === book.name );
                if(temp.length > 0){
                    book = temp[0];
                    isHas = true;
                }
                this.setState({book, isHas})
            }
        }});
    }

    /* 加入书架 */
    onAddToList = () => {
        this.props.dispatch({type:'book/addBook', payload: {
            book: {...this.state.book, hasNew:true},
            callback: (book) => {
                this.setState({book, isHas:true})
            }
        }})
    };

    /* 开始阅读 */
    onGoRead = () => {
        let item = this.state.book;
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
                    Toast.fail('找不到资源，可能已删除');
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

    render() {
        const {book, isHas} = this.state;
        return (
            <div className="detail-container">
                <Header back title="" style={{borderBottom:'none'}} />
                <div className="info">
                    <div style={{flex:1}}>
                        <Image source={{src:book.img}} width="90%" style={{paddingTop:'120%'}} />
                    </div>
                    <div style={{flex:2,paddingLeft:5}}>
                        <div className="name">{book.name}</div>
                        <div className="min">作者：{book.author}</div>
                        <div className="min">类型：{book.type}</div>
                        <div className="min">更新状态：{book.status}</div>
                    </div>
                </div>
                <div style={{padding:20,fontSize:14,lineHeight:'22px'}}>
                    <div>简介：</div>
                    <div style={{marginTop:8}}>{book.desc}</div>
                </div>
                {isHas? (
                    <Footer>
                        <div className="footer-item" onClick={()=>this.onGoRead()}>开始阅读</div>
                        <div className="footer-item disabled">已加入书架</div>
                    </Footer>
                ) : (
                    <Footer>
                        <div className="footer-item disabled">开始阅读</div>
                        <div className="footer-item" onClick={()=>this.onAddToList()}>加入书架</div>
                    </Footer>
                )}
            </div>
        );
    }
}
