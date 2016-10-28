define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      serializeForm = require('../../mixins/serialize-form'),
      SotaDispatcher = require('sota-dispatcher'),
      Loader = require('es6!../loader'),
      Cookies = require('js-cookie'),
      Responses = require('../responses');
  
  class CreateGroup extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        areAllComponentsRequestsDone: false
      };
      this.closeForm = this.closeForm.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.checkPostStatus = this.checkPostStatus.bind(this);
      db.componentsForSelectedDevices.reset();
      SotaDispatcher.dispatch({actionType: 'get-components-for-selected-devices', uuid: this.props.groupDevices[0]});
      SotaDispatcher.dispatch({actionType: 'get-components-for-selected-devices', uuid: this.props.groupDevices[1]});
      db.componentsForSelectedDevices.addWatch("poll-components-for-selected-devices", _.bind(this.forceUpdate, this, null));
      db.postStatus.addWatch("poll-components-for-devices-post-status", _.bind(this.checkPostStatus, this, null));
    }
    componentWillUnmount() {
      db.componentsForSelectedDevices.removeWatch("poll-components-for-selected-devices");
      db.postStatus.removeWatch("poll-components-for-devices-post-status");
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
    checkPostStatus() {
      var postStatus = db.postStatus.deref();
      if(!_.isUndefined(postStatus) && !_.isUndefined(postStatus['get-components-for-selected-devices']) && 
         !_.isUndefined(postStatus['get-components-for-selected-devices'][this.props.groupDevices[0]]) && 
         !_.isUndefined(postStatus['get-components-for-selected-devices'][this.props.groupDevices[1]])) {
        this.setState({areAllComponentsRequestsDone: true});
      }
    }
    render() {        
      var components = db.componentsForSelectedDevices.deref();
      var canCreateGroup = !_.isUndefined(components) && !_.isUndefined(components[this.props.groupDevices[0]]) && Object.keys(components[this.props.groupDevices[0]]).length && 
                           !_.isUndefined(components[this.props.groupDevices[1]]) && Object.keys(components[this.props.groupDevices[1]]).length;
            
      return (
        <div id="modal-create-group" className="myModal">
          <div className="modal-dialog center-xy">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" onClick={this.props.closeForm}></button>
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
                    {this.state.areAllComponentsRequestsDone ?
                      <span>
                        One of the devices you are trying to add to this Smart Group has not reported any hardware information yet. Smart Grouping automatically generates groups of similar devices, so it needs hardware information to work.
                      </span>
                    :
                      <Loader />
                    }
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
