define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      SotaDispatcher = require('sota-dispatcher'),
      db = require('stores/db'),
      PieChart = require('react-chartjs').Pie,
      DoughnutChart = require('react-chartjs').Doughnut,
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      CampaignHeader = require('es6!./campaign-header'),
      CampaignGroupsList = require('es6!./campaign-groups-list'),
      CampaignCancelModal = require('es6!./campaign-cancel-modal'),
      Loader = require('es6!../loader');
      
  class CampaignDetails extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: undefined,
        campaignDetailsHeight: '300px',
        campaignUuidToCancel: null,
        isCampaignCancelModalShown: false
      };
      this.setCampaignDetailsHeight = this.setCampaignDetailsHeight.bind(this);
      this.cancelCampaignForGroup = this.cancelCampaignForGroup.bind(this);
      this.cancelCampaign = this.cancelCampaign.bind(this);
      this.showCampaignCancelModal = this.showCampaignCancelModal.bind(this);
      this.closeCampaignCancelModal = this.closeCampaignCancelModal.bind(this);
      this.setData = this.setData.bind(this);
      
      SotaDispatcher.dispatch({actionType: 'get-campaign', uuid: this.props.params.id});
      db.campaign.addWatch("poll-campaign", _.bind(this.setData, this, null));
      SotaDispatcher.dispatch({actionType: 'get-campaign-statistics', uuid: this.props.params.id});
      db.campaignStatistics.addWatch("poll-campaign-statistics", _.bind(this.setData, this, null));
    }
    componentDidMount() {
      var that = this;
      window.addEventListener("resize", this.setCampaignDetailsHeight);
      this.setCampaignDetailsHeight();
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.setCampaignDetailsHeight);
      db.campaign.reset();
      db.campaignStatistics.reset();
      db.campaign.removeWatch("poll-campaign");
      db.campaignStatistics.removeWatch("poll-campaign");
    }
    setCampaignDetailsHeight() {
      var windowHeight = jQuery(window).height();
      var offsetTop = jQuery('#campaigns-wrapper').offset().top;
            
      this.setState({
        campaignDetailsHeight: windowHeight - offsetTop
      });
    }
    cancelCampaignForGroup(uuid) {
      this.showCampaignCancelModal(uuid);
    }
    cancelCampaign() {
      console.log('cancel whole campaign');
    }
    showCampaignCancelModal(uuid) {
      this.setState({
        isCampaignCancelModalShown: true,
        campaignUuidToCancel: uuid
      });
    }
    closeCampaignCancelModal() {
      this.setState({
        isCampaignCancelModalShown: false,
        campaignUuidToCancel: null
      });
    }
    setData() {      
      if(!_.isUndefined(db.campaign.deref()) && !_.isUndefined(db.campaignStatistics.deref())) {
        var campaign = db.campaign.deref();  
        var campaignStatistics = db.campaignStatistics.deref();
        var overallDevicesCount = 0;
        var overallUpdatedDevicesCount = 0;
        var overallFailedUpdates = 0;
        var overallSuccessfulUpdates = 0;
        
        _.each(campaign.groups, function(group, index) {
          campaign.groups[index]['statistics'] = _.findWhere(db.campaignStatistics.deref(), {updateId: group.updateRequest});
        });
        
        _.each(campaignStatistics, function(statistic) {
          overallDevicesCount += statistic.deviceCount;
          overallUpdatedDevicesCount += statistic.updatedDevices;
          overallFailedUpdates += statistic.failedUpdates;
          overallSuccessfulUpdates += statistic.successfulUpdates;
        });
        
        campaign.overallDevicesCount = overallDevicesCount;
        campaign.overallUpdatedDevicesCount = overallUpdatedDevicesCount;
        campaign.overallFailedUpdates = overallFailedUpdates;
        campaign.overallSuccessfulUpdates = overallSuccessfulUpdates;
        
        this.setState({data: campaign});
      }
    }
    render() {
      var campaign = this.state.data;
      var failureRateData = [];
      var progress = 0;
      
      if(!_.isUndefined(campaign)) {
        failureRateData = [
          {
            value: campaign.overallFailedUpdates,
            color: "#FF0000",
            highlight: "#FF0000",
            label: "Failure rate"
          },
          {
            value: campaign.overallSuccessfulUpdates,
            color: "#96DCD1",
            highlight: "#96DCD1",
            label: "Success rate"
          }
        ];
        
        progress = Math.min(Math.round(campaign.overallUpdatedDevicesCount/Math.max(campaign.overallDevicesCount, 1) * 100), 100);
      }
            
      return (
        <div id="campaign">
          <div className="grey-header">
            {!_.isUndefined(campaign) ?
              <CampaignHeader 
                name={campaign.meta.name}
                devicesCount={campaign.overallDevicesCount}/>
            : undefined}
            {_.isUndefined(campaign) ? 
              <Loader />
            : undefined}
          </div>
  
          <div className="panel panel-ats">
            <div className="panel-heading">
              <div className="panel-heading-left pull-left">
                CAMPAIGN DETAILED VIEW
              </div>
            </div>
            <div className="panel-body">
              <div id="campaigns-wrapper" className="with-background" style={{height: this.state.campaignDetailsHeight}}>
                {!_.isUndefined(campaign) ?
                  <div>
                    <div className="container">
                      <div className="row">
                        <div className="col-md-7">
                          <div className="margin-top-30">
                            <div className="font-18">Total progress</div>
                          </div>
                          <div className="margin-top-50">
                            <div className="col-md-3 margin-top-5">
                              <span className="lightgrey">{campaign.overallUpdatedDevicesCount} of {campaign.overallDevicesCount} Devices</span>
                            </div>
                            <div className="col-md-8">
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
                            </div>
                          </div>
                        </div>
                        <div className="col-md-5">
                          <div className="margin-top-30">
                            <div className="font-18">Failure rate</div>
                            <div className="col-md-10 col-md-offset-2">
                              <div className="position-relative">
                                <DoughnutChart data={failureRateData} options={{percentageInnerCutout: 40}} width="120" height="120"/>
                                <div className="campaign-chart-inside font-18 text-center"><strong>{Math.round(campaign.overallFailedUpdates/Math.max(campaign.overallUpdatedDevicesCount, 1) * 100)}%</strong></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="margin-top-40">
                      <CampaignGroupsList 
                        groups={campaign.groups}
                        cancelCampaignForGroup={this.cancelCampaignForGroup}/>
                    
                      <div className="container margin-bottom-15">
                        <button className="btn btn-red pull-right margin-right-40" title="Cancel the Campaign for all groups" onClick={this.cancelCampaign}>CANCEL ALL</button>
                      </div>
                    </div>
                  </div>
                : undefined}
              </div>
              {_.isUndefined(campaign) ? 
                <Loader />
              : undefined}
            </div>
          </div>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.isCampaignCancelModalShown ?
              <CampaignCancelModal
                closeForm={this.closeCampaignCancelModal} 
                campaignUuid={this.state.campaignUuidToCancel}/>
            : null}
          </VelocityTransitionGroup>
        </div>
      );
    }
  };

  return CampaignDetails;
});
