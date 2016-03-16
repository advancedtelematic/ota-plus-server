define(function(require) {
  var React = require('react'),
      serializeForm = require('../../mixins/serialize-form'),
      modalForm = require('../../mixins/modal-form'),
      db = require('../../stores/db'),
      SotaDispatcher = require('sota-dispatcher');

  var AddVehicleComponent = React.createClass({
    mixins: [
      modalForm
    ],
    handleSubmit: function(e) {
      e.preventDefault();

      payload = serializeForm(this.refs.form);
      SotaDispatcher.dispatch({
        actionType: 'create-vehicle',
        vehicle: payload
      });
    },
    buttonLabel: "NEW VIN",
    form: function() {
      return (
        <div>
          <div className="myModal">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" onClick={this.modalForm}>&times;</button>
                  <h4 className="modal-title">New vehicle</h4>
                </div>
                <div className="modal-body">
                  <form ref='form' onSubmit={this.handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="name">Vehicle Name</label>
                      <input type="text" className="form-control" name="vin" ref="vin" placeholder="VIN"/>
                    </div>
                    <div className="form-group">
                      <button type="submit" className="btn btn-primary">Add Vehicle</button>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-default" onClick={this.modalForm}>Close</button>
                </div>
              </div>
            </div>
          </div>       
        </div>
      );
    }
  });

  return AddVehicleComponent;
});
