define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      CampaignsListItem = require('es6!./campaigns-list-item');
      
  class CampaignsList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        progress1: 0,
        progress2: 0,
        progress3: 0,
        failure_rate1: 50,
        failure_rate2: 40,
        failure_rate3: 10,
      };
    }
    componentDidMount() {
      var that = this;
      setInterval(function() {
        that.setState({
          progress1: (that.state.progress1 < 100 ? Math.min(that.state.progress1 + Math.round(1*Math.random()), 100) : 100),
          progress2: (that.state.progress2 < 100 ? Math.min(that.state.progress2 + Math.round(3*Math.random()), 100) : 100),
          progress3: (that.state.progress3 < 100 ? Math.min(that.state.progress3 + Math.round(6*Math.random()), 100) : 100),
          failure_rate1: Math.round(100*Math.random()),
          failure_rate2: Math.round(100*Math.random()),
          failure_rate3: Math.round(100*Math.random()),
        });
      }, 2000);
    }
    render() {
      var campaign1 = {
        name: 'Campaign 01',
        start_date: 'Mon Aug 03 2016',
        end_date: 'Thu Aug 08 2016',
        progress: this.state.progress1,
        success_rate: 100 - this.state.failure_rate1,
        failure_rate: this.state.failure_rate1,
        uuid: 1
      };
      
      var campaign2 = {
        name: 'Campaign 02',
        start_date: 'Mon Aug 03 2016',
        end_date: 'Thu Aug 08 2016',
        progress: this.state.progress2,
        success_rate: 100 - this.state.failure_rate2,
        failure_rate: this.state.failure_rate2,
        uuid: 2
      };
      
      var campaign3 = {
        name: 'Campaign 03',
        start_date: 'Mon Aug 23 2016',
        end_date: 'Thu Aug 28 2016',
        progress: this.state.progress3,
        success_rate: 100 - this.state.failure_rate3,
        failure_rate: this.state.failure_rate3,
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
