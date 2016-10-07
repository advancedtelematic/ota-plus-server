define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      DetailsHeader = require('es6!./details-header'),
      PackagesQueue = require('es6!../packages/queue'),
      Packages = require('es6!../packages/packages'),
      TutorialInstallDevice = require('es6!../tutorial/install-device'),
      Loader = require('es6!../loader'),
      VelocityUI = require('velocity-ui'),
      VelocityHelpers = require('mixins/velocity/velocity-helpers'),
      VelocityComponent = require('mixins/velocity/velocity-component'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group');

  class DeviceDetails extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.state = {
        intervalId: null,
      }
      this.refreshData = this.refreshData.bind(this);
    }
    componentDidMount() {
      var that = this;
      var intervalId = setInterval(function() {
        that.refreshData();
      }, 1000);
      this.setState({intervalId: intervalId});
    }
    componentWillUnmount(){
      clearInterval(this.state.intervalId);
    }
    refreshData() {
      SotaDispatcher.dispatch({actionType: 'get-device', uuid: this.props.params.id});
    }
    render() {
      const deviceWithStatus = db.showDevice.deref();

      return (
        <div>
          <div className="col-md-6 nopadding border-right-2">
            <div className="panel panel-ats">
              <div className="panel-heading">
                <div className="panel-heading-left pull-left">
                  {this.context.strings.packages}
                </div>
              </div>
              <div className="panel-body">
                  
              </div>
              <div className="panel-footer">
               
                <span className="packages-statistics">
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  DeviceDetails.contextTypes = {
    strings: React.PropTypes.object.isRequired
  };

  return DeviceDetails;
});
