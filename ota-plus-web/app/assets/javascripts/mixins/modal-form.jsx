define(['jquery', 'react'], function($, React) {
  var modalForm = {
    modalForm: function() {
      this.setState({showForm: !this.state.showForm});
    },
    getInitialState: function() {
      return {showForm: false};
    },
    render: function() {
      return (
        <div>
          <div className="row">
            <div className="col-md-12">
              <button className="btn btn-primary pull-right" onClick={this.modalForm}>
                { this.state.showForm ? "HIDE" : this.buttonLabel }
              </button>
            </div>
          </div>
          { this.state.showForm ? this.form() : null }
        </div>
      );
    }
  };

  return modalForm;
});
