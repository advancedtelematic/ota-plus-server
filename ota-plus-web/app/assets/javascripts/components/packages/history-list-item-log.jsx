define(function(require) {
  var React = require('react');
  
  class HistoryListItemLog extends React.Component {
    render() {
      return (
        <div className="margin-top-10 pull-left">
          <p><strong>{this.props.name}</strong> Log</p>
          Package successfully installed on {this.props.completionTime.toDateString() + ' ' + this.props.completionTime.toLocaleTimeString()}
  
          <div className="log-code">
            {this.props.installationLog.resultText !== undefined && this.props.installationLog.resultText ? 
              this.props.installationLog.resultText
            : <span>Log is empty</span>}
          </div>
        </div>
      );
    }
  };

  return HistoryListItemLog;
});

