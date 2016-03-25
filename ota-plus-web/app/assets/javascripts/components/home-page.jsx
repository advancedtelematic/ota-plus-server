define(function(require) {

  var React = require('react'),
      Router = require('react-router'),
      _ = require('underscore'),
      SotaDispatcher = require('sota-dispatcher'),
      ListOfPackages = require('./packages/list-of-packages'),
      ListOfAssociatedPackages = require('./packages/list-of-associated-packages'),
      ListOfVehicles = require('./vehicles/list-of-vehicles'),
      ListOfAssociatedVehicles = require('./vehicles/list-of-associated-vehicles'),
      VehiclesHeader = require('./vehicles/vehicles-header-component'),
      PackagesHeader = require('./packages/packages-header-component'),
      db = require('stores/db');

  var Home = React.createClass({
    getInitialState: function() {
      return {
        searchAssociatedPackages: false,
        selectedVin: '',
        searchAssociatedVehicles: false,
        selectedName: '',
        selectedVersion: '',
     };
    },
    contextTypes: {
      router: React.PropTypes.func
    },
    componentWillUnmount: function(){
    },
    componentWillMount: function(){
    },
    showAssociatedPackagesClick: function (event, vin) {
      {this.state.selectedVin == vin ?
        this.setState({
          searchAssociatedPackages: false,
          selectedVin: ''
        })
      :
        this.setState({
          searchAssociatedPackages: true,
          selectedVin: vin
        })
      }
    },
    showAssociatedVehiclesClick: function (event, name, version) {
      {(this.state.selectedName == name && this.state.selectedVersion == version) ?
        this.setState({
          searchAssociatedVehicles: false,
          selectedName: '',
          selectedVersion: ''
        })
      :
        this.setState({
          searchAssociatedVehicles: true,
          selectedName: name,
          selectedVersion: version
        })
      }
    },
    render: function() {
      return (
        <div className="row">
          <div className="col-md-6">
            <VehiclesHeader/>
            {this.state.searchAssociatedVehicles ? 
              <ListOfAssociatedVehicles 
                AllVehicles={db.searchableVehicles}
                AllVehiclesPollEventName="poll-vehicles"
                AllVehiclesDispatchObject={{actionType: "search-vehicles-by-regex", regex: ""}}
                InstalledVehicles={db.vehiclesWholeDataForPackage}
                InstalledVehiclesPollEventName="poll-installed-vehicles"
                InstalledVehiclesDispatchObject={{actionType: "get-vehicles-wholedata-for-package", name: this.state.selectedName, version: this.state.selectedVersion}}
                QueuedVehicles={db.vehiclesQueuedForPackage}
                QueuedVehiclesPollEventName="poll-queued-vehicles"
                QueuedVehiclesDispatchObject={{actionType: "get-vehicles-queued-for-package", name: this.state.selectedName, version: this.state.selectedVersion}}
                SelectedName={this.state.selectedName}
                SelectedVersion={this.state.selectedVersion}/>
            : 
              <ListOfVehicles 
                Vehicles={db.searchableVehicles}
                AllowAssociatedPackagesAction={true}
                PollEventName="poll-vehicles"
                DispatchObject={{actionType: "search-vehicles-by-regex", regex: ""}}
                onClick={this.showAssociatedPackagesClick}
                SelectedVin={this.state.selectedVin}/>
            }
          </div>
          <div className="col-md-6">
            <PackagesHeader/>
            {this.state.searchAssociatedPackages ?
              <ListOfAssociatedPackages
                AllPackages={db.searchablePackages}
                AllPackagesPollEventName="poll-packages"
                AllPackagesDispatchObject={{actionType: 'search-packages-by-regex', regex: "."}}
                InstalledPackages={db.packagesForVin}
                InstalledPackagesPollEventName="poll-installed-packages"
                InstalledPackagesDispatchObject={{actionType: 'get-packages-for-vin', vin: this.state.selectedVin}}
                QueuedPackages={db.packageQueueForVin}
                QueuedPackagesPollEventName="poll-queued-packages"
                QueuedPackagesDispatchObject={{actionType: 'get-package-queue-for-vin', vin: this.state.selectedVin}}
                SelectedVin={this.state.selectedVin}
                DisplayCampaignLink={false}/>
            : 
              <ListOfPackages
                Packages={db.searchablePackages}
                PollEventName="poll-packages"
                DispatchObject={{actionType: 'search-packages-by-regex', regex: "."}}
                DisplayCampaignLink={false}
                AllowAssociatedDevicesAction={true}
                onClick={this.showAssociatedVehiclesClick}
                SelectedName={this.state.selectedName}
                SelectedVersion={this.state.selectedVersion}/>
            }
          </div>
        </div>
      );
    }
  });

  return Home;
});
