define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      Loader = require('../loader'),
      CampaignsListItem = require('./campaigns-list-item');
      
  class CampaignsList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        campaignsWrapperHeight: this.props.contentHeight
      };
      this.goToCampaignDetails = this.goToCampaignDetails.bind(this);
    }
    componentDidMount() {
      this.setState({campaignsWrapperHeight: this.props.contentHeight - jQuery('.panel-subheading').height()});
    }
    componentWillReceiveProps(nextProps) {
      if(nextProps.contentHeight != this.props.contentHeight)
        this.setState({campaignsWrapperHeight: nextProps.contentHeight - jQuery('.panel-subheading').height()});
    }
    goToCampaignDetails(campaignUUID) {
      this.context.history.pushState(null, `campaigndetails/${campaignUUID}`);
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
              configureCampaign={this.props.openWizard}
              openRenameModal={this.props.openRenameModal}/>
          );
        }, this);
        
        runningCampaigns = _.map(this.props.campaigns.running, function(campaign, i) {
          return (
            <CampaignsListItem 
              key={"campaign-" + campaign.name}
              campaign={campaign}
              goToCampaignDetails={this.goToCampaignDetails}
              openRenameModal={this.props.openRenameModal}/>
          );
        }, this);
        
        finishedCampaigns = _.map(this.props.campaigns.finished, function(campaign, i) {
          return (
            <CampaignsListItem 
              key={"campaign-" + campaign.name}
              campaign={campaign}
              goToCampaignDetails={this.goToCampaignDetails}
              openRenameModal={this.props.openRenameModal}/>
          );
        }, this);
      }
            
      return (
          <div className="with-background" style={{height: this.state.campaignsWrapperHeight}}>
            <div className="campaigns-section-header">Draft campaigns</div>
            {draftCampaigns.length ? 
              <table className="table with-background">
                <thead>
                  <tr>
                    <th className="col-md-3">Name</th>
                    <th className="col-md-2">Start date</th>
                    <th className="col-md-2">End date</th>
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
                    <th className="col-md-4">Name</th>
                    <th className="col-md-2">Start date</th>
                    <th className="col-md-2">End date</th>
                    <th className="col-md-3">Status</th>
                    <th className="col-md-1 text-right"></th>
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
                    <th className="col-md-4">Name</th>
                    <th className="col-md-2">Start date</th>
                    <th className="col-md-2">End date</th>
                    <th className="col-md-3">Status</th>
                    <th className="col-md-1 text-right"></th>
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
      );
    }
  };
  
  CampaignsList.contextTypes = {
    history: React.PropTypes.object.isRequired,
  };

  return CampaignsList;
});
