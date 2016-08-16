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
        <div className="impact-analysis-header">      
          <div className="col-md-12">
            <Link to="/"><img src="/assets/img/icons/back.png" className="icon-back" alt=""/></Link>
            <div className="impact-analysis-icon"></div>
            <div className="impact-analysis-header-text">
              <div className="title">Impact analyser</div>
              <div className="counter">
                {!_.isUndefined(impactedDevices) ? 
                  _.isUndefined(impactedDevices.length) ? 
                    <span>No impacted devices</span>
                  :
                    <span>Impact: {impactedDevices.length} Devices</span>
                :
                  <span><i className="fa fa-circle-o-notch fa-spin"></i> impact analysis</span>
                }
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return ImpactAnalysisHeader;
});
