import React, { Component } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

export default class RefreshView extends InfiniteScroll{

    constructor(props){
        super(props)
    }

    componentWillReceiveProps (props) {
        // new data was sent in
        setTimeout(()=>{
            this.setState({
                showLoader: false,
                actionTriggered: false,
                pullToRefreshThresholdBreached: false
            });
        }, 1000);
    }

    onStart (evt) {
        if (this.state.lastScrollTop) return;

        this.dragging = true;
        this.startY = evt.pageY || evt.touches[0].pageY;
        this.currentY = this.startY;
        this.isScroll = false;

        // this._infScroll.style.willChange = 'transform';
        // this._infScroll.style.transition = `transform 0.2s cubic-bezier(0,0,0.31,1)`;
        this._infScroll.style.transition = 'all 0.5s';
    }

    onMove (evt) {
        if (!this.dragging) return;
        this.currentY = evt.pageY || evt.touches[0].pageY;

        // user is scrolling down to up
        if (this.currentY < this.startY) return;
/*
        if ((this.currentY - this.startY) >= this.props.pullDownToRefreshThreshold) {
            this.setState({
                pullToRefreshThresholdBreached: true
            });
        }*/

        if ((this.currentY - this.startY) >= this.props.pullDownToRefreshThreshold) {
            this.isScroll = true;
        }

        // so you can drag upto 1.5 times of the maxPullDownDistance
        if (this.currentY - this.startY > this.maxPullDownDistance * 1.5) return;

        this._infScroll.style.overflow = 'visible';
        this._infScroll.style.transform = `translate3d(0, ${this.currentY - this.startY}px, 0)`;
    }

    onEnd (evt) {
        this.startY = 0;
        this.currentY = 0;

        this.dragging = false;

        /*if (this.state.pullToRefreshThresholdBreached) {
            this.props.refreshFunction && this.props.refreshFunction();
        }*/

        if(this.isScroll){
            this.setState({
                pullToRefreshThresholdBreached: true
            });
            if (this.state.pullToRefreshThresholdBreached) {
                this.props.refreshFunction && this.props.refreshFunction();
            }
            this._infScroll.style.transform = `translate3d(0, 40px, 0)`;
        }else{
            this._infScroll.style.transform = `translate3d(0, 0px, 0)`;
        }

        requestAnimationFrame(() => {
            setTimeout(()=>{
                this._infScroll.style.overflow = 'auto';
                this._infScroll.style.transform = 'none';
                this._infScroll.style.willChange = 'none';
            }, 1000);
        });
    }

}
