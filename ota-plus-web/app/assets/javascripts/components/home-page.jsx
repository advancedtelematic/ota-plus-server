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
              {this.state.searchAssociatedVehicles ? 
              <div>
                <div className="row">
                  <div className="col-md-12">
                    <h1>
                      Associated vehicles - {this.state.selectedName} {this.state.selectedVersion}
                    </h1>
                  </div>
                </div>
                <ListOfAssociatedVehicles 
                  Vehicles={db.vehiclesWholeDataForPackage}
                  PollEventName="poll-associated-vehicles"
                  DispatchObject={{actionType: "get-vehicles-wholedata-for-package", name: this.state.selectedName, version: this.state.selectedVersion}}
                  SelectedName={this.state.selectedName}/>
              </div>
            : 
              <div>
                <VehiclesHeader/>
                <ListOfVehicles 
                  Vehicles={db.searchableVehicles}
                  DisplayAssociatedPackagesLink={true}
                  PollEventName="poll-vehicles"
                  DispatchObject={{actionType: "search-vehicles-by-regex", regex: ""}}
                  IsHomePage={true}
                  onClick={this.showAssociatedPackagesClick}
                  SelectedVin={this.state.selectedVin}/>
              </div>
            }
            
          </div>
          <div className="col-md-6">
            {this.state.searchAssociatedPackages ? 
              <div>
                <div className="row">
                  <div className="col-md-12">
                    <h1>
                      Associated Packages - {this.state.selectedVin}
                    </h1>
                  </div>
                </div>
                <ListOfAssociatedPackages
                  Packages={db.packagesForVin}
                  PollEventName="poll-associated-packages"
                  DispatchObject={{actionType: 'get-packages-for-vin', vin: this.state.selectedVin}}
                  DisplayCampaignLink={false}/>
              </div>
            : 
              <div>
                <div className="row">
                  <div className="col-md-12">
                    <h1>
                      Packages
                    </h1>
                  </div>
                </div>
                <ListOfPackages
                  Packages={db.searchablePackages}
                  PollEventName="poll-packages"
                  DispatchObject={{actionType: 'search-packages-by-regex', regex: "."}}
                  DisplayCampaignLink={false}
                  DisplayAssociatedDevicesLink={true}
                  onClick={this.showAssociatedVehiclesClick}
                  SelectedName={this.state.selectedName}
                  SelectedVersion={this.state.selectedVersion}/>
              </div>
            }
          </div>
        </div>
      );
    }
  });

  return Home;
});
