define(function(require) {

  var React = require('react'),
      Router = require('react-router'),
      _ = require('underscore'),
      SotaDispatcher = require('sota-dispatcher'),
      ListOfPackages = require('./packages/list-of-packages'),
      PackagesHeader = require('./packages/packages-header-component'),
      ListOfVehicles = require('./vehicles/list-of-vehicles'),
      VehiclesHeader = require('./vehicles/vehicles-header-component'),
      db = require('stores/db');

  var Home = React.createClass({
    contextTypes: {
      router: React.PropTypes.func
    },
    componentWillUnmount: function(){
    },
    componentWillMount: function(){
    },

    render: function() {
      return (
        <div className="row">
          <div className="col-md-6">
            <VehiclesHeader/>
            <ListOfVehicles 
              Vehicles={db.searchableVehicles}
              PollEventName="poll-vehicles"
              DispatchObject={{actionType: "search-vehicles-by-regex", regex: ""}}/>
          </div>
          <div className="col-md-6">
            <PackagesHeader/>
            <ListOfPackages
              Packages={db.searchablePackages}
              PollEventName="poll-packages"
              DispatchObject={{actionType: 'search-packages-by-regex', regex: ""}}
              DisplayCampaignLink={false}
              DisplayAssociatedDevicesLink={true}/>
          </div>
        </div>
      );
    }
  });

  return Home;
});
