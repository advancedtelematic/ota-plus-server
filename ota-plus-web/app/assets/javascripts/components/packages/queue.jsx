define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      QueueList = require('./queue-list');
  
  class Queue extends React.Component {
    render() {
      return (
        <div id="queue">
          <QueueList 
            QueuedPackages={db.packageQueueForVin}
            PollEventName="poll-queued-packages"
            DispatchObject={{actionType: "get-package-queue-for-vin", vin: this.props.vin}}
            vin={this.props.vin}/>
        </div>
      );
    }
  };

  return Queue;
});
