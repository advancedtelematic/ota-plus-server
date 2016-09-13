define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      Loader = require('es6!../loader');

  class ImpactedDevices extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div className="col-md-12">
          <div className="impact-devices-group">
            <div className="impacted-group">
              <div className="device-icon"></div>
              <div className="title">Volkswagen Polo GTI</div>
              <div className="subtitle">1.120.120 Devices</div>
            </div>
  
            <div className="dots"></div>
  
            <div className="impacted-device">
              <div className="device-icon"></div>
              <div className="title">Veronica</div>
              <div className="subtitle">Available</div>
            </div>
  
            <div className="impacted-device">
              <div className="device-icon"></div>
              <div className="title">Violet</div>
              <div className="subtitle">Available</div>
            </div>
  
             <div className="impacted-device notavailable">
              <div className="device-icon"></div>
              <div className="title">Vivien</div>
              <div className="subtitle">Not available</div>
            </div>
          </div>
          <hr className="full-line pull-left" />
        </div>
      );
    }
  };

  return ImpactedDevices;
});
