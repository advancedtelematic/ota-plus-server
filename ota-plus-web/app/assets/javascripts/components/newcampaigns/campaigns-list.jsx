define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      CampaignsListItem = require('es6!./campaigns-list-item');
      
  class CampaignsList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        intervalId: null,
        progress1: 0,
        progress2: 0,
        progress3: 0,
        failureRate1: 50,
        failureRate2: 40,
        failureRate3: 10,
      };
      this.configureCampaign = this.configureCampaign.bind(this);
      SotaDispatcher.dispatch({actionType: 'get-campaigns'});
      db.campaigns.addWatch("poll-campaigns", _.bind(this.forceUpdate, this, null));
    }
    componentDidMount() {
      var that = this;
      var intervalId = setInterval(function() {
        that.setState({
          progress1: (that.state.progress1 < 100 ? Math.min(that.state.progress1 + Math.round(1*Math.random()), 100) : 100),
          progress2: (that.state.progress2 < 100 ? Math.min(that.state.progress2 + Math.round(3*Math.random()), 100) : 100),
          progress3: (that.state.progress3 < 100 ? Math.min(that.state.progress3 + Math.round(6*Math.random()), 100) : 100),
          failureRate1: Math.min(Math.max(that.state.failureRate1 + Math.floor(Math.random() * 8) - 3, 0), 100),
          failureRate2: Math.min(Math.max(that.state.failureRate2 + Math.floor(Math.random() * 7) - 1, 0), 100),
          failureRate3: Math.min(Math.max(that.state.failureRate3 + Math.floor(Math.random() * 10) - 5, 0), 100),
        });
      }, 2000);
      this.setState({intervalId: intervalId});
    }
    componentWillUnmount() {
      clearInterval(this.state.intervalId);
      db.campaigns.removeWatch("poll-campaigns");
    }
    configureCampaign(campaign, e) {
      e.preventDefault();
      this.props.openWizard(campaign);
    }
    render() {
      var campaigns = _.map(db.campaigns.deref(), function(campaign, i) {
        return (
          <tr key={"campaign-" + campaign.name}>
            <td>{campaign.name}</td>
            <td></td>
            <td></td>
            <td></td>
            <td><a href="#" className="black" onClick={this.configureCampaign.bind(this, campaign)}>Configure</a></td>
          </tr>
        );
      }, this);
      var campaign1 = {
        name: 'Campaign 01',
        start_date: 'Mon Aug 03 2016',
        end_date: 'Thu Aug 08 2016',
        progress: this.state.progress1,
        successRate: 100 - this.state.failureRate1,
        failureRate: this.state.failureRate1,
        uuid: 1
      };
      
      var campaign2 = {
        name: 'Campaign 02',
        start_date: 'Mon Aug 03 2016',
        end_date: 'Thu Aug 08 2016',
        progress: this.state.progress2,
        successRate: 100 - this.state.failureRate2,
        failureRate: this.state.failureRate2,
        uuid: 2
      };
      
      var campaign3 = {
        name: 'Campaign 03',
        start_date: 'Mon Aug 23 2016',
        end_date: 'Thu Aug 28 2016',
        progress: this.state.progress3,
        successRate: 100 - this.state.failureRate3,
        failureRate: this.state.failureRate3,
        uuid: 3
      };
        
      return (
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {campaigns}
              <CampaignsListItem campaign={campaign1} />
              <CampaignsListItem campaign={campaign2} />
              <CampaignsListItem campaign={campaign3} />
            </tbody>
          </table>
        </div>
      );
    }
  };

  return CampaignsList;
});
