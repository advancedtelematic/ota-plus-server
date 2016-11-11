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
        overGroupUUID: null
      };
      this.prepareGroups = this.prepareGroups.bind(this);
      this.onDragOver = this.onDragOver.bind(this);
      this.onDragLeave = this.onDragLeave.bind(this);
      this.onDrop = this.onDrop.bind(this);
      this.handleResponse = this.handleResponse.bind(this);
      db.postStatus.addWatch("poll-add-device-to-group", _.bind(this.handleResponse, this, null));
    }
    componentDidMount() {
      this.prepareGroups(this.props.groups, this.props.devices);
    }
    componentWillReceiveProps(nextProps) {
      if(!nextProps.draggingDeviceUUID && this.props.draggingDeviceUUID !== nextProps.draggingDeviceUUID) {
        this.setState({overGroupUUID: null});
      }
      if(!_.isEqual(this.props.devices, nextProps.devices) || !_.isEqual(this.props.groups, nextProps.groups)) {
        this.prepareGroups(nextProps.groups, nextProps.devices);
      }
    }
    componentWillUnmount() {
      db.postStatus.removeWatch("poll-add-device-to-group");
    }
    prepareGroups(groupsData, devicesData) {
      var devicesUUIDs = _.pluck(devicesData, 'uuid');
      var newGroups = _.clone(groupsData);
      _.each(newGroups, function(group, index) {
        group.devicesFilteredUUIDs = _.filter(group.devicesUUIDs, function(device) {
          return (devicesUUIDs.indexOf(device) > -1);
        });
      });
      this.setState({groupsData: newGroups});
    }
    onDragOver(e) {
      e.preventDefault();
      this.setState({overGroupUUID: e.currentTarget.dataset.groupuuid});
    }
    onDragLeave(e) {
      this.setState({overGroupUUID: null});
    }
    onDrop(e) {
      if(e.preventDefault)
        e.preventDefault();
      var draggingUUID = this.props.draggingDeviceUUID;
      var dropUUID = e.currentTarget.dataset.groupuuid;
      
      if(draggingUUID !== null && dropUUID !== null) {
        SotaDispatcher.dispatch({
          actionType: 'add-device-to-group',
          uuid: dropUUID,
          deviceId: draggingUUID
        });
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
      }
    }
    render() {        
      var className = '';
      if(this.props.draggingDeviceUUID !== null) {
        className = 'droppable';
      }
        
      var groups = _.map(this.state.groupsData, function(group, index) {
        if(!_.isUndefined(group) && Object.keys(group.devicesFilteredUUIDs).length) {
          var groupClassName = (this.state.overGroupUUID !== null && group.id == this.state.overGroupUUID) ? className + " active" : className;
          return (
            <li 
              key={'group-' + group.groupName}
              onDragOver={this.onDragOver}
              onDragLeave={this.onDragLeave}
              onDrop={this.onDrop}
              data-groupuuid={group.id}>
              <GroupsListItem 
                group={group}
                selectGroup={this.props.selectGroup}
                isSelected={(this.props.selectedGroup.name == group.groupName && this.props.selectedGroup.type == 'real')}
                groupClassName={groupClassName}/>
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
