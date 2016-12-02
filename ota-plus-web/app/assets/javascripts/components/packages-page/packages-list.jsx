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
      PackageStatusForm = require('es6!./status/status-form'),
      Loader = require('es6!../loader');
  
  class PackagesList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        searchablePackagesData: undefined,
        searchablePackagesDataNotChanged: undefined,
        expandedPackage: null,
        tmpIntervalId: null,
        fakeHeaderTopPosition: 0,
        fakeHeaderLetter: null,
        isFormShown: this.props.isFormShown,
        files: null,
        blacklistedPackageName: null,
        blacklistedPackageVersion: null,
        blacklistMode: null,
        isBlacklistFormShown: false,
        chosenStatusPackageName: null,
        packagesShownStartIndex: 0,
        packagesShownEndIndex: 50,
        isPackageStatusFormShown: false,
      };
      this.refreshSearchablePackagesData = this.refreshSearchablePackagesData.bind(this);
      this.setSearchablePackagesData = this.setSearchablePackagesData.bind(this);
      this.groupAndSortPackages = this.groupAndSortPackages.bind(this);
      this.onDrop = this.onDrop.bind(this);
      this.showBlacklistForm = this.showBlacklistForm.bind(this);
      this.closeBlacklistForm = this.closeBlacklistForm.bind(this);
      this.showPackageStatusForm = this.showPackageStatusForm.bind(this);
      this.closePackageStatusForm = this.closePackageStatusForm.bind(this);
      this.expandPackage = this.expandPackage.bind(this);
      this.generatePositions = this.generatePositions.bind(this);
      this.setFakeHeader = this.setFakeHeader.bind(this);
      this.packagesListScroll = this.packagesListScroll.bind(this);
      this.startIntervalPackagesListScroll = this.startIntervalPackagesListScroll.bind(this);
      this.stopIntervalPackagesListScroll = this.stopIntervalPackagesListScroll.bind(this);
      this.handlePackageCreated = this.handlePackageCreated.bind(this);
      this.handlePackageBlacklisted = this.handlePackageBlacklisted.bind(this);
      
      SotaDispatcher.dispatch({actionType: 'search-packages-by-regex', regex: this.props.filterValue});
      db.searchablePackages.addWatch("poll-packages", _.bind(this.refreshSearchablePackagesData, this, null));
      db.packageCreated.addWatch("package-created", _.bind(this.handlePackageCreated, this, null));
      db.packageBlacklisted.addWatch("package-blacklisted", _.bind(this.handlePackageBlacklisted, this, null));
    }
    componentDidMount() {
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
    componentWillReceiveProps(nextProps) {
      if(this.props.isFormShown !== nextProps.isFormShown) {
        this.setState({isFormShown: nextProps.isFormShown});
      }
      if(this.props.selectedSort !== nextProps.selectedSort) {
        this.setSearchablePackagesData(nextProps.selectedSort);
      }
    }
    componentWillUnmount() {
      ReactDOM.findDOMNode(this.refs.packagesList).removeEventListener('scroll', this.packagesListScroll);
      db.searchablePackages.reset();      
      db.searchablePackages.removeWatch("poll-packages");
      db.packageCreated.removeWatch("package-created");
      db.packageBlacklisted.removeWatch("package-blacklisted");
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
    setFakeHeader(header) {
      this.setState({fakeHeaderLetter: header});
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
          newFakeHeaderLetter = Object.keys(this.state.searchablePackagesData)[index];
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
      var packagesShownEndIndex = packagesShownStartIndex + Math.floor(this.props.packagesListHeight / listItemHeight) + 2 * offset;     
            
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
    refreshSearchablePackagesData() {
      this.setSearchablePackagesData(this.props.selectedSort);
    }
    setSearchablePackagesData(selectedSort = this.props.selectedSort) {
      var searchablePackages = db.searchablePackages.deref();
      if(!_.isUndefined(searchablePackages)) {
        searchablePackages = this.groupAndSortPackages(searchablePackages, selectedSort);
        if(_.isUndefined(this.state.searchablePackagesData) || Object.keys(this.state.searchablePackagesData)[0] !== Object.keys(searchablePackages)[0])
          this.setFakeHeader(Object.keys(searchablePackages)[0]);
      }
      this.setState({
        searchablePackagesData: searchablePackages,
        searchablePackagesDataNotChanged: db.searchablePackages.deref()
      });
    }
    groupAndSortPackages(packages, selectedSort = this.props.selectedSort) {
      var that = this;
      var groupedPackages = {};
      var sortedPackages = {};
      var installedCount = 0;
      var queuedCount = 0;
            
      _.each(packages, function(obj, index){
        var objKey = obj.id.name+'_'+obj.id.version;
        if(_.isUndefined(groupedPackages[obj.id.name]) || !groupedPackages[obj.id.name] instanceof Array ) {
          groupedPackages[obj.id.name] = new Object();
          groupedPackages[obj.id.name]['elements'] = [];
          groupedPackages[obj.id.name]['packageName'] = obj.id.name;
        }
        groupedPackages[obj.id.name]['elements'].push(packages[index]);
      });

      _.each(groupedPackages, function(obj, index) {
        groupedPackages[index]['elements'] = obj['elements'].sort(function (a, b) {
          var aVersion = a.id.version;
          var bVersion = b.id.version;
          return that.compareVersions(bVersion, aVersion);
        });
      });

      Object.keys(groupedPackages).sort(function(a, b) {
        if(selectedSort !== 'undefined' && selectedSort == 'desc')
          return (a.charAt(0) % 1 === 0 && b.charAt(0) % 1 !== 0) ? -1 : b.localeCompare(a);
        else
          return (a.charAt(0) % 1 === 0 && b.charAt(0) % 1 !== 0) ? 1 : a.localeCompare(b);
      }).forEach(function(key) {
        var firstLetter = key.charAt(0).toUpperCase();
        firstLetter = firstLetter.match(/[A-Z]/) ? firstLetter : '#';

        if( typeof sortedPackages[firstLetter] == 'undefined' || !sortedPackages[firstLetter] instanceof Array ) {
           sortedPackages[firstLetter] = [];
        }
        sortedPackages[firstLetter].push(groupedPackages[key]);
      });
      return sortedPackages;
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
    closeBlacklistForm(ifRefreshData = false) {
      if(ifRefreshData) {
        var that = this;
        setTimeout(function() {
          SotaDispatcher.dispatch({actionType: 'search-packages-by-regex', regex: that.props.filterValue});
          SotaDispatcher.dispatch({actionType: 'impact-analysis'});
        }, 1);
      }
      this.setState({
        isBlacklistFormShown: false,
        blacklistedPackageName: null,
        blacklistedPackageVersion: null
      });
    }
    showPackageStatusForm(packageName) {
      this.setState({
        isPackageStatusFormShown: true,
        chosenStatusPackageName: packageName
      });
    }
    closePackageStatusForm() {
      this.setState({
        isPackageStatusFormShown: false,
        chosenStatusPackageName: null
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
    handlePackageCreated() {
      var packageCreated = db.packageCreated.deref();
      if(!_.isUndefined(packageCreated)) {
        var searchablePackagesNotChanged = this.state.searchablePackagesDataNotChanged;
        
        //TMP: TO REMOVE WHEN API FIELD IS ADDED
        packageCreated.id = packageCreated.packageId;
        //
        
        searchablePackagesNotChanged.push(packageCreated);
        
        var searchablePackages = this.groupAndSortPackages(searchablePackagesNotChanged, this.props.selectedSort);
        
        if(_.isUndefined(this.state.searchablePackagesData) || Object.keys(this.state.searchablePackagesData)[0] !== Object.keys(searchablePackages)[0])
          this.setFakeHeader(Object.keys(searchablePackages)[0]);
        
        this.setState({
          searchablePackagesData: searchablePackages,
          searchablePackagesDataNotChanged: searchablePackagesNotChanged
        });
        db.packageCreated.reset();
      }
    }
    handlePackageBlacklisted() {
      var packageBlacklisted = db.packageBlacklisted.deref();
      if(!_.isUndefined(packageBlacklisted)) {
        var searchablePackagesNotChanged = this.state.searchablePackagesDataNotChanged;
        _.each(searchablePackagesNotChanged, function(pack, index) {
          if(pack.id.name === packageBlacklisted.packageId.name && pack.id.version === packageBlacklisted.packageId.version) {
            searchablePackagesNotChanged[index].isBlackListed = true;
          }
        });
        this.setState({
          searchablePackagesData: this.groupAndSortPackages(searchablePackagesNotChanged, this.props.selectedSort),
          searchablePackagesDataNotChanged: searchablePackagesNotChanged
        });
        db.packageBlacklisted.reset();
      }
    }
    render() {
      var packageIndex = -1;
      if(!_.isUndefined(this.state.searchablePackagesData)) {
        var packages = _.map(this.state.searchablePackagesData, function(packages, index) {
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
                    showPackageStatusForm={this.showPackageStatusForm}
                    selected={this.state.expandedPackage == pack.packageName ? true : false}/>
                    <VelocityTransitionGroup enter={{animation: "slideDown", begin: function() {that.startIntervalPackagesListScroll()}, complete: function() {that.stopIntervalPackagesListScroll()}}} leave={{animation: "slideUp"}}>
                      {this.state.expandedPackage == pack.packageName ?
                        <PackageListItemDetails
                          key={'package-' + pack.packageName + '-versions'}
                          versions={pack.elements}
                          packageName={pack.packageName}
                          showBlacklistForm={this.showBlacklistForm}/>
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
          <ul className="list-group" id="packages-list" style={{height: this.props.packagesListHeight}}>
            <Dropzone ref="dropzone" onDrop={this.onDrop} multiple={false} disableClick={true} className="dnd-zone" activeClassName="dnd-zone-active">
              <div id="packages-list-inside">
                <div className={"ioslist-wrapper" + (!_.isUndefined(packages) && packages.length ? " with-background" : "")} ref="packagesList">
                  <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
                    {!_.isUndefined(packages) ? 
                      packages.length ?
                        <div>
                          <h2 className="ioslist-fake-header" style={{top: this.state.fakeHeaderTopPosition}} ref="fakeHeader">{this.state.fakeHeaderLetter}</h2>
                          {packages}
                        </div>
                      :
                        <div className="col-md-12 height-100 position-relative text-center">
                          <div className="center-xy padding-15">
                            <span className="font-24 white">
                              {this.props.filterValue !== '' ? 
                                <span>No matching packages found.</span>
                              :
                                <span>
                                  There are no packages. <br />
                                  To add a new package drag & drop it here.
                                </span>
                              }
                            </span>
                          </div>
                        </div>
                    : undefined}
                  </VelocityTransitionGroup>
                  {_.isUndefined(packages) ? 
                    <Loader className="white"/>
                  : undefined}
                </div>
              </div>
            </Dropzone>
          </ul>
          
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
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.isPackageStatusFormShown ?
              <PackageStatusForm 
                packageName={this.state.chosenStatusPackageName}
                closeForm={this.closePackageStatusForm}
                hasBetaAccess={this.props.hasBetaAccess}/>
            : null}
          </VelocityTransitionGroup>
        </div>
      );
    }
  };

  return PackagesList;
});
