define(function(require) {
  var React = require('react'),
      Campaign = require('./campaign');
  
  class Campaigns extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        counter: 0,
        progressIntervalId: null,
      }
      
      this.reload = this.reload.bind(this);
    }
    componentDidMount() {
      var that = this;
      var id = setInterval(function() {
        that.reload();
      }, 500);
      
      this.setState({
        progressIntervalId: id
      });
    }
    reload() {
      this.setState({
        counter: this.state.counter + 1
      });
    }
    render() {
      var campaignsData = JSON.parse(localStorage.getItem('campaignsData'));
      var campaigns = _.map(campaignsData, function(campaign, i) {
        return (
          <Campaign key={'campaign-' + i} params={this.props.params} campaign={campaign} reload={this.reload}/>
        );
      }, this);
      
      return (
        <div>
          {campaigns}
        </div>
      );
    }
  };

  return Campaigns;
});
