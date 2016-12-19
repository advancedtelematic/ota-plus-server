define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      Loader = require('../loader'),
      CampaignsListItem = require('./campaigns-list-item');
      
  class CampaignsList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        campaignsData: undefined,
        campaignsWrapperHeight: this.props.contentHeight
      };
      this.configureCampaign = this.configureCampaign.bind(this);
    }
    componentDidMount() {
      this.setState({campaignsWrapperHeight: this.props.contentHeight - jQuery('.panel-subheading').height()});
    }
    componentWillReceiveProps(nextProps) {
      if(nextProps.contentHeight != this.props.contentHeight)
        this.setState({campaignsWrapperHeight: nextProps.contentHeight - jQuery('.panel-subheading').height()});
    }
    configureCampaign(campaignUUID, e) {
      e.preventDefault();
      this.props.openWizard(campaignUUID);
    }
    render() {
      var draftCampaigns = [];
      var runningCampaigns = [];
      var finishedCampaigns = [];
      
      if(!_.isUndefined(this.props.campaigns)) {
        draftCampaigns = _.map(this.props.campaigns.draft, function(campaign, i) {
          return (
            <CampaignsListItem 
              key={"campaign-" + campaign.name}
              campaign={campaign}
              configureCampaign={this.configureCampaign}/>
          );
        }, this);
        
        runningCampaigns = _.map(this.props.campaigns.running, function(campaign, i) {
          return (
            <CampaignsListItem 
              key={"campaign-" + campaign.name}
              campaign={campaign}/>
          );
        }, this);
        
        finishedCampaigns = _.map(this.props.campaigns.finished, function(campaign, i) {
          return (
            <CampaignsListItem 
              key={"campaign-" + campaign.name}
              campaign={campaign}/>
          );
        }, this);
      }
      
      var campaigns = _.map(this.props.campaignsData, function(campaign, i) {
        return (
          <CampaignsListItem 
            key={"campaign-" + campaign.name}
            campaign={campaign}
            configureCampaign={this.configureCampaign}/>
        );
      }, this);
            
      return (
        <div id="campaigns-wrapper" style={{height: this.state.campaignsWrapperHeight}}>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {!_.isUndefined(db.campaigns.deref()) ? 
              db.campaigns.deref().length ?
                <div className="height-100 with-background">
                  <div className="campaigns-section-header">Draft campaigns</div>
                  {draftCampaigns.length ? 
                    <table className="table with-background">
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
                    <table className="table with-background">
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
                    <table className="table with-background">
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
                null
            : undefined}
          </VelocityTransitionGroup>
        </div>
      );
    }
  };

  return CampaignsList;
});
