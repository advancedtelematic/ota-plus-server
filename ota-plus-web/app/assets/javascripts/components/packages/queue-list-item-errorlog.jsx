define(function(require) {
  var React = require('react');
  
  class QueueListItemErrorlog extends React.Component {
    render() {
      return (
        <div style={{marginTop: 10}}>
          <div><strong>{this.props.name}</strong> Log</div>
          <div>Terminated due to Error:</div>
          
          <div className="log-code">
            echo<br />
            bash<br />
            Note the bash global variable did not change<br />
            "local" is bash reserved word
          </div>
          
          <div><span className="red">Runtime Error: Line 56</span></div>
        </div>
      );
    }
  };

  return QueueListItemErrorlog;
});
