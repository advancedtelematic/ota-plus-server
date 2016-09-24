define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      serializeForm = require('../../mixins/serialize-form'),
      SotaDispatcher = require('sota-dispatcher'),
      Cookies = require('js-cookie'),
      Responses = require('../responses');
  
  class CreateGroup extends React.Component {
    constructor(props) {
      super(props);
      
      this.state = {
         
      }
      
      this.compareComponents = this.compareComponents.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentWillUnmount() {
    }
    compareComponents(data1, data2, common) {
      for (var prop in data1) {
        if (data2.hasOwnProperty(prop)) {
          if (typeof data1[prop] == 'object') {
            if (Object.keys(data1[prop]).length) {
              if (typeof common[prop] == 'undefined')
                common[prop] = {};
              this.compareComponents(data1[prop], data2[prop], common[prop]);
            } else {
              common[prop] = undefined;
            }
          } else {
            if (data1[prop] !== data2[prop])
              common[prop] = undefined;
            else
              common[prop] = data1[prop];
          }
        } else {
          common[prop] = undefined;
        }
      }
    }
    handleSubmit(e) {
      e.preventDefault();
      var devices = db.searchableDevicesWithComponents.deref();
      var firstDeviceData = _.findWhere(devices, {deviceName: this.props.groupNames[0]});
      var secondDeviceData = _.findWhere(devices, {deviceName: this.props.groupNames[1]});
      var commonData = {};
      this.compareComponents(firstDeviceData.components, secondDeviceData.components, commonData);      
      this.compareComponents(secondDeviceData.components, firstDeviceData.components, commonData);
           
      commonData = JSON.stringify(commonData,
        function(k, v) { if (v === undefined) { return null; } return v; }
      );
            
      SotaDispatcher.dispatch({
        actionType: 'create-group',
        name: this.refs.group_name.value,
        data: commonData
      });
    }
    render() {
      var devices = db.searchableDevicesWithComponents.deref();
      var firstDeviceData = _.findWhere(devices, {deviceName: this.props.groupNames[0]});
      var secondDeviceData = _.findWhere(devices, {deviceName: this.props.groupNames[1]});
      var canCreateGroup = !_.isUndefined(firstDeviceData) && !_.isUndefined(firstDeviceData['components']) && !_.isUndefined(secondDeviceData) && !_.isUndefined(secondDeviceData['components']);
      
      return (
        <div id="modal-create-group" className="myModal">
          <div className="modal-dialog center-xy">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" onClick={this.props.closeForm}></button>
                <h4 className="modal-title">
                  <img src="/assets/img/icons/grid.png" className="create-group-icon" style={{width: '20px'}} alt="" /> &nbsp;
                  {canCreateGroup ? 
                    <span>Create a new Group</span>
                  :
                    <span>Could not create Smart Group</span>
                  }
                </h4>
              </div>
              {canCreateGroup ?
                <form ref='form' onSubmit={this.handleSubmit} encType="multipart/form-data" className="form-horizontal">
                  <div className="modal-body">
                    <Responses action="create-package" handledStatuses="error"/>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label className="col-sm-3 control-label">Group Name</label>
                          <div className="col-sm-9">
                            <input className="form-control" name="group_name" ref="group_name"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <a href="#" className="darkgrey margin-top-20 pull-left" onClick={this.props.closeForm}>close</a>
                    <button type="submit" className="btn btn-confirm pull-right" onClick={this.handleSubmit}>Create Group</button>
                  </div>
                </form>
              :
                <div>
                  <div className="modal-body">
                    One of the devices you are trying to add to this Smart Group has not reported any hardware information yet. Smart Grouping automatically generates groups of similar devices, so it needs hardware information to work.
                  </div>
                  <div className="modal-footer">
                    <a href="#" className="darkgrey margin-top-20 pull-left" onClick={this.props.closeForm}>close</a>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      );
    }
  };

  CreateGroup.contextTypes = {
    history: React.PropTypes.object.isRequired,
    strings: React.PropTypes.object.isRequired,
  };

  return CreateGroup;
});
