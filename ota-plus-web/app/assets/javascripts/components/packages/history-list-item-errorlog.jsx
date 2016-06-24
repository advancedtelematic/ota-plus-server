define(function(require) {
  var React = require('react');
  
  class HistoryListItemErrorlog extends React.Component {
    render() {
      return (
        <div style={{marginTop: 10}}>
          <div><strong>{this.props.name}</strong> Log</div>
          Package not installed on {this.props.completionTime.toDateString() + ' ' + this.props.completionTime.toLocaleTimeString()}
          <div>Terminated due to Error:</div>
          <div className="log-code">
            {this.props.installationLog.resultText ? 
              this.props.installationLog.resultText
            : <span>Log is empty</span>}
          </div>
          
          <div><span className="red"></span></div>
        </div>
      );
    }
  };

  return HistoryListItemErrorlog;
});
