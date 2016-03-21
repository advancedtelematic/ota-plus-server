define(function(require) {

  var React = require('react'),
      Router = require('react-router'),
      _ = require('underscore'),
      Dropzone = require('../../mixins/dropzone'),
      serializeForm = require('../../mixins/serialize-form'),
      ShowDevicesForPackages = require('../vehicles/show-devices-for-packages'),
      SotaDispatcher = require('sota-dispatcher');

  var Packages = React.createClass({
    contextTypes: {
      router: React.PropTypes.func
    },
    componentWillUnmount: function(){
      this.props.Packages.removeWatch(this.props.PollEventName);
    },
    componentWillMount: function(){
      SotaDispatcher.dispatch(this.props.DispatchObject);
      this.props.Packages.addWatch(this.props.PollEventName, _.bind(this.forceUpdate, this, null));
    },
    refreshData: function() {
      SotaDispatcher.dispatch(this.props.DispatchObject);
    },
    getInitialState: function() {
      return {
        files: [],
        showForm: false
      };
    },
    onDrop: function (files) {
      this.setState({
        files: files,
        showForm: true
      });
    },
    closeForm: function() {
      this.setState({showForm: !this.state.showForm});
    },
    handleSubmit: function(e) {
      e.preventDefault();

      var payload = serializeForm(this.refs.form);
      //need to create this attribute since packages sent from core/resolver have it
      payload.id = {name: payload.name, version: payload.version};

      var data = new FormData();
      data.append('file', this.state.files[0]);
      
      SotaDispatcher.dispatch({
        actionType: 'create-package',
        package: payload,
        data: data
      });
      this.closeForm();
      this.refreshData();
    },
    form: function() {
      return (
        <div>
          <div className="myModal">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" onClick={this.closeForm}>&times;</button>
                  <h4 className="modal-title">New package</h4>
                </div>
                <div className="modal-body">
                  <form ref='form' onSubmit={this.handleSubmit} encType="multipart/form-data">
                    <div className="form-group">
                      <label htmlFor="name">Package Name</label>
                      <input type="text" className="form-control" name="name" ref="name" placeholder="Package Name"/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="version">Version</label>
                      <input type="text" className="form-control" name="version" ref="version" placeholder="1.0.0"/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="description">Description</label>
                      <input type="text" className="form-control" name="description" ref="description" placeholder="Description text"/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="vendor">Vendor</label>
                      <input type="text" className="form-control" name="vendor" ref="vendor" placeholder="Vendor name"/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="binary">Package Binary</label>
                      {this.state.files.length > 0 ? <div> {this.state.files.map((file) => <div>{file.name} </div> )} </div> : ''}
                    </div>
                    <div className="form-group">
                      <button type="submit" className="btn btn-primary">Add PACKAGE</button>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-default" onClick={this.closeForm}>Close</button>
                </div>
              </div>
            </div>
          </div>       
        </div>
      );
    },
    onClick: function(name, version, t) {
      this.props.onClick(t, name, version);
    },
    render: function() {
      var _click = this.onClick;
      var _SelectedName = this.props.SelectedName;
      var _SelectedVersion = this.props.SelectedVersion;
      var rows = _.map(this.props.Packages.deref(), function(package) {
        return (
          <tr key={package.id.name + '-' + package.id.version} className={(_SelectedName == package.id.name && _SelectedVersion == package.id.version) ? 'selected' : ''}>
            <td>
              <Router.Link to='package' params={{name: package.id.name, version: package.id.version}}>
                { package.id.name }
              </Router.Link>
            </td>
            <td>
              { package.id.version }
            </td>
            {this.props.DisplayAssociatedDevicesLink ?
              <td>
                <button type="button" className="btn btn-default" onClick={_click.bind(null, package.id.name, package.id.version)}>{(_SelectedName == package.id.name && _SelectedVersion == package.id.version) ? 'Hide' : 'Show'} associated vehicles</button>
              </td>
            : ''}
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
        <div>
          <Dropzone ref="dropzone" onDrop={this.onDrop} multiple={false} disableClick={true}>
          <table className="table table-striped table-bordered" style={{marginBottom: 0}}>
            <thead>
              <tr>
                <td>
                  Package Name
                </td>
                <td>
                  Version
                </td>
                {this.props.DisplayAssociatedDevicesLink ? <td/> : ''}
                {this.props.DisplayCampaignLink ? <td/> : ''}
              </tr>
            </thead>
            <tbody>
              { rows }
            </tbody>
          </table>
          </Dropzone>
          { this.state.showForm ? this.form() : null }
        </div>
      );
    }
  });

  return Packages;
});
