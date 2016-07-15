define(function(require) {
  var React = require('react'),
      ReactDOM = require('react-dom'),
      SotaDispatcher = require('sota-dispatcher'),
      db = require('stores/db'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      PackagesListItem = require('./packages-list-item'),
      PackageListItemDetails = require('./packages-list-item-details'),
      Dropzone = require('../../mixins/dropzone'),
      AddPackage = require('../packages/add-package'),
      Loader = require('../loader'),
      jQuery = require('jquery'),
      IOSList = require('ioslist');
  
  class PackagesList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: undefined,
        expandedPackage: null,
        timeout: null,
        intervalId: null,
        files: null,
        showForm: this.props.showForm,
        iosListObj: null,
      };
      this.refreshData = this.refreshData.bind(this);
      this.onDrop = this.onDrop.bind(this);
      this.expandPackage = this.expandPackage.bind(this);

      db.searchablePackages.addWatch("poll-packages", _.bind(this.setData, this, null));
    }
    componentWillUpdate(nextProps, nextState) {
      if(nextProps.filterValue != this.props.filterValue) {
        SotaDispatcher.dispatch({actionType: 'search-packages-by-regex', regex: this.props.filterValue});
      }
    }
    componentWillReceiveProps(nextProps) {
      if(this.props.showForm !== nextProps.showForm) {
        this.setState({showForm: nextProps.showForm});
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
      var intervalId = setInterval(function() {
        that.refreshData();
      }, 1000);
      this.setState({intervalId: intervalId});
      this.refreshData();

      var tmpIntervalId = setInterval(function() {
        var packagesListNode = ReactDOM.findDOMNode(that.refs.packagesList);
        if(packagesListNode) {
          var a = jQuery(packagesListNode).ioslist();
          clearInterval(tmpIntervalId);
        }
      }, 30);
    }
    componentWillUnmount() {
      db.searchablePackages.reset();
      db.searchablePackages.removeWatch("poll-packages");
      clearTimeout(this.state.timeout);
      clearInterval(this.state.intervalId);
    }
    refreshData() {
      SotaDispatcher.dispatch({actionType: 'search-packages-by-regex', regex: this.props.filterValue});
    }
    setData() {
      var result = this.prepareData();
      this.setState({
        data: result.data
      });
    }
    onDrop(files) {
      this.setState({
        files: files,
      });
      
      this.props.openForm();
    }
    prepareData() {
      var Packages = db.searchablePackages.deref();

      var SortedPackages = undefined;
      var installedCount = 0;
      var queuedCount = 0;
      if(!_.isUndefined(Packages)) {
        var GroupedPackages = {};
        Packages.find(function(obj, index){
          var objKey = obj.id.name+'_'+obj.id.version;

          if( typeof GroupedPackages[obj.id.name] == 'undefined' || !GroupedPackages[obj.id.name] instanceof Array ) {
            GroupedPackages[obj.id.name] = new Object();
            GroupedPackages[obj.id.name]['elements'] = [];
            GroupedPackages[obj.id.name]['packageName'] = obj.id.name;
          }
          
          GroupedPackages[obj.id.name]['elements'].push(Packages[index]);
        });

        var selectSort = this.props.selectSort;
        SortedPackages = {};
        Object.keys(GroupedPackages).sort(function(a, b) {
          if(selectSort !== 'undefined' && selectSort == 'desc')
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
            var packageInfo = '';
            var mainLabel = '';

            var versions = pack.elements;

            var sortedElements = versions.sort(function (a, b) {
              var aVersion = a.id.version;
              var bVersion = b.id.version;
              return that.compareVersions(bVersion, aVersion);
            });
          return (
            <li key={'package-' + pack.packageName} className={this.state.expandedPackage == pack.packageName ? 'selected' : null}>
              <PackagesListItem
                key={'package-' + pack.packageName + '-items'}
                name={pack.packageName}
                expandPackage={this.expandPackage}
                packageInfo={packageInfo}
                mainLabel={mainLabel}
                selected={this.state.expandedPackage == pack.packageName ? true : false}/>
                <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
                  {this.state.expandedPackage == pack.packageName ?
                    <PackageListItemDetails
                      key={'package-' + pack.packageName + '-versions'}
                      versions={sortedElements}
                      packageName={pack.packageName}
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
                      <div className="col-md-12">
                        <br />
                        <i className="fa fa-warning"></i> Sorry, there is no results.
                      </div>
                    }
                  </Dropzone>
                </ul>
              : undefined}
            </VelocityTransitionGroup>
            {_.isUndefined(packages) ? 
              <Loader />
            : undefined}
            <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
              {this.state.showForm ?
                <AddPackage
                  files={this.state.files}
                  closeForm={this.props.closeForm}
                  key="add-package"/>
              : null}
            </VelocityTransitionGroup>
          </div>
        </div>
      );
    }
  };

  return PackagesList;
});
