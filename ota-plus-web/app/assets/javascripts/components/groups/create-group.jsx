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
      this.closeForm = this.closeForm.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentWillUnmount() {
    }
    handleSubmit(e) {
      e.preventDefault();
            
      SotaDispatcher.dispatch({
        actionType: 'create-group',
        data: {
          device1: this.props.groupDevices[0],
          device2: this.props.groupDevices[1],
          groupName: this.refs.groupName.value
        }
      });
    }
    closeForm(e) {
      e.preventDefault();
      this.props.closeForm();
    }
    render() {
      var devices = db.searchableDevicesWithComponents.deref();
      var firstDeviceData = _.findWhere(devices, {uuid: this.props.groupDevices[0]});
      var secondDeviceData = _.findWhere(devices, {uuid: this.props.groupDevices[1]});
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
                            <input className="form-control" name="groupName" ref="groupName"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <a href="#" className="darkgrey margin-top-20 pull-left" onClick={this.closeForm}>close</a>
                    <button type="submit" className="btn btn-confirm pull-right" onClick={this.handleSubmit}>Create Group</button>
                  </div>
                </form>
              :
                <div>
                  <div className="modal-body text-justify">
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
