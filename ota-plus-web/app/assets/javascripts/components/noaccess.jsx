define(function(require) {
  var React = require('react');

  class NoAccess extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div className={this.props.className}>
          You don't have an access to this feature.
        </div>
      );
    }
  }
  return NoAccess;
});
