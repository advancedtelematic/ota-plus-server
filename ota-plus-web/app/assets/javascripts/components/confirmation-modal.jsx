define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher');
  
  class ConfirmationModal extends React.Component {
    constructor(props) {
      super(props);
      this.cancel = this.cancel.bind(this);
      this.confirm = this.confirm.bind(this);
    }
    cancel(e) {
      e.preventDefault();
      this.props.cancelAction();
    }
    confirm(e) {
      e.preventDefault();
      this.props.confirmAction();
    }
    render() {
      return (
        <div id="modal-confirmation" className="myModal">
          <div className="modal-dialog center-xy">
            <div className="modal-content">
              <div className="modal-header modal-header-red text-center">
                <h4 className="modal-title">
                  {this.props.title}
                </h4>
              </div>
              <div className="modal-body">                    
                {this.props.description}
              </div>
              <div className="modal-footer">
                <a href="#" className="darkgrey margin-top-20 pull-left" onClick={this.cancel}>{this.props.cancelText}</a>
                <div>
                  <button type="submit" className="btn btn-confirm pull-right" onClick={this.confirm}>{this.props.confirmText}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  ConfirmationModal.contextTypes = {
    history: React.PropTypes.object.isRequired,
    
  };

  return ConfirmationModal;
});
