define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      Loader = require('es6!../loader');

  class OngoingDraftCampaigns extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        campaignsData: undefined
      };
      this.setCampaignsData = this.setCampaignsData.bind(this);
      SotaDispatcher.dispatch({actionType: 'get-campaigns'});
      db.campaigns.addWatch("homepage-ongoing-campaigns", _.bind(this.setCampaignsData, this, null));
    }
    componentWillUnmount() {
      db.campaigns.removeWatch("homepage-ongoing-campaigns");
      db.campaigns.reset();
    }
    setCampaignsData() {
      var campaigns = _.clone(db.campaigns.deref());
      if(!_.isUndefined(campaigns)) {
        var newCampaigns = [];
        _.each(campaigns, function(campaign) {
          if(!campaign.launched)
            newCampaigns.push(campaign);
        }, this);
        newCampaigns = _.sortBy(newCampaigns, function(campaign) {
          return campaign.createdAt;
        }).reverse();
        this.setState({
          campaignsData: newCampaigns.slice(0, 10)
        });
      }
    }
    render() {
      var campaigns = [];  
      if(!_.isUndefined(this.state.campaignsData)) {
        campaigns = _.map(this.state.campaignsData, function(campaign) {
          return (
            <tr key={campaign.id}>
              <td>{campaign.name}</td>
              <td>none</td>
              <td>none</td>
              <td><a href="#" className="black" onClick={this.props.configureCampaign.bind(this, campaign.id)}>Configure</a></td>
            </tr>
          );
        }, this);
      }
      return (
        <div style={{height: this.props.listHeight}}>
          {!_.isUndefined(this.state.campaignsData) ?
            this.state.campaignsData.length ?
              <table className="table">
                <thead>
                  <tr>
                    <td>Name</td>
                    <td>Start Date</td>
                    <td>End Date</td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  {campaigns}
                </tbody>
              </table>
            :
              <div className="height-100">
                <div className="table-empty-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <td>Name</td>
                        <td>Start Date</td>
                        <td>End Date</td>
                        <td></td>
                      </tr>
                    </thead>
                  </table>
                </div>
                <div className="col-md-12 height-100 position-relative text-center">
                  <div className="center-xy padding-15">
                    <button type="submit" className="btn btn-confirm btn-small" onClick={this.props.openNewCampaignModal}><i className="fa fa-plus"></i> ADD NEW CAMPAIGN</button>
                  </div>
                </div>
              </div>
          : undefined}
          {_.isUndefined(this.state.campaignsData) ?
            <Loader className="center-xy"/>
          : undefined}
        </div>
      );
    }
  }
  
  OngoingDraftCampaigns.propTypes = {
    listHeight: React.PropTypes.number.isRequired,
  };
  
  return OngoingDraftCampaigns;
});
