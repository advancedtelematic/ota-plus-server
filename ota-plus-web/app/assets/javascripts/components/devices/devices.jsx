define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher')
      ReactCSSTransitionGroup = React.addons.CSSTransitionGroup,
      DevicesList = require('./devices-list');
  
  class Devices extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
       intervalId: null,
        expandedSectionName: 'testDevices',
        packagesCount: 67,
        campaignsCount: 32,
        productionDevicesCount: 0,
      };
      
      this.refreshData = this.refreshData.bind(this);
      
      SotaDispatcher.dispatch({actionType: 'get-devices'});
      db.devices.addWatch("devices", _.bind(this.forceUpdate, this, null));
      SotaDispatcher.dispatch({actionType: 'search-devices-by-regex', regex: this.props.filterValue});
      db.searchableDevices.addWatch("searchable-devices", _.bind(this.forceUpdate, this, null));
      SotaDispatcher.dispatch({actionType: 'search-production-devices', regex: this.props.filterValue});
      db.searchableProductionDevices.addWatch("searchable-production-devices", _.bind(this.forceUpdate, this, null));
    }
    componentDidMount() {
      var that = this;
      var intervalId = setInterval(function() {
        that.refreshData();
      }, 1000);
      this.setState({intervalId: intervalId});
    }
    componentWillUpdate(nextProps, nextState) {
      if(nextProps.filterValue != this.props.filterValue) {
        SotaDispatcher.dispatch({actionType: 'search-devices-by-regex', regex: nextProps.filterValue});
        SotaDispatcher.dispatch({actionType: 'search-production-devices', regex: nextProps.filterValue});
      }
    }
    componentWillUnmount(){
      db.devices.removeWatch("devices");
      db.searchableDevices.removeWatch("searchable-devices");
      db.searchableProductionDevices.removeWatch("searchable-production-devices");
      clearInterval(this.state.intervalId);
    }
    refreshData() {
      SotaDispatcher.dispatch({actionType: 'get-devices'});
      SotaDispatcher.dispatch({actionType: 'search-devices-by-regex', regex: this.props.filterValue});
    }
    expandSection(sectionName, e) {
      this.setState({
        expandedSectionName: (this.state.expandedSectionName == sectionName) ? null : sectionName
      });
    }
    numberWithDots(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    render() {
      var productionDevicesCount = 0;
      var totalProductionDevicesCount = 15382448;
      if(this.props.filterValue.length >= 17) {
        productionDevicesCount = db.searchableProductionDevices.deref().length;
      } else {
        productionDevicesCount = this.props.filterValue.length > 0 ? this.props.filterValue.length == 16 ? 25 : Math.round(totalProductionDevicesCount / (this.props.filterValue.length * 3499)) : totalProductionDevicesCount;
      }
      return (
        <div>
          <button className="btn btn-full-section" onClick={this.expandSection.bind(this, 'testDevices')}>
            <i className={(this.state.expandedSectionName == 'testDevices') ? "fa fa-chevron-circle-down" : "fa fa-chevron-circle-right"} aria-hidden="true"></i> TEST DEVICES ({this.numberWithDots(db.searchableDevices.deref().length)} out of {this.numberWithDots(db.devices.deref().length)})
          </button>
          {this.state.expandedSectionName == 'testDevices' ? 
            <div>
              <ReactCSSTransitionGroup
                transitionAppear={true}
                transactionLeave={false}
                transitionAppearTimeout={500}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}
                transitionName="example">   
                <div id="devices">
                  <DevicesList
                    Devices={db.searchableDevices}
                    areProductionDevices={false}/>
                  {this.props.children}
                </div>
              </ReactCSSTransitionGroup>
            </div>
          : null}
      
          <button className="btn btn-full-section" onClick={this.expandSection.bind(this, 'productionDevices')}>
            <i className={(this.state.expandedSectionName == 'productionDevices') ? "fa fa-chevron-circle-down" : "fa fa-chevron-circle-right"} aria-hidden="true"></i> PRODUCTION DEVICES ({this.numberWithDots(productionDevicesCount)} out of {this.numberWithDots(totalProductionDevicesCount)})
          </button>
          {this.state.expandedSectionName == 'productionDevices' ? 
            <div>
              <ReactCSSTransitionGroup
                transitionAppear={true}
                transactionLeave={false}
                transitionAppearTimeout={500}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}
                transitionName="example">   
                <div id="devices">
                  <DevicesList
                    Devices={db.searchableProductionDevices}
                    areProductionDevices={true}/>
                  {this.props.children}
                </div>
              </ReactCSSTransitionGroup>
            </div>
          : null}
      
          <button className="btn btn-full-section" onClick={this.expandSection.bind(this, 'packages')}>
            <i className={(this.state.expandedSectionName == 'packages') ? "fa fa-chevron-circle-down" : "fa fa-chevron-circle-right"} aria-hidden="true"></i> PACKAGES ({this.props.filterValue.length  == 0 ? this.numberWithDots(this.state.packagesCount) : this.props.filterValue.length == 1 ? 1 : this.props.filterValue.length == 2 ? 0 : 0} out of {this.numberWithDots(this.state.packagesCount)})
          </button>
          {this.state.expandedSectionName == 'packages' ? 
            <div></div>
          : null}
      
          <button className="btn btn-full-section" onClick={this.expandSection.bind(this, 'campaigns')}>
            <i className={(this.state.expandedSectionName == 'campaigns') ? "fa fa-chevron-circle-down" : "fa fa-chevron-circle-right"} aria-hidden="true"></i> CAMPAIGNS ({this.props.filterValue.length  == 0 ? this.numberWithDots(this.state.campaignsCount) : this.props.filterValue.length == 1 ? 1 : this.props.filterValue.length == 2 ? 0 : 0} out of {this.numberWithDots(this.state.campaignsCount)})
          </button>
          {this.state.expandedSectionName == 'campaigns' ? 
            <div></div>
          : null}
        </div>
      );
    }
  };

  return Devices;
});
