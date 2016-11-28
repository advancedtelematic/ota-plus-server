define(function(require) {
  var React = require('react'),
      ReactDOM = require('react-dom'),
      SotaDispatcher = require('sota-dispatcher');

  class GroupsArtificial extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        artificialGroupsData: {
          all: {
            groupName: 'all',
            devicesCount: null,
            friendlyName: 'All devices',
            isDND: false
          },
          ungrouped: {
            groupName: 'ungrouped',
            devicesCount: null,
            friendlyName: 'Ungrouped devices',
            isDND: true
          }
        }
      };
      this.onDragOver = this.onDragOver.bind(this);
      this.onDragLeave = this.onDragLeave.bind(this);
      this.onDrop = this.onDrop.bind(this);
      this.prepareGroups = this.prepareGroups.bind(this);
    }
    componentDidMount() {
      this.prepareGroups(this.props.groups, this.props.devices);
    }
    componentWillReceiveProps(nextProps) {
      if(!_.isEqual(this.props.devices, nextProps.devices) || !_.isEqual(this.props.groups, nextProps.groups)) {
        this.prepareGroups(nextProps.groups, nextProps.devices);
      }
    }
    prepareGroups(groups, devices) {
      var ungroupedDevicesCount;
      var artificialGroupsData = this.state.artificialGroupsData;
      artificialGroupsData.all.devicesCount = Object.keys(devices).length;
      
      var discardedDeviceUUIDs = [];
      _.each(groups, function(group) {
        _.each(group.devicesUUIDs, function(uuid) {
          if(discardedDeviceUUIDs.indexOf(uuid) < 0) {
            devices = _.reject(devices, function(device) {
              return device.uuid == uuid;
            });
            discardedDeviceUUIDs.push(uuid);
          }
        });
      });
      
      artificialGroupsData.ungrouped.devicesCount = Object.keys(devices).length;
      
      this.setState({
        artificialGroupsData: artificialGroupsData
      });
    }
    onDragOver(e) {
      e.preventDefault();
      this.props.onGroupDragOver({
        id: e.currentTarget.dataset.groupname,
        type: 'artificial'
      });
    }
    onDragLeave(e) {
      this.props.onGroupDragOver(null);
    }
    onDrop(e) {
      if(e.preventDefault)
        e.preventDefault();
      var draggingDeviceUUID = (this.props.draggingDevice !== null ? this.props.draggingDevice.uuid : null);
      var dropGroupName = e.currentTarget.dataset.groupname;
      var foundDevice = _.findWhere(this.props.devices, {uuid: draggingDeviceUUID});
      if(draggingDeviceUUID !== null && dropGroupName == 'ungrouped') {
        SotaDispatcher.dispatch({
          actionType: 'remove-device-from-group',
          uuid: foundDevice.groupUUID,
          deviceId: foundDevice.uuid
        });
      }
    }
    render() {        
      var groups = _.map(this.state.artificialGroupsData, function(group, index) {
        var groupClassName = '';
        if(this.props.draggingDevice !== null && group.isDND) {
          groupClassName = (!this.props.isDraggingOverButton && (_.isUndefined(this.props.draggingDevice.groupUUID) && this.props.draggingOverGroup === null || this.props.draggingOverGroup !== null && this.props.draggingOverGroup.type == 'artificial' && group.groupName == this.props.draggingOverGroup.id)) ? "droppable active" : "droppable";
        }
        var isSelected = (this.props.selectedGroup.type == 'artificial' && group.groupName == this.props.selectedGroup.name);
        return (
          <div className="list-group-item-wrapper" key={"artificial-group-" + group.groupName}>
            <button 
              type="button" 
              className={"list-group-item " + groupClassName + " " + (isSelected  ? " checked" : "") } 
              onClick={this.props.selectGroup.bind(this, {name: group.groupName, type: 'artificial'})} 
              id={"button-artificial-group-" + group.groupName}
              onDragOver={group.isDND ? this.onDragOver : null}
              onDragLeave={group.isDND ? this.onDragLeave : null}
              onDrop={group.isDND ? this.onDrop : null}
             data-groupname={group.groupName}>
              <div className="group-text">
                <div className="group-title" title={group.friendlyName}>{group.friendlyName}</div>
                <div className="group-subtitle">{group.devicesCount} devices</div>
              </div>
              {isSelected ? 
                <div className="group-pointer">
                  <i className="fa fa-angle-right fa-3x"></i>
                </div>
              : null}
            </button>
          </div>
        );
      }, this);
      
      return (
        <div>
          {groups}
        </div>
      );
    }
  };

  GroupsArtificial.contextTypes = {
    location: React.PropTypes.object,
  };

  return GroupsArtificial;
});
