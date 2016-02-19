define(function(require) {

  var React = require('react'),
      _ = require('underscore'),
      Router = require('react-router'),
      Fluxbone = require('../../mixins/fluxbone'),
      SotaDispatcher = require('sota-dispatcher');

  var ListOfVehicles = React.createClass({
    componentWillUnmount: function(){
      this.props.Vehicles.removeWatch("poll-vehicles");
    },
    componentWillMount: function(){
      SotaDispatcher.dispatch({actionType: 'search-vehicles-by-regex', regex: "."});
      this.props.Vehicles.addWatch("poll-vehicles", _.bind(this.forceUpdate, this, null));
    },
    render: function() {
      var vehicles = _.map(this.props.Vehicles.deref(), function(vehicle) {
        return (
          <tr key={vehicle.vin}>
            <td>
              <Router.Link to='vehicle' params={{vin: vehicle.vin}}>
              { vehicle.vin }
              </Router.Link>
            </td>
            <td>
              debian ( &nbsp;
                <a href={`/api/v1/client/${vehicle.vin}/debian/32`}> 32 </a> &nbsp;
                <a href={`/api/v1/client/${vehicle.vin}/debian/64`}> 64 </a> &nbsp;
              )
            </td>
            <td>
              rpm ( &nbsp;
                <a href={`#/client/${vehicle.vin}/rpm/32`}> 32 </a> &nbsp;
                <a href={`#/client/${vehicle.vin}/rpm/64`}> 64 </a> &nbsp;
              )
            </td>
          </tr>
        );
      });
      return (
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <td>
                VIN
              </td>
            </tr>
          </thead>
          <tbody>
            { vehicles }
          </tbody>
        </table>
      );
    }
  });

  return ListOfVehicles;
});
