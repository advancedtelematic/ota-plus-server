define(function(require) {
  var React = require('react');
  
  class HistoryListItemLog extends React.Component {
    render() {
      return (
        <div style={{marginTop: 10}}>
          <p><strong>{this.props.name}</strong> Log</p>
          Package successfully installed on Tue 22 March 2016 11:43:22
  
          <div className="log-code">
            echo<br />
            bash<br />
            Note the bash global variable did not change<br />
            "local" is bash reserved word
          </div>
        </div>
      );
    }
  };

  return HistoryListItemLog;
});

