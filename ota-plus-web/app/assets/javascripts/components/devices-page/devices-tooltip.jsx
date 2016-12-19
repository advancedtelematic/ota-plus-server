define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link;

  class DevicesTooltip extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div id="devices-tooltip" className="myModal">
          <div className="modal-dialog center-xy">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Devices</h4>
              </div>
              <div className="modal-body font-14">
                <div className="text-center margin-top-20">
                  ATS Garage helps you manage your embedded devices. <br /><br />
                  To get started, you'll need to create a device and install the ATS Garage client on it.
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-confirm pull-right" onClick={this.props.hideDevicesTooltip}>Got it</button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return DevicesTooltip;
});
