define(function(require) {
  var React = require('react'),
      SotaDispatcher = require('sota-dispatcher');

  class TreeHubTooltip extends React.Component {
    constructor(props) {
      super(props);
      this.closeModal = this.closeModal.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    closeModal(e) {
      e.preventDefault();
      this.props.hideTreeHubTooltip();
    }
    handleSubmit() {
      SotaDispatcher.dispatch({
        actionType: 'enable-treehub-feature'
      });
      this.props.hideTreeHubTooltip();
    }
    render() {
      return (
        <div id="treehub-tooltip" className="myModal">
          <div className="modal-dialog center-xy">
            <div className="modal-content">
              <div className="modal-body font-14">
                <div className="text-center">
                  With ATS Garage, OSTree, and TreeHub, you can have incredibly fast 
                  and efficient atomic differential updates to your embedded devices
                  --it's like Git (and GitHub) for your embedded filesystems. You even 
                  get versioning on the device, so you can instantly switch between
                  different firmware releases without having to re-flash or re-download anything.
                  <br /><br />
                  Sound exciting? Click the switch to enable, and then start reading 
                  the docs to learn how to <strong>integrate TreeHub into your existing 
                  OpenEmbedded/Yocto project </strong>, or how to <strong>start a new project from scratch on a Raspberry Pi</strong>.
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

  return TreeHubTooltip;
});
