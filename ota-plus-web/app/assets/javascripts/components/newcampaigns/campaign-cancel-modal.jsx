define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher');
  
  class CampaignCancelModal extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
      this.closeForm = this.closeForm.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentWillUnmount() {
    }
    closeForm(e) {
      e.preventDefault();
      this.props.closeForm();
    }
    handleSubmit(e) {
      e.preventDefault();
    }
    render() {
      return (
        <div id="modal-campaign-cancel" className="myModal">
          <div className="modal-dialog center-xy">
            <div className="modal-content">
              <div className="modal-header modal-header-red text-center">
                <h4 className="modal-title">
                  You're about to cancel Campaign
                </h4>
              </div>
              <div className="modal-body">                    
                <div className="row text-center">
                  <div className="col-md-12">
                    <div>
                      <div className="group-icon"></div>
                      <div className="group-text text-left">
                        <div className="group-title">Campaign 0{this.props.campaignUuid}</div>
                        <div className="group-subtitle">XYC devices</div>
                      </div>
                    </div>
                    <div className="margin-top-25">
                      <p>This Campaign will not be installable anymore.</p>
                      <p>You can find this Campaign in <strong>Trash</strong> at any time.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <a href="#" className="darkgrey margin-top-20 pull-left" onClick={this.closeForm}>cancel</a>
                <div>
                  <button type="submit" className="btn btn-confirm pull-right" onClick={this.handleSubmit}>Confirm</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  CampaignCancelModal.contextTypes = {
    history: React.PropTypes.object.isRequired,
    strings: React.PropTypes.object.isRequired,
  };

  return CampaignCancelModal;
});
