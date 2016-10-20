define(function(require) {
  var React = require('react');

  class Loader extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div className={"loader text-center padding-15 " + this.props.className}>
          <i className="fa fa-circle-o-notch fa-spin fa-2x"></i> &nbsp;
          Getting data from server
        </div>
      );
    }
  }
  return Loader;
});
