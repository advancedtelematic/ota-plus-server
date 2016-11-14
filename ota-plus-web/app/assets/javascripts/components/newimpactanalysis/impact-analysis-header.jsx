define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      db = require('stores/db');
      
  class ImpactAnalysisHeader extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      var impactedDevices = this.props.impactedDevices;
      return (
        <div className="grey-header">      
          <div className="col-md-12">
            <Link to="/"><img src="/assets/img/icons/back.png" className="icon-back" alt=""/></Link>
            <div className="grey-header-icon"></div>
            <div className="grey-header-text">
              <div className="grey-header-title">Impact analyser</div>
              <div className="grey-header-subtitle">
                <span>Impact: 53.092.232 Devices in 15 Groups</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return ImpactAnalysisHeader;
});
