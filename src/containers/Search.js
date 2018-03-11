import React, {Component} from 'react'
import {connect} from 'dva'
import Link from 'next/link'
import Router from 'next/router'
import {SearchBar} from 'antd-mobile'
import {Header, Icon, ZScroll, Image} from '../components'

@connect(({reptile, loading}) => ({reptile, loading}))
export default class extends Component {

    constructor(props) {
        super(props);
        this.state = {
            keyword: this.props.url.query.keyword,
            history: []
        };
    }

    componentDidMount() {
        const {keyword} = this.state;
        if(keyword){
            this.props.dispatch({type:'reptile/search', payload:{
                keyword
            }})
        }
        let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        this.setState({history})
    }

    onSearch = (keyword) => {
        if(keyword){
            let {history} = this.state;
            if(history.indexOf(keyword) === -1){
                history.unshift(keyword);
                localStorage.setItem('searchHistory', JSON.stringify(history))
            }
            Router.replace(`/search?keyword=${keyword}`)
        }
    };

    onNext = ({refresh=false, page=0}) => {

    };

    onItemClick = (item) => {
        sessionStorage.setItem('bookDetail', JSON.stringify(item));
        Router.push('/detail')
    };

    onClearHistory = () => {
        localStorage.removeItem('searchHistory');
        this.setState({ history:[] })
    };

    render() {
        const {keyword, history} = this.state;
        const {reptile:{searchList}, loading} = this.props;
        return (
            <div>
                <Header back right={(
                    <div className="click" style={{fontSize:14}} onClick={()=>this.onSearch(keyword)}>搜索</div>
                )}>
                    <SearchBar
                        value={keyword}
                        className="search-input-box"
                        placeholder="关键字"
                        showCancelButton
                        onChange={val=>this.setState({keyword:val})}
                        onSubmit={this.onSearch}
                    />
                </Header>
                {keyword? (
                    <ZScroll loading={loading.models.reptile} onNext={this.onNext}>
                        {searchList.map( (item, i) => (
                            <div key={i} className="click search-result-item" onClick={()=>this.onItemClick(item)}>
                                <div className="img">
                                    <Image source={{src:item.img}} style={{width:'92%',paddingTop:'120%'}} />
                                </div>
                                <div className="info">
                                    <div className="name">{item.name}</div>
                                    <div className="author">{item.author}　{item.type}　{item.status}</div>
                                    <div className="desc">{item.desc}</div>
                                </div>
                            </div>
                        ))}
                    </ZScroll>
                ) : (history.length>0 ?(
                    <div className="search-history">
                        <div className="title">
                            <span>搜索历史：</span>
                            <span className="click" onClick={this.onClearHistory}>
                                <Icon type="remove" size="sm" color="#666" />
                            </span>
                        </div>
                        <div className="list">
                            {history.map( (item,i) => (
                                <span key={i} onClick={()=>this.onSearch(item)}>{item}</span>
                            ))}
                        </div>
                    </div>
                ) : null)}
            </div>
        );
    }
}
