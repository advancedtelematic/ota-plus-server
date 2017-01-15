define(function(require) {
  var React = require('react'),
      SotaDispatcher = require('sota-dispatcher');

  class UniqueCredentialsTooltip extends React.Component {
    constructor(props) {
      super(props);
      this.handleDownload = this.handleDownload.bind(this);
    }
    handleDownload() {
      var packageManager = this.refs.packageManager.value;
      var pollingInterval = this.refs.pollingInterval.value;
      var link = "/api/v1/device_client/" + this.props.deviceUUID + "/toml?package_manager=" + packageManager + "&polling_sec=" + pollingInterval;
      window.open(link, '_blank');
      this.props.closeModal();
    }
    render() {
      return (
        <div id="unique-credentials-tooltip" className="myModal">
          <div className="modal-dialog center-xy">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Download the unique credentials for this device</h4>
              </div>
              <div className="modal-body font-14">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-row-title">Package manager:</div>
                  </div>
                  <div className="col-md-6">
                    <select className="form-control" name="package_manager" ref="packageManager">
                      <option value="deb">Debian</option>
                      <option value="rpm">RPM</option>
                      <option value="ostree" selected>OSTree</option>
                      <option value="off">Off</option>
                    </select>
                  </div>
                </div>
                <div className="row margin-top-20">
                  <div className="col-md-6">
                    <div className="form-row-title">Polling interval:</div>
                  </div>
                  <div className="col-md-6">
                    <input type="number" className="form-control" defaultValue="60" min="10" name="polling_interval" ref="pollingInterval" onKeyDown={function(e) {e.preventDefault();return false;}}/>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <a href="#" className="darkgrey margin-top-20 pull-left" onClick={this.props.closeModal}>Cancel</a>
                <button type="button" className="btn btn-confirm pull-right" onClick={this.handleDownload}>Download</button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };
  
  UniqueCredentialsTooltip.propTypes = {
    deviceUUID: React.PropTypes.string.isRequired,
    closeModal: React.PropTypes.func,
  };

  return UniqueCredentialsTooltip;
});
