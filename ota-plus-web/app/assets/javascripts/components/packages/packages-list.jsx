define(function(require) {
  var React = require('react'),
      ReactDOM = require('react-dom'),
      SotaDispatcher = require('sota-dispatcher'),
      db = require('stores/db'),
      PackagesListItem = require('./packages-list-item'),
      PackageListItemDetails = require('./packages-list-item-details'),
      Dropzone = require('../../mixins/dropzone'),
      Loader = require('../loader'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      TutorialAddPackageFirstStep = require('../tutorial/add-package-first-step'),
      TutorialAddPackageSecondStep = require('../tutorial/add-package-second-step');
  
  class PackagesList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        packagesData: undefined,
        packagesDataNotFiltered: undefined,
        expandedPackage: null,
        tmpIntervalId: null,
        fakeHeaderTopPosition: 0,
        fakeHeaderLetter: null,
        selectedType: null,
        packagesShownStartIndex: 0,
        packagesShownEndIndex: 50
      };
      this.refreshPackagesData = this.refreshPackagesData.bind(this);
      this.setPackagesData = this.setPackagesData.bind(this);
      this.prepareInitialData = this.prepareInitialData.bind(this);
      this.applyFilters = this.applyFilters.bind(this);
      this.onDrop = this.onDrop.bind(this);
      this.expandPackage = this.expandPackage.bind(this);
      this.toggleAutoInstall = this.toggleAutoInstall.bind(this);
      this.handleDeviceSeen = this.handleDeviceSeen.bind(this);
      this.generatePositions = this.generatePositions.bind(this);
      this.setFakeHeader = this.setFakeHeader.bind(this);
      this.packagesListScroll = this.packagesListScroll.bind(this);
      this.startIntervalPackagesListScroll = this.startIntervalPackagesListScroll.bind(this);
      this.stopIntervalPackagesListScroll = this.stopIntervalPackagesListScroll.bind(this);
      this.handlePackageCreated = this.handlePackageCreated.bind(this);
      this.handlePackageBlacklisted = this.handlePackageBlacklisted.bind(this);
      this.handleAutoUpdate = this.handleAutoUpdate.bind(this);

      db.blacklistedPackages.addWatch("poll-blacklisted-packages-page", _.bind(this.refreshPackagesData, this, null));
      db.searchablePackages.addWatch("poll-packages", _.bind(this.refreshPackagesData, this, null));
      db.searchablePackagesForDevice.addWatch("poll-installed-packages", _.bind(this.refreshPackagesData, this, null));
      db.packageQueueForDevice.addWatch("poll-queue-packages", _.bind(this.refreshPackagesData, this, null));
      db.autoInstallPackagesForDevice.addWatch("poll-auto-install-packages-for-device", _.bind(this.refreshPackagesData, this, null));
      db.deviceSeen.addWatch("poll-deviceseen-packages", _.bind(this.handleDeviceSeen, this, null));
      db.packageCreated.addWatch("package-created", _.bind(this.handlePackageCreated, this, null));
      db.packageBlacklisted.addWatch("package-blacklisted", _.bind(this.handlePackageBlacklisted, this, null));
      db.postStatus.addWatch("poll-auto-update", _.bind(this.handleAutoUpdate, this, null));
      SotaDispatcher.dispatch({actionType: 'get-blacklisted-packages'});
      SotaDispatcher.dispatch({actionType: 'get-package-queue-for-device', device: this.props.device.uuid});
      SotaDispatcher.dispatch({actionType: 'search-packages-by-regex', regex: this.props.filterValue});
      SotaDispatcher.dispatch({actionType: 'search-packages-for-device-by-regex', device: this.props.device.uuid, regex: this.props.filterValue});
      SotaDispatcher.dispatch({actionType: 'get-auto-install-packages-for-device', device: this.props.device.uuid});
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
        this.setPackagesData(nextProps.selectedStatus, nextProps.selectedType, nextProps.selectedSort);
      }
    }
    componentDidMount() {
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
      db.autoInstallPackagesForDevice.reset();
      db.blacklistedPackages.removeWatch("poll-blacklisted-packages-page");
      db.searchablePackages.removeWatch("poll-packages")
      db.searchablePackagesForDevice.removeWatch("poll-installed-packages");
      db.packageQueueForDevice.removeWatch("poll-queue-packages");
      db.autoInstallPackagesForDevice.removeWatch("poll-auto-install-packages-for-device");
      db.deviceSeen.removeWatch("poll-deviceseen-packages");
      db.packageCreated.removeWatch("package-created");
      db.packageBlacklisted.removeWatch("package-blacklisted");
      db.postStatus.removeWatch("poll-auto-update");
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
      var scrollTop = ReactDOM.findDOMNode(this.refs.packagesList).scrollTop;
      var newFakeHeaderLetter = this.state.fakeHeaderLetter;
      var headerHeight = !_.isUndefined(this.refs.fakeHeader) ? this.refs.fakeHeader.offsetHeight : 28;
      var positions = this.generatePositions();
      var wrapperPosition = ReactDOM.findDOMNode(this.refs.packagesList).getBoundingClientRect();
      var beforeHeadersCount = 0;
      
      positions.every(function(position, index) {
        if(scrollTop >= position) {
          beforeHeadersCount++;
          newFakeHeaderLetter = Object.keys(this.state.packagesData)[index];
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
    handleDeviceSeen() {
      var deviceSeen = db.deviceSeen.deref();
      if(!_.isUndefined(deviceSeen) && this.props.device.uuid === deviceSeen.uuid) {
        SotaDispatcher.dispatch({actionType: 'get-blacklisted-packages'});
        SotaDispatcher.dispatch({actionType: 'search-packages-by-regex', regex: this.props.filterValue});
        SotaDispatcher.dispatch({actionType: 'search-packages-for-device-by-regex', device: this.props.device.uuid, regex: this.props.filterValue});
      }
    }
    refreshPackagesData() {
      this.setPackagesData(this.props.selectedStatus, this.props.selectedType, this.props.selectedSort);
    }
    setPackagesData(selectedStatus, selectedType, selectedSort) {
      selectedStatus = selectedStatus || this.props.selectedStatus;
      selectedType = selectedType || this.props.selectedType;
      selectedSort = selectedSort || this.props.selectedSort;
    
      var packages = undefined;
      var initialPackagesData = this.prepareInitialData();
            
      if(!_.isUndefined(initialPackagesData)) {
        var packages = this.applyFilters(initialPackagesData, selectedStatus, selectedType, selectedSort);
        
        if(!_.isUndefined(packages.packagesData) && (_.isUndefined(this.state.packagesData) || Object.keys(this.state.packagesData)[0] !== Object.keys(packages.packagesData)[0]))
          this.setFakeHeader(Object.keys(packages.packagesData)[0]);
        
        this.props.setPackagesStatistics(packages.statistics.installedCount, packages.statistics.queuedCount);
        
        this.setState({
          packagesData: packages.packagesData,
          packagesDataNotFiltered: initialPackagesData
        });
      }
    }
    prepareInitialData() {
      var packages = _.clone(db.searchablePackages.deref());
      var installedPackages = _.clone(db.searchablePackagesForDevice.deref());
      var queuedPackages = _.clone(db.packageQueueForDevice.deref());
      var blacklistedPackages = _.clone(db.blacklistedPackages.deref());
      var autoInstallPackagesForDevice = _.clone(db.autoInstallPackagesForDevice.deref());
            
      var result = undefined;
            
      if(!_.isUndefined(packages) && !_.isUndefined(installedPackages) && !_.isUndefined(queuedPackages) && !_.isUndefined(blacklistedPackages) && !_.isUndefined(autoInstallPackagesForDevice)) {
        installedPackages.forEach(function(installed, index) {
          installed.type = 'unmanaged';
          installed.isBlackListed = false;
          packages.push(installed);
        });
                
        packages.forEach(function(installed, packageIndex) {
          packages[packageIndex]['isAutoInstallEnabled'] = false;
          blacklistedPackages.forEach(function(blacklist, blacklistIndex) {
            if(installed.id.name == blacklist.packageId.name && installed.id.version == blacklist.packageId.version) {
              packages[packageIndex]['isBlackListed'] = true;
            }
          });
          autoInstallPackagesForDevice.forEach(function(autoInstallPackage, autoInstallPackageIndex) {
            if(installed.id.name == autoInstallPackage) {
              packages[packageIndex]['isAutoInstallEnabled'] = true;
            }
          });
        });
        
        result = packages;
      }
      return result;
    }
    applyFilters(packages, selectedStatus, selectedType, selectedSort) {
      selectedStatus = selectedStatus || this.props.selectedStatus;
      selectedType = selectedType || this.props.selectedType;
      selectedSort = selectedSort || this.props.selectedSort;
    
      var that = this;
      var sortedPackages = undefined;
      var installedPackages = _.clone(db.searchablePackagesForDevice.deref());
      var queuedPackages = _.clone(db.packageQueueForDevice.deref());
      var installedCount = 0;
      var queuedCount = 0;
        
      switch(selectedType) {
        case 'unmanaged':
          packages = packages.filter(function(pack) {
            return pack.type === 'unmanaged';
          });
        break;
        case 'managed':
          packages = packages.filter(function(pack) {
            return (_.isUndefined(pack.type) || pack.type !== 'unmanaged');
          });
        break;
        default:
        break;
      }
      
      var installedIds = new Object();
      _.each(installedPackages, function(obj, index) {
        installedIds[obj.id.name + '_' + obj.id.version] = obj.id.name + '_' + obj.id.version;
      });

      var queuedIds = new Object();
      _.each(queuedPackages, function(obj, index) {
        queuedIds[obj.packageId.name + '_' + obj.packageId.version] = obj.packageId.name + '_' + obj.packageId.version;
      });

      var groupedPackages = {};
      _.each(packages, function(obj, index) {
        var uri = !_.isUndefined(obj.uri) && !_.isUndefined(obj.uri.uri) ? obj.uri.uri : '';
        var objKey = obj.id.name + '_' + obj.id.version;
        var isQueued = false;
        var isInstalled = false;
                    
        if(objKey in installedIds) {
          packages[index].attributes = {status: 'installed', string: 'Installed', label: 'label-success'};
          isInstalled = true;
        } else if(objKey in queuedIds) {
          packages[index].attributes = {status: 'queued', string: 'Queued', label: 'label-info'};
          isQueued = true;
        } else {
          packages[index].attributes = {status: 'notinstalled', string: 'Not installed', label: 'label-danger'};
        }

        if(_.isUndefined(groupedPackages[obj.id.name]) || !groupedPackages[obj.id.name] instanceof Array ) {
          groupedPackages[obj.id.name] = new Object();
          groupedPackages[obj.id.name]['elements'] = [];
          groupedPackages[obj.id.name]['packageName'] = obj.id.name;
          groupedPackages[obj.id.name]['isQueued'] = isQueued;
          groupedPackages[obj.id.name]['isInstalled'] = isInstalled;
          groupedPackages[obj.id.name]['isBlackListed'] = obj.isBlackListed && isInstalled ? true : false;
          groupedPackages[obj.id.name]['isAutoInstallEnabled'] = !_.isUndefined(obj.isAutoInstallEnabled) ? obj.isAutoInstallEnabled : false;
        }

        if(!groupedPackages[obj.id.name].isQueued && isQueued) {
          groupedPackages[obj.id.name]['isQueued'] = true;
        }
        if(!groupedPackages[obj.id.name].isInstalled && isInstalled) {
          groupedPackages[obj.id.name]['isInstalled'] = true;
        }
        if(!groupedPackages[obj.id.name]['isBlackListed'] && obj.isBlackListed && isInstalled)
          groupedPackages[obj.id.name]['isBlackListed'] = true;
      
        groupedPackages[obj.id.name]['elements'].push(packages[index]);
      });
        
      _.each(groupedPackages, function(obj, index) {
        groupedPackages[index]['elements'] = obj['elements'].sort(function (a, b) {
          var aVersion = a.id.version;
          var bVersion = b.id.version;
          return that.compareVersions(bVersion, aVersion);
        });
      });

      var selectedPackages = {};
      switch(selectedStatus) {
        case 'installed':
          _.each(groupedPackages, function(obj, key) {
            if(obj.isInstalled)
              selectedPackages[key] = groupedPackages[key];
          });
        break;
        case 'queued':
          _.each(groupedPackages, function(obj, key) {
            if(obj.isQueued)
              selectedPackages[key] = groupedPackages[key];
          });
        break;
        case 'uninstalled':
          _.each(groupedPackages, function(obj, key) {
            if(!obj.isInstalled && !obj.isQueued)
              selectedPackages[key] = groupedPackages[key];
          });
        break;
        default:
          selectedPackages = groupedPackages;
        break;
      }
      
      _.each(selectedPackages, function(pack, index) {
        pack.isQueued ? queuedCount++ : null;
        pack.isInstalled ? installedCount++ : null;
      });

      sortedPackages = {};
      Object.keys(selectedPackages).sort(function(a, b) {
        if(selectedSort !== 'undefined' && selectedSort == 'desc')
          return (a.charAt(0) % 1 === 0 && b.charAt(0) % 1 !== 0) ? -1 : b.localeCompare(a);
        else
          return (a.charAt(0) % 1 === 0 && b.charAt(0) % 1 !== 0) ? 1 : a.localeCompare(b);
      }).forEach(function(key) {
        var firstLetter = key.charAt(0).toUpperCase();
        firstLetter = firstLetter.match(/[A-Z]/) ? firstLetter : '#';
        if(_.isUndefined(sortedPackages[firstLetter]) || !sortedPackages[firstLetter] instanceof Array ) {
           sortedPackages[firstLetter] = [];
        }
        sortedPackages[firstLetter].push(selectedPackages[key]);
      });
    
      return {'packagesData': sortedPackages, 'statistics': {'queuedCount': queuedCount, 'installedCount': installedCount}};
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
    toggleAutoInstall(packageName, isAutoInstallEnabled = false) {
      SotaDispatcher.dispatch({
        actionType: isAutoInstallEnabled ? 'disable-package-auto-install-for-device' : 'enable-package-auto-install-for-device',
        packageName: packageName,
        device: this.props.device.uuid
      });
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
        var packagesNotChanged = this.state.packagesDataNotFiltered;
        
        //TMP: TO REMOVE WHEN API FIELD IS ADDED
        packageCreated.id = packageCreated.packageId;
        //
        
        packagesNotChanged.push(packageCreated);
        
        var packages = this.applyFilters(packagesNotChanged, this.props.selectedStatus, this.props.selectedType, this.props.selectedSort);
        
        if(!_.isUndefined(packages.packagesData) && (_.isUndefined(this.state.packagesData) || Object.keys(this.state.packagesData)[0] !== Object.keys(packages.packagesData)[0]))
          this.setFakeHeader(Object.keys(packages.packagesData)[0]);
        
        this.props.setPackagesStatistics(packages.statistics.installedCount, packages.statistics.queuedCount);
        
        this.setState({
          packagesDataNotFiltered: packagesNotChanged,
          packagesData: packages.packagesData
        });
        db.packageCreated.reset();
      }
    }
    handlePackageBlacklisted() {
      var packageBlacklisted = db.packageBlacklisted.deref();
      if(!_.isUndefined(packageBlacklisted)) {
        var packagesNotChanged = this.state.packagesDataNotFiltered;
        _.each(packagesNotChanged, function(pack, index) {
          if(pack.id.name === packageBlacklisted.packageId.name && pack.id.version === packageBlacklisted.packageId.version) {
            packagesNotChanged[index].isBlackListed = true;
          }
        });
        
        var packages = this.applyFilters(packagesNotChanged, this.props.selectedStatus, this.props.selectedType, this.props.selectedSort);
        
        this.setState({
          packagesDataNotFiltered: packagesNotChanged,
          packagesData: packages.packagesData
        });
        db.packageBlacklisted.reset();
      }
    }
    handleAutoUpdate() {
      var postStatus = !_.isUndefined(db.postStatus.deref()) ? db.postStatus.deref() : undefined;
      if(!_.isUndefined(postStatus['enable-package-auto-install-for-device']) && postStatus['enable-package-auto-install-for-device'].status === 'success') {
        var that = this;
        delete postStatus['enable-package-auto-install-for-device'];
        db.postStatus.reset(postStatus);
        setTimeout(function() {
          SotaDispatcher.dispatch({actionType: 'get-auto-install-packages-for-device', device: that.props.device.uuid});
        }, 1);
      }
      if(!_.isUndefined(postStatus['disable-package-auto-install-for-device']) && postStatus['disable-package-auto-install-for-device'].status === 'success') {
        var that = this;
        delete postStatus['disable-package-auto-install-for-device'];
        db.postStatus.reset(postStatus);
        setTimeout(function() {
          SotaDispatcher.dispatch({actionType: 'get-auto-install-packages-for-device', device: that.props.device.uuid});
        }, 1);
      }
    }
    render() {
      var packageIndex = -1;
      if(!_.isUndefined(this.state.packagesData)) {
        var packages = _.map(this.state.packagesData, function(packages, index) {
          var items = _.map(packages, function(pack, i) {
            packageIndex++;
            
            var that = this;
            var queuedPackage;
            var installedPackage;
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
                    packageInfo={packageInfo}
                    mainLabel={mainLabel}
                    deviceId={this.props.device.uuid}
                    isSelected={this.state.expandedPackage == pack.packageName}
                    isBlackListed={pack.isBlackListed}
                    isAutoInstallEnabled={!_.isUndefined(pack.isAutoInstallEnabled) ? pack.isAutoInstallEnabled : false}
                    toggleAutoInstall={this.toggleAutoInstall}/>
                    <VelocityTransitionGroup enter={{animation: "slideDown", begin: function() {that.startIntervalPackagesListScroll()}, complete: function() {that.stopIntervalPackagesListScroll()}}} leave={{animation: "slideUp"}}>
                      {this.state.expandedPackage == pack.packageName ?
                        <PackageListItemDetails
                          key={'package-' + pack.packageName + '-versions'}
                          versions={pack.elements}
                          deviceId={this.props.device.uuid}
                          packageName={pack.packageName}
                          isQueued={pack.isQueued}
                          isAutoInstallEnabled={!_.isUndefined(pack.isAutoInstallEnabled) ? pack.isAutoInstallEnabled : false}
                          showBlacklistForm={this.props.showBlacklistForm}/>
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
                            this.props.selectedType === 'unmanaged' ? 
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
