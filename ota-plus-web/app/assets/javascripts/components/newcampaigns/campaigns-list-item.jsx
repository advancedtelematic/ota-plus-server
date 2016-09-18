define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      db = require('stores/db'),
      Chartjs = require('Chartjs'),
      PieChart = require('react-chartjs').Pie;

  class CampaignsListItem extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      var link = 'campaigns';
      var data = [
        {
          value: this.props.campaign.failure_rate,
          color:"#FF0000",
          highlight: "#FF0000",
          label: "Failure rate"
        },
        {
          value: this.props.campaign.success_rate,
          color: "#96DCD1",
          highlight: "#96DCD1",
          label: "Success rate"
        }];
      return (
        <tr>
          <td className="font-14">
            <Link to={`${link}`} className="black">{this.props.campaign.name}</Link>
          </td>
          <td>{this.props.campaign.start_date}</td>
          <td>{this.props.campaign.end_date}</td>
          <td>
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
            <PieChart data={data} width="30" height="30"/>
          </td>
        </tr>
      );
    }
  };

  return CampaignsListItem;
});
