define(function(require) {
  var React = require('react'),
      ReactDOM = require('react-dom'),
      SotaDispatcher = require('sota-dispatcher'),
      db = require('stores/db'),
      PackagesListItem = require('es6!./packages-list-item'),
      PackageListItemDetails = require('es6!./packages-list-item-details'),
      Dropzone = require('es6!../../mixins/dropzone'),
      Loader = require('es6!../loader'),
      jQuery = require('jquery'),
      IOSList = require('ioslist'),
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
        iosListObj: null,
        selectedToAnalyse: [],
        tmpQueueData: undefined,
        selectedType: null
      };
      this.refreshData = this.refreshData.bind(this);
      this.onDrop = this.onDrop.bind(this);
      this.expandPackage = this.expandPackage.bind(this);
      this.selectToAnalyse = this.selectToAnalyse.bind(this);
      this.updateListToAnalyse = this.updateListToAnalyse.bind(this);
      this.refresh = this.refresh.bind(this);
      this.queueUpdated = this.queueUpdated.bind(this);

      db.searchablePackages.addWatch("poll-packages", _.bind(this.refresh, this, null));
      db.searchablePackagesForDevice.addWatch("poll-installed-packages", _.bind(this.refresh, this, null));
      db.packageQueueForDevice.addWatch("poll-queued-packages", _.bind(this.queueUpdated, this, null));
    }
    componentWillUpdate(nextProps, nextState) {
      if(nextProps.filterValue != this.props.filterValue) {
        SotaDispatcher.dispatch({actionType: 'search-packages-by-regex', regex: nextProps.filterValue});
        SotaDispatcher.dispatch({actionType: 'search-packages-for-device-by-regex', device: this.props.device.id, regex: nextProps.filterValue});
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
        this.setState({selectedType: nextProps.selectedType});
      }
      
    }
    componentDidUpdate(prevProps, prevState) {
      if(!_.isUndefined(prevState.data) && Object.keys(prevState.data).length === 0 && !_.isUndefined(this.state.data) && Object.keys(this.state.data).length > 0) {
        jQuery(ReactDOM.findDOMNode(this.refs.packagesList)).ioslist();
      } else {
        document.body.dispatchEvent(new CustomEvent("refreshList"));
      }
    }
    componentDidMount() {
      var that = this;
      this.refreshData();

      var tmpIntervalId = setInterval(function() {
        var packagesListNode = ReactDOM.findDOMNode(that.refs.packagesList);
        if(packagesListNode) {
          var a = jQuery(packagesListNode).ioslist();
          clearInterval(tmpIntervalId);
        }
      }, 500);
      
      $('#selectPackages').change(function() {
        if($(this).prop('checked')) {
          $('.checkbox-impact').each(function() {
            $(this).prop('checked', 'checked');
          });
          that.updateListToAnalyse('selectAll');
        } else {
          $('.checkbox-impact').each(function() {
            $(this).prop('checked', false);
          });
          that.updateListToAnalyse();
        }
      });
    }
    componentWillUnmount() {
      db.searchablePackages.reset();
      db.searchablePackagesForDevice.reset();
      db.packageQueueForDevice.reset();
      db.searchablePackages.removeWatch("poll-packages");
      db.searchablePackagesForDevice.removeWatch("poll-installed-packages");
      db.packageQueueForDevice.removeWatch("poll-queued-packages");
      clearTimeout(this.state.timeout);
    }
    refreshData() {
      SotaDispatcher.dispatch({actionType: 'get-package-queue-for-device', device: this.props.device.id});
      SotaDispatcher.dispatch({actionType: 'search-packages-by-regex', regex: this.props.filterValue});
      SotaDispatcher.dispatch({actionType: 'search-packages-for-device-by-regex', device: this.props.device.id, regex: this.props.filterValue});
    }
    refresh() {
      this.setData(this.props.selectedStatus, this.props.selectedType, this.props.selectedSort);
    }
    queueUpdated() {
      if(JSON.stringify(this.state.tmpQueueData) !== JSON.stringify(db.packageQueueForDevice.deref())) {
        SotaDispatcher.dispatch({actionType: 'search-packages-by-regex', regex: this.props.filterValue});
        SotaDispatcher.dispatch({actionType: 'search-packages-for-device-by-regex', device: this.props.device.id, regex: this.props.filterValue});
      }
      this.setState({
        tmpQueueData: db.packageQueueForDevice.deref()
      });
    }
    setData(selectedStatus, selectedType, selectedSort) {
      var result = this.prepareData(selectedStatus, selectedType, selectedSort);
      var data = result.data;
      this.props.setPackagesStatistics(result.statistics.installedCount, result.statistics.queuedCount);
      this.setState({
        data: data
      });
    }
    onDrop(files) {
      this.props.onDrop(files);
    }
    prepareData(selectedStatus, selectedType, selectedSort) {
      var Packages = _.clone(db.searchablePackages.deref());
      var Installed = _.clone(db.searchablePackagesForDevice.deref());
      var Queued = _.clone(db.packageQueueForDevice.deref());

      var SortedPackages = undefined;
      var installedCount = 0;
      var queuedCount = 0;

      var selectedStatus = selectedStatus ? selectedStatus : this.props.selectedStatus;
      var selectedType = selectedType ? selectedType : this.props.selectedType;
      var selectedSort = selectedSort ? selectedSort : this.props.selectedSort;
            
      if(!_.isUndefined(Packages) && !_.isUndefined(Installed) && !_.isUndefined(Queued)) {
        switch(selectedType) {
          case 'all': 
            Installed.forEach(function(installed){
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
        Installed.forEach(function(obj){
          InstalledIds[obj.id.name+'_'+obj.id.version] = obj.id.name+'_'+obj.id.version;
        });

        var QueuedIds = new Object();
        Queued.forEach(function(obj){
          QueuedIds[obj.packageId.name+'_'+obj.packageId.version] = obj.packageId.name+'_'+obj.packageId.version;
        });

        var GroupedPackages = {};
        Packages.find(function(obj, index){
          var uri = !_.isUndefined(obj.uri) && !_.isUndefined(obj.uri.uri) ? obj.uri.uri : '';
          var objKey = obj.id.name+'_'+obj.id.version;
          var isQueued = false;
          var isInstalled = false;
                    
          var isDebOrRpmPackage = uri.toLowerCase().includes('.deb') || uri.toLowerCase().includes('.rpm') ? true : false;

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

          GroupedPackages[obj.id.name]['elements'].push(Packages[index]);
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
    selectToAnalyse(name) {
      var selectedToAnalyse = this.state.selectedToAnalyse;

      var index = 0;
      if(index = selectedToAnalyse.indexOf(name) > -1) {
        selectedToAnalyse = selectedToAnalyse.filter(function(i) {
          return i != name;
        });
      } else {
        selectedToAnalyse.push(name);
      }
      this.setState({
        selectedToAnalyse: selectedToAnalyse
      });

      this.props.countImpactAnalysisPackages(selectedToAnalyse.length);
    }
    updateListToAnalyse(action) {
      var selectedToAnalyse = [];

      if(action == 'selectAll') {
        _.each(this.state.data, function(group, i) {
          _.each(group, function(pack, j) {
            selectedToAnalyse.push(pack.packageName);
          });
        });
      }
      this.setState({
        selectedToAnalyse: selectedToAnalyse,
      });
      this.props.countImpactAnalysisPackages(selectedToAnalyse.length);
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
            var queuedPackage = '';
            var installedPackage = '';
            var packageInfo = '';
            var mainLabel = '';

            var versions = pack.elements;

            var sortedElements = versions.sort(function (a, b) {
              var aVersion = a.id.version;
              var bVersion = b.id.version;
              return that.compareVersions(bVersion, aVersion);
            });

            var tmp = sortedElements.find(function (i) {
              return i.attributes.status == 'queued';
            });
            queuedPackage = (tmp !== undefined) ? tmp.id.version : '';

            tmp = sortedElements.find(function (i) {
              return i.attributes.status == 'installed';
            });
            installedPackage = (tmp !== undefined) ? tmp.id.version : '';

          return (
            <li key={'package-' + pack.packageName} className={this.state.expandedPackage == pack.packageName ? 'selected' : null}>
              <PackagesListItem
                key={'package-' + pack.packageName + '-items'}
                name={pack.packageName}
                expandPackage={this.expandPackage}
                queuedPackage={queuedPackage}
                installedPackage={installedPackage}
                isDebOrRpmPackage={pack.isDebOrRpmPackage}
                packageInfo={packageInfo}
                mainLabel={mainLabel}
                selectToAnalyse={this.selectToAnalyse}
                deviceId={this.props.device.id}
                selected={this.state.expandedPackage == pack.packageName ? true : false}/>
                <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
                  {this.state.expandedPackage == pack.packageName ?
                    <PackageListItemDetails
                      key={'package-' + pack.packageName + '-versions'}
                      versions={sortedElements}
                      deviceId={this.props.device.id}
                      packageName={pack.packageName}
                      isQueued={pack.isQueued}
                      refresh={this.refreshData}/>
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
          <div>
            <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
              {!_.isUndefined(packages) ? 
                <ul className="list-group" id="packages-list" style={{height: this.props.packagesListHeight}}>
                  <Dropzone ref="dropzone" onDrop={this.onDrop} multiple={false} disableClick={true} className="dnd-zone" activeClassName="dnd-zone-active">
                    {packages.length ?
                      <div id="packages-list-inside" ref="packagesList">
                        <h2 className="ioslist-fake-header"></h2>
                        <div className="ioslist-wrapper">
                          {packages}
                        </div>
                      </div>
                    :
                      <div className="height-100 position-relative text-center">
                        {this.state.selectedType === 'unmanaged' ? 
                          <div className="center-xy padding-15">
                            This device hasn’t reported any information about<br />
                            its system-installed software packages yet 
                          </div>
                        :
                          <div className="center-xy padding-15">
                            There are no packages managed by ATS Garage to<br />
                            show. To add a new package, drag and drop it here. 
                          </div>
                        }
                      </div>
                    }
                  </Dropzone>
                </ul>
              : undefined}
            </VelocityTransitionGroup>
            {_.isUndefined(packages) ? 
              <Loader />
            : undefined}
          </div>
            
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
