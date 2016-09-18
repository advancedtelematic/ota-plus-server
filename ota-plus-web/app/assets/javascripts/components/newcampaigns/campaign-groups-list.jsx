define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      CampaignGroupsListItem = require('es6!./campaign-groups-list-item');
      
  class CampaignGroupsList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        intervalId: null,
        progress1: 0,
        progress2: 0,
        progress3: 0,
        failureRate1: 50,
        failureRate2: 40,
        failureRate3: 30,
        totalDevicesCount1: 523,
        totalDevicesCount2: 1275,
        totalDevicesCount3: 766
      };
    }
    componentDidMount() {
      var that = this;
      var intervalId = setInterval(function() {
        that.setState({
          progress1: (that.state.progress1 < 100 ? Math.min(that.state.progress1 + Math.round(1*Math.random()), 100) : 100),
          progress2: (that.state.progress2 < 100 ? Math.min(that.state.progress2 + Math.round(3*Math.random()), 100) : 100),
          progress3: (that.state.progress3 < 100 ? Math.min(that.state.progress3 + Math.round(6*Math.random()), 100) : 100),
          failureRate1: Math.min(Math.max(that.state.failureRate1 + Math.floor(Math.random() * 2) - 1, 0), 100),
          failureRate2: Math.min(Math.max(that.state.failureRate2 + Math.floor(Math.random() * 2) - 1, 0), 100),
          failureRate3: Math.min(Math.max(that.state.failureRate3 + Math.floor(Math.random() * 2) - 2, 0), 100)
        });
      }, 2000);
      this.setState({intervalId: intervalId});
    }
    componentWillUnmount() {
      clearInterval(this.state.intervalId);
    }
    render() {
      var campaign1 = {
        name: 'Campaign 01',
        progress: this.state.progress1,
        successRate: 100 - this.state.failureRate1,
        failureRate: this.state.failureRate1,
        count: this.state.totalDevicesCount1,
        uuid: 1
      };
      
      var campaign2 = {
        name: 'Campaign 02',
        progress: this.state.progress2,
        successRate: 100 - this.state.failureRate2,
        failureRate: this.state.failureRate2,
        count: this.state.totalDevicesCount2,
        uuid: 2
      };
      
      var campaign3 = {
        name: 'Campaign 03',
        progress: this.state.progress3,
        successRate: 100 - this.state.failureRate3,
        failureRate: this.state.failureRate3,
        count: this.state.totalDevicesCount3,
        uuid: 3
      };
        
      return (
        <div>
          <table className="table table-grey-header">
            <thead>
              <tr>
                <th className="col-md-4">Name</th>
                <th className="col-md-4 text-center">Status</th>
                <th className="col-md-3"></th>
                <th className="col-md-1"></th>
              </tr>
            </thead>
            <tbody>
              <CampaignGroupsListItem 
                campaign={campaign1} 
                cancelCampaignForGroup={this.props.cancelCampaignForGroup}/>
              <CampaignGroupsListItem 
                campaign={campaign2} 
                cancelCampaignForGroup={this.props.cancelCampaignForGroup}/>
              <CampaignGroupsListItem 
                campaign={campaign3} 
                cancelCampaignForGroup={this.props.cancelCampaignForGroup}/>
            </tbody>
          </table>
        </div>
      );
    }
  };

  return CampaignGroupsList;
});
