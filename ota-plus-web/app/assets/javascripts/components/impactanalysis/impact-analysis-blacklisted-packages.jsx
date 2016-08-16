define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher');

  class ImpactAnalysisBlacklistedPackages extends React.Component {
    constructor(props) {
      super(props);
      
      SotaDispatcher.dispatch({actionType: 'get-blacklisted-packages'});
      db.blacklistedPackages.addWatch("poll-blacklisted-packages", _.bind(this.forceUpdate, this, null));
    }
    render() {
      return (
        <div className="col-md-12">
          Blacklisted packages
        </div>
      );
    }
  };

  return ImpactAnalysisBlacklistedPackages;
});
