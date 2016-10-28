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
      this.props.cancelCampaignForGroup(this.props.campaignGroup, this.props.groupName);
    }
    render() {
      var statistics = this.props.campaignGroup.statistics;
      var progress = Math.min(Math.round(statistics.updatedDevices/Math.max(statistics.deviceCount, 1) * 100), 100);
      var data = [
        {
          value: statistics.failedUpdates,
          color:"#FF0000",
          highlight: "#FF0000",
          label: "Failure rate"
        },
        {
          value: statistics.successfulUpdates,
          color: "#96DCD1",
          highlight: "#96DCD1",
          label: "Success rate"
        },
        {
          value: statistics.cancelledUpdates,
          color: "#CCCCCC",
          highlight: "#CCCCCC",
          label: "Cancelled rate"
        }];
        
      return (
        <tr>
          <td>
            <div className="group-icon"></div>
            <div className="group-text">
              <div className="group-title">{this.props.groupName}</div>
              <div className="group-subtitle">{statistics.deviceCount} devices</div>
            </div>
          </td>
          <td>
            <div className="col-md-4 margin-top-5">
              <span className="lightgrey">{statistics.updatedDevices} of {statistics.deviceCount} Devices</span>
            </div>
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
            <div className="pull-left margin-left-30">
              <PieChart data={data} width="50" height="50" options={{showTooltips: false}}/>
            </div>
            <div className="pull-left margin-top-20 margin-left-20">
              <span className={statistics.failedUpdates == 0 ? "lightgrey" : ""}>
                {Math.round(statistics.failedUpdates/Math.max(statistics.updatedDevices, 1)*100)} % failure rate
              </span>
            </div>
          </td>
          <td>
            {statistics.updatedDevices !== statistics.deviceCount ?
              <a href="#" className="darkgrey hover-red" title="Cancel the Campaign for this group" onClick={this.cancelCampaignForGroup}><strong>Cancel</strong></a>
            : null}
          </td>
        </tr>
      );
    }
  };

  return CampaignGroupsListItem;
});
