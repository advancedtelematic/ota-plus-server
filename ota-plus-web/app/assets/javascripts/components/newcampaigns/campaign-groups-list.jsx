define(function(require) {
  var React = require('react'),
      SotaDispatcher = require('sota-dispatcher'),
      db = require('stores/db'),
      CampaignGroupsListItem = require('es6!./campaign-groups-list-item'),
      Loader = require('es6!../loader');
      
  class CampaignGroupsList extends React.Component {
    constructor(props) {
      super(props);
      SotaDispatcher.dispatch({actionType: 'get-groups'});
      db.groups.addWatch("poll-campaign-details-groups", _.bind(this.forceUpdate, this, null));
    }
    componentWillUnmount() {
      db.groups.removeWatch("poll-campaign-details-groups");
    }
    render() {
      var groupsData = db.groups.deref();
      if(!_.isUndefined(groupsData)) {
        var groups = _.map(this.props.groups, function(group) {
          var foundGroup = _.findWhere(groupsData, {id: group.group});
          return (
            <CampaignGroupsListItem 
              key={"campaign-group-" + group.updateRequest}
              groupName={foundGroup.groupName}
              campaignGroup={group} 
              cancelCampaignForGroup={this.props.cancelCampaignForGroup}/>
          );
        }, this);
      }
        
      return (
        <div>
          {!_.isUndefined(groupsData) ? 
            <table className="table table-grey-header">
              <thead>
                <tr>
                  <th className="col-md-4">Name</th>
                  <th className="col-md-4 text-center">Status</th>
                  <th className="col-md-3"></th>
                  <th className="col-md-1"></th>
                </tr>
              </thead>
              <tbody>
                {groups}
              </tbody>
            </table>
          : undefined}
          {_.isUndefined(groupsData) ? 
            <Loader />
          : undefined}
        </div>
      );
    }
  };

  return CampaignGroupsList;
});
