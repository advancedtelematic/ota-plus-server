define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      QueueList = require('./queue-list');
  
  class Queue extends React.Component {
    render() {
      return (
        <div id="queue">
          <QueueList 
            Packages={db.packageQueueForVin}
            PollEventName="poll-packages-queue-for-vin"
            DispatchObject={{actionType: "get-package-queue-for-vin", vin: this.props.vin}}
            strings={this.props.strings}/>
        </div>
      );
    }
  };

  return Queue;
});
