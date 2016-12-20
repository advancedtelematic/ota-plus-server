define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group');

  class DetailsHeader extends React.Component {
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
        var isTestDevice = localStorage.getItem('firstProductionTestDevice') === device.uuid || localStorage.getItem('secondProductionTestDevice') === device.uuid || localStorage.getItem('thirdProductionTestDevice') === device.uuid ? true : false;
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
                  {this.props.duplicatingInProgress ?
                    <div>
                      <img src='/assets/img/icons/loading.gif' alt='' width="20"/> &nbsp;
                      Synchronising &nbsp;
                    </div>
                  :
                    <div>
                      <div className={"device-status device-status-" + device.status}></div>
                      {deviceStatus}
                    </div>
                  }
                </div>
              : undefined}
            </VelocityTransitionGroup>
            <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
              {!_.isUndefined(device) && isTestDevice ? 
                <Link to={`devicedetails/${this.props.device.uuid}/newcampaign`} className="btn-new-campaign pull-right">
                  Campaign wizard
                </Link>
              : null}
            </VelocityTransitionGroup>
            <VelocityTransitionGroup enter={{animation: 'fadeIn'}} leave={{animation: 'fadeOut'}}>
              {!_.isUndefined(device) ?
                <div className="device-header-dates">
                  <div>
                    <i className="fa fa-calendar text-success" aria-hidden="true"></i> Created date: {createdDate.toDateString() + ' ' + createdDate.toLocaleTimeString()}
                  </div>
                  <div>
                    {device.activatedAt !== null ?
                      <span><i className="fa fa-times-circle-o text-success" aria-hidden="true"></i> Activated date: {activatedDate.toDateString() + ' ' + activatedDate.toLocaleTimeString()}</span>
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

  return DetailsHeader;
});
