define(function(require) {
  var React = require('react');
      
  class ProvisioningHeader extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div className="grey-header">      
          <div className="col-md-12">
            <div className="grey-header-icon"></div>
            <div className="grey-header-text">
              <div className="grey-header-title">Provisioning</div>
            </div>
          </div>
        </div>
      );
    }
  };

  return ProvisioningHeader;
});
