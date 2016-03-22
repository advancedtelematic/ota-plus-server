define(function(require) {

  var React = require('react'),
      Router = require('react-router'),
      _ = require('underscore'),
      SotaDispatcher = require('sota-dispatcher');

  var ListOfAssociatedPackages = React.createClass({
    getInitialState: function() {
      return {isButtonDisabled: true};
    },
    contextTypes: {
      router: React.PropTypes.func
    },
    componentWillUnmount: function(){
      this.props.AllPackages.removeWatch(this.props.AllPackagesPollEventName);
      this.props.AssociatedPackages.removeWatch(this.props.AssociatedPackagesPollEventName);
    },
    componentWillMount: function(){
      SotaDispatcher.dispatch(this.props.AllPackagesDispatchObject);
      this.props.AllPackages.addWatch(this.props.AllPackagesPollEventName, _.bind(this.forceUpdate, this, null));
      
      SotaDispatcher.dispatch(this.props.AssociatedPackagesDispatchObject);
      this.props.AssociatedPackages.addWatch(this.props.AssociatedPackagesPollEventName, _.bind(this.forceUpdate, this, null));
    },
    componentWillUpdate: function(nextProps, nextState) {
      if(nextProps.SelectedVin != this.props.SelectedVin) {
        this.resetForm();
        this.props.AllPackages.removeWatch(this.props.AllPackagesPollEventName);
        SotaDispatcher.dispatch(nextProps.AllPackagesDispatchObject);
        this.props.AllPackages.addWatch(nextProps.AllPackagesPollEventName, _.bind(this.forceUpdate, this, null));
      
        this.props.AssociatedPackages.removeWatch(this.props.AssociatedPackagesPollEventName);
        SotaDispatcher.dispatch(nextProps.AssociatedPackagesDispatchObject);
        this.props.AssociatedPackages.addWatch(nextProps.AssociatedPackagesPollEventName, _.bind(this.forceUpdate, this, null));
      }
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
    render: function() {
      var Associated = this.props.AssociatedPackages.deref();
      var Packages = this.props.AllPackages.deref();
      var _SelectedVin = this.props.SelectedVin;
      
      var Ids = {};
      Associated.forEach(function(obj){
        Ids[obj.id.name+'_'+obj.id.version] = obj.id.name+'_'+obj.id.version;
      });
      
      Packages.filter(function(obj, index){
        Packages[index].installed = ((obj.id.name+'_'+obj.id.version) in Ids) ? true : false;
      });
      
      var rows = _.map(Packages, function(package) {
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
              {package.installed ? 
                <span className="label label-success label-package">Installed</span>
              : 
                <input type="checkbox" name="package" data-packagename={package.id.name} data-packageversion={package.id.version} onChange={this.changeButtonState}/>
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
                  <button className="btn btn-primary" type="submit" disabled={this.state.isButtonDisabled}>Install selected</button>
                </td>
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
