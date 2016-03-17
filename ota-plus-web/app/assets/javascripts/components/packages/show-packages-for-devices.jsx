define(function(require) {

  var $ = require('jquery'),
      React = require('react'),
      _ = require('underscore'),
      modalPanel = require('../../mixins/modal-panel'),
      db = require('stores/db'),
      ListOfAssociatedDevices = require('./list-of-packages'),
      SotaDispatcher = require('sota-dispatcher');

  var ShowPackagesForDevices = React.createClass({
    mixins: [
      modalPanel
    ],
    getInitialState: function() {
      return {associatedPackages: "aaa"};
    },
 
    buttonLabel: "Show associated packages",
    modal: function() {
      return (
        <div>
          <div className="myModal">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" onClick={this.modalPanel}>&times;</button>
                  <h4 className="modal-title">Packages for {this.props.vin}</h4>
                </div>
                <div className="modal-body">                    
                  <ListOfAssociatedDevices
                    Packages={db.packagesForVin}
                    PollEventName="poll-packages"
                    DispatchObject={{actionType: 'get-packages-for-vin', vin: this.props.vin}}
                    DisplayCampaignLink={false}/>
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

  return ShowPackagesForDevices;
});
