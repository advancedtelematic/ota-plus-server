define(function(require) {

  var React = require('react'),
      _ = require('underscore'),
      Router = require('react-router'),
      Fluxbone = require('../../mixins/fluxbone'),
      SotaDispatcher = require('sota-dispatcher');

  var ListOfAssociatedVehicles = React.createClass({
    getInitialState: function() {
      return {
        isButtonDisabled: true,
        changesCount: 0
      };
    },
    componentWillUnmount: function(){
      this.props.AllVehicles.removeWatch(this.props.AllVehiclesPollEventName);
      this.props.InstalledVehicles.removeWatch(this.props.InstalledVehiclesPollEventName);
      this.props.QueuedVehicles.removeWatch(this.props.QueuedVehiclesPollEventName);
    },
    componentWillMount: function(){
      SotaDispatcher.dispatch(this.props.AllVehiclesDispatchObject);
      this.props.AllVehicles.addWatch(this.props.AllVehiclesPollEventName, _.bind(this.forceUpdate, this, null));
      
      SotaDispatcher.dispatch(this.props.InstalledVehiclesDispatchObject);
      this.props.InstalledVehicles.addWatch(this.props.InstalledVehiclesPollEventName, _.bind(this.forceUpdate, this, null));

      SotaDispatcher.dispatch(this.props.QueuedVehiclesDispatchObject);
      this.props.QueuedVehicles.addWatch(this.props.QueuedVehiclesPollEventName, _.bind(this.forceUpdate, this, null));
    },
    componentWillUpdate: function(nextProps, nextState) {
      if(nextProps.SelectedName != this.props.SelectedName) {
        this.props.AllVehicles.removeWatch(this.props.AllVehiclesPollEventName);
        SotaDispatcher.dispatch(nextProps.AllVehiclesDispatchObject);
        this.props.AllVehicles.addWatch(nextProps.AllVehiclesPollEventName, _.bind(this.forceUpdate, this, null));

        this.props.InstalledVehicles.removeWatch(this.props.InstalledVehiclesPollEventName);
        SotaDispatcher.dispatch(nextProps.InstalledVehiclesDispatchObject);
        this.props.InstalledVehicles.addWatch(nextProps.InstalledVehiclesPollEventName, _.bind(this.forceUpdate, this, null));

        this.props.QueuedVehicles.removeWatch(this.props.QueuedVehiclesPollEventName);
        SotaDispatcher.dispatch(nextProps.QueuedVehiclesDispatchObject);
        this.props.QueuedVehicles.addWatch(nextProps.QueuedVehiclesPollEventName, _.bind(this.forceUpdate, this, null));
        
        this.resetForm();
        this.props.UpdateDimensions();
      }
    },
    componentDidMount: function() {
      this.props.UpdateDimensions();
    },
    handleSubmit: function(e) {
      e.preventDefault();
      var formElements = this.refs.form.getDOMNode().elements;
      var data = [];
      _.map(formElements, function(element) {
        if(element.type == 'checkbox' && element.checked) {
          data.push({
            vin: element.dataset.vin
          });
        }
      });
      if(data.length) {
        //API call
        console.log('sending');
      } else {
        alert('Please select at least one vehicle');
      }
    },
    resetForm: function() {
      this.refs.form.getDOMNode().reset();
      this.changeButtonState();
    },
    changeButtonState: function() {
      var formElements = this.refs.form.getDOMNode().elements;
      var data = [];
      _.map(formElements, function(element) {
        if(element.type == 'checkbox' && element.checked) {
          data.push({
            vin: element.dataset.vin
          });
        }
      });
      this.setState({
        isButtonDisabled: (data.length ? false : true)
      });
    },
    prepareData: function() {
      var Installed = this.props.InstalledVehicles.deref();
      var Queued = this.props.QueuedVehicles.deref();
      var Vehicles = this.props.AllVehicles.deref();
      
      var InstalledIds = {};
      
      Installed.forEach(function(obj){
        InstalledIds[obj.vin] = obj.vin;
      });
      
      var QueuedIds = {};
      Queued.forEach(function(obj){
        QueuedIds[obj.vin] = obj.vin;
      });
      
      Vehicles.filter(function(obj, index){
        var objKey = obj.vin;
        if(objKey in InstalledIds) {
          Vehicles[index].attributes = {checked: true, status: 'installed', string: 'Installed', label: 'label-success'};
        } else if(objKey in QueuedIds) {
          Vehicles[index].attributes = {checked: true, status: 'queued', string: 'Queued', label: 'label-info'};
        } else {
          Vehicles[index].attributes = {checked: false, status: 'notinstalled', string: 'Not installed', label: 'label-danger'};
        }
      });
      
      return Vehicles;
    },
    render: function() {   
      var Vehicles = this.prepareData();
      var vehicles = _.map(Vehicles, function(vehicle, index) {
        return (
          <tr key={'associated-vehicle-' + vehicle.vin}>
            <td>
              <Router.Link to='vehicle' params={{vin: vehicle.vin}}>
              { vehicle.vin }
              </Router.Link>
            </td>
            <td>
              <span className={'label label-vehicle '+ vehicle.attributes.label}>{vehicle.attributes.string}</span>
            </td>
            <td>
              {!vehicle.attributes.checked ? 
                <input type="checkbox" name="vehicle" data-vehiclevin={vehicle.vin} onChange={this.changeButtonState}/>
              :
              ''
              }
            </td>
          </tr>
        );
      }, this);
      return (
        <form ref="form" onSubmit={this.handleSubmit}>
          <div className="resizeWrapper">
            <table className="table table-bordered">
              <tbody>
                { vehicles }
              </tbody>
              <tfoot>
                <tr>
                  <td/>
                  <td/>
                  <td>
                    <button className="btn btn-primary" type="submit" disabled={this.state.isButtonDisabled}>Apply changes</button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </form>
      );
    }
  });

  return ListOfAssociatedVehicles;
});
