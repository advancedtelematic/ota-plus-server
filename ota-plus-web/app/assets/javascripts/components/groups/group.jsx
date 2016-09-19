define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      GroupHeader = require('es6!./group-header'),
      GroupDevicesList = require('es6!./group-devices-list'),
      Loader = require('es6!../loader');
  
  class Group extends React.Component {
    constructor(props) {
      super(props);
      
      this.state = {
        groupDevicesListHeight: '400px',
        group: undefined,
        devices: undefined,
        devicesCount: undefined
      };
      this.checkIfComponentsMatch = this.checkIfComponentsMatch.bind(this);
      this.setGroupDevicesListHeight = this.setGroupDevicesListHeight.bind(this);
      this.setData = this.setData.bind(this);
      
      SotaDispatcher.dispatch({actionType: 'get-group', name: this.props.params.id});
      SotaDispatcher.dispatch({actionType: 'search-devices-by-regex-with-components'});
      db.group.addWatch("poll-group", _.bind(this.setData, this, null));
      db.searchableDevicesWithComponents.addWatch("poll-group-devices-with-components", _.bind(this.setData, this, null));
    }
    componentDidMount() {
      var that = this;
      window.addEventListener("resize", this.setGroupDevicesListHeight);
      setTimeout(function() {
        that.setGroupDevicesListHeight();
      }, 1);
    }
    componentWillUnmount() {
      db.group.reset();
      db.searchableDevicesWithComponents.reset();
      db.group.removeWatch("poll-group");
      db.searchableDevicesWithComponents.removeWatch("poll-group-devices-with-components");
      window.removeEventListener("resize", this.setGroupDevicesListHeight);
    }
    checkIfComponentsMatch(data, common, isCorrect) {
      if (Object.keys(common).length !== _.union(Object.keys(data), Object.keys(common)).length) {
        isCorrect = false;
      } else {
        for (var prop in common) {
          if (common[prop] !== null) {
            if (data.hasOwnProperty(prop)) {
              if (typeof common[prop] == 'object') {
                isCorrect = this.checkIfComponentsMatch(data[prop], common[prop], isCorrect);
              } else if(common[prop] !== data[prop]) {
		isCorrect = false;
	      }
            } else {
              isCorrect = false;
            }
          }
        }
      }
      return isCorrect;
    }
    setData() {
      var that = this;
      var devices = db.searchableDevicesWithComponents.deref();
      var group = db.group.deref();
            
      if(!_.isUndefined(group) && !_.isUndefined(devices)) {
        _.each(devices, function(device, deviceIndex) {
          if(!_.isUndefined(devices[deviceIndex]) && !_.isUndefined(device.components)) {
            var correct = true;
            correct = that.checkIfComponentsMatch(device.components, JSON.parse(group), correct);
            if(!correct) {
              delete devices[deviceIndex];
            }
          } else if(!_.isUndefined(devices[deviceIndex])) {
            delete devices[deviceIndex];
          }
        });
          
        this.setState({
          devices: devices,
          devicesCount: Object.keys(devices).length
        });
      }
      
      if(!_.isUndefined(group)) {
        this.setState({group: group});
      }
    }
    setGroupDevicesListHeight() {
      var windowHeight = jQuery(window).height();
      var offsetTop = jQuery('#group-devices-list').offset().top
      this.setState({
        groupDevicesListHeight: windowHeight - offsetTop
      });
    }
    render() {
      var group = this.state.group;
      var devices = this.state.devices;
      return (
        <div className="group">
          <GroupHeader 
            name={this.props.params.id}
            devicesCount={this.state.devicesCount}/>
          
          <div id="group-devices-list" style={{height: this.state.groupDevicesListHeight}}>
            {!_.isUndefined(group) && !_.isUndefined(devices) ?
              <span>
                <GroupDevicesList Devices={devices}/>
              </span>
            : undefined}
            {_.isUndefined(group) || _.isUndefined(devices) ?
              <Loader />
            : undefined}
          </div>
        </div>
      );
    }
  };

  return Group;
});
