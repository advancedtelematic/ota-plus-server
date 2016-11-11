define(function(require) {
  var React = require('react'),
      ReactDOM = require('react-dom');

  class GroupsArtificial extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        artificialGroupsData: {
          all: {
            groupName: 'all',
            devicesCount: null,
            friendlyName: 'All devices'
          },
          ungrouped: {
            groupName: 'ungrouped',
            devicesCount: null,
            friendlyName: 'Ungrouped devices'
          }
        }
      };
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
    render() {
      var selectedArtificialGroupName = (this.props.selectedGroup.type == 'artificial' ? this.props.selectedGroup.name : null);
      var groups = _.map(this.state.artificialGroupsData, function(group, index) {
        return (
          <button key={"button-artificial-group-" + group.groupName} type="button" className={"list-group-item " + (selectedArtificialGroupName == group.groupName ? " checked" : "")} onClick={this.props.selectGroup.bind(this, {name: group.groupName, type: 'artificial'})} id={"button-artificial-group-" + group.groupName}>
            <div className="pull-left">
              <div className="group-text">
                <div className="group-title" title={group.friendlyName}>{group.friendlyName}</div>
                <div className="group-subtitle">{group.devicesCount} devices</div>
              </div>
            </div>
          </button>
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
