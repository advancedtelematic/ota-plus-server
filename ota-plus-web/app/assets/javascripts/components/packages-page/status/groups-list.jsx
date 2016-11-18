define(function(require) {
  var React = require('react'),
      ReactDOM = require('react-dom'),
      SotaDispatcher = require('sota-dispatcher'),
      db = require('stores/db'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      Loader = require('../../loader'),
      jQuery = require('jquery'),
      GroupsListItem = require('./groups-list-item');

  class GroupsList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        groupsData: undefined
      };
      this.setData = this.setData.bind(this);
      SotaDispatcher.dispatch({actionType: 'get-groups'});
      db.groups.addWatch("groups-package-status", _.bind(this.setData, this, null));
    }
    componentWillUnmount() {
      db.groups.removeWatch("groups-package-status");
    }
    setData() {
      if(!_.isUndefined(db.groups.deref())) {
        this.setState({
          groupsData: db.groups.deref()
        });
        this.props.selectAllGroups();
      }
    }
    render() {
      var groups = _.map(this.state.groupsData, function(group, index) {
        var isSelected = this.props.selectedGroups.indexOf(group.id) > -1 ? true : false;
        return (
          <li key={'group-' + group.groupName}>
            <GroupsListItem 
              group={group}
              isSelected={isSelected}
              toggleGroup={this.props.toggleGroup}/>
          </li>
        );
      }, this);
      return (
        <div>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {!_.isUndefined(groups) ? 
              groups
            : undefined}
          </VelocityTransitionGroup>
          {_.isUndefined(groups) ? 
            <Loader />
          : undefined}
        </div>
      );
    }
  }
  return GroupsList;
});
