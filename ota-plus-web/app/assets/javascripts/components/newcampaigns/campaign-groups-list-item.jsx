define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      db = require('stores/db'),
      PieChart = require('react-chartjs').Pie;

  class CampaignGroupsListItem extends React.Component {
    constructor(props) {
      super(props);
      this.cancelCampaignForGroup = this.cancelCampaignForGroup.bind(this);
    }
    cancelCampaignForGroup(e) {
      e.preventDefault();
      this.props.cancelCampaignForGroup(this.props.campaign.uuid);
    }
    render() {
      var link = 'campaigndetails/' + this.props.campaign.uuid;
      var data = [
        {
          value: this.props.campaign.failureRate,
          color:"#FF0000",
          highlight: "#FF0000",
          label: "Failure rate"
        },
        {
          value: this.props.campaign.successRate,
          color: "#96DCD1",
          highlight: "#96DCD1",
          label: "Success rate"
        }];
      return (
        <tr>
          <td>
            <div className="group-icon"></div>
            <div className="group-text">
              <div className="group-title">All good now</div>
              <div className="group-subtitle">{this.props.campaign.count} devices</div>
            </div>
          </td>
          <td>
            <div className="col-md-4 margin-top-5">
              <span className="lightgrey">{Math.round(this.props.campaign.progress/100*this.props.campaign.count)} of {this.props.campaign.count} Devices</span>
            </div>
            <div className="progress progress-blue">
              <div className={"progress-bar" + (this.props.campaign.progress != 100 ? ' progress-bar-striped active': '')} role="progressbar" style={{width: this.props.campaign.progress + '%'}}></div>
              <div className="progress-count">
                {this.props.campaign.progress}%
              </div>
              <div className="progress-status">
                {this.props.campaign.progress == 100 ?
                  <span className="fa-stack">
                    <i className="fa fa-circle fa-stack-1x"></i>
                    <i className="fa fa-check-circle fa-stack-1x fa-inverse"></i>
                  </span>
                : null}
              </div>
            </div>
          </td>
          <td>
            <div className="pull-left margin-left-30">
              <PieChart data={data} width="50" height="50"/>
            </div>
            <div className="pull-left margin-top-20 margin-left-20">
              <span className={this.props.campaign.failureRate == 0 ? "lightgrey" : ""}>
                {this.props.campaign.failureRate} % failure rate
              </span>
            </div>
          </td>
          <td>
            <a href="#" className="darkgrey hover-red" title="Cancel the Campaign for this group" onClick={this.cancelCampaignForGroup}><strong>Cancel</strong></a>
          </td>
        </tr>
      );
    }
  };

  return CampaignGroupsListItem;
});
