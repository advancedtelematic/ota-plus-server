define(function(require) {
  var React = require('react'),
      SotaDispatcher = require('sota-dispatcher');

  class ProvisioningTooltip extends React.Component {
    constructor(props) {
      super(props);
      this.closeModal = this.closeModal.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    closeModal(e) {
      e.preventDefault();
      this.props.hideProvisioningTooltip();
    }
    handleSubmit() {
      SotaDispatcher.dispatch({
        actionType: 'activate-provisioning-feature'
      });
    }
    render() {
      return (
        <div id="provisioning-tooltip" className="myModal">
          <div className="modal-dialog center-xy">
            <div className="modal-content">
              <div className="modal-body font-14">
                <div className="text-center">
                  description
                </div>
              </div>
              <div className="modal-footer">
                <a href="#" className="darkgrey margin-top-20 pull-left" onClick={this.closeModal}>later</a>
                <button type="button" className="btn btn-confirm pull-right" onClick={this.handleSubmit}>Get started now!</button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return ProvisioningTooltip;
});
