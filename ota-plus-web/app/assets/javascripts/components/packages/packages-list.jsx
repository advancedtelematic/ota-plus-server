define(function(require) {
  var React = require('react'),
      ReactCSSTransitionGroup = React.addons.CSSTransitionGroup,
      SotaDispatcher = require('sota-dispatcher'),
      PackagesListItem = require('./packages-list-item'),
      PackageListItemDetails = require('./packages-list-item-details'),
      Dropzone = require('../../mixins/dropzone'),
      AddPackage = require('./add-package');
  
  class PackagesList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: {},
        expandedPackage: null,
        timeout: null,
        intervalId: null,
        files: null,
        showForm: false
      };
      this.refreshData = this.refreshData.bind(this);
      this.onDrop = this.onDrop.bind(this);
      this.closeForm = this.closeForm.bind(this);
      this.expandPackage = this.expandPackage.bind(this);
      
      this.props.AllPackages.addWatch(this.props.AllPackagesPollEventName, _.bind(this.forceUpdate, this, null));
      this.props.InstalledPackages.addWatch(this.props.InstalledPackagesPollEventName, _.bind(this.forceUpdate, this, null));
      this.props.QueuedPackages.addWatch(this.props.QueuedPackagesPollEventName, _.bind(this.forceUpdate, this, null));
    }
    componentWillUpdate(nextProps, nextState) {
      if(nextProps.filterValue != this.props.filterValue) {        
        SotaDispatcher.dispatch(nextProps.AllPackagesDispatchObject);
      }
    }
    componentDidMount() {
      var that = this;
      var intervalId = setInterval(function() {
        that.refreshData();
      }, 1000);
      this.setState({intervalId: intervalId});
      this.refreshData();
    }
    componentWillUnmount(){
      this.props.AllPackages.removeWatch(this.props.AllPackagesPollEventName);
      this.props.InstalledPackages.removeWatch(this.props.InstalledPackagesPollEventName);
      this.props.QueuedPackages.removeWatch(this.props.QueuedPackagesPollEventName);
      clearTimeout(this.state.timeout);
      clearInterval(this.state.intervalId);
    }
    refreshData() {
      var that = this;
    
      SotaDispatcher.dispatch(this.props.AllPackagesDispatchObject);      
      SotaDispatcher.dispatch(this.props.InstalledPackagesDispatchObject);      
      SotaDispatcher.dispatch(this.props.QueuedPackagesDispatchObject);
      
      var timeout = setTimeout(function() {
        var result = that.prepareData();
        var data = result.data;
        that.props.setPackagesStatistics(result.statistics.installedCount, result.statistics.queuedCount);
        that.setState({
          data: data
        });
      }, 200);
      
      this.setState({
        timeout: timeout
      }); 
    }
    onDrop(files) {
      this.setState({
        files: files,
        showForm: true
      });
    }
    closeForm() {
      this.setState({
        showForm: false
      });
    }
    prepareData() {
      var Packages = this.props.AllPackages.deref();
      var Installed = this.props.InstalledPackages.deref();
      var Queued = this.props.QueuedPackages.deref();
      
      var installedCount = 0;
      var queuedCount = 0;
      
      var InstalledIds = new Object();
      Installed.forEach(function(obj){
        InstalledIds[obj.id.name+'_'+obj.id.version] = obj.id.name+'_'+obj.id.version;
      });
      
      var QueuedIds = new Object();
      Queued.forEach(function(obj){
        QueuedIds[obj.packageId.name+'_'+obj.packageId.version] = obj.packageId.name+'_'+obj.packageId.version;
      });
            
      var GroupedPackages = new Object();
      Packages.filter(function(obj, index){
        var objKey = obj.id.name+'_'+obj.id.version;
        var isQueued = false;
        var isInstalled = false;
        
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
        
        GroupedPackages[obj.id.name]['elements'].push(Packages[index]);
      });
      
      return {'data': GroupedPackages, 'statistics': {'queuedCount': queuedCount, 'installedCount': installedCount}};
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
      var Packages = this.state.data;
      var selectSort = this.props.selectSort;
      var SortedPackages = {};
      
      switch(this.props.selectStatus) {
        case 'installed': 
          Packages = _.filter(Packages, function(obj) {
            return obj.isInstalled;
          });
        break;
        case 'queued': 
          Packages = _.filter(Packages, function(obj) {
            return obj.isQueued;
          });
        break;
        case 'uninstalled': 
          Packages = _.filter(Packages, function(obj) {
            return (!obj.isQueued && !obj.isInstalled);
          });
        break;
      } 
      
      Object.keys(Packages).sort(function(a, b) {
        if(selectSort !== 'undefined' && selectSort == 'desc') 
          return b.localeCompare(a);
        else
          return a.localeCompare(b);
      }).forEach(function(key) {
        SortedPackages[key] = Packages[key];
      });

      var lettersArray = [];
      var packages = _.map(SortedPackages, function(pack, i) {
        var queuedPackage = '';
        var installedPackage = '';
        var packageInfo = '';
        var mainLabel = '';
        
        var elements = pack.elements;
        var that = this;
        var sortedElements = elements.sort(function (a, b) {
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
                
        var firstLetter = pack.packageName.charAt(0);
        var showLetterHeader = false;
        if(lettersArray.indexOf(firstLetter) == -1) {
          lettersArray.push(firstLetter);
          showLetterHeader = true;
        }
        
        return (
          <div key={'package-' + pack.packageName}>
            {showLetterHeader ? <li className="list-group-item disabled">{firstLetter.toUpperCase()}</li> : null}
            <PackagesListItem key={'package-' + pack.packageName + '-items'} name={pack.packageName} expandPackage={this.expandPackage} queuedPackage={queuedPackage} installedPackage={installedPackage} packageInfo={packageInfo} mainLabel={mainLabel}/>
            {this.state.expandedPackage == pack.packageName ?
              <ReactCSSTransitionGroup
                transitionAppear={true}
                transactionLeave={false}
                transitionAppearTimeout={500}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}
                transitionName="example">
                <PackageListItemDetails 
                  key={'package-' + pack.packageName + '-versions'} 
                  versions={sortedElements} 
                  vin={this.props.vin} 
                  packageName={pack.packageName}
                  isQueued={pack.isQueued}
                  refresh={this.refreshData}/> 
              </ReactCSSTransitionGroup>
            : null}
          </div>
        );
      }, this);

      return (
        <div>
          {this.props.lastSeen ?
            <div>
              <ul id="packages-list" className="list-group"> 
                <Dropzone ref="dropzone" onDrop={this.onDrop} multiple={false} disableClick={true} className="dnd-zone" activeClassName="dnd-zone-active">
                  {packages.length > 0 ? packages 
                  :
                    <div className="col-md-12">
                      <br />
                      <i className="fa fa-warning"></i> Sorry, there is no results.
                    </div>
                  }
                </Dropzone>
              </ul>
              {this.state.showForm ? 
                <AddPackage 
                  files={this.state.files}
                  vin={this.props.vin}
                  closeForm={this.closeForm}
                  key="add-package"/> 
              : null}
            </div>
          : 
            <ul id="packages-list" className="list-group"> 
              {packages.length > 0 ? packages 
              :
                <div className="col-md-12">
                  <br />
                  <i className="fa fa-warning"></i> Sorry, there is no results.
                </div>
              }
            </ul>
          }
        </div>
      );
    }
  };

  return PackagesList;
});
