define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group');

  class ProductionDetailsHeader extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      const device = this.props.device;
      if(!_.isUndefined(device)) {
        var deviceName = device.deviceName;
        var lastSeenDate = new Date(device.lastSeen);
        var createdDate = new Date(device.createdAt);
        var activatedDate = new Date(device.activatedAt);
        var deviceStatus = 'Status unknown';
        switch(this.props.device.status) {
          case 'UpToDate':
            deviceStatus = 'Device synchronized';
          break;
          case 'Outdated':
            deviceStatus = 'Device unsynchronized';
          break;
          case 'Error':
            deviceStatus = 'Installation error';
          break;
          default:
          break;
        }
      }
     
      return (
        <div className="grey-header">
          <div className="col-md-12">
            <Link to="/"><img src="/assets/img/icons/back.png" className="icon-back" alt=""/></Link>
            <div className="grey-header-icon"></div>
            <VelocityTransitionGroup enter={{animation: 'fadeIn', display: 'inline-block'}} leave={{animation: 'fadeOut', display: 'inline-block'}}>
              {!_.isUndefined(device) ?
                <div className="grey-header-text">
                  <div className="grey-header-title">{deviceName}</div>
                  <div className="grey-header-subtitle">
                    {device.status !== 'NotSeen' ?
                      <span>Last seen online: {lastSeenDate.toDateString() + ' ' + lastSeenDate.toLocaleTimeString()}</span>
                    :
                      <span>Never seen online</span>
                    }
                  </div>
                </div>
              : undefined}
            </VelocityTransitionGroup>
            {_.isUndefined(device) ?
              <div className="grey-header-text">
                <div className="grey-header-subtitle"><i className="fa fa-square-o fa-spin"></i> device loading</div>
              </div>
            : undefined}
            <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
              {!_.isUndefined(device) ?
                <div className="device-header-status">
                  <div className={"device-status device-status-" + device.status}></div>
                  {deviceStatus}
                </div>
              : undefined}
            </VelocityTransitionGroup>
            <Link to={`devicedetails/${localStorage.getItem('firstProductionTestDevice')}/synchronising/${this.props.id}`} className="btn-duplicate-device pull-right">
              Duplicate to test device (1)
            </Link>
            <VelocityTransitionGroup enter={{animation: 'fadeIn'}} leave={{animation: 'fadeOut'}}>
              {!_.isUndefined(device) ?
                <div className="device-header-dates">
                  <div>
                    Created date: {createdDate.toDateString() + ' ' + createdDate.toLocaleTimeString()}
                  </div>
                  <div>
                    {device.activatedAt !== null ?
                      <span>Activated date: {activatedDate.toDateString() + ' ' + activatedDate.toLocaleTimeString()}</span>
                    :
                      <span><i className="fa fa-times-circle-o text-danger" aria-hidden="true"></i> Device not activated</span>
                    }
                  </div>
                </div>
              : undefined}
            </VelocityTransitionGroup>
          </div>
        </div>
      );
    }
  };

  return ProductionDetailsHeader;
});
