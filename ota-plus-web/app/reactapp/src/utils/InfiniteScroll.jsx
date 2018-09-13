import React, { Component, PropTypes } from 'react';

export default class InfiniteScroll extends Component {
    static propTypes = {
        children: PropTypes.node,
        element: PropTypes.string,
        className: PropTypes.string,
        hasMore: PropTypes.bool,
        isLoading: PropTypes.bool,
        initialLoad: PropTypes.bool,
        loadMore: PropTypes.func.isRequired,
        pageStart: PropTypes.number,
        threshold: PropTypes.number,
        useWindow: PropTypes.bool,
        isReverse: PropTypes.bool,
        loader: PropTypes.node,
    };
    static defaultProps = {
        element: 'div',
        hasMore: false,
        isLoading: false,
        initialLoad: true,
        pageStart: 0,
        threshold: 250,
        useWindow: true,
        isReverse: false,
    };
    constructor(props) {
        super(props);
        this.scrollListener = this.scrollListener.bind(this);
    }
    componentDidMount() {
        this.pageLoaded = this.props.pageStart;
        this.attachScrollListener();
    }
    componentDidUpdate() {
        if (this.props.hasMore) {
            this.attachScrollListener();
        } else {
            this.detachScrollListener();
        }
    }
    componentWillUnmount() {
        this.detachScrollListener();
    }
    setDefaultLoader(loader) {
        this._defaultLoader = loader;
    }
    calculateTopPosition(el) {
        if (!el) {
            return 0;
        }
        return el.offsetTop + this.calculateTopPosition(el.offsetParent);
    }
    scrollListener() {
        const el = this.scrollComponent;
        const scrollEl = window;
        let scrollOffset;

        if (this.props.useWindow) {
            const scrollTop = (scrollEl.pageYOffset !== undefined) ?
                scrollEl.pageYOffset
            :
                (document.documentElement || document.body.parentNode || document.body).scrollTop;
            if (this.props.isReverse) {
                scrollOffset = scrollTop;
            } else {
                scrollOffset = (this.calculateTopPosition(el) + el.offsetHeight) -
                (scrollTop + window.innerHeight);
            }
        } else if (this.props.isReverse) {
            scrollOffset = el.parentNode.scrollTop;
        } else {
            scrollOffset = el.scrollHeight - el.parentNode.scrollTop - el.parentNode.clientHeight;
        }
        if (scrollOffset < Number(this.props.threshold)) {
            this.detachScrollListener();
            // Call loadMore after detachScrollListener to allow for non-async loadMore functions
            if (typeof this.props.loadMore === 'function' && !this.props.isLoading) {
                this.props.loadMore.call();
            }
        }
    }

    attachScrollListener() {
        if (!this.props.hasMore) {
            return;
        }
        let scrollEl = window;
        if (this.props.useWindow === false) {
            scrollEl = this.scrollComponent.parentNode;
        }
        scrollEl.addEventListener('scroll', this.scrollListener);
        scrollEl.addEventListener('resize', this.scrollListener);
        if (this.props.initialLoad) {
            this.scrollListener();
        }
    }
    detachScrollListener() {
        let scrollEl = window;
        if (this.props.useWindow === false) {
            scrollEl = this.scrollComponent.parentNode;
        }
        scrollEl.removeEventListener('scroll', this.scrollListener);
        scrollEl.removeEventListener('resize', this.scrollListener);
    }
    render() {
        const {
            children,
            hasMore,
            useWindow,
            pageStart,
            loadMore,
            initialLoad,
            threshold,
            isReverse,
            element,
            isLoading,
            loader,
            ...props
        } = this.props;
        props.ref = (node) => {
            this.scrollComponent = node;
        };
        return React.createElement(element, props, children, isLoading &&
            (loader || this._defaultLoader));
    }
}
