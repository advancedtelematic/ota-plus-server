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
    componentWillReceiveProps(nextProps) {
      if(nextProps.filterValue != this.props.filterValue || nextProps.selectedSort != this.props.selectedSort) {
        this.setData(nextProps.filterValue, nextProps.selectedSort);
      }
    }
    componentWillUnmount() {
      db.campaigns.reset();
      db.campaigns.removeWatch("poll-campaigns");
    }
    configureCampaign(campaignUUID, e) {
      e.preventDefault();
      this.props.openWizard(campaignUUID);
    }
    setData(filterValue = null, selectedSort) {
      var campaigns = db.campaigns.deref();
      if(!_.isUndefined(campaigns)) {
        if(filterValue) {            
          campaigns = _.filter(campaigns, function(campaign) {
            return campaign.name.indexOf(filterValue) > -1;
          });
        }
          
        campaigns.sort(function(a, b) {
          var aName = a.name;
          var bName = b.name;
          if(selectedSort !== 'undefined' && selectedSort == 'desc')
            return (aName.charAt(0) % 1 === 0 && bName.charAt(0) % 1 !== 0) ? -1 : bName.localeCompare(aName);
          else
            return (aName.charAt(0) % 1 === 0 && bName.charAt(0) % 1 !== 0) ? 1 : aName.localeCompare(bName);
        });
        
        var groupedCampaigns = {draft: [], running: [], finished: []};
        
        _.each(campaigns, function(campaign) {
          if(!campaign.launched) {
            groupedCampaigns.draft.push(campaign); 
          } else {
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
            
            campaign.summary = {
              overallDevicesCount: overallDevicesCount,
              overallUpdatedDevicesCount: overallUpdatedDevicesCount,
              overallFailedUpdates: overallFailedUpdates,
              overallSuccessfulUpdates: overallSuccessfulUpdates,
              overallCancelledUpdates: overallCancelledUpdates
            };
            
            if(overallUpdatedDevicesCount < overallDevicesCount) {
              groupedCampaigns.running.push(campaign);
            } else {
              groupedCampaigns.finished.push(campaign);
            }
          }
        });
        
        this.setState({data: campaigns, campaigns: groupedCampaigns});
      }
    }
    render() {
      var draftCampaigns = [];
      var runningCampaigns = [];
      var finishedCampaigns = [];
      
      if(!_.isUndefined(this.state.campaigns)) {
        draftCampaigns = _.map(this.state.campaigns.draft, function(campaign, i) {
          return (
            <CampaignsListItem 
              key={"campaign-" + campaign.name}
              campaign={campaign}
              configureCampaign={this.configureCampaign}/>
          );
        }, this);
        
        runningCampaigns = _.map(this.state.campaigns.running, function(campaign, i) {
          return (
            <CampaignsListItem 
              key={"campaign-" + campaign.name}
              campaign={campaign}/>
          );
        }, this);
        
        finishedCampaigns = _.map(this.state.campaigns.finished, function(campaign, i) {
          return (
            <CampaignsListItem 
              key={"campaign-" + campaign.name}
              campaign={campaign}/>
          );
        }, this);
      }
      
      var campaigns = _.map(this.state.data, function(campaign, i) {
        return (
          <CampaignsListItem 
            key={"campaign-" + campaign.name}
            campaign={campaign}
            configureCampaign={this.configureCampaign}/>
        );
      }, this);
            
      return (
         <div className="height-100">
          {!_.isUndefined(db.campaigns.deref()) ? 
            db.campaigns.deref().length ?
              <div className="height-100 with-background">
                <div className="campaigns-section-header">Draft campaigns</div>
                {draftCampaigns.length ? 
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="col-md-3">Name</th>
                        <th className="col-md-2">Start Date</th>
                        <th className="col-md-2">End Date</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {draftCampaigns}
                    </tbody>
                  </table>
                :
                  <div className="campaigns-list-inner">
                    {this.props.filterValue != '' ?
                      <span>No matching draft campaigns.</span>
                    :
                      <span>No draft campaigns.</span>
                    }
                  </div>
                }
                <div className="campaigns-section-header">Running campaigns</div>
                {runningCampaigns.length ? 
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="col-md-3">Name</th>
                        <th className="col-md-2">Start Date</th>
                        <th className="col-md-2">End Date</th>
                        <th className="col-md-3">Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {runningCampaigns}
                    </tbody>
                  </table>
                :
                  <div className="campaigns-list-inner">
                    {this.props.filterValue != '' ?
                      <span>No matching running campaigns.</span>
                    :
                      <span>No running campaigns.</span>
                    }
                  </div>
                }
                <div className="campaigns-section-header">Finished campaigns</div>
                {finishedCampaigns.length ? 
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="col-md-3">Name</th>
                        <th className="col-md-2">Start Date</th>
                        <th className="col-md-2">End Date</th>
                        <th className="col-md-3">Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {finishedCampaigns}
                    </tbody>
                  </table>
                :
                  <div className="campaigns-list-inner">
                    {this.props.filterValue != '' ?
                      <span>No matching finished campaigns.</span>
                    :
                      <span>No finished campaigns.</span>
                    }
                  </div>
                }              
              </div>
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
