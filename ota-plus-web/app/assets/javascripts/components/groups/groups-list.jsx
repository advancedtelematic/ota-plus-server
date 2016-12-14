define(function(require) {
  var React = require('react'),
      ReactDOM = require('react-dom'),
      SotaDispatcher = require('sota-dispatcher'),
      db = require('stores/db'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      Loader = require('../loader'),
      jQuery = require('jquery'),
      IOSList = require('ioslist'),
      GroupsListItem = require('./groups-list-item');

  class GroupsList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        groupsData: undefined,
        isFiltered: false,
      };
      this.prepareGroups = this.prepareGroups.bind(this);
      this.renameGroup = this.renameGroup.bind(this);
      this.onDragOver = this.onDragOver.bind(this);
      this.onDragLeave = this.onDragLeave.bind(this);
      this.onDrop = this.onDrop.bind(this);
      this.handleResponse = this.handleResponse.bind(this);
      db.postStatus.addWatch("poll-add-device-to-group", _.bind(this.handleResponse, this, null));
    }
    componentDidMount() {
      this.prepareGroups(this.props.groups, this.props.devices, false);
    }
    componentWillReceiveProps(nextProps) {
      if(!_.isEqual(this.props.devices, nextProps.devices) || !_.isEqual(this.props.groups, nextProps.groups) || 
         this.props.isFiltered !== nextProps.isFiltered || !_.isEqual(this.props.draggingDevice, nextProps.draggingDevice)) {
        var isFiltered = nextProps.draggingDevice !== null ? false : nextProps.isFiltered;
        this.prepareGroups(nextProps.groups, nextProps.devices, isFiltered);
      }
    }
    componentWillUnmount() {
      db.postStatus.removeWatch("poll-add-device-to-group");
    }
    prepareGroups(groupsData, devicesData, isFiltered = false) {
      var devicesUUIDs = _.pluck(devicesData, 'uuid');
      
      _.each(groupsData, function(group, index) {
        if(isFiltered) {
          group.devicesFilteredUUIDs = _.filter(group.devicesUUIDs, function(device) {
            return (devicesUUIDs.indexOf(device) > -1);
          });
        } else {
          group.devicesFilteredUUIDs = group.devicesUUIDs;
        }
      });
      this.setState({
        groupsData: groupsData,
        isFiltered: isFiltered
      });
    }
    renameGroup(group, e) {
      e.preventDefault();
      this.props.openRenameGroupModal(group);
    }
    onDragOver(e) {
      e.preventDefault();
      this.props.onGroupDragOver({
        id: e.currentTarget.dataset.groupuuid,
        type: 'real'
      });
    }
    onDragLeave(e) {
      this.props.onGroupDragOver(null);
    }
    onDrop(e) {
      if(e.preventDefault)
        e.preventDefault();
      var draggingDeviceUUID = this.props.draggingDevice.uuid;
      var dropGroupUUID = e.currentTarget.dataset.groupuuid;
      var foundDevice = _.findWhere(this.props.devices, {uuid: draggingDeviceUUID});
                          
      if(draggingDeviceUUID !== null && dropGroupUUID !== null) {
        SotaDispatcher.dispatch({
          actionType: 'remove-device-from-group',
          uuid: foundDevice.groupUUID,
          deviceId: foundDevice.uuid
        });
          
        setTimeout(function() {
          SotaDispatcher.dispatch({
            actionType: 'add-device-to-group',
            uuid: dropGroupUUID,
            deviceId: draggingDeviceUUID
          });
        }, 300);
      }
    }
    handleResponse() {
      var postStatus = !_.isUndefined(db.postStatus.deref()) ? db.postStatus.deref() : undefined;
      if(!_.isUndefined(postStatus['add-device-to-group'])) {
        if(postStatus['add-device-to-group'].status === 'success') {
          delete postStatus['add-device-to-group'];
          db.postStatus.reset(postStatus);
          setTimeout(function() {
            SotaDispatcher.dispatch({actionType: 'get-groups'});
          }, 1);
        }
      } else if(!_.isUndefined(postStatus['remove-device-from-group'])) {
        if(postStatus['remove-device-from-group'].status === 'success') {
          delete postStatus['remove-device-from-group'];
          db.postStatus.reset(postStatus);
          setTimeout(function() {
            SotaDispatcher.dispatch({actionType: 'get-groups'});
          }, 1);
        }
      }
    }
    render() {        
      var className = '';
      if(this.props.draggingDevice !== null) {
        className = 'droppable';
      }
              
      var groups = _.map(this.state.groupsData, function(group, index) {
        if(!_.isUndefined(group) && (!this.state.isFiltered || Object.keys(group.devicesFilteredUUIDs).length)) {
          var groupClassName = (!this.props.isDraggingOverButton && (this.props.draggingDevice !== null && this.props.draggingOverGroup === null && this.props.draggingDevice.groupUUID == group.id || this.props.draggingOverGroup !== null && group.id == this.props.draggingOverGroup.id)) ? className + " active" : className;
          return (
            <li 
              className="list-group-item-wrapper"
              key={'group-' + group.groupName}
              onDragOver={this.onDragOver}
              onDragLeave={this.onDragLeave}
              onDrop={this.onDrop}
              data-groupuuid={group.id}>
              <GroupsListItem 
                group={group}
                selectGroup={this.props.selectGroup}
                isSelected={this.props.selectedGroup.name == group.groupName && this.props.selectedGroup.type == 'real'}
                groupClassName={groupClassName}/>
              <div className="dropdown action-menu-dropdown pull-right">
                <div data-toggle="dropdown">
                  <i className="fa fa-chevron-down" aria-hidden="true"></i>
                </div>
                <ul className="dropdown-menu">
                  <li onClick={this.renameGroup.bind(this, group)}>
                    <img src="/assets/img/icons/edit_black.png" alt="" style={{width: '15px'}}/> Rename
                  </li>
                </ul>
              </div>
            </li>
          );
        }
      }, this);
      return (
        <div>
          {groups}
        </div>
      );
    }
  }
  return GroupsList;
});
