define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      db = require('stores/db'),
      Events = require('../../handlers/events');

  class DetailsHeader extends React.Component {
    constructor(props) {
      super(props);
      db.deviceSeen.addWatch("poll-deviceseen", _.bind(this.forceUpdate, this, null));
    }
    componentDidMount() {
      window.deviceSeen = Events.deviceSeen;
    }
    componentWillUnmount() {
      db.deviceSeen.removeWatch("poll-deviceseen");
    }
    render() {
      var deviceName = this.props.device.deviceName;
      var lastSeenDate = new Date(this.props.device.lastSeen);
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
      
      var isTestDevice = localStorage.getItem('firstProductionTestDevice') === this.props.device.id || localStorage.getItem('secondProductionTestDevice') === this.props.device.id || localStorage.getItem('thirdProductionTestDevice') === this.props.device.id ? true : false;
      lastSeenDate = !_.isUndefined(db.deviceSeen.deref()) ? new Date(db.deviceSeen.deref().lastSeen) : lastSeenDate;
      
      return (
        
          <div className="col-md-12">
            <Link to="/"><img src="/assets/img/icons/back.png" className="icon-back" alt=""/></Link>
            <div className="device-icon"></div>
            <div className="device-header-text">
              <div className="device-name">{deviceName}</div>
              <div className="device-lastseen">
                {this.props.device.status !== 'NotSeen' ?
                  <span>Last seen online: {lastSeenDate.toDateString() + ' ' + lastSeenDate.toLocaleTimeString()}</span>
                :
                  <span>Never seen online</span>
                }
              </div>
            </div>

            <div className="device-header-status pull-right">
              {this.props.duplicatingInProgress ?
                <div>
                  <img src='/assets/img/icons/loading.gif' alt='' width="20"/> &nbsp;
                  Synchronising &nbsp;
                </div>
              :
                <div>
                  <div className={"device-status device-status-" + this.props.device.status}></div>
                  {deviceStatus}
                </div>
              }
            </div>
            {isTestDevice ? 
              <Link to={`devicedetails/${this.props.device.id}/newcampaign`} className="btn-new-campaign pull-right">
                Campaign wizard
              </Link>
            : null}
            <iframe src={"/api/v1/events/devices/" + this.props.device.id} style={{display: 'none'}}></iframe>
        </div>
      );
    }
  };

  return DetailsHeader;
});
