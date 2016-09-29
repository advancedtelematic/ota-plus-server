define(function(require) {
  var React = require('react'),
      ReactDOM = require('react-dom'),
      SotaDispatcher = require('sota-dispatcher'),
      db = require('stores/db'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      Loader = require('../../../loader'),
      jQuery = require('jquery'),
      IOSList = require('ioslist'),
      GroupsListItem = require('./groups-list-item');

  class GroupsList extends React.Component {
    constructor(props) {
      super(props);
      
      var event = new CustomEvent("refreshList");
            
      this.state = {
        data: undefined,
        timeout: null,
        intervalId: null,
        iosListObj: null,
        event: event,
        chosenGroups: this.props.wizardData !== null && !_.isUndefined(this.props.wizardData[1]) && !_.isUndefined(this.props.wizardData[1].chosenGroups) ? this.props.wizardData[1].chosenGroups : []
      };
      
      this.restoreGroups = this.restoreGroups.bind(this);
      this.checkIfComponentsMatch = this.checkIfComponentsMatch.bind(this);
      this.setData = this.setData.bind(this);
      this.prepareData = this.prepareData.bind(this);
      this.toggleGroup = this.toggleGroup.bind(this);
      
      SotaDispatcher.dispatch({actionType: 'get-groups'});
      SotaDispatcher.dispatch({actionType: 'search-devices-by-regex-with-components', regex: ''});
      db.groups.addWatch("groups-campaign", _.bind(this.setData, this, null));
      db.searchableDevicesWithComponents.addWatch("searchable-devices-with-components-campaign", _.bind(this.setData, this, null));      
    }
    componentWillUpdate(nextProps, nextState) {
      if(nextProps.filterValue != this.props.filterValue) {
        SotaDispatcher.dispatch({actionType: 'search-devices-by-regex-with-components', regex: nextProps.filterValue});
      }
    }
    componentDidUpdate(prevProps, prevState) {
      if(!_.isUndefined(prevState.data) && Object.keys(prevState.data).length === 0 && !_.isUndefined(this.state.data) && Object.keys(this.state.data).length > 0) {
        jQuery(ReactDOM.findDOMNode(this.refs.devicesList)).ioslist();
      } else {
        document.body.dispatchEvent(this.state.event);
      }
    }
    componentDidMount() {
      var that = this;
      var intervalId = setInterval(function() {
        that.refreshData();
      }, 10000);
      this.setState({intervalId: intervalId});
      this.refreshData();

      var tmpIntervalId = setInterval(function() {
        var devicesListNode = ReactDOM.findDOMNode(that.refs.devicesList);
        if(devicesListNode) {
          var a = jQuery(devicesListNode).ioslist();
          clearInterval(tmpIntervalId);
        }
      }, 30);
    }
    componentWillUnmount() {
      db.groups.reset();
      db.groups.removeWatch("groups-campaign");
      db.searchableDevicesWithComponents.reset();
      db.searchableDevicesWithComponents.removeWatch("searchable-devices-with-components-campaign");
      clearTimeout(this.state.timeout);
      clearInterval(this.state.intervalId);
    }
    refreshData() {
      SotaDispatcher.dispatch({actionType: 'search-devices-by-regex-with-components', regex: this.props.filterValue});
    }
    setData() {
      if(!_.isUndefined(db.groups.deref()) && !_.isUndefined(db.searchableDevicesWithComponents.deref()))
        this.restoreGroups(db.searchableDevicesWithComponents.deref(), db.groups.deref());
    }
    choosePackage(name, version) {
      this.setState({
        chosenPackage: {name: name, version: version}
      });
      
      this.props.setWizardData(name, version);
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
    restoreGroups(devices, groupsJSON) {
      var that = this;
      var groups = [];
            
      _.each(devices, function(device, deviceIndex) {
        _.each(groupsJSON, function(group) {
          var deviceComponents = _.clone(device.components);
          var correct = true;
          
          if(!_.isUndefined(deviceComponents)) {
            correct = that.checkIfComponentsMatch(deviceComponents, JSON.parse(group.groupInfo), correct);
            if(correct) {
              if(typeof groups[group.groupName] == 'undefined' || !groups[group.groupName] instanceof Array) {
                groups[group.groupName] = [];
              }
              groups[group.groupName].push(deviceIndex);
              delete devices[deviceIndex];
            }
          }
        });
      });
                        
      this.prepareData(groups);
    }
    prepareData(groups) {
      var SortedGroups = {};
      
      if(!_.isUndefined(groups)) {
        Object.keys(groups).sort(function(a, b) {
          return (a.charAt(0) % 1 === 0 && b.charAt(0) % 1 !== 0) ? 1 : a.localeCompare(b);
        }).forEach(function(key) {
          var firstLetter = key.charAt(0).toUpperCase();
          firstLetter = firstLetter.match(/[A-Z]/) ? firstLetter : '#';

          if( typeof SortedGroups[firstLetter] == 'undefined' || !SortedGroups[firstLetter] instanceof Array ) {
             SortedGroups[firstLetter] = [];
          }
          SortedGroups[firstLetter][key] = groups[key];
        });
      }
      this.setState({data: SortedGroups});
    }
    toggleGroup(groupName) {
      var chosenGroups = this.state.chosenGroups;
      var index = 0;
      if(index = chosenGroups.indexOf(groupName) > -1) {
        chosenGroups = chosenGroups.filter(function(i) {
          return i != groupName;
        });
      } else {
        chosenGroups.push(groupName);
      }
      this.setState({
        chosenGroups: chosenGroups
      });
      this.props.setWizardData(chosenGroups);
    }
    render() {
      if(!_.isUndefined(this.state.data)) {
        var groups = _.map(this.state.data, function(groups, index) {
          if(!_.isUndefined(groups)) {
            var items = [];
            for(var groupName in groups) {
              var isChosen = this.state.chosenGroups.indexOf(groupName) > -1 ? true : false;
              items.push(
                <li key={'package-' + groupName}>
                  <GroupsListItem 
                    name={groupName}
                    toggleGroup={this.toggleGroup}
                    isChosen={isChosen}/>
                </li>
              );
            }
            return(
              <div className="ioslist-group-container" key={'list-group-container-' + index}>
                <div className="ioslist-group-header">{index}</div>
                <ul>
                  {items}
                </ul>
              </div>
            );
          }
        }, this);
      }
      return (
        <div>
          <div>
            <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
              {!_.isUndefined(groups) ? 
                <ul className="list-group ios-groups-list" id="packages-list">
                  {groups.length ?
                    <div id="packages-list-inside" ref="groupsList">
                      <h2 className="ioslist-fake-header"></h2>
                      <div className="ioslist-wrapper">
                        {groups}
                      </div>
                    </div>
                  :
                    <div className="col-md-12 height-100 position-relative text-center">
                      {this.props.filterValue !== '' ? 
                        <div className="center-xy padding-15">
                          No matching groups found.
                        </div>
                      :
                        <div className="center-xy padding-15">
                          There are no groups to choose. 
                        </div>
                      }
                    </div>
                  }
                </ul>
              : undefined}
            </VelocityTransitionGroup>
            {_.isUndefined(groups) ? 
              <Loader />
            : undefined}
          </div>
        </div>
      );
    }
  }
  return GroupsList;
});
