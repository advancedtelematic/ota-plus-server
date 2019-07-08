/** @format */
import PropTypes from 'prop-types';
import React, { Component } from 'react';

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

  componentDidMount() {
    const { pageStart } = this.props;
    this.pageLoaded = pageStart;
    this.attachScrollListener();
  }

  componentDidUpdate() {
    const { hasMore } = this.props;
    if (hasMore) {
      this.attachScrollListener();
    } else {
      this.detachScrollListener();
    }
  }

  componentWillUnmount() {
    this.detachScrollListener();
  }

  setDefaultLoader(loader) {
    this.defaultLoader = loader;
  }

  scrollListener = () => {
    const el = this.scrollComponent;
    const scrollEl = window;
    let scrollOffset;
    const { useWindow, isReverse, threshold, loadMore, isLoading, hasMore } = this.props;
    if (useWindow) {
      const scrollTop = scrollEl.pageYOffset !== undefined
        ? scrollEl.pageYOffset
        : (document.documentElement || document.body.parentNode || document.body).scrollTop;
      if (isReverse) {
        scrollOffset = scrollTop;
      } else {
        scrollOffset = this.calculateTopPosition(el) + el.offsetHeight - (scrollTop + window.innerHeight);
      }
    } else if (isReverse) {
      scrollOffset = el.parentNode.scrollTop;
    } else {
      scrollOffset = el.scrollHeight - el.parentNode.scrollTop - el.parentNode.clientHeight;
    }
    if (scrollOffset < Number(threshold)) {
      this.detachScrollListener();
      // Call loadMore after detachScrollListener to allow for non-async loadMore functions
      if (typeof loadMore === 'function' && !isLoading) {
        if (hasMore) {
          loadMore.call();
        }
      }
    }
  };

  calculateTopPosition(el) {
    if (!el) {
      return 0;
    }
    return el.offsetTop + this.calculateTopPosition(el.offsetParent);
  }

  attachScrollListener() {
    const { useWindow, hasMore, initialLoad } = this.props;
    if (!hasMore) {
      return;
    }
    let scrollEl = window;
    if (useWindow === false) {
      scrollEl = this.scrollComponent.parentNode;
    }
    scrollEl.addEventListener('scroll', this.scrollListener);
    scrollEl.addEventListener('resize', this.scrollListener);
    if (initialLoad) {
      this.scrollListener();
    }
  }

  detachScrollListener() {
    const { useWindow } = this.props;
    let scrollEl = window;
    if (useWindow === false) {
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
    return React.createElement(element, props, children, isLoading && (loader || this.defaultLoader));
  }
}
