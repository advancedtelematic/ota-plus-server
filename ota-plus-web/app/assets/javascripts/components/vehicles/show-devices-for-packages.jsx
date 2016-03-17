define(function(require) {

  var $ = require('jquery'),
      React = require('react'),
      _ = require('underscore'),
      modalPanel = require('../../mixins/modal-panel'),
      db = require('stores/db'),
      ListOfAssociatedDevices = require('./list-of-vehicles'),
      SotaDispatcher = require('sota-dispatcher');

  var ShowDevicesForPackages = React.createClass({
    mixins: [
      modalPanel
    ],
    buttonLabel: "Show associated devices",
    modal: function() {
      return (
        <div>
          <div className="myModal">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" onClick={this.modalPanel}>&times;</button>
                  <h4 className="modal-title">Devices for {this.props.name} - {this.props.version}</h4>
                </div>
                <div className="modal-body">
                  <ListOfAssociatedDevices
                    Vehicles={db.vehiclesWholeDataForPackage}
                    PollEventName="poll-vehicles-wholedata-for-package"
                    DispatchObject={{actionType: "get-vehicles-wholedata-for-package", name: this.props.name, version: this.props.version}}
                    DisplayAssociatedPackagesLink={false}/>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-default" onClick={this.modalPanel}>Close</button>
                </div>
              </div>
            </div>
          </div>       
        </div>
      );
    }
  });

  return ShowDevicesForPackages;
});