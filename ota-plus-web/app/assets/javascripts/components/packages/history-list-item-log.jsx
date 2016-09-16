define(function(require) {
  var React = require('react');
  
  class HistoryListItemLog extends React.Component {
    render() {
      return (
        <div className="margin-top-10 width-100 pull-left">
          {this.props.status == 'cancelled' ? 
            <span>Installation</span>
          :
            <span>Package</span>
          }
          &nbsp; {this.props.status} on {this.props.time.toDateString() + ' ' + this.props.time.toLocaleTimeString()}
  
          <div className="log-code">
            {this.props.installationLog.resultText !== undefined && this.props.installationLog.resultText ? 
              this.props.installationLog.resultText
            : 
              <span>Log is empty</span>
            }
          </div>
        </div>
      );
    }
  };

  return HistoryListItemLog;
});

