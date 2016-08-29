define(function(require) {
  var React = require('react');

  class Loader extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div className="loader text-center">
          <img src="/assets/img/icons/loading.gif" alt="" style={{height:'30px'}}/> &nbsp;
          Getting data from server
        </div>
      );
    }
  }
  return Loader;
});
