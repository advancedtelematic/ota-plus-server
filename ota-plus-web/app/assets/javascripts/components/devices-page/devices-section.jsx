define(function(require) {
  var React = require('react'),
      DevicesBar = require('./devices-bar'),
      DevicesList = require('./devices-list'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group');
        
  class DevicesSection extends React.Component {
    constructor(props) {
      super(props);
      var areTestSettingsCorrect = localStorage.getItem('firstProductionTestDevice') && localStorage.getItem('firstProductionTestDevice') !== '' && 
                                   localStorage.getItem('secondProductionTestDevice') && localStorage.getItem('secondProductionTestDevice') !== '' && 
                                   localStorage.getItem('thirdProductionTestDevice') && localStorage.getItem('thirdProductionTestDevice') !== '' ? true : false;   
      this.state = {
        expandedSectionName: 'testDevices',
        devicesListHeight: this.props.contentHeight,
        areTestSettingsCorrect: areTestSettingsCorrect
      };
      this.setDevicesListHeight = this.setDevicesListHeight.bind(this);
    }
    componentDidMount() {
      this.setDevicesListHeight(this.props.contentHeight);
    }
    componentWillReceiveProps(nextProps) {
      if(nextProps.contentHeight !== this.props.contentHeight) {
        this.setDevicesListHeight(nextProps.contentHeight);
      }
    }
    setDevicesListHeight(contentHeight) {
      var devicesBarHeight = jQuery('#devices-bar').outerHeight();
      var btnSectionsHeight = jQuery('.btn-full-section').length ? 4 * 34 : 0;
      this.setState({devicesListHeight: contentHeight - devicesBarHeight - btnSectionsHeight});
    }
    expandSection(sectionName, e) {
      this.setState({expandedSectionName: (this.state.expandedSectionName == sectionName) ? null : sectionName});
    }
    numberWithDots(x) {
      return !_.isUndefined(x) ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : '';
    }
    render() {
      var productionDevicesCount = 0;
      var totalProductionDevicesCount = 15382448;
      var packagesCount = 67;
      var campaignsCount = 32;
      var productionDevicesCount = 0;
      if(this.props.filterValue.length >= 17) {
        productionDevicesCount = !_.isUndefined(this.props.productionDevices) ? this.props.productionDevices.length : 0;
      } else {
        productionDevicesCount = this.props.filterValue.length > 0 ? this.props.filterValue.length == 16 ? 25 : Math.round(totalProductionDevicesCount / (this.props.filterValue.length * 3499)) : totalProductionDevicesCount;
      }
      return (
        <div id="devices-column">
          <div className="panel panel-ats">
            <div className="panel-body">
              <DevicesBar
                filterValue={this.props.filterValue}
                selectedStatus={this.props.selectedStatus}
                selectedStatusName={this.props.selectedStatusName}
                selectedSort={this.props.selectedSort}
                selectStatus={this.props.selectStatus}
                selectSort={this.props.selectSort}
                changeFilter={this.props.changeFilter}/>
          
              {this.state.areTestSettingsCorrect ?
                <button className="btn btn-full-section first" onClick={this.expandSection.bind(this, 'testDevices')}>
                  <i className={(this.state.expandedSectionName == 'testDevices') ? "fa fa-chevron-circle-down" : "fa fa-chevron-circle-right"} aria-hidden="true"></i> &nbsp;
                  TEST DEVICES &nbsp;
                  {this.numberWithDots(this.props.searchableDevices.length)} 
                  <span>
                    &nbsp;out of {this.numberWithDots(this.props.devices.length)}
                  </span>
                </button>
              : null}
              <div style={{paddingTop: !this.state.areTestSettingsCorrect ? '40px' : 0}}>
                <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}} runOnMount={true}>
                  {this.state.expandedSectionName == 'testDevices' ? 
                    <div>
                      <div className="devices" style={{height: this.state.devicesListHeight}}>
                        <DevicesList
                          devices={this.props.searchableDevices}
                          areProductionDevices={false}
                          openNewDeviceModal={this.props.openNewDeviceModal}
                          openRenameDeviceModal={this.props.openRenameDeviceModal}
                          openNewSmartGroupModal={this.props.openNewSmartGroupModal}
                          draggingDeviceUUID={this.props.draggingDeviceUUID}
                          onDeviceDragStart={this.props.onDeviceDragStart}
                          onDeviceDragEnd={this.props.onDeviceDragEnd}/>
                      </div>
                    </div>
                  : undefined}
                </VelocityTransitionGroup>
              </div>
              {this.state.areTestSettingsCorrect ?
                <div>
                  <button className="btn btn-full-section" onClick={this.expandSection.bind(this, 'productionDevices')}>
                    <i className={(this.state.expandedSectionName == 'productionDevices') ? "fa fa-chevron-circle-down" : "fa fa-chevron-circle-right"} aria-hidden="true"></i> PRODUCTION DEVICES ({this.numberWithDots(productionDevicesCount)} out of {this.numberWithDots(totalProductionDevicesCount)})
                  </button>
                  <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
                    {this.state.expandedSectionName == 'productionDevices' ?
                      <div>
                        <div className="devices" style={{height: this.state.devicesListHeight}}>
                          <DevicesList
                            devices={this.props.productionDevices}
                            productionDeviceName={this.props.filterValue}
                            areProductionDevices={true}/>
                        </div>
                      </div>
                    : null}
                  </VelocityTransitionGroup>

                  <button className="btn btn-full-section" onClick={this.expandSection.bind(this, 'packages')}>
                    <i className={(this.state.expandedSectionName == 'packages') ? "fa fa-chevron-circle-down" : "fa fa-chevron-circle-right"} aria-hidden="true"></i> PACKAGES ({this.props.filterValue.length  == 0 ? this.numberWithDots(packagesCount) : this.props.filterValue.length == 1 ? 1 : this.props.filterValue.length == 2 ? 0 : 0} out of {this.numberWithDots(packagesCount)})
                  </button>
                  {this.state.expandedSectionName == 'packages' ?
                    <div></div>
                  : null}

                  <button className="btn btn-full-section" onClick={this.expandSection.bind(this, 'campaigns')}>
                    <i className={(this.state.expandedSectionName == 'campaigns') ? "fa fa-chevron-circle-down" : "fa fa-chevron-circle-right"} aria-hidden="true"></i> CAMPAIGNS ({this.props.filterValue.length  == 0 ? this.numberWithDots(campaignsCount) : this.props.filterValue.length == 1 ? 1 : this.props.filterValue.length == 2 ? 0 : 0} out of {this.numberWithDots(campaignsCount)})
                  </button>
                  {this.state.expandedSectionName == 'campaigns' ?
                    <div></div>
                  : null}
                </div>
              : null}
            </div>
          </div>
        </div>
      );
    }
  };

  return DevicesSection;
});
