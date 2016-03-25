define(function(require) {

  var React = require('react'),
      _ = require('underscore'),
      Router = require('react-router'),
      Fluxbone = require('../../mixins/fluxbone'),
      ShowPackagesForDevices = require('../packages/show-packages-for-devices'),
      SotaDispatcher = require('sota-dispatcher');

  var ListOfVehicles = React.createClass({
    componentWillUnmount: function(){
      this.props.Vehicles.removeWatch(this.props.PollEventName);
    },
    componentWillMount: function(){
      SotaDispatcher.dispatch(this.props.DispatchObject);
      this.props.Vehicles.addWatch(this.props.PollEventName, _.bind(this.forceUpdate, this, null));
    },

    onClick: function(vin, t) {
      this.props.onClick(t, vin);
    },
    render: function() {
      var _AllowAssociatedPackagesAction = this.props.AllowAssociatedPackagesAction;
      var _click = this.onClick;
      var _SelectedVin = this.props.SelectedVin;
      var vehicles = _.map(this.props.Vehicles.deref(), function(vehicle, i) {
        return (
          
          <tr key={vehicle.vin} className={_SelectedVin == vehicle.vin ? 'selected' : ''} onClick={_AllowAssociatedPackagesAction ? _click.bind(null, vehicle.vin) : ''}>
            <td>
              <Router.Link to='vehicle' params={{vin: vehicle.vin}} onClick={e => e.stopPropagation()}>
              { vehicle.vin }
              </Router.Link>
            </td>
            <td>
              debian ( &nbsp;
                <a href={`/api/v1/client/${vehicle.vin}/deb/32`}> 32 </a> &nbsp;
                <a href={`/api/v1/client/${vehicle.vin}/deb/64`}> 64 </a> &nbsp;
              )
            </td>
            <td>
              rpm ( &nbsp;
                <a href={`/api/v1/client/${vehicle.vin}/rpm/32`}> 32 </a> &nbsp;
                <a href={`/api/v1/client/${vehicle.vin}/rpm/64`}> 64 </a> &nbsp;
              )
            </td>
          </tr>
        );
      });
      return (
        <table id={this.props.AllowAssociatedPackagesAction ? 'table-vehicles' : ''} className="table table-striped table-bordered">
          <thead>
            <tr>
              <td>
                VIN
              </td>
              <td />
              <td />
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
