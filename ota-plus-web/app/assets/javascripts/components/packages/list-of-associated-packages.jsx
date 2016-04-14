define(function(require) {

  var React = require('react'),
      Router = require('react-router'),
      _ = require('underscore'),
      SotaDispatcher = require('sota-dispatcher');

  var ListOfAssociatedPackages = React.createClass({
    getInitialState: function() {
      return {
        isButtonDisabled: true,
        changesCount: 0
      };
    },
    contextTypes: {
      router: React.PropTypes.func
    },
    componentWillUnmount: function(){
      this.props.AllPackages.removeWatch(this.props.AllPackagesPollEventName);
      this.props.InstalledPackages.removeWatch(this.props.InstalledPackagesPollEventName);
      this.props.QueuedPackages.removeWatch(this.props.QueuedPackagesPollEventName);
    },
    componentWillMount: function(){
      SotaDispatcher.dispatch(this.props.AllPackagesDispatchObject);
      this.props.AllPackages.addWatch(this.props.AllPackagesPollEventName, _.bind(this.forceUpdate, this, null));
      
      SotaDispatcher.dispatch(this.props.InstalledPackagesDispatchObject);
      this.props.InstalledPackages.addWatch(this.props.InstalledPackagesPollEventName, _.bind(this.forceUpdate, this, null));
      
      SotaDispatcher.dispatch(this.props.QueuedPackagesDispatchObject);
      this.props.QueuedPackages.addWatch(this.props.QueuedPackagesPollEventName, _.bind(this.forceUpdate, this, null));
    },
    componentWillUpdate: function(nextProps, nextState) {
      if(nextProps.SelectedVin != this.props.SelectedVin || nextState.refreshData == true) {
        this.resetForm();
        this.props.AllPackages.removeWatch(this.props.AllPackagesPollEventName);
        SotaDispatcher.dispatch(nextProps.AllPackagesDispatchObject);
        this.props.AllPackages.addWatch(nextProps.AllPackagesPollEventName, _.bind(this.forceUpdate, this, null));
      
        this.props.InstalledPackages.removeWatch(this.props.InstalledPackagesPollEventName);
        SotaDispatcher.dispatch(nextProps.InstalledPackagesDispatchObject);
        this.props.InstalledPackages.addWatch(nextProps.InstalledPackagesPollEventName, _.bind(this.forceUpdate, this, null));
        
        this.props.QueuedPackages.removeWatch(this.props.QueuedPackagesPollEventName);
        SotaDispatcher.dispatch(nextProps.QueuedPackagesDispatchObject);
        this.props.QueuedPackages.addWatch(nextProps.QueuedPackagesPollEventName, _.bind(this.forceUpdate, this, null));
      
        this.setState({refreshData: false});
        this.props.UpdateDimensions();
      }
    },
    componentDidMount: function() {
      setInterval(this.refreshData, 5000);
      this.props.UpdateDimensions();
    },
    refreshData: function() {
      SotaDispatcher.dispatch(this.props.AllPackagesDispatchObject);
      SotaDispatcher.dispatch(this.props.InstalledPackagesDispatchObject);
      SotaDispatcher.dispatch(this.props.QueuedPackagesDispatchObject);
    },
    installPackage: function(packageName, packageVersion, e) {
      e.preventDefault();
      
      var data = { 
        name: packageName,
        version: packageVersion
      };
      
      sendRequest.doPost('/api/v1/updates/' + this.props.SelectedVin, data)
        .success(_.bind(function() {
           this.setState({refreshData: true});
        }, this));
    },
    resetForm: function() {
      this.refs.form.getDOMNode().reset();
    },
    prepareData: function() {
      var Installed = this.props.InstalledPackages.deref();
      var Queued = this.props.QueuedPackages.deref();
      var Packages = this.props.AllPackages.deref();
      
      var InstalledIds = {};
      Installed.forEach(function(obj){
        InstalledIds[obj.name+'_'+obj.version] = obj.name+'_'+obj.version;
      });

      var QueuedIds = {};
      Queued.forEach(function(obj){
        QueuedIds[obj.name+'_'+obj.version] = obj.name+'_'+obj.version;
      });
      
      var GroupedPackages = [];
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
          GroupedPackages[obj.id.name] = [];
          GroupedPackages[obj.id.name]['elements'] = [];
          GroupedPackages[obj.id.name]['packageName'] = obj.id.name;
          GroupedPackages[obj.id.name]['isQueued'] = isQueued;
          GroupedPackages[obj.id.name]['isQueuedOrInstalled'] = (isInstalled || isQueued);
        }
        
        if(!GroupedPackages[obj.id.name].isQueued && isQueued) {
            GroupedPackages[obj.id.name]['isQueued'] = true;
        }
        
        if(!GroupedPackages[obj.id.name].isQueuedOrInstalled && (isInstalled || isQueued)) {
            GroupedPackages[obj.id.name]['isQueuedOrInstalled'] = true;
        }
        
        GroupedPackages[obj.id.name]['elements'].push(Packages[index]);
      });
      
      return GroupedPackages;
    },
    packageOnMouseEnter: function(i, packageName, event) {
      var key = 'package'+i;
      this.setState({
        [key]: true
      });
    },
    packageOnMouseLeave: function(i, packageName, event) {
      var key = 'package'+i;
      this.setState({
        [key]: false
      });
    },
    render: function() {
      var Packages = this.prepareData();
      var rows = [];
      var i = 0;
      for(var index in Packages) {
        var key = 'package'+i;
        var SubPackages = Packages[index].elements;
        var SubPackagesRows = [];
        rows.push(
          <tr key={'associated-package-' + Packages[index].packageName} onMouseEnter={this.packageOnMouseEnter.bind(null, i, Packages[index].packageName)} onMouseLeave={this.packageOnMouseLeave.bind(null, i, Packages[index].packageName)} className={Packages[index].isQueuedOrInstalled ? 'selected' : ''}>
            <td>
              {Packages[index].packageName}
                <div>
                  {SubPackages.forEach(function(subpackage){
                    SubPackagesRows.push(
                      <div>
                        Version: <span className="label label-warning">{subpackage.id.version}</span> &nbsp;
                        <span className={'label ' + subpackage.attributes.label}>{subpackage.attributes.string}</span> &nbsp;
                        {subpackage.attributes.status == 'notinstalled' ?
                          <button className='btn btn-primary btn-install' disabled={Packages[index].isQueued} onClick={this.installPackage.bind(null, subpackage.id.name, subpackage.id.version)}>Install</button> 
                        : ''}
                      </div>
                    );
                  }, this)}
                  {SubPackagesRows}
                </div>
            </td>    
          </tr>
        );
        i++;
      }
      
      return (
        <form ref="form" onSubmit={this.handleSubmit}>
          <div className="resizeWrapper">
            <table className="table table-bordered">
              <tbody>
                { rows }
              </tbody>
            </table>
          </div>
        </form>
      );
    }
  });

  return ListOfAssociatedPackages;
});
