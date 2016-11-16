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
    }
    render() {
      var groups = _.map(this.props.groups, function(group, index) {
        if(!_.isUndefined(group)) {
          return (
            <li key={'group-' + group.groupName}>
              <GroupsListItem 
                group={group}
                selectGroup={this.props.selectGroup}
                isSelected={(this.props.selectedGroup.name == group.groupName && this.props.selectedGroup.type == 'real')}/>
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
