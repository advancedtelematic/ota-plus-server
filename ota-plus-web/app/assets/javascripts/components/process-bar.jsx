define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher');

  class ProcessBar extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div>
          <span className="counting black">{this.props.label}</span>
          <div className="progress">
            <div className="progress-bar progress-bar-striped active width-100" role="progressbar"></div>
          </div>
        </div>
      );
    }
  };

  return ProcessBar;
});
