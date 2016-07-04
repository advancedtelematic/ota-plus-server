define(function(require) {
  var React = require('react');

  class Loader extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div className="loader text-center">
          <div>
            Getting data from server
          </div>
          <div className="margin-top-20">
            <img src="/assets/img/icons/loading2.gif" alt=""/>
          </div>
        </div>
      );
    }
  }
  return Loader;
});
