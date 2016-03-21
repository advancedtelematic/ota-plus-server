define(function(require) {

  var React = require('react'),
      _ = require('underscore'),
      Router = require('react-router'),
      Fluxbone = require('../../mixins/fluxbone'),
      SotaDispatcher = require('sota-dispatcher');

  var ListOfAssociatedVehicles = React.createClass({
    componentWillUnmount: function(){
      this.props.Vehicles.removeWatch(this.props.PollEventName);
    },
    componentWillMount: function(){
      SotaDispatcher.dispatch(this.props.DispatchObject);
      this.props.Vehicles.addWatch(this.props.PollEventName, _.bind(this.forceUpdate, this, null));
    },
    componentWillUpdate: function(nextProps, nextState) {
      this.props.Vehicles.removeWatch(this.props.PollEventName);
      SotaDispatcher.dispatch(nextProps.DispatchObject);
      this.props.Vehicles.addWatch(nextProps.PollEventName, _.bind(this.forceUpdate, this, null));
    },
    render: function() {
      var vehicles = _.map(this.props.Vehicles.deref(), function(vehicle) {
        return (
          <tr key={'associated-vehicle-' + vehicle.vin}>
            <td>
              <Router.Link to='vehicle' params={{vin: vehicle.vin}}>
              { vehicle.vin }
              </Router.Link>
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

  return ListOfAssociatedVehicles;
});
