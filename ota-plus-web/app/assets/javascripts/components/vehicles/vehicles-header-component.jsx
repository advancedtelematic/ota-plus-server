define(function(require) {
  var React = require('react'),
      AddVehicleComponent = require('./add-vehicle-component');
  
  var VehiclesHeaderComponent = React.createClass({
    render: function() {
      return (
        <div className="row">
          <div className="col-md-6">
            <h1>
              Vehicles
            </h1>
          </div>
          <div className="col-md-6">
            <AddVehicleComponent/>
          </div>
        </div>
      );
    }
  });

  return VehiclesHeaderComponent;

});
