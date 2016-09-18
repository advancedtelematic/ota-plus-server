define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher');
  
  class CampaignCancel extends React.Component {
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
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header modal-header-red text-center">
                <h4 className="modal-title">
                  You're about to cancel Campaign
                </h4>
              </div>
              <div className="modal-body">                    
                <div className="row text-center">
                  <div className="col-md-12">
                    <p>You're about to <strong>blacklist</strong> the following package version:</p>
                    <div className="font-20">{this.props.packageName}</div>
                    <div className="font-20"><strong>v. {this.props.packageVersion}</strong></div>
                    <p className="lightgrey margin-top-25">
                      When you blacklist a package version, you can no longer install it on any devices. 
                      It will also appear in the <strong>Impact analysis tab</strong>, showing which devices currently have it installed.
                    </p>
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

  CampaignCancel.contextTypes = {
    history: React.PropTypes.object.isRequired,
    strings: React.PropTypes.object.isRequired,
  };

  return CampaignCancel;
});
