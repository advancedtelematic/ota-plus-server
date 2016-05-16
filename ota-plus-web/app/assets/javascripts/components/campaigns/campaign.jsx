define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link;
  
  class Campaign extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        showMoreStats: false,
        reload: 0,
      }
            
      this.toggleStats = this.toggleStats.bind(this);
      this.cancelCampaign = this.cancelCampaign.bind(this);
      this.pauseCampaign = this.pauseCampaign.bind(this);
    }
    toggleStats(e) {
      e.preventDefault();
      this.setState({
        showMoreStats: !this.state.showMoreStats
      });
    }
    cancelCampaign() {
      var campaignsData = JSON.parse(localStorage.getItem('campaignsData'));      
      campaignsData = campaignsData.filter(function(obj) {
        return obj.name != this.props.campaign.name;
      }, this);
      
      localStorage.setItem('campaignsData', JSON.stringify(campaignsData));
      
      this.props.reload();
    }
    pauseCampaign() {
      var campaignsData = JSON.parse(localStorage.getItem('campaignsData'));  
      
      var newCampaignsData = [];
          
      _.map(campaignsData, function(campaign, i) {
        newCampaignsData[i] = campaign;
        
        if(campaign.name == this.props.campaign.name) {
          if(newCampaignsData[i].status == 'running') {
            newCampaignsData[i].status = 'paused';
          } else if(newCampaignsData[i].status == 'paused') {
            newCampaignsData[i].status = 'running';
          }
        }
      }, this);
      
      localStorage.setItem('campaignsData', JSON.stringify(newCampaignsData));
      
      this.props.reload();
    }
    render() {
      var campaign = this.props.campaign;
      return (
        <div className="campaign-box">
          <div className="row">
            <div className="col-md-7">
              <h4>{campaign.name}</h4>
            </div>
            {campaign.status != 'finished' ?
              <div className="col-md-5">
                <button className="btn btn-campaign pull-right" onClick={this.cancelCampaign}>Cancel</button>
                <button className="btn btn-campaign pull-right" onClick={this.pauseCampaign}>{campaign.status == 'running' ? 'Pause' : 'Resume'}</button>
              </div>
            : null}
          </div>
          <div className="campaign-box-inner">
            <div>
              Status: &nbsp;
              {campaign.status == 'running' ?
                <span className="green">running</span> 
              :
                campaign.status == 'paused' ?
                  <span className="red">paused</span>
                :
                  <span className="green">finished</span>
              }
              &nbsp; (launched today)
            </div>
            <div>
              End date: &nbsp;
              {campaign.end_date} {campaign.end_time} local time
            </div>
            <div>
              <div className="row">
                <div className="col-md-5">
                  Progress: &nbsp;
                  [0 &gt; 100%] 
                </div>
                <div className="col-md-3 nopadding">
                  <div className="progress">
                    <div className="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style={{width: this.props.campaign.progress + '%'}}></div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              Failure rate: &nbsp;
              <span className="green">0%</span> &nbsp;
              (auto-stop safety {campaign.auto_stop_safety ? <span className="green">activated</span> : <span className="red">not activated</span>})
            </div>
            <div>
              Avg. compression rate: &nbsp;
              46% (delta manager <span className="green">activated</span>)
            </div>
            <p></p>
            {this.state.showMoreStats ? 
              <div>
                <i className="fa fa-minus" aria-hidden="true"></i>
                <a href="#" onClick={this.toggleStats}>Less stats</a>
              </div>
            :
              <div>
                <i className="fa fa-plus" aria-hidden="true"></i>
                <a href="#" onClick={this.toggleStats}>More stats</a>
              </div>
            }
            
            {this.state.showMoreStats ?
              <div>
                stats
              </div>
            : null}
          </div>
        </div>
      );
    }
  };

  return Campaign;
});
