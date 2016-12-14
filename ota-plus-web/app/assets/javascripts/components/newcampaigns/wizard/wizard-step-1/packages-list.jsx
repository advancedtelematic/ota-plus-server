define(function(require) {
  var React = require('react'),
      ReactDOM = require('react-dom'),
      SotaDispatcher = require('sota-dispatcher'),
      db = require('stores/db'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      PackagesListItem = require('./packages-list-item'),
      PackageListItemDetails = require('./packages-list-item-details'),
      Loader = require('../../../loader');

  class PackagesList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: undefined,
        expandedPackage: this.props.wizardData !== null && !_.isUndefined(this.props.wizardData[0]) && !_.isUndefined(this.props.wizardData[0].packageName) ? this.props.wizardData[0].packageName : null,
        timeout: null,
        intervalId: null,
        tmpIntervalId: null,
        fakeHeaderTopPosition: 0,
        fakeHeaderLetter: null,
        packagesShownStartIndex: 0,
        packagesShownEndIndex: 50,
        chosenPackage: {
          name: this.props.wizardData !== null && !_.isUndefined(this.props.wizardData[0]) && !_.isUndefined(this.props.wizardData[0].packageName) ? this.props.wizardData[0].packageName : '',
          version: this.props.wizardData !== null && !_.isUndefined(this.props.wizardData[0]) && !_.isUndefined(this.props.wizardData[0].packageVersion) ? this.props.wizardData[0].packageVersion : ''
        }
      };
      
      this.refreshData = this.refreshData.bind(this);
      this.setData = this.setData.bind(this);
      this.prepareData = this.prepareData.bind(this);
      this.expandPackage = this.expandPackage.bind(this);
      this.compareVersions = this.compareVersions.bind(this);
      this.choosePackage = this.choosePackage.bind(this);
      this.generatePositions = this.generatePositions.bind(this);
      this.setFakeHeader = this.setFakeHeader.bind(this);
      this.packagesListScroll = this.packagesListScroll.bind(this);
      this.startIntervalPackagesListScroll = this.startIntervalPackagesListScroll.bind(this);
      this.stopIntervalPackagesListScroll = this.stopIntervalPackagesListScroll.bind(this);
      
      db.searchablePackages.addWatch("poll-packages-campaign", _.bind(this.setData, this, null));      
    }
    componentDidMount() {
      var that = this;
      this.refreshData();
      ReactDOM.findDOMNode(this.refs.packagesList).addEventListener('scroll', this.packagesListScroll);
    }
    componentDidUpdate(prevProps, prevState) {
      if(this.props.packagesListHeight !== prevProps.packagesListHeight) {
        this.packagesListScroll();
      }
    }
    componentWillUpdate(nextProps, nextState) {
      if(nextProps.filterValue != this.props.filterValue) {
        SotaDispatcher.dispatch({actionType: 'search-packages-by-regex', regex: nextProps.filterValue});
      }
    }
    componentWillUnmount() {
      ReactDOM.findDOMNode(this.refs.packagesList).removeEventListener('scroll', this.packagesListScroll);
      db.searchablePackages.removeWatch("poll-packages-campaign");
      clearTimeout(this.state.timeout);
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
    setFakeHeader(data) {
      this.setState({fakeHeaderLetter: Object.keys(data)[0]});
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
          newFakeHeaderLetter = Object.keys(this.state.data)[index];
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
      var headersHeight = !_.isUndefined(document.getElementsByClassName('ioslist-group-header')[0]) ? document.getElementsByClassName('ioslist-group-header')[0].offsetHeight : 28;
      var listItemHeight = !_.isUndefined(document.getElementsByClassName('list-group-item')[0]) ? document.getElementsByClassName('list-group-item')[0].offsetHeight - 1 : 39;
      var packagesShownStartIndex = Math.floor((ReactDOM.findDOMNode(this.refs.packagesList).scrollTop - (beforeHeadersCount - 1) * headersHeight + packageDetailsOffset) / listItemHeight) - offset;
      var packagesShownEndIndex = packagesShownStartIndex + Math.floor(ReactDOM.findDOMNode(this.refs.packagesList).offsetHeight / listItemHeight) + 2 * offset;     
            
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
      clearInterval(this.state.tmpIntervalId);
      this.setState({tmpIntervalId: null});
    }
    refreshData() {
      SotaDispatcher.dispatch({actionType: 'search-packages-by-regex', regex: this.props.filterValue});
    }
    setData() {
      var result = this.prepareData();
      if(!_.isUndefined(result.data) && (_.isUndefined(this.state.data) || Object.keys(this.state.data)[0] !== Object.keys(result.data)[0]))
        this.setFakeHeader(result.data);
      
      this.setState({
        data: result.data
      });
    }
    prepareData() {
      var that = this;
      var Packages = db.searchablePackages.deref();

      var SortedPackages = undefined;
      var installedCount = 0;
      var queuedCount = 0;
            
      if(!_.isUndefined(Packages)) {
        var GroupedPackages = {};
        _.each(Packages, function(obj, index){
          var objKey = obj.id.name+'_'+obj.id.version;
          
          if( typeof GroupedPackages[obj.id.name] == 'undefined' || !GroupedPackages[obj.id.name] instanceof Array ) {
            GroupedPackages[obj.id.name] = new Object();
            GroupedPackages[obj.id.name]['elements'] = [];
            GroupedPackages[obj.id.name]['packageName'] = obj.id.name;
          }
                    
          GroupedPackages[obj.id.name]['elements'].push(Packages[index]);
        });
        
        _.each(GroupedPackages, function(obj, index) {
          GroupedPackages[index]['elements'] = obj['elements'].sort(function (a, b) {
            var aVersion = a.id.version;
            var bVersion = b.id.version;
            return that.compareVersions(bVersion, aVersion);
          });
        });

        SortedPackages = {};
        Object.keys(GroupedPackages).sort(function(a, b) {
          return (a.charAt(0) % 1 === 0 && b.charAt(0) % 1 !== 0) ? 1 : a.localeCompare(b);
        }).forEach(function(key) {
          var firstLetter = key.charAt(0).toUpperCase();
          firstLetter = firstLetter.match(/[A-Z]/) ? firstLetter : '#';

          if( typeof SortedPackages[firstLetter] == 'undefined' || !SortedPackages[firstLetter] instanceof Array ) {
             SortedPackages[firstLetter] = [];
          }
          SortedPackages[firstLetter].push(GroupedPackages[key]);
        });
      }
    
      return {'data': SortedPackages};
    }
    expandPackage(name) {
      var expandedPackage = this.state.expandedPackage;

      if(expandedPackage == name) {
        this.setState({
          expandedPackage: null
        });
      } else {
        this.setState({
          expandedPackage: name
        });
      }
    }
    compareVersions(a, b) {
      if (a === b) {
       return 0;
      }
      var a_components = a.split(".");
      var b_components = b.split(".");
      var len = Math.min(a_components.length, b_components.length);

      for (var i = 0; i < len; i++) {
        if (parseInt(a_components[i]) > parseInt(b_components[i])) {
          return 1;
        }
        if (parseInt(a_components[i]) < parseInt(b_components[i])) {
          return -1;
        }
      }
      if (a_components.length > b_components.length) {
        return 1;
      }
      if (a_components.length < b_components.length) {
        return -1;
      }
      return 0;
    }
    choosePackage(name, version) {
      this.setState({
        chosenPackage: {name: name, version: version}
      });
      
      this.props.setWizardData(name, version);
    }
    render() {
      var packageIndex = -1;
      if(!_.isUndefined(this.state.data)) {
        var packages = _.map(this.state.data, function(packages, index) {
          var items = _.map(packages, function(pack, i) {
            packageIndex++;
            
            var that = this;

            if(packageIndex >= this.state.packagesShownStartIndex && packageIndex <= this.state.packagesShownEndIndex)
              return (
                <li key={'package-' + pack.packageName} className={this.state.expandedPackage == pack.packageName ? 'selected' : null}>
                  <PackagesListItem
                    key={'package-' + pack.packageName + '-items'}
                    name={pack.packageName}
                    expandPackage={this.expandPackage}
                    selected={this.state.expandedPackage == pack.packageName ? true : false}/>
                    <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
                      {this.state.expandedPackage == pack.packageName ?
                        <PackageListItemDetails
                          key={'package-' + pack.packageName + '-versions'}
                          versions={pack.elements}
                          packageName={pack.packageName}
                          chosenPackage={this.state.chosenPackage}
                          choosePackage={this.choosePackage}/>
                      : null}
                    </VelocityTransitionGroup>
                </li>
              );
      
            return (
              <li key={'package-' + pack.packageName} className="list-group-item" >{packageIndex}</li>
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
      }
      return (
        <div>
          <ul className="list-group" id="packages-list">
            <div id="packages-list-inside">
              <div className="ioslist-wrapper" ref="packagesList">
                <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
                  {!_.isUndefined(packages) ? 
                    packages.length ?
                      <div>
                        <h2 className="ioslist-fake-header" style={{top: this.state.fakeHeaderTopPosition}} ref="fakeHeader">{this.state.fakeHeaderLetter}</h2>
                        {packages}
                      </div>
                    :
                      <div className="col-md-12 height-100 position-relative text-center">
                        {this.props.filterValue !== '' ? 
                          <div className="center-xy padding-15">
                            No matching packages found.
                          </div>
                        :
                          <div className="center-xy padding-15">
                            There are no packages to choose.
                          </div>
                        }
                      </div>
                  : undefined}
                </VelocityTransitionGroup>
                {_.isUndefined(packages) ? 
                  <Loader />
                : undefined}
              </div>
            </div>
          </ul>
        </div>
      );
    }
  }
  return PackagesList;
});
