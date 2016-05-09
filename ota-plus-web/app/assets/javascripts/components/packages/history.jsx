define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      HistoryList = require('./history-list');
  
  class History extends React.Component {
    render() {
      return (
        <div>
          <div id="history">
            <HistoryList 
              Packages={db.packageHistoryForVin}
              PollEventName="poll-packages-history-for-vin"
              DispatchObject={{actionType: "get-package-history-for-vin", vin: this.props.vin}}/>
          </div>
          <hr className="divider"/>
        </div>
      );
    }
  };

  return History;
});
