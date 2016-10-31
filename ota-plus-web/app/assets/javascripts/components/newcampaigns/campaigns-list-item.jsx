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
      var campaign = this.props.campaign;
      if(campaign.launched) {
        var progress = Math.min(Math.round(campaign.summary.overallUpdatedDevicesCount/Math.max(campaign.summary.overallDevicesCount, 1) * 100), 100);
        var data = [
          {
            value: campaign.summary.overallFailedUpdates,
            color:"#FF0000",
            highlight: "#FF0000",
            label: "Failure rate"
          },
          {
            value: campaign.summary.overallSuccessfulUpdates,
            color: "#96DCD1",
            highlight: "#96DCD1",
            label: "Success rate"
          },
          {
            value: campaign.summary.overallCancelledUpdates,
            color: "#CCCCCC",
            highlight: "#CCCCCC",
            label: "Cancelled rate"
          }];
      }
      var link = 'campaigndetails/' + campaign.id;
      
      return (
        <tr>
          <td className="font-14">
            {campaign.launched ? 
              <Link to={`${link}`} className="black">{campaign.name}</Link>
            :
              campaign.name
            }
          </td>
          <td>none</td>
          <td>none</td>
          {campaign.launched ? 
            <td>
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
          : null}
          <td>
            {campaign.launched ? 
              <PieChart data={data} width="30" height="30" options={{showTooltips: false}}/>
            :
              <a href="#" className="black" onClick={this.props.configureCampaign.bind(this, campaign.id)}>Configure</a>
            }
          </td>
        </tr>
      );
    }
  };

  return CampaignsListItem;
});
