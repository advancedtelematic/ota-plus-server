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
      this.state = {
        data: undefined,
        timeout: null,
        intervalId: null,
        tmpIntervalId: null,
        fakeHeaderTopPosition: 0,
        fakeHeaderLetter: null,
        groupsShownStartIndex: 0,
        groupsShownEndIndex: 50,
        chosenGroups: this.props.wizardData !== null && !_.isUndefined(this.props.wizardData[1]) && !_.isUndefined(this.props.wizardData[1].chosenGroups) ? this.props.wizardData[1].chosenGroups : []
      };
      
      this.restoreGroups = this.restoreGroups.bind(this);
      this.checkIfComponentsMatch = this.checkIfComponentsMatch.bind(this);
      this.setData = this.setData.bind(this);
      this.prepareData = this.prepareData.bind(this);
      this.toggleGroup = this.toggleGroup.bind(this);
      this.generatePositions = this.generatePositions.bind(this);
      this.setFakeHeader = this.setFakeHeader.bind(this);
      this.groupsListScroll = this.groupsListScroll.bind(this);
      this.startIntervalGroupsListScroll = this.startIntervalGroupsListScroll.bind(this);
      this.stopIntervalGroupsListScroll = this.stopIntervalGroupsListScroll.bind(this);
      
      SotaDispatcher.dispatch({actionType: 'get-groups'});
      SotaDispatcher.dispatch({actionType: 'search-devices-by-regex-with-components', regex: ''});
      db.groups.addWatch("groups-campaign", _.bind(this.setData, this, null));
      db.searchableDevicesWithComponents.addWatch("searchable-devices-with-components-campaign", _.bind(this.setData, this, null));      
    }
    componentDidMount() {
      var that = this;
      var intervalId = setInterval(function() {
        that.refreshData();
      }, 10000);
      this.setState({intervalId: intervalId});
      this.refreshData();
      ReactDOM.findDOMNode(this.refs.groupsList).addEventListener('scroll', this.groupsListScroll);
    }
    componentWillUpdate(nextProps, nextState) {
      if(nextProps.filterValue != this.props.filterValue) {
        SotaDispatcher.dispatch({actionType: 'search-devices-by-regex-with-components', regex: nextProps.filterValue});
      }
    }
    componentDidUpdate(prevProps, prevState) {
      if(this.props.groupsListHeight !== prevProps.groupsListHeight) {
        this.groupsListScroll();
      }
    }
    componentWillUnmount() {
      ReactDOM.findDOMNode(this.refs.groupsList).removeEventListener('scroll', this.groupsListScroll);
      db.groups.reset();
      db.groups.removeWatch("groups-campaign");
      db.searchableDevicesWithComponents.reset();
      db.searchableDevicesWithComponents.removeWatch("searchable-devices-with-components-campaign");
      clearTimeout(this.state.timeout);
      clearInterval(this.state.intervalId);
    }
    generatePositions() {
      var groupsListItems = !_.isUndefined(ReactDOM.findDOMNode(this.refs.groupsList).children[0].children[0]) ? ReactDOM.findDOMNode(this.refs.groupsList).children[0].children[0].children : null;
      var wrapperPosition = ReactDOM.findDOMNode(this.refs.groupsList).getBoundingClientRect();
      var positions = [];
      _.each(groupsListItems, function(item) {
        if(item.className.indexOf('ioslist-group-container') > -1) {
          var header = item.getElementsByClassName('ioslist-group-header')[0];
          positions.push(header.getBoundingClientRect().top - wrapperPosition.top + ReactDOM.findDOMNode(this.refs.groupsList).scrollTop);
        }
      }, this);
      return positions;
    }
    setFakeHeader(data) {
      this.setState({fakeHeaderLetter: Object.keys(data)[0]});
    }
    groupsListScroll() {
      var scrollTop = this.refs.groupsList.scrollTop;
      var newFakeHeaderLetter = this.state.fakeHeaderLetter;
      var headerHeight = !_.isUndefined(this.refs.fakeHeader) ? this.refs.fakeHeader.offsetHeight : 28;
      var positions = this.generatePositions();
      var wrapperPosition = ReactDOM.findDOMNode(this.refs.groupsList).getBoundingClientRect();
      var beforeHeadersCount = 0;
      
      positions.every(function(position, index) {
        if(scrollTop >= position) {
          beforeHeadersCount++;
          newFakeHeaderLetter = Object.keys(this.state.data)[index];
          return true;
        } else if(scrollTop >= position - headerHeight) {
          scrollTop -= scrollTop - (position - headerHeight);
          return true;
        }
      }, this);
          
      var offset = 5;
      var headersHeight = !_.isUndefined(document.getElementsByClassName('ioslist-group-header')[0]) ? document.getElementsByClassName('ioslist-group-header')[0].offsetHeight : 28;
      var listItemHeight = !_.isUndefined(document.getElementsByClassName('list-group-item')[0]) ? document.getElementsByClassName('list-group-item')[0].offsetHeight - 1 : 39;
      var groupsShownStartIndex = Math.floor((ReactDOM.findDOMNode(this.refs.groupsList).scrollTop - (beforeHeadersCount - 1) * headersHeight) / listItemHeight) - offset;
      var groupsShownEndIndex = groupsShownEndIndex + Math.floor(ReactDOM.findDOMNode(this.refs.groupsList).offsetHeight / listItemHeight) + 2 * offset;     
            
      this.setState({
        fakeHeaderTopPosition: scrollTop,
        fakeHeaderLetter: newFakeHeaderLetter,
        groupsShownStartIndex: groupsShownStartIndex,
        groupsShownEndIndex: groupsShownEndIndex
      });
    }
    startIntervalGroupsListScroll() {
      clearInterval(this.state.tmpIntervalId);
      var that = this;
      var intervalId = setInterval(function() {
        that.groupsListScroll();
      }, 10);
      this.setState({tmpIntervalId: intervalId});
    }
    stopIntervalGroupsListScroll() {
      clearInterval(this.state.tmpIntervalId);
      this.setState({tmpIntervalId: null});
    }
    refreshData() {
      SotaDispatcher.dispatch({actionType: 'search-devices-by-regex-with-components', regex: this.props.filterValue});
    }
    setData() {
      if(!_.isUndefined(db.groups.deref()) && !_.isUndefined(db.searchableDevicesWithComponents.deref())) {
        var result = this.restoreGroups(db.searchableDevicesWithComponents.deref(), db.groups.deref());
        if(!_.isUndefined(result.data) && (_.isUndefined(this.state.data) || Object.keys(this.state.data)[0] !== Object.keys(result.data)[0]))
          this.setFakeHeader(result.data);
        
        this.setState({
          data: result.data
        });
      }
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
                        
      return this.prepareData(groups);
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
      return {data: SortedGroups};
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
      var groupIndex = -1;
      if(!_.isUndefined(this.state.data)) {
        var groups = _.map(this.state.data, function(groups, index) {
          if(!_.isUndefined(groups)) {
            var items = [];
            for(var groupName in groups) {
              groupIndex++;
              var isChosen = this.state.chosenGroups.indexOf(groupName) > -1 ? true : false;
              
              if(groupIndex >= this.state.groupsShownStartIndex && groupIndex <= this.state.groupsShownEndIndex)
                items.push(
                  <li key={'group-' + groupName}>
                    <GroupsListItem 
                      name={groupName}
                      toggleGroup={this.toggleGroup}
                      isChosen={isChosen}/>
                  </li>
                );
              else 
                items.push(
                  <li key={'group-' + groupName} className="list-group-item" >{groupIndex}</li>
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
          <ul className="list-group ios-groups-list" id="packages-list">
            <div id="packages-list-inside">
              <div className="ioslist-wrapper" ref="groupsList">
                <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
                  {!_.isUndefined(groups) ? 
                    groups.length ?
                      <div>
                        <h2 className="ioslist-fake-header" style={{top: this.state.fakeHeaderTopPosition}} ref="fakeHeader">{this.state.fakeHeaderLetter}</h2>
                        {groups}
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
                  : undefined}
                </VelocityTransitionGroup>
                {_.isUndefined(groups) ? 
                  <Loader />
                : undefined}
              </div>
            </div>
          </ul>
        </div>
      );
    }
  }
  return GroupsList;
});
