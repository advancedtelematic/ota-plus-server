define(['jquery', 'react'], function($, React) {
  var modalPanel = {
    modalPanel: function() {
      this.setState({showModal: !this.state.showModal});
    },
    getInitialState: function() {
      return {showModal: false};
    },
    render: function() {
      return (
        <div>
          <div className="row">
            <div className="col-md-12">
              <button className="btn btn-primary pull-right" onClick={this.modalPanel}>
                { this.state.showModal ? "HIDE" : this.buttonLabel }
              </button>
            </div>
          </div>
          { this.state.showModal ? this.modal() : null }
        </div>
      );
    }
  };

  return modalPanel;
});
