define(function(require) {
  var React = require('react'),
      SotaDispatcher = require('sota-dispatcher'),
      HistoryListItem = require('./history-list-item');
  
  class HistoryList extends React.Component {
    constructor(props) {
      super(props);
      
      SotaDispatcher.dispatch(this.props.DispatchObject);
      this.props.Packages.addWatch(this.props.PollEventName, _.bind(this.forceUpdate, this, null));
    }
    componentWillUnmount(){
      this.props.Packages.removeWatch(this.props.PollEventName);
    }
    render() {
      var Packages = this.props.Packages.deref();
      Packages.sort(function(a, b) {
        return new Date(b.completionTime) - new Date(a.completionTime);
      });
      var packages = _.map(Packages, function(pack, i) {
        return (
          <HistoryListItem key={pack.packageId.name + '-' + pack.packageId.version} package={pack}/>
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
