define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      Loader = require('es6!../loader'),
      CampaignsListItem = require('es6!./campaigns-list-item');
      
  class CampaignsList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: undefined
      };
      this.configureCampaign = this.configureCampaign.bind(this);
      this.setData = this.setData.bind(this);
      SotaDispatcher.dispatch({actionType: 'get-campaigns'});
      db.campaigns.addWatch("poll-campaigns", _.bind(this.setData, this, null));
    }
    componentWillUnmount() {
      db.campaigns.reset();
      db.campaigns.removeWatch("poll-campaigns");
    }
    configureCampaign(campaignUUID, e) {
      e.preventDefault();
      this.props.openWizard(campaignUUID);
    }
    setData() {
      var campaigns = db.campaigns.deref();
      if(!_.isUndefined(campaigns)) {
        campaigns.sort(function(a, b) {
          var aName = a.name;
          var bName = b.name;
          return (aName.charAt(0) % 1 === 0 && bName.charAt(0) % 1 !== 0) ? 1 : aName.localeCompare(bName);
        });
        this.setState({data: campaigns});
      }
    }
    render() {
      var campaigns = _.map(this.state.data, function(campaign, i) {
        return (
          <CampaignsListItem 
            key={"campaign-" + campaign.name}
            campaign={campaign}
            configureCampaign={this.configureCampaign}/>
        );
      }, this);
            
      return (
        <div className={"height-100" + (!_.isUndefined(db.campaigns.deref()) && campaigns.length ? " with-background" : "")}>
          {!_.isUndefined(db.campaigns.deref()) ? 
            campaigns.length ? 
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns}
                </tbody>
              </table>
            :
              <div className="col-md-12 height-100 position-relative text-center">
                <div className="center-xy padding-15">
                  <span className="font-24 white">
                    There are no campaigns.
                  </span>
                </div>
              </div>
          : undefined}
          {_.isUndefined(db.campaigns.deref()) ?
            <Loader className="white" />
          : null}
        </div>
      );
    }
  };

  return CampaignsList;
});
