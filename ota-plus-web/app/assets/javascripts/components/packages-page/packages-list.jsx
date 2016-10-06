define(function(require) {
  var React = require('react'),
      ReactDOM = require('react-dom'),
      SotaDispatcher = require('sota-dispatcher'),
      db = require('stores/db'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      PackagesListItem = require('es6!./packages-list-item'),
      PackageListItemDetails = require('es6!./packages-list-item-details'),
      Dropzone = require('es6!../../mixins/dropzone'),
      AddPackage = require('es6!../packages/add-package'),
      BlacklistForm = require('es6!../packages/blacklist-form'),
      Loader = require('es6!../loader');
  
  class PackagesList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: undefined,
        expandedPackage: null,
        intervalId: null,
        tmpIntervalId: null,
        fakeHeaderTopPosition: 0,
        fakeHeaderLetter: null,
        isFormShown: this.props.isFormShown,
        files: null,
        blacklistedPackageName: null,
        blacklistedPackageVersion: null,
        blacklistMode: null,
        isBlacklistFormShown: false,
      };
      
      this.refreshData = this.refreshData.bind(this);
      this.refresh = this.refresh.bind(this);
      this.setData = this.setData.bind(this);
      this.prepareData = this.prepareData.bind(this);
      this.onDrop = this.onDrop.bind(this);
      this.showBlacklistForm = this.showBlacklistForm.bind(this);
      this.closeBlacklistForm = this.closeBlacklistForm.bind(this);
      this.expandPackage = this.expandPackage.bind(this);
      this.generatePositions = this.generatePositions.bind(this);
      this.setFakeHeader = this.setFakeHeader.bind(this);
      this.packagesListScroll = this.packagesListScroll.bind(this);
      this.startIntervalPackagesListScroll = this.startIntervalPackagesListScroll.bind(this);
      this.stopIntervalPackagesListScroll = this.stopIntervalPackagesListScroll.bind(this);
      
      db.searchablePackages.addWatch("poll-packages", _.bind(this.refresh, this, null));      
    }
    componentDidMount() {
      var that = this;
      var intervalId = setInterval(function() {
        that.refreshData();
      }, 1000);
      this.setState({intervalId: intervalId});
      this.refreshData();
      ReactDOM.findDOMNode(this.refs.packagesList).addEventListener('scroll', this.packagesListScroll);
    }
    componentWillUpdate(nextProps, nextState) {
      if(nextProps.filterValue != this.props.filterValue) {
        SotaDispatcher.dispatch({actionType: 'search-packages-by-regex', regex: nextProps.filterValue});
      }
    }
    componentWillReceiveProps(nextProps) {
      if(this.props.isFormShown !== nextProps.isFormShown) {
        this.setState({isFormShown: nextProps.isFormShown});
      }
      if(this.props.selectedSort !== nextProps.selectedSort) {
        this.setData(nextProps.selectedSort);
      }
    }
    componentWillUnmount() {
      ReactDOM.findDOMNode(this.refs.packagesList).removeEventListener('scroll', this.packagesListScroll);
      db.searchablePackages.reset();      
      db.searchablePackages.removeWatch("poll-packages");
      clearInterval(this.state.intervalId);
      clearInterval(this.state.tmpIntervalId);
    }
    generatePositions() {
      var packagesListItems = ReactDOM.findDOMNode(this.refs.packagesList).children[0].children;
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
      var headerHeight = ReactDOM.findDOMNode(this.refs.fakeHeader).offsetHeight;
      var positions = this.generatePositions();
      
      positions.every(function(position, index) {
        if(scrollTop >= position) {
          newFakeHeaderLetter = Object.keys(this.state.data)[index];
          return true;
        } else if(scrollTop >= position - headerHeight) {
          scrollTop -= scrollTop - (position - headerHeight);
          return true;
        }
      }, this);
      
      this.setState({
        fakeHeaderTopPosition: scrollTop,
        fakeHeaderLetter: newFakeHeaderLetter
      });
    }
    startIntervalPackagesListScroll() {
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
    refresh() {
      this.setData(this.props.selectedSort);
    }
    setData(selectedSort) {
      var result = this.prepareData(selectedSort);
      if(!_.isUndefined(result.data) && (_.isUndefined(this.state.data) || Object.keys(this.state.data)[0] !== Object.keys(result.data)[0]))
        this.setFakeHeader(result.data);
      
      this.setState({
        data: result.data
      });
    }
    prepareData(selectedSort) {
      var that = this;
      var Packages = db.searchablePackages.deref();

      var SortedPackages = undefined;
      var installedCount = 0;
      var queuedCount = 0;
      
      var selectedSort = selectedSort ? selectedSort : this.props.selectedSort;
      
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
          if(selectedSort !== 'undefined' && selectedSort == 'desc')
            return (a.charAt(0) % 1 === 0 && b.charAt(0) % 1 !== 0) ? -1 : b.localeCompare(a);
          else
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
    onDrop(files) {
      this.setState({
        files: files,
      });
      this.props.openForm();
    }
    showBlacklistForm(packageName, packageVersion, mode) {
      this.setState({
        isBlacklistFormShown: true,
        blacklistedPackageName: packageName,
        blacklistedPackageVersion: packageVersion,
        blacklistMode: mode
      });
    }
    closeBlacklistForm() {
      this.setState({
        isBlacklistFormShown: false,
        blacklistedPackageName: null,
        blacklistedPackageVersion: null
      });
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
    render() {
      if(!_.isUndefined(this.state.data)) {
        var packages = _.map(this.state.data, function(packages, index) {
          var items = _.map(packages, function(pack, i) {
            var that = this;
          return (
            <li key={'package-' + pack.packageName} className={this.state.expandedPackage == pack.packageName ? 'selected' : null}>
              <PackagesListItem
                key={'package-' + pack.packageName + '-items'}
                name={pack.packageName}
                expandPackage={this.expandPackage}
                selected={this.state.expandedPackage == pack.packageName ? true : false}/>
                <VelocityTransitionGroup enter={{animation: "slideDown", begin: function() {that.startIntervalPackagesListScroll()}, complete: function() {that.stopIntervalPackagesListScroll()}}} leave={{animation: "slideUp"}}>
                  {this.state.expandedPackage == pack.packageName ?
                    <PackageListItemDetails
                      key={'package-' + pack.packageName + '-versions'}
                      versions={pack.elements}
                      packageName={pack.packageName}
                      refresh={this.refreshData}
                      showBlacklistForm={this.showBlacklistForm}/>
                  : null}
                </VelocityTransitionGroup>
            </li>
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
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            <ul className="list-group" id="packages-list" style={{height: this.props.packagesListHeight}}>
              <Dropzone ref="dropzone" onDrop={this.onDrop} multiple={false} disableClick={true} className="dnd-zone" activeClassName="dnd-zone-active">
                <div id="packages-list-inside">
                  <div className="ioslist-wrapper" ref="packagesList">
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
                              There are no packages managed by ATS Garage to<br />
                              show. To add a new package, drag and drop it here. 
                            </div>
                          }
                        </div>
                    : undefined}
                    {_.isUndefined(packages) ? 
                      <Loader />
                    : undefined}
                  </div>
                </div>
              </Dropzone>
            </ul>
          </VelocityTransitionGroup>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.isFormShown ?
              <AddPackage
                files={this.state.files}
                closeForm={this.props.closeForm}
                key="add-package"/>
            : null}
          </VelocityTransitionGroup>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.isBlacklistFormShown ?
              <BlacklistForm
                mode={this.state.blacklistMode}
                packageName={this.state.blacklistedPackageName}
                packageVersion={this.state.blacklistedPackageVersion}
                closeForm={this.closeBlacklistForm}/>
            : null}
          </VelocityTransitionGroup>
        </div>
      );
    }
  };

  return PackagesList;
});
