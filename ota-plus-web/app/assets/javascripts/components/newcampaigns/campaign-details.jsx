define(function(require) {
  var React = require('react'),
      ReactI18next = require('reactI18next'),
      Router = require('react-router'),
      Link = Router.Link,
      SotaDispatcher = require('sota-dispatcher'),
      db = require('stores/db'),
      PieChart = require('react-chartjs').Pie,
      DoughnutChart = require('react-chartjs').Doughnut,
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      CampaignHeader = require('./campaign-header'),
      CampaignGroupsList = require('./campaign-groups-list'),
      CampaignCancelModal = require('./campaign-cancel-modal'),
      CampaignCancelGroupModal = require('./campaign-cancel-group-modal'),
      Loader = require('../loader');
      
  class CampaignDetails extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        campaignData: undefined,
        campaignDetailsHeight: '300px',
        campaignToCancel: null,
        campaignGroupToCancel: null,
        isCampaignCancelModalShown: false,
        isCampaignCancelGroupModalShown: false
      };
      this.setCampaignDetailsHeight = this.setCampaignDetailsHeight.bind(this);
      this.cancelCampaign = this.cancelCampaign.bind(this);
      this.cancelCampaignForGroup = this.cancelCampaignForGroup.bind(this);
      this.closeCampaignCancelModal = this.closeCampaignCancelModal.bind(this);
      this.closeCampaignCancelGroupModal = this.closeCampaignCancelGroupModal.bind(this);
      this.setCampaignData = this.setCampaignData.bind(this);
      this.handleDeviceSeen = this.handleDeviceSeen.bind(this);
      
      SotaDispatcher.dispatch({actionType: 'get-campaign', uuid: this.props.params.id});
      SotaDispatcher.dispatch({actionType: 'get-campaign-statistics', uuid: this.props.params.id});
      db.campaign.addWatch("poll-campaign", _.bind(this.setCampaignData, this, null));
      db.campaignStatistics.addWatch("poll-campaign-statistics", _.bind(this.setCampaignData, this, null));
      db.deviceSeen.addWatch("poll-deviceseen-campaign-details", _.bind(this.handleDeviceSeen, this, null));
    }
    componentDidMount() {
      var that = this;
      window.addEventListener("resize", this.setCampaignDetailsHeight);
      this.setCampaignDetailsHeight();
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.setCampaignDetailsHeight);
      db.campaign.removeWatch("poll-campaign");
      db.campaignStatistics.removeWatch("poll-campaign");
      db.deviceSeen.removeWatch("poll-deviceseen-campaign-details");
      db.campaign.reset();
      db.campaignStatistics.reset();
    }
    setCampaignDetailsHeight() {
      var windowHeight = jQuery(window).height();
      var offsetTop = jQuery('#campaigns-wrapper').offset().top;
            
      this.setState({
        campaignDetailsHeight: windowHeight - offsetTop
      });
    }    
    cancelCampaign() {
      this.setState({
        isCampaignCancelModalShown: true,
        campaignToCancel: this.state.campaignData
      });
    }
    cancelCampaignForGroup(campaignGroup, groupName) {
      campaignGroup.meta = this.state.campaignData.meta;
      campaignGroup.groupName = groupName;
      
      this.setState({
        isCampaignCancelGroupModalShown: true,
        campaignGroupToCancel: campaignGroup
      });
    }
    closeCampaignCancelModal(ifRefreshData = false) {
      if(ifRefreshData) {
        var that = this;
        setTimeout(function() {
          SotaDispatcher.dispatch({actionType: 'get-campaign', uuid: that.props.params.id});
          SotaDispatcher.dispatch({actionType: 'get-campaign-statistics', uuid: that.props.params.id});
        }, 1);
      }
      this.setState({
        isCampaignCancelModalShown: false,
        campaignDetailsToCancel: null
      });
    }
    closeCampaignCancelGroupModal(ifRefreshData = false) {
      if(ifRefreshData) {
        var that = this;
        setTimeout(function() {
          SotaDispatcher.dispatch({actionType: 'get-campaign', uuid: that.props.params.id});
          SotaDispatcher.dispatch({actionType: 'get-campaign-statistics', uuid: that.props.params.id});
        }, 1);
      }
      this.setState({
        isCampaignCancelGroupModalShown: false,
        campaignGroupToCancel: null
      });
    }
    setCampaignData() {      
      if(!_.isUndefined(db.campaign.deref()) && !_.isUndefined(db.campaignStatistics.deref())) {
        var campaign = db.campaign.deref();  
        var campaignStatistics = db.campaignStatistics.deref();
        var overallDevicesCount = 0;
        var overallUpdatedDevicesCount = 0;
        var overallFailedUpdates = 0;
        var overallSuccessfulUpdates = 0;
        var overallCancelledUpdates = 0;
        
        _.each(campaign.groups, function(group, index) {
          campaign.groups[index]['statistics'] = _.findWhere(db.campaignStatistics.deref(), {updateId: group.updateRequest});
        });
        
        _.each(campaignStatistics, function(statistic) {
          overallDevicesCount += statistic.deviceCount;
          overallUpdatedDevicesCount += statistic.updatedDevices;
          overallFailedUpdates += statistic.failedUpdates;
          overallSuccessfulUpdates += statistic.successfulUpdates;
          overallCancelledUpdates += statistic.cancelledUpdates;
        });
        
        campaign.overallDevicesCount = overallDevicesCount;
        campaign.overallUpdatedDevicesCount = overallUpdatedDevicesCount;
        campaign.overallFailedUpdates = overallFailedUpdates;
        campaign.overallSuccessfulUpdates = overallSuccessfulUpdates;
        campaign.overallCancelledUpdates = overallCancelledUpdates;
        
        this.setState({campaignData: campaign});
      }
    }
    handleDeviceSeen() {
      var deviceSeen = db.deviceSeen.deref();
      if(!_.isUndefined(deviceSeen) && !_.isUndefined(this.state.campaignData)) {
        SotaDispatcher.dispatch({actionType: 'get-campaign', uuid: this.props.params.id});
        SotaDispatcher.dispatch({actionType: 'get-campaign-statistics', uuid: this.props.params.id});
      }
    }
    render() {
      const { t } = this.props;
      var campaign = this.state.campaignData;
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
          },
          {
            value: campaign.overallCancelledUpdates,
            color: "#CCCCCC",
            highlight: "#CCCCCC",
            label: "Cancelled rate"
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
                <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
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
                              <span className="lightgrey">{campaign.overallUpdatedDevicesCount} of {t('common.deviceWithCount', {count: campaign.overallDevicesCount})}</span>
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
                                <DoughnutChart data={failureRateData} options={{percentageInnerCutout: 40}} width="120" height="120" options={{showTooltips: false}}/>
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
                    
                      <div className="row">
                        {campaign.overallUpdatedDevicesCount !== campaign.overallDevicesCount ?
                          <button className="btn btn-red pull-right margin-bottom-15 margin-right-40" title="Cancel the Campaign for all groups" onClick={this.cancelCampaign}>CANCEL ALL</button>
                        : null}
                      </div>
                    </div>
                  </div>
                : undefined}
                </VelocityTransitionGroup>
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
                campaign={this.state.campaignToCancel}/>
            : null}
          </VelocityTransitionGroup>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.isCampaignCancelGroupModalShown ?
              <CampaignCancelGroupModal
                closeForm={this.closeCampaignCancelGroupModal} 
                group={this.state.campaignGroupToCancel}/>
            : null}
          </VelocityTransitionGroup>
        </div>
      );
    }
  };

  return ReactI18next.translate()(CampaignDetails);
});
