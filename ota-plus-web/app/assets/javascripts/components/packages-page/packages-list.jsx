define(function(require) {
  var React = require('react'),
      ReactDOM = require('react-dom'),
      SotaDispatcher = require('sota-dispatcher'),
      db = require('stores/db'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      PackagesListItem = require('./packages-list-item'),
      PackageListItemDetails = require('./packages-list-item-details'),
      Dropzone = require('../../mixins/dropzone'),
      Loader = require('../loader');
  
  class PackagesList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        packagesWrapperHeight: this.props.contentHeight,
        tmpIntervalId: null,
        fakeHeaderTopPosition: 0,
        fakeHeaderLetter: this.props.fakeHeaderLetter,
        packagesShownStartIndex: 0,
        packagesShownEndIndex: 50,
      };
      this.generatePositions = this.generatePositions.bind(this);
      this.packagesListScroll = this.packagesListScroll.bind(this);
      this.startIntervalPackagesListScroll = this.startIntervalPackagesListScroll.bind(this);
      this.stopIntervalPackagesListScroll = this.stopIntervalPackagesListScroll.bind(this);
      this.highlightPackage = this.highlightPackage.bind(this);
    }
    componentDidMount() {
      ReactDOM.findDOMNode(this.refs.packagesList).addEventListener('scroll', this.packagesListScroll);
      this.setState({packagesWrapperHeight: this.props.contentHeight - jQuery('.panel-subheading').height()});
    }
    componentWillReceiveProps(nextProps) {
      if(nextProps.fakeHeaderLetter !== this.props.fakeHeaderLetter)
        this.setState({fakeHeaderLetter: nextProps.fakeHeaderLetter});
      if(nextProps.contentHeight !== this.props.contentHeight)
        this.setState({packagesWrapperHeight: nextProps.contentHeight - jQuery('.panel-subheading').height()});
    }
    componentDidUpdate(prevProps, prevState) {
      if(this.state.packagesWrapperHeight !== prevState.packagesWrapperHeight) {
        this.packagesListScroll();
      }
      if(this.props.selectedType !== prevProps.selectedType) {
        ReactDOM.findDOMNode(this.refs.packagesList).scrollTop = 0;
        this.packagesListScroll();
      }
    }
    componentWillUnmount() {
      ReactDOM.findDOMNode(this.refs.packagesList).removeEventListener('scroll', this.packagesListScroll);
      clearInterval(this.state.tmpIntervalId);
    }
    generatePositions() {
      var packagesListItems = !_.isUndefined(ReactDOM.findDOMNode(this.refs.packagesList).children[0].children[0]) ? ReactDOM.findDOMNode(this.refs.packagesList).children[0].children[0].children : null;
      var wrapperPosition = ReactDOM.findDOMNode(this.refs.packagesList).getBoundingClientRect();
      var positions = [];
      _.each(packagesListItems, function(item) {
        if(item.className.indexOf('ioslist-group-container') > -1) {
          var header = item.getElementsByClassName('ioslist-group-header')[0];
          positions.push(header.getBoundingClientRect().top - wrapperPosition.top + ReactDOM.findDOMNode(this.refs.packagesList).scrollTop);
        }
      }, this);
      return positions;
    }
    packagesListScroll() {
      var scrollTop = this.refs.packagesList.scrollTop;
      var newFakeHeaderLetter = this.state.fakeHeaderLetter;
      var headerHeight = !_.isUndefined(this.refs.fakeHeader) ? this.refs.fakeHeader.offsetHeight : 28;
      var positions = this.generatePositions();
      var wrapperPosition = ReactDOM.findDOMNode(this.refs.packagesList).getBoundingClientRect();
      var beforeHeadersCount = 0;
      
      positions.every(function(position, index) {
        if(scrollTop >= position) {
          beforeHeadersCount++;
          newFakeHeaderLetter = Object.keys(this.props.searchablePackagesData)[index];
          return true;
        } else if(scrollTop >= position - headerHeight) {
          scrollTop -= scrollTop - (position - headerHeight);
          return true;
        }
      }, this);
      
      var packageDetailsOffset = 0;
      var packageDetails = document.getElementsByClassName('package-details')[0];
      if(!_.isUndefined(packageDetails))
        var packageDetailsOffset = Math.min(Math.max(packageDetails.getBoundingClientRect().top - wrapperPosition.top, -packageDetails.offsetHeight), 0);
    
      var offset = 5;
      var headersHeight = !_.isUndefined(document.getElementsByClassName('ioslist-group-header')[0]) ? document.getElementsByClassName('ioslist-group-header')[0].offsetHeight : 28;;
      var listItemHeight = !_.isUndefined(document.getElementsByClassName('list-group-item')[0]) ? document.getElementsByClassName('list-group-item')[0].offsetHeight - 1 : 39;;
      var packagesShownStartIndex = Math.floor((ReactDOM.findDOMNode(this.refs.packagesList).scrollTop - (beforeHeadersCount - 1) * headersHeight + packageDetailsOffset) / listItemHeight) - offset;
      var packagesShownEndIndex = packagesShownStartIndex + Math.floor(this.state.packagesWrapperHeight / listItemHeight) + 2 * offset;     
            
      this.setState({
        fakeHeaderTopPosition: scrollTop,
        fakeHeaderLetter: newFakeHeaderLetter,
        packagesShownStartIndex: packagesShownStartIndex,
        packagesShownEndIndex: packagesShownEndIndex
      });
    }
    startIntervalPackagesListScroll() {
      clearInterval(this.state.tmpIntervalId);
      var that = this;
      var intervalId = setInterval(function() {
        that.packagesListScroll();
      }, 10);
      this.setState({tmpIntervalId: intervalId});
    }
    stopIntervalPackagesListScroll() {
      if(!_.isUndefined(this.props.highlightedName))
        jQuery('#button-package-' + this.props.highlightedName).offset().top;
      clearInterval(this.state.tmpIntervalId);
      this.setState({tmpIntervalId: null});
    }    
    highlightPackage() {
      var element = jQuery('#button-package-' + this.props.highlightedName);
      if(!_.isUndefined(this.props.highlightedName) && !_.isUndefined(element)) {
        this.refs.packagesList.scrollTop = element.offset().top;
        this.props.expandPackage(this.props.highlightedName);
      }
    }
    render() {
      var packageIndex = -1;
      var that = this;
      var packages = _.map(this.props.searchablePackagesData, function(packages, index) {
        var items = _.map(packages, function(pack, i) {
          packageIndex++;
          var that = this;
          var isExpanded = this.props.expandedPackageName == pack.packageName;
          if(packageIndex >= this.state.packagesShownStartIndex && packageIndex <= this.state.packagesShownEndIndex)
            return (
              <li key={'package-' + pack.packageName} className={isExpanded ? 'selected' : null}>
                <PackagesListItem
                  key={'package-' + pack.packageName + '-items'}
                  name={pack.packageName}
                  expandPackage={this.props.expandPackage}
                  showPackageStatusModal={this.props.showPackageStatusModal}
                  selected={isExpanded}
                  isOndevicesList={this.props.isOndevicesList}/>
                <VelocityTransitionGroup enter={{animation: "slideDown", begin: function() {that.startIntervalPackagesListScroll()}, complete: function() {that.stopIntervalPackagesListScroll()}}} leave={{animation: "slideUp"}}>
                  {isExpanded ?
                    <PackageListItemDetails
                      key={'package-' + pack.packageName + '-versions'}
                      versions={pack.elements}
                      packageName={pack.packageName}
                      showBlacklistForm={this.props.showBlacklistModal}
                      queryPackagesData={this.props.queryPackagesData}
                      isOndevicesList={this.props.isOndevicesList}/>
                  : null}
                </VelocityTransitionGroup>
              </li>
            );
          return (
            <li key={'package-' + pack.packageName} className="list-group-item" ></li>
          );
        }, this);
        return(
          <div className="ioslist-group-container" key={'list-group-container-' + index}>
            <div className="ioslist-group-header">{index}</div>
            <ul>
              {items}
            </ul>
          </div>
        );
      }, this);
      return (
        <div>
          <ul className="list-group" id="packages-list" style={{height: this.state.packagesWrapperHeight}}>
            <Dropzone ref="dropzone" onDrop={!this.props.isOndevicesList ? this.props.onFileDrop : null} multiple={false} disableClick={true} className="dnd-zone" activeClassName={!this.props.isOndevicesList ? "dnd-zone-active" : null}>
              <div id="packages-list-inside">
                <div className="ioslist-wrapper with-background" ref="packagesList">
                  <VelocityTransitionGroup enter={{animation: "fadeIn", complete: function() {that.highlightPackage()}}} leave={{animation: "fadeOut"}}>
                    {packages.length ? 
                      <div>
                        <h2 className="ioslist-fake-header" style={{top: this.state.fakeHeaderTopPosition}} ref="fakeHeader">{this.state.fakeHeaderLetter}</h2>
                        {packages}
                      </div>
                      : 
                        <div className="col-md-12 height-100 position-relative text-center">
                          <div className="center-xy padding-15">
                            <span className="font-18">
                              No matching packages found.
                            </span>
                          </div>
                        </div>
                      }
                  </VelocityTransitionGroup>
                </div>
              </div>
            </Dropzone>
          </ul>
        </div>
      );
    }
  };

  return PackagesList;
});
