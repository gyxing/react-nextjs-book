import React, {Component} from 'react'
import {connect} from 'dva'
import Router from 'next/router'
import {Drawer, Popover, Slider} from 'antd-mobile'
import {Header, Icon, Image, Footer} from '../components'
import VirtualList from 'react-tiny-virtual-list'
import {fullScreen, getUrlParameter} from '../utils'

const Item = Popover.Item;

let theme = {
    default: {backgroundColor:'#fffdf6', color:'#000'},
    black: {backgroundColor:'#676767', color:'#e4e4e4'}
};

@connect(({book, loading}) => ({book, loading}))
export default class extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chapter: {},
            book: {},
            visible: false,
            open: false,
            popupVisible: [false, false, false, false],

            isMoon: false,
            fontSize: 20,
            theme: 'default'

        };
    }

    componentDidMount() {
        this.props.dispatch({type:'book/getBook', payload:{
            name: this.props.url.query.name || getUrlParameter('name'),
            callback: (book) => {
                let {chapterIndex=0} = book;
                this.setCurChapter(chapterIndex, book);
            }
        }});
        let setup = JSON.parse(localStorage.getItem('bookSetup'));
        if(setup){
            this.setState({...setup});
        }
        fullScreen(this.container)
    }

    setCurChapter = (chapterIndex, book) => {
        // document.body.scrollTop = document.documentElement.scrollTop = 0;
        // window.scrollTo(0, 0);
        if(!book){ book = this.state.book }
        book.chapterIndex = chapterIndex;
        let chapter = book.chapters[chapterIndex];
        if(chapter.content){
            this.setState({book, chapter, visible:false, open:false});
            if(!book){
                this.props.dispatch({type:'book/updateBook', payload:{book}});
            }
        }else{
            this.props.dispatch({type:'reptile/getContent', payload:{
                chapter,
                callback: (res) => {
                    //保存记录
                    book.chapters[chapterIndex] = res;
                    this.props.dispatch({type:'book/updateBook', payload:{book}});

                    this.setState({book, chapter:res, visible:false, open:false});
                }
            }})
        }
    };

    componentWillUnmount() {
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        localStorage.setItem(`${this.state.book.name}_scrollTop`, scrollTop);
    }

    /* 上一章 */
    onPrevious = () => {
        this.setCurChapter(this.state.book.chapterIndex - 1)
    };

    /* 下一章 */
    onNext = () => {
        this.setCurChapter(this.state.book.chapterIndex + 1)
    };

    onOpenChange = (open) => {
        this.setState({ open: !this.state.open });
        if(open){
            this.onScrollTo(this.state.book.chapterIndex)
        }
    };

    onFootClick = (index) => {
        let {popupVisible} = this.state;
        popupVisible.map( (item,i) => i===index? item=true : item=false);
    };

    /* 夜间模式 */
    onMoon = () => {
        let isMoon = !this.state.isMoon;
        this.setState({isMoon, visible:false});

        let {fontSize, theme} = this.state;
        localStorage.setItem('bookSetup', JSON.stringify({isMoon, fontSize, theme}))
    };

    /* 更改纸张类型 */
    onThemeChange = (theme) => {
        this.setState({theme, visible:false});
        let {fontSize, isMoon} = this.state;
        localStorage.setItem('bookSetup', JSON.stringify({isMoon, fontSize, theme}))
    };

    /* 改变字体大小 */
    onFontChange = (fontSize) => {
        this.setState({fontSize, visible:false});
        let {isMoon, theme} = this.state;
        localStorage.setItem('bookSetup', JSON.stringify({isMoon, fontSize, theme}))
    };

    /* 缓存章节内容 */
    onCache = (event) => {
        if(event.key){
            let endIndex = parseInt(event.key);
            let {book} = this.state;
            this._onCache(book, book.chapterIndex, endIndex)
        }
    };

    _onCache = (book, index, endIndex) => {
        let {chapters} = book;
        if(index <= endIndex && chapters[index] && !chapters[index].content){
            this.props.dispatch({type:'reptile/getContent', payload:{
                chapter: chapters[index],
                callback: (res) => {
                    book.chapters[index] = res;
                    this.props.dispatch({type:'book/updateBook', payload:{book}});
                    this._onCache(book, index+1, endIndex);
                }
            }})
        }else if(index > endIndex){
            this.setState({book})
        }else{
            this._onCache(book, index+1, endIndex);
        }
    };

    onScrollTo = (index) => {
        this.listNode.scrollTo(index * 35)
    };

    render() {
        const {visible, open} = this.state;
        return (
            <div className="read-container" ref={ref=>this.container=ref}>
                <Drawer
                    enableDragHandle
                    sidebar={this.renderChapters()}
                    open={open}
                    onOpenChange={this.onOpenChange}
                    sidebarStyle={{backgroundColor:'#f2f2f2',width:'85%'}}
                    dragHandleStyle={{width:0}}
                >
                    {this.renderContent()}
                </Drawer>
                {visible? this.renderModal() : null}
            </div>
        );
    }

    renderContent = () => {
        const {chapter:{name, content=''}, fontSize=16, isMoon, theme} = this.state;
        let style = {};
        if(isMoon){
            style = {backgroundColor:'#676767', color:'#e4e4e4'}
        }else if(theme==='paper'){
            style = {background:'url(/static/images/paper.jpg) 50% 50%/cover repeat'};
        }else{
            style = {backgroundColor:'#fffdf6'}
        }
        return (
            <div className="content" onClick={()=>this.setState({visible:true})} style={style}>
                <div className="name">{name}</div>
                <div className="txt" style={{fontSize}}>
                    {content.split('\n').map( (item,i) => <p key={i}>{item.trim()}</p>)}
                </div>
            </div>
        )
    };

    renderChapters = () => {
        const {book} = this.state;
        const {chapters=[]} = book;
        return (
            <div className="read-chapters">
                <div className="title">
                    <div>目录 ({chapters.length})</div>
                    <div className="opts">
                        <span onClick={()=>this.onScrollTo(0)}><Icon internal type="up" size="sm" color="#666" /></span>
                        <span onClick={()=>this.onScrollTo(chapters.length)}><Icon internal type="down" size="sm" color="#666" /></span>
                    </div>
                </div>
                <div className="list">
                    <VirtualList
                        ref={ref=>this.listNode=ref}
                        height="100%"
                        width='100%'
                        overscanCount={chapters.length}
                        itemCount={chapters.length}
                        itemSize={35}
                        renderItem={({index, style}) =>
                            <div className="item" key={index} style={style} onClick={()=>this.setCurChapter(index)}>
                                <span className="name" style={index===book.chapterIndex?{color:'#f00'}:{}}>{chapters[index].name}</span>
                                {chapters[index].content? (
                                    <span className="tag">已缓存</span>
                                ) : null}
                            </div>
                        }
                    />
                </div>
            </div>
        )
    };

    renderModal = () => {
        const {chapter, book, popupVisible, fontSize} = this.state;

        let footer = [
            {icon:'font', placement:'topLeft', overlay: [(
                <div className="read-popover-font">
                    <div className="title">
                        <span>字体: {fontSize}</span>
                        <span onClick={()=>this.onFontChange(16)}>默认</span>
                    </div>
                    <Slider
                        defaultValue={fontSize}
                        min={12}
                        max={30}
                        onAfterChange={val=>this.onFontChange(val)}
                    />
                </div>
            )]},
            {icon:'bgskin', placement:'topLeft', overlay: [(
                <div className="read-popover-themes">
                    <div className="default" onClick={()=>this.onThemeChange('default')}>默认</div>
                    <div className="paper" onClick={()=>this.onThemeChange('paper')}>牛皮纸</div>
                </div>
            )]},
            {icon:'moon'},
            {icon:'ellipsis', overlay: [
                (<Item key={book.chapterIndex + 20} icon={<Icon type="download" size="sm" color="#000" />}>缓存后面20章</Item>),
                (<Item key={book.chapters.length - 1} icon={<Icon type="download" size="sm" color="#000" />}>缓存剩余章节</Item>),
                (<Item icon={<Icon type="exchange" size="sm" color="#000" />}>换源下载</Item>)
            ]}
        ];

        return (
            <div className="modal">
                <Header title={`${book.name}　${chapter.name}`} style={{position:'fixed',top:0,width:'100%',backgroundColor:'#fff',zIndex:10}}/>
                <div className="cover" onClick={()=>this.setState({visible:false})}/>
                <div className="left" onClick={this.onOpenChange}>
                    <span>&gt;&gt;</span>
                </div>
                <div className="right">
                    <div onClick={this.onPrevious}>上一章</div>
                    <div onClick={this.onNext}>下一章</div>
                </div>
                <Footer style={{justifyContent:'space-around'}}>
                    <div onClick={()=>Router.back()}>
                        <Icon internal type="left" size="lg" color="#666" />
                    </div>
                    {footer.map( (item,i) => item.icon!=='moon'?(
                        <div key={i} onClick={()=>this.onFootClick(i)}>
                            <Popover
                                mask
                                visible={popupVisible[i]}
                                placement={item.placement || 'topRight'}
                                overlay={item.overlay}
                                onSelect={this.onCache}
                            >
                                <Icon type={item.icon} size="md" color="#666" />
                            </Popover>
                        </div>
                    ):(
                        <div key={i} onClick={this.onMoon}>
                            <Icon type={item.icon} size="md" color="#666" />
                        </div>
                    ))}
                </Footer>
            </div>
        )
    };
}
