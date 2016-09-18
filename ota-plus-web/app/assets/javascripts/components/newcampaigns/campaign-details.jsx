define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      db = require('stores/db'),
      PieChart = require('react-chartjs').Pie,
      DoughnutChart = require('react-chartjs').Doughnut,
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      CampaignHeader = require('es6!./campaign-header'),
      CampaignGroupsList = require('es6!./campaign-groups-list'),
      CampaignCancelModal = require('es6!./campaign-cancel-modal');
      
  class CampaignDetails extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        campaignDetailsHeight: '300px',
        failureRate: 30,
        totalProgress: 0,
        devicesCount: 2564,
        campaignUuidToCancel: null,
        isCampaignCancelModalShown: false
      };
      this.setCampaignDetailsHeight = this.setCampaignDetailsHeight.bind(this);
      this.cancelCampaignForGroup = this.cancelCampaignForGroup.bind(this);
      this.cancelCampaign = this.cancelCampaign.bind(this);
      this.showCampaignCancelModal = this.showCampaignCancelModal.bind(this);
      this.closeCampaignCancelModal = this.closeCampaignCancelModal.bind(this);
    }
    componentDidMount() {
      var that = this;
      window.addEventListener("resize", this.setCampaignDetailsHeight);
      this.setCampaignDetailsHeight();
      
      if(this.state.totalProgress == 100) {
        clearInterval(this.state.intervalId);
      }
      
      var intervalId = setInterval(function() {
        that.setState({
          totalProgress: Math.min(that.state.totalProgress + Math.round(5*Math.random()), 100),
          failureRate: Math.min(Math.max(that.state.failureRate + Math.floor(Math.random() * 6) - 2, 0), 100)
        });
      }, 2000);
      
      this.setState({intervalId: intervalId});
    }
    componentWillUnmount() {
      clearInterval(this.state.intervalId);
      window.removeEventListener("resize", this.setCampaignDetailsHeight);
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
    render() {
      var failureRateData = [
        {
          value: this.state.failureRate,
          color:"#FF0000",
          highlight: "#FF0000",
          label: "Failure rate"
        },
        {
          value: 100 - this.state.failureRate,
          color: "#96DCD1",
          highlight: "#96DCD1",
          label: "Success rate"
        }];
      return (
        <div id="campaign">
          <CampaignHeader 
            uuid={this.props.params.id}/>
          
          <div className="panel panel-ats">
            <div className="panel-heading">
              <div className="panel-heading-left pull-left">
                CAMPAIGN DETAILED VIEW
              </div>
            </div>
            <div className="panel-body">
              <div id="campaigns-wrapper" style={{height: this.state.campaignDetailsHeight}}>
                <div className="container">
                  <div className="row">
                    <div className="col-md-7">
                      <div className="margin-top-30">
                        <div className="font-18">Total progress</div>
                      </div>
                      <div className="margin-top-50">
                        <div className="col-md-3 margin-top-5">
                          <span className="lightgrey">{Math.round(this.state.totalProgress/100*this.state.devicesCount)} of {this.state.devicesCount} Devices</span>
                        </div>
                        <div className="col-md-8">
                          <div className="progress progress-blue">
                            <div className={"progress-bar" + (this.state.totalProgress != 100 ? ' progress-bar-striped active': '')} role="progressbar" style={{width: this.state.totalProgress + '%'}}></div>
                            <div className="progress-count">
                              {this.state.totalProgress}%
                            </div>
                            <div className="progress-status">
                              {this.state.totalProgress == 100 ?
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
                            <div className="campaign-chart-inside font-18 text-center"><strong>{this.state.failureRate}%</strong></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="margin-top-40">
                  <CampaignGroupsList 
                    cancelCampaignForGroup={this.cancelCampaignForGroup}/>
                  
                  <div className="container margin-bottom-15">
                    <button className="btn btn-red pull-right margin-right-40" title="Cancel the Campaign for all groups" onClick={this.cancelCampaign}>CANCEL ALL</button>
                  </div>
                </div>
              </div>
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
