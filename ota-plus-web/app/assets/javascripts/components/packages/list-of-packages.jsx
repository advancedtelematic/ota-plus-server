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
      window.clearInterval(this.state.intervalId);
    },
    componentWillMount: function(){
      SotaDispatcher.dispatch(this.props.DispatchObject);
      this.props.Packages.addWatch(this.props.PollEventName, _.bind(this.forceUpdate, this, null));
    },
    componentWillUpdate: function(nextProps, nextState) {
      this.props.UpdateDimensions();
    },
    componentDidMount: function() {
      var intervalId = setInterval(this.refreshData, 5000);
      this.setState({intervalId: intervalId});
      this.props.UpdateDimensions();
    },
    refreshData: function() {
      SotaDispatcher.dispatch(this.props.DispatchObject);
    },
    getInitialState: function() {
      return {
        files: [],
        showForm: false,
        intervalId: null,
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
    onClick: function(name, e) {
      this.props.onClick(e, name);
    },
    prepareData: function() {
      var Packages = this.props.Packages.deref();
      
      var GroupedPackages = [];
      Packages.filter(function(obj, index){
        var objKey = obj.id.name+'_'+obj.id.version;
        
        if( typeof GroupedPackages[obj.id.name] == 'undefined' || !GroupedPackages[obj.id.name] instanceof Array ) {
          GroupedPackages[obj.id.name] = [];
          GroupedPackages[obj.id.name]['elements'] = [];
          GroupedPackages[obj.id.name]['packageName'] = obj.id.name;
        }
        
        GroupedPackages[obj.id.name]['elements'].push(obj);
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
      if(this.props.SelectedName != packageName) {
        var key = 'package'+i;
        this.setState({
          [key]: false
        });
      }
    },
    render: function() {
      var Packages = this.prepareData();
      var _click = this.onClick;
      
      var rows = [];
      
      var i = 0;
      for(var index in Packages) {
        var key = 'package'+i;
        var SubPackages = Packages[index].elements;
        var SubPackagesRows = [];
        var _DisplayCampaignLink = this.props.DisplayCampaignLink;
        rows.push(
          <tr key={Packages[index].packageName} className={(this.props.SelectedName == Packages[index].packageName) ? 'selected' : ''} onClick={this.props.AllowAssociatedDevicesAction ? _click.bind(null, Packages[index].packageName) : ''} onMouseEnter={this.packageOnMouseEnter.bind(null, i, Packages[index].packageName)} onMouseLeave={this.packageOnMouseLeave.bind(null, i, Packages[index].packageName)}>
            <td>
              {Packages[index].packageName}
                <div>
                  {SubPackages.forEach(function(subpackage){
                    SubPackagesRows.push(
                      <div>
                        Version: <span className="label label-warning">{subpackage.id.version}</span>
                        {_DisplayCampaignLink ?
                            <Router.Link to='new-campaign' params={{name: subpackage.id.name, version: subpackage.id.version}} onClick={e => e.stopPropagation()} className="pull-right">
                              Create Campaign
                            </Router.Link>
                        : ''}
                      </div>
                    );
                  })}
                  {SubPackagesRows}
                </div>
            </td>            
          </tr>
        );
        i++;
      }
      return (
        <div className="resizeWrapper">
          <Dropzone ref="dropzone" onDrop={this.onDrop} multiple={false} disableClick={true}>
            <table id={this.props.AllowAssociatedDevicesAction ? 'table-packages' : ''} className="table table-bordered" style={{marginBottom: 0}}>
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
