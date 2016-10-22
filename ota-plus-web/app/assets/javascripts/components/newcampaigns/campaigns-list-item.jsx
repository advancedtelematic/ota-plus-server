define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      db = require('stores/db'),
      PieChart = require('react-chartjs').Pie;

  class CampaignsListItem extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      var overallDevicesCount = 0;
      var overallUpdatedDevicesCount = 0;
      var overallFailedUpdates = 0;
      var overallSuccessfulUpdates = 0;
      
      _.each(this.props.campaign.statistics, function(statistic) {
        overallDevicesCount += statistic.deviceCount;
        overallUpdatedDevicesCount += statistic.updatedDevices;
        overallFailedUpdates += statistic.failedUpdates;
        overallSuccessfulUpdates += statistic.successfulUpdates;
      });
              
      var progress = Math.min(Math.round(overallUpdatedDevicesCount/Math.max(overallDevicesCount, 1) * 100), 100);
              
      var link = 'campaigndetails/' + this.props.campaign.id;
      var data = [
        {
          value: overallFailedUpdates,
          color:"#FF0000",
          highlight: "#FF0000",
          label: "Failure rate"
        },
        {
          value: overallSuccessfulUpdates,
          color: "#96DCD1",
          highlight: "#96DCD1",
          label: "Success rate"
        }];
      return (
        <tr>
          <td className="font-14">
            {this.props.campaign.launched ? 
              <Link to={`${link}`} className="black">{this.props.campaign.name}</Link>
            :
              this.props.campaign.name
            }
          </td>
          <td>none</td>
          <td>none</td>
          <td>
            {this.props.campaign.launched ? 
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
            :
              <span>Not launched yet</span>
            }
          </td>
          <td>
            {this.props.campaign.launched ? 
              <PieChart data={data} width="30" height="30"/>
            :
              <a href="#" className="black" onClick={this.props.configureCampaign.bind(this, this.props.campaign.id)}>Configure</a>
            }
          </td>
        </tr>
      );
    }
  };

  return CampaignsListItem;
});
