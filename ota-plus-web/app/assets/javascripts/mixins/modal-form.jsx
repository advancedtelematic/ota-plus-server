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
          <button className="btn btn-primary pull-right btn-add-new-vin" onClick={this.modalForm}>
            { this.state.showForm ? "HIDE" : this.buttonLabel }
          </button>
          { this.state.showForm ? this.form() : null }
        </div>
      );
    }
  };

  return modalForm;
});
