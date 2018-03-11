import React, { Component } from 'react'
import InfiniteScroll from './RefreshView'
import {Icon} from './index'

let page = 0;

export default class extends Component {

    constructor(props){
        super(props);
        page = 0;
        this.state = {
            loading: false
        }
    }
/*
    componentWillReceiveProps(nextProps) {
        const {loading} = nextProps;
        if(!loading){
            // 延迟，不然变化太快，会造成卡顿的错觉
            setTimeout(()=>{
                this.setState({ loading });
            }, 1000)
        }else{
            this.setState({ loading });
        }
    }*/

    onRefresh = () => {
        page = 0;
        this.props.onRefresh({
            page,
            refresh: true
        })
    };

    onNext = () => {
        page += 1;
        this.props.onNext({
            page,
            refresh: false
        })
    };

    render() {
        const {children, onRefresh, onNext, hasMore=true} = this.props;
        let param = {};
        onRefresh? param = Object.assign(param, {
            pullDownToRefresh: true,
            pullDownToRefreshContent: <div style={{textAlign:'center',padding:'8px 0'}}>下拉刷新</div>,
            releaseToRefreshContent: <div style={{textAlign:'center',padding:'8px 0'}}><Icon type="loading" internal /></div>,
            refreshFunction: this.onRefresh
        }) : '';
        onNext? param = Object.assign(param, {
            next: this.onNext,
            hasMore
        }) : '';
        return (
            <InfiniteScroll
                loader={this.renderLoader()}
                {...param}
                endMessage={(
                    <div style={{textAlign:'center'}}>我也是有底线的</div>
                )}
            >
                {children}
            </InfiniteScroll>
        )
    }

    renderLoader = () => {
        const {loading} = this.props;
        return (
            <div style={{textAlign:'center',padding:'8px 0'}}>
                {loading? (
                    <Icon type="loading" internal />
                ) : (
                    <span>{/*上拉获取更多*/}</span>
                )}
            </div>
        )
    }

}
