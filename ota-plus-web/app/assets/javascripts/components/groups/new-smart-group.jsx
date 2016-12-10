define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      serializeForm = require('../../mixins/serialize-form'),
      SotaDispatcher = require('sota-dispatcher'),
      Loader = require('../loader'),
      Cookies = require('js-cookie'),
      Responses = require('../responses');
  
  class NewSmartGroup extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        areAllComponentsRequestsDone: false
      };
      this.closeModal = this.closeModal.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleResponse = this.handleResponse.bind(this);
      this.checkPostStatus = this.checkPostStatus.bind(this);
      db.componentsForSelectedDevices.reset();
      SotaDispatcher.dispatch({actionType: 'get-components-for-selected-devices', uuid: this.props.groupedDevices[0]});
      SotaDispatcher.dispatch({actionType: 'get-components-for-selected-devices', uuid: this.props.groupedDevices[1]});
      db.componentsForSelectedDevices.addWatch("poll-components-for-selected-devices", _.bind(this.forceUpdate, this, null));
      db.postStatus.addWatch("poll-components-for-devices-post-status", _.bind(this.checkPostStatus, this, null));
      db.postStatus.addWatch("poll-create-smart-group", _.bind(this.handleResponse, this, null));
    }
    componentWillUnmount() {
      db.componentsForSelectedDevices.removeWatch("poll-components-for-selected-devices");
      db.postStatus.removeWatch("poll-components-for-devices-post-status");
      db.postStatus.removeWatch("poll-create-smart-group");
    }
    handleSubmit(e) {
      e.preventDefault();
      SotaDispatcher.dispatch({
        actionType: 'create-smart-group',
        data: {
          device1: this.props.groupedDevices[0],
          device2: this.props.groupedDevices[1],
          groupName: this.refs.groupName.value
        }
      });
    }
    handleResponse() {
      var postStatus = !_.isUndefined(db.postStatus.deref()) ? db.postStatus.deref() : undefined;
      if(!_.isUndefined(postStatus['create-smart-group']) && postStatus['create-smart-group'].status === 'success') {
        var that = this;
        db.postStatus.removeWatch("poll-create-smart-group");
        delete postStatus['create-smart-group'];
        db.postStatus.reset(postStatus);
        setTimeout(function() {
          that.props.closeModal(true);
        }, 1);
      }
    }
    closeModal(e) {
      e.preventDefault();
      this.props.closeModal();
    }
    checkPostStatus() {
      var postStatus = db.postStatus.deref();
      if(!_.isUndefined(postStatus) && !_.isUndefined(postStatus['get-components-for-selected-devices']) && 
         !_.isUndefined(postStatus['get-components-for-selected-devices'][this.props.groupedDevices[0]]) && 
         !_.isUndefined(postStatus['get-components-for-selected-devices'][this.props.groupedDevices[1]])) {
        this.setState({areAllComponentsRequestsDone: true});
      }
    }
    render() {        
      var components = db.componentsForSelectedDevices.deref();
      var canCreateGroup = !_.isUndefined(components) && !_.isUndefined(components[this.props.groupedDevices[0]]) && Object.keys(components[this.props.groupedDevices[0]]).length && 
                           !_.isUndefined(components[this.props.groupedDevices[1]]) && Object.keys(components[this.props.groupedDevices[1]]).length;
            
      return (
        <div id="modal-create-group" className="myModal">
          <div className="modal-dialog center-xy">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" onClick={this.props.closeModal}></button>
                <h4 className="modal-title">
                  <img src="/assets/img/icons/grid.png" className="create-group-icon" style={{width: '20px'}} alt="" /> &nbsp;
                  {!this.state.areAllComponentsRequestsDone || canCreateGroup ? 
                    <span>Create a new Group</span>
                  :
                    <span>Could not create Smart Group</span>
                  }
                </h4>
              </div>
              {canCreateGroup ?
                <form ref='form' onSubmit={this.handleSubmit} encType="multipart/form-data" className="form-horizontal">
                  <div className="modal-body">
                    <Responses action="create-smart-group" handledStatuses="error"/>
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
                    <a href="#" className="darkgrey margin-top-20 pull-left" onClick={this.closeModal}>close</a>
                    <button type="submit" className="btn btn-confirm pull-right" onClick={this.handleSubmit}>Create Group</button>
                  </div>
                </form>
              :
                <div>
                  <div className="modal-body text-justify">
                    {this.state.areAllComponentsRequestsDone ?
                      <span>
                        One of the devices you are trying to add to this Smart Group has not reported any hardware information yet. Smart Grouping automatically generates groups of similar devices, so it needs hardware information to work.
                      </span>
                    :
                      <Loader />
                    }
                  </div>
                  <div className="modal-footer">
                    <a href="#" className="darkgrey margin-top-20 pull-left" onClick={this.props.closeModal}>close</a>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      );
    }
  };

  NewSmartGroup.contextTypes = {
    history: React.PropTypes.object.isRequired,
    strings: React.PropTypes.object.isRequired,
  };

  return NewSmartGroup;
});
