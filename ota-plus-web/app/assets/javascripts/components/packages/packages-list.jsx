define(function(require) {
  var React = require('react'),
      ReactDOM = require('react-dom'),
      SotaDispatcher = require('sota-dispatcher'),
      db = require('stores/db'),
      PackagesListItem = require('es6!./packages-list-item'),
      PackageListItemDetails = require('es6!./packages-list-item-details'),
      Dropzone = require('es6!../../mixins/dropzone'),
      Loader = require('es6!../loader'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      TutorialAddPackageFirstStep = require('es6!../tutorial/add-package-first-step'),
      TutorialAddPackageSecondStep = require('es6!../tutorial/add-package-second-step');
  
  class PackagesList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: undefined,
        expandedPackage: null,
        timeout: null,
        tmpIntervalId: null,
        fakeHeaderTopPosition: 0,
        fakeHeaderLetter: null,
        tmpQueueData: undefined,
        selectedType: null,
        packagesShownStartIndex: 0,
        packagesShownEndIndex: 50
      };
      this.refreshData = this.refreshData.bind(this);
      this.refresh = this.refresh.bind(this);
      this.setData = this.setData.bind(this);
      this.prepareData = this.prepareData.bind(this);
      this.onDrop = this.onDrop.bind(this);
      this.expandPackage = this.expandPackage.bind(this);
      this.queueUpdated = this.queueUpdated.bind(this);
      this.generatePositions = this.generatePositions.bind(this);
      this.setFakeHeader = this.setFakeHeader.bind(this);
      this.packagesListScroll = this.packagesListScroll.bind(this);
      this.startIntervalPackagesListScroll = this.startIntervalPackagesListScroll.bind(this);
      this.stopIntervalPackagesListScroll = this.stopIntervalPackagesListScroll.bind(this);

      db.blacklistedPackages.addWatch("poll-blacklisted-packages-page", _.bind(this.refresh, this, null));
      db.searchablePackages.addWatch("poll-packages", _.bind(this.refresh, this, null));
      db.searchablePackagesForDevice.addWatch("poll-installed-packages", _.bind(this.refresh, this, null));
      db.packageQueueForDevice.addWatch("poll-queued-packages", _.bind(this.queueUpdated, this, null));
    }
    componentWillUpdate(nextProps, nextState) {
      if(nextProps.filterValue != this.props.filterValue) {
        SotaDispatcher.dispatch({actionType: 'search-packages-by-regex', regex: nextProps.filterValue});
        SotaDispatcher.dispatch({actionType: 'search-packages-for-device-by-regex', device: this.props.device.uuid, regex: nextProps.filterValue});
      }
    }
    componentWillReceiveProps(nextProps) {
      if(this.props.showForm !== nextProps.showForm) {
        this.setState({showForm: nextProps.showForm});
      }
      if(this.props.selectedStatus !== nextProps.selectedStatus || 
              this.props.selectedType !== nextProps.selectedType || 
              this.props.selectedSort !== nextProps.selectedSort) {
        this.setData(nextProps.selectedStatus, nextProps.selectedType, nextProps.selectedSort);
      }
      if(this.props.selectedType !== nextProps.selectedType) {
        this.setState({
          selectedType: nextProps.selectedType
        });
      }
    }
    componentDidMount() {
      var that = this;
      this.refreshData();
      ReactDOM.findDOMNode(this.refs.packagesList).addEventListener('scroll', this.packagesListScroll);
    }
    componentDidUpdate(prevProps, prevState) {
      if(this.props.selectedType !== prevProps.selectedType || this.props.selectedStatus !== prevProps.selectedStatus) {
        ReactDOM.findDOMNode(this.refs.packagesList).scrollTop = 0;
      }
      if(this.props.packagesListHeight !== prevProps.packagesListHeight) {
        this.packagesListScroll();
      }
    }
    componentWillUnmount() {
      ReactDOM.findDOMNode(this.refs.packagesList).removeEventListener('scroll', this.packagesListScroll);
      db.searchablePackages.reset();
      db.searchablePackagesForDevice.reset();
      db.packageQueueForDevice.reset();
      db.blacklistedPackages.removeWatch("poll-blacklisted-packages-page");
      db.searchablePackages.removeWatch("poll-packages");
      db.searchablePackagesForDevice.removeWatch("poll-installed-packages");
      db.packageQueueForDevice.removeWatch("poll-queued-packages");
      clearTimeout(this.state.timeout);
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
    setFakeHeader(data) {
      this.setState({fakeHeaderLetter: Object.keys(data)[0]});
    }
    packagesListScroll() {
      var scrollTop = ReactDOM.findDOMNode(this.refs.packagesList).scrollTop;
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
    queueUpdated() {
      if(JSON.stringify(this.state.tmpQueueData) !== JSON.stringify(db.packageQueueForDevice.deref())) {
        SotaDispatcher.dispatch({actionType: 'get-blacklisted-packages'});
        SotaDispatcher.dispatch({actionType: 'search-packages-by-regex', regex: this.props.filterValue});
        SotaDispatcher.dispatch({actionType: 'search-packages-for-device-by-regex', device: this.props.device.uuid, regex: this.props.filterValue});
      }
      this.setState({
        tmpQueueData: db.packageQueueForDevice.deref()
      });
    }
    refreshData() {
      SotaDispatcher.dispatch({actionType: 'get-blacklisted-packages'});
      SotaDispatcher.dispatch({actionType: 'get-package-queue-for-device', device: this.props.device.uuid});
      SotaDispatcher.dispatch({actionType: 'search-packages-by-regex', regex: this.props.filterValue});
      SotaDispatcher.dispatch({actionType: 'search-packages-for-device-by-regex', device: this.props.device.uuid, regex: this.props.filterValue});
    }
    refresh() {
      this.setData(this.props.selectedStatus, this.props.selectedType, this.props.selectedSort);
    }
    setData(selectedStatus, selectedType, selectedSort) {
      var result = this.prepareData(selectedStatus, selectedType, selectedSort);
      if(!_.isUndefined(result.data) && (_.isUndefined(this.state.data) || Object.keys(this.state.data)[0] !== Object.keys(result.data)[0]))
        this.setFakeHeader(result.data);
      
      this.props.setPackagesStatistics(result.statistics.installedCount, result.statistics.queuedCount);
      this.setState({
        data: result.data
      });
    }
    prepareData(selectedStatus, selectedType, selectedSort) {
      var that = this;
      var Packages = _.clone(db.searchablePackages.deref());
      var Installed = _.clone(db.searchablePackagesForDevice.deref());
      var Queued = _.clone(db.packageQueueForDevice.deref());
      var BlackList = _.clone(db.blacklistedPackages.deref());

      var SortedPackages = undefined;
      var installedCount = 0;
      var queuedCount = 0;

      var selectedStatus = selectedStatus ? selectedStatus : this.props.selectedStatus;
      var selectedType = selectedType ? selectedType : this.props.selectedType;
      var selectedSort = selectedSort ? selectedSort : this.props.selectedSort;
            
      if(!_.isUndefined(Packages) && !_.isUndefined(Installed) && !_.isUndefined(Queued) && !_.isUndefined(BlackList)) {
        _.each(Packages, function(obj, index){
          Packages[index].isManagedPackage = true;
        });
        
        BlackList.forEach(function(blacklist, index){
          Installed.forEach(function(installed, index) {
            if(installed.id.name == blacklist.packageId.name && installed.id.version == blacklist.packageId.version) {
              Installed[index]['isBlackListed'] = true;
            }
          });
        });
        
        switch(selectedType) {
          case 'all': 
            Installed.forEach(function(installed, index){
              Packages.push(installed);
            });
          break;
          case 'unmanaged':
            Packages.forEach(function(obj) {
              Installed = Installed.filter(function(res){
                return (res.id.name != obj.id.name && res.id.version != obj.id.version);
              });
            });
            Packages = Installed;
          break;
          default:
          break;
        }
                        
        var InstalledIds = new Object();
        _.each(Installed, function(obj, index){
          InstalledIds[obj.id.name+'_'+obj.id.version] = obj.id.name+'_'+obj.id.version;
        });

        var QueuedIds = new Object();
        _.each(Queued, function(obj, index){
          QueuedIds[obj.packageId.name+'_'+obj.packageId.version] = obj.packageId.name+'_'+obj.packageId.version;
        });

        var GroupedPackages = {};
        _.each(Packages, function(obj, index){
          var uri = !_.isUndefined(obj.uri) && !_.isUndefined(obj.uri.uri) ? obj.uri.uri : '';
          var objKey = obj.id.name+'_'+obj.id.version;
          var isQueued = false;
          var isInstalled = false;
                    
          var isDebOrRpmPackage = uri.toLowerCase().indexOf('.deb') > -1 || uri.toLowerCase().indexOf('.rpm') > -1 ? true : false;
          var isManagedPackage = !_.isUndefined(obj.isManagedPackage) && obj.isManagedPackage ? true : false;

          if(objKey in InstalledIds) {
            Packages[index].attributes = {status: 'installed', string: 'Installed', label: 'label-success'};
            isInstalled = true;
          } else if(objKey in QueuedIds) {
            Packages[index].attributes = {status: 'queued', string: 'Queued', label: 'label-info'};
            isQueued = true;
          } else {
            Packages[index].attributes = {status: 'notinstalled', string: 'Not installed', label: 'label-danger'};
          }

          if( typeof GroupedPackages[obj.id.name] == 'undefined' || !GroupedPackages[obj.id.name] instanceof Array ) {
            GroupedPackages[obj.id.name] = new Object();
            GroupedPackages[obj.id.name]['elements'] = [];
            GroupedPackages[obj.id.name]['packageName'] = obj.id.name;
            GroupedPackages[obj.id.name]['isQueued'] = isQueued;
            GroupedPackages[obj.id.name]['isInstalled'] = isInstalled;
            GroupedPackages[obj.id.name]['isDebOrRpmPackage'] = isDebOrRpmPackage;
            GroupedPackages[obj.id.name]['isManagedPackage'] = isManagedPackage;
            GroupedPackages[obj.id.name]['isBlackListed'] = obj.isBlackListed && isInstalled ? true : false;

            isQueued ? queuedCount++ : null;
            isInstalled ? installedCount++ : null;
          }

          if(!GroupedPackages[obj.id.name].isQueued && isQueued) {
            GroupedPackages[obj.id.name]['isQueued'] = true;
            queuedCount++;
          }

          if(!GroupedPackages[obj.id.name].isInstalled && isInstalled) {
            GroupedPackages[obj.id.name]['isInstalled'] = true;
            installedCount++;
          }
          
          if(!GroupedPackages[obj.id.name].isDebOrRpmPackage && isDebOrRpmPackage) {
            GroupedPackages[obj.id.name]['isDebOrRpmPackage'] = true;
          }
          
          if(!GroupedPackages[obj.id.name]['isBlackListed'] && obj.isBlackListed && isInstalled)
            GroupedPackages[obj.id.name]['isBlackListed'] = true;

          GroupedPackages[obj.id.name]['elements'].push(Packages[index]);
        });
        
        _.each(GroupedPackages, function(obj, index) {
          GroupedPackages[index]['elements'] = obj['elements'].sort(function (a, b) {
            var aVersion = a.id.version;
            var bVersion = b.id.version;
            return that.compareVersions(bVersion, aVersion);
          });
        });

        var SelectedPackages = {};
        switch(selectedStatus) {
          case 'installed':
            _.each(GroupedPackages, function(obj, key) {
              if(obj.isInstalled)
                SelectedPackages[key] = GroupedPackages[key];
            });
          break;
          case 'queued':
            _.each(GroupedPackages, function(obj, key) {
              if(obj.isQueued)
                SelectedPackages[key] = GroupedPackages[key];
            });
          break;
          case 'uninstalled':
            _.each(GroupedPackages, function(obj, key) {
              if(!obj.isInstalled && !obj.isQueued)
                SelectedPackages[key] = GroupedPackages[key];
            });
          break;
          default:
            SelectedPackages = GroupedPackages;
          break;
        }

        SortedPackages = {};
        Object.keys(SelectedPackages).sort(function(a, b) {
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
          SortedPackages[firstLetter].push(SelectedPackages[key]);
        });
      }
    
      return {'data': SortedPackages, 'statistics': {'queuedCount': queuedCount, 'installedCount': installedCount}};
    }
    onDrop(files) {
      this.props.onDrop(files);
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
      var packageIndex = -1;
      if(!_.isUndefined(this.state.data)) {
        var packages = _.map(this.state.data, function(packages, index) {
          var items = _.map(packages, function(pack, i) {
            packageIndex++;
            
            var that = this;
            var queuedPackage = '';
            var installedPackage = '';
            var packageInfo = '';
            var mainLabel = '';

            var tmp = _.find(pack.elements, function (i) {
              return i.attributes.status == 'queued';
            });
            queuedPackage = (tmp !== undefined) ? tmp.id.version : '';

            tmp = _.find(pack.elements, function (i) {
              return i.attributes.status == 'installed';
            });
            installedPackage = (tmp !== undefined) ? tmp.id.version : '';

            if(packageIndex >= this.state.packagesShownStartIndex && packageIndex <= this.state.packagesShownEndIndex)
              return (
                <li key={'package-' + pack.packageName} className={this.state.expandedPackage == pack.packageName ? 'selected' : null}>
                  <PackagesListItem
                    key={'package-' + pack.packageName + '-items'}
                    name={pack.packageName}
                    expandPackage={this.expandPackage}
                    queuedPackage={queuedPackage}
                    installedPackage={installedPackage}
                    isDebOrRpmPackage={pack.isDebOrRpmPackage}
                    isManagedPackage={pack.isManagedPackage}
                    packageInfo={packageInfo}
                    mainLabel={mainLabel}
                    deviceId={this.props.device.uuid}
                    selected={this.state.expandedPackage == pack.packageName ? true : false}
                    isBlackListed={pack.isBlackListed}/>
                    <VelocityTransitionGroup enter={{animation: "slideDown", begin: function() {that.startIntervalPackagesListScroll()}, complete: function() {that.stopIntervalPackagesListScroll()}}} leave={{animation: "slideUp"}}>
                      {this.state.expandedPackage == pack.packageName ?
                        <PackageListItemDetails
                          key={'package-' + pack.packageName + '-versions'}
                          versions={pack.elements}
                          deviceId={this.props.device.uuid}
                          packageName={pack.packageName}
                          isQueued={pack.isQueued}
                          refresh={this.refreshData}
                          showBlacklistForm={this.props.showBlacklistForm}
                          closeBlacklistForm={this.props.closeBlacklistForm}/>
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
                <div className="ioslist-wrapper" ref="packagesList">
                  <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
                    {!_.isUndefined(packages) ? 
                      packages.length ?
                        <div>
                          <h2 className="ioslist-fake-header" style={{top: this.state.fakeHeaderTopPosition}} ref="fakeHeader">{this.state.fakeHeaderLetter}</h2>
                          {packages}
                        </div>
                      :
                        <div className="height-100 position-relative text-center">
                          {this.props.filterValue !== '' ? 
                            <div className="center-xy padding-15">
                              No matching packages found.
                            </div>
                          :
                            this.state.selectedType === 'unmanaged' ? 
                              <div className="center-xy padding-15">
                                This device hasn’t reported any information about<br />
                                its system-installed software packages yet.
                              </div>
                            :
                              <div className="center-xy padding-15">
                                There are no packages managed by ATS Garage to<br />
                                show. To add a new package, drag and drop it here. 
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
            </Dropzone>
          </ul>
          {this.props.device.status !== 'NotSeen' 
                      && !_.isUndefined(db.searchablePackages.deref()) && !db.searchablePackages.deref().length ? 
            null
          : null}
          {this.props.device.status !== 'NotSeen' 
                      && !_.isUndefined(db.searchablePackages.deref()) && db.searchablePackages.deref().length
                      && !_.isUndefined(db.searchablePackagesForDevice.deref()) && !db.searchablePackagesForDevice.deref().length 
                      && !_.isUndefined(db.packageQueueForDevice.deref()) && db.packageQueueForDevice.deref().length ?
            null
          : null}
        </div>
      );
    }
  };

  return PackagesList;
});
