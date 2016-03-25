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
      if(nextProps.SelectedVin != this.props.SelectedVin) {
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
      }
    },
    handleSubmit: function(e) {
      e.preventDefault();
      var formElements = this.refs.form.getDOMNode().elements;
      var data = [];
      _.map(formElements, function(element) {
        if(element.type == 'checkbox' && element.checked) {
          data.push({
            name: element.dataset.packagename,
            version: element.dataset.packageversion
          });
        }
      });
      if(data.length) {
          SotaDispatcher.dispatch({
          actionType: 'add-packages-to-vin',
          vin: this.props.SelectedVin,
          packages: data
        });
      } else {
        alert('Please select at least one package');
      }
    },
    resetForm: function() {
      this.refs.form.getDOMNode().reset();
      this.changeButtonState();
    },
    changeButtonState: function() {
      var formElements = this.refs.form.getDOMNode().elements;
      var data = [];
      _.map(formElements, function(element) {
        if(element.type == 'checkbox' && element.checked) {
          data.push({
            name: element.dataset.packagename,
            version: element.dataset.packageversion
          });
        }
      });
      this.setState({
        isButtonDisabled: (data.length ? false : true)
      });
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
      
      Packages.filter(function(obj, index){
        var objKey = obj.id.name+'_'+obj.id.version;
        if(objKey in InstalledIds) {
          Packages[index].attributes = {checked: true, status: 'installed', string: 'Installed', label: 'label-success'};
        } else if(objKey in QueuedIds) {
          Packages[index].attributes = {checked: true, status: 'queued', string: 'Queued', label: 'label-info'};
        } else {
          Packages[index].attributes = {checked: false, status: 'notinstalled', string: 'Not installed', label: 'label-danger'};
        }
      });
      
      return Packages;
    },
    render: function() {
      var Packages = this.prepareData();
      var rows = _.map(Packages, function(package, index) {
        return (
          <tr key={'associated-package-' + package.id.name + '-' + package.id.version}>
            <td>
              <Router.Link to='package' params={{name: package.id.name, version: package.id.version}}>
                { package.id.name }
              </Router.Link>
            </td>
            <td>
              { package.id.version }
            </td>
            <td>
              <span className={'label label-package '+ package.attributes.label}>{package.attributes.string}</span>
            </td>
            <td>
              {!package.attributes.checked ? 
                <input type="checkbox" name="package" data-packagename={package.id.name} data-packageversion={package.id.version} onChange={this.changeButtonState} />
              :
              ''
              }
            </td>
            {this.props.DisplayCampaignLink ?
              <td>
                <Router.Link to='new-campaign' params={{name: package.id.name, version: package.id.version}}>
                  Create Campaign
                </Router.Link>
              </td>
            : ''}
          </tr>
        );
      }, this);
      return (
        <form ref="form" onSubmit={this.handleSubmit}>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <td>
                  Package Name
                </td>
                <td>
                  Version
                </td>
                <td/>
                <td/>
                {this.props.DisplayCampaignLink ? <td/> : ''}
              </tr>
            </thead>
            <tbody>
              { rows }
            </tbody>
            <tfoot>
              <tr>
                <td/>
                <td/>
                <td>
                  <button className="btn btn-primary" type="submit" disabled={this.state.isButtonDisabled}>Apply changes</button>
                </td>
                <td/>
                {this.props.DisplayCampaignLink ? <td/> : ''}
              </tr>
            </tfoot>
          </table>
        </form>
      );
    }
  });

  return ListOfAssociatedPackages;
});
