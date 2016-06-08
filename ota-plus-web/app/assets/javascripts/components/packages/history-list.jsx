define(function(require) {
  var React = require('react'),
      SotaDispatcher = require('sota-dispatcher'),
      HistoryListItem = require('./history-list-item');
  
  class HistoryList extends React.Component {
    constructor(props) {
      super(props);
      this.state = ({
        intervalId: null
      });
      this.refreshData = this.refreshData.bind(this);
      SotaDispatcher.dispatch(this.props.DispatchObject);
      this.props.PackagesHistory.addWatch(this.props.PollEventName, _.bind(this.forceUpdate, this, null));
    }
    componentDidMount() {
      var that = this;
      var intervalId = setInterval(function() {
        that.refreshData();
      }, 1000);
      this.setState({intervalId: intervalId});
    }
    componentWillUnmount() {
      this.props.PackagesHistory.removeWatch(this.props.PollEventName);
      clearInterval(this.state.intervalId);
    }
    refreshData() {
      SotaDispatcher.dispatch(this.props.DispatchObject);
    }
    render() {
      var Packages = this.props.PackagesHistory.deref();
      Packages.sort(function(a, b) {
        var dateCompared = new Date(b.completionTime) - new Date(a.completionTime);
        return dateCompared == 0 ? b.id - a.id : dateCompared;
      });
      var packages = _.map(Packages, function(pack, i) {
        return (
          <HistoryListItem key={pack.packageId.name + '-' + pack.packageId.version + '-' + pack.id} package={pack}/>
        );
      }, this);       
      return (
        packages.length > 0 ?
          <ul className="list-group"> 
            {packages}
          </ul>
        :
          <div>History is empty</div>
      );
    }
  };

  return HistoryList;
});
