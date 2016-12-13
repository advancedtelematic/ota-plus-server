define(function(require) {
  var React = require('react');
      
  class ImpactAnalysisHeader extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      var impactedDevices = this.props.impactedDevices;
      return (
        <div className="grey-header">      
          <div className="col-md-12">
            <div className="grey-header-icon"></div>
            <div className="grey-header-text">
              <div className="grey-header-title">Impact analyser</div>
              <div className="grey-header-subtitle">
                {!_.isUndefined(this.props.deviceCount) && !_.isUndefined(this.props.groupCount) ? 
                  <span>Impact: {this.props.deviceCount} Devices in {this.props.groupCount} Groups</span>
                :
                  <span><i className="fa fa-square-o fa-spin"></i> impact analysis</span>
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
