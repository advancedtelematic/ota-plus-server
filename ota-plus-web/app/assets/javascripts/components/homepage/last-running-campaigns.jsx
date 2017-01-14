define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      PieChart = require('react-chartjs').Pie,
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      Loader = require('../loader'),
      CampaignsListItem = require('../newcampaigns/campaigns-list-item');

  class LastRunningCampaigns extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        campaignsData: undefined
      };
      this.setCampaignsData = this.setCampaignsData.bind(this);
      this.goToCampaignDetails = this.goToCampaignDetails.bind(this);
      db.campaigns.addWatch("homepage-running-campaigns", _.bind(this.setCampaignsData, this, null));
    }
    componentWillUnmount() {
      db.campaigns.removeWatch("homepage-running-campaigns");
      db.campaigns.reset();
    }
    setCampaignsData() {
      var campaigns = db.campaigns.deref();
      if(!_.isUndefined(campaigns)) {
        var newCampaigns = [];
        _.each(campaigns, function(campaign) {
          if(campaign.launched) {
            var overallDevicesCount = 0;
            var overallUpdatedDevicesCount = 0;
            var overallFailedUpdates = 0;
            var overallSuccessfulUpdates = 0;
            var overallCancelledUpdates = 0;
            _.each(campaign.statistics, function(statistic) {
              overallDevicesCount += statistic.deviceCount;
              overallUpdatedDevicesCount += statistic.updatedDevices;
              overallFailedUpdates += statistic.failedUpdates;
              overallSuccessfulUpdates += statistic.successfulUpdates;
              overallCancelledUpdates += statistic.cancelledUpdates;
            });
            if(overallDevicesCount !== overallUpdatedDevicesCount) {
              campaign.summary = {
                overallDevicesCount: overallDevicesCount,
                overallUpdatedDevicesCount: overallUpdatedDevicesCount,
                overallFailedUpdates: overallFailedUpdates,
                overallSuccessfulUpdates: overallSuccessfulUpdates,
                overallCancelledUpdates: overallCancelledUpdates
              };
              newCampaigns.push(campaign);
            }
          }
        });
        newCampaigns = _.sortBy(newCampaigns, function(campaign) {
          return campaign.createdAt;
        }).reverse();
        this.setState({
          campaignsData: newCampaigns.slice(0, 10)
        });
      }
    }
    goToCampaignDetails(e) {
      var id = e.currentTarget.dataset.id;
      this.context.history.pushState(null, `campaigndetails/${id}`);
    }
    render() {
      var campaigns = [];  
      if(!_.isUndefined(this.state.campaignsData)) {
        campaigns = _.map(this.state.campaignsData, function(campaign) {
          var progress = Math.min(Math.round(campaign.summary.overallUpdatedDevicesCount/Math.max(campaign.summary.overallDevicesCount, 1) * 100), 100);
          var data = [
            {
              value: campaign.summary.overallFailedUpdates,
              color:"#FF0000",
              highlight: "#FF0000",
              label: "Failure rate"
            },
            {
              value: campaign.summary.overallSuccessfulUpdates,
              color: "#96DCD1",
              highlight: "#96DCD1",
              label: "Success rate"
            },
            {
              value: campaign.summary.overallCancelledUpdates,
              color: "#CCCCCC",
              highlight: "#CCCCCC",
              label: "Cancelled rate"
            }];
        
          return (
            <tr key={campaign.id} data-id={campaign.id} onClick={this.goToCampaignDetails}>
              <td>{campaign.name}</td>
              <td>none</td>
              <td>none</td>
              <td>
                <div className="progress progress-blue">
                  <div className={"progress-bar" + (progress != 100 ? ' progress-bar-striped active': '')} role="progressbar" style={{width: progress + '%'}}></div>
                  <div className="progress-count">
                    {progress}%
                  </div>
                  <div className="progress-status">
                    {progress == 100 ?
                      <span className="fa-stack">
                        <i className="fa fa-circle fa-stack-1x"></i>
                        <i className="fa fa-check-circle fa-stack-1x fa-inverse"></i>
                      </span>
                    : null}
                  </div>
                </div>
              </td>
              <td>
                <PieChart data={data} width="30" height="30" options={{showTooltips: false}}/>   
              </td>
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
                    <td>Start date</td>
                    <td>End date</td>
                    <td>Status</td>
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
                        <td>Start date</td>
                        <td>End date</td>
                        <td>Status</td>
                        <td></td>
                      </tr>
                    </thead>
                  </table>
                </div>
                <div className="col-md-12 height-100 position-relative text-center">
                  <div className="center-xy padding-15">
                    <span className="font-18">No running campaigns.</span>
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
  
  LastRunningCampaigns.propTypes = {
    listHeight: React.PropTypes.number.isRequired,
  };
  
  LastRunningCampaigns.contextTypes = {
    history: React.PropTypes.object.isRequired,
  };
  
  return LastRunningCampaigns;
});
