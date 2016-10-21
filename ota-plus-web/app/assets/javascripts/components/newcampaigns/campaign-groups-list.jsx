define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      CampaignGroupsListItem = require('es6!./campaign-groups-list-item');
      
  class CampaignGroupsList extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      var groups = _.map(this.props.groups, function(group) {
        return (
          <CampaignGroupsListItem 
            key={"campaign-group-" + group.updateRequest}
            campaignGroup={group} 
            cancelCampaignForGroup={this.props.cancelCampaignForGroup}/>
        );
      }, this);
        
      return (
        <div>
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
        </div>
      );
    }
  };

  return CampaignGroupsList;
});
