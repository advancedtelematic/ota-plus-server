define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link;

  class ProductionDetailsHeader extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      var lastSeenDate = new Date(this.props.device.lastSeen);
      lastSeenDate.setDate(lastSeenDate.getDate()-10);
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
            
      return (
        <div className="col-md-12">
          <Link to="/"><img src="/assets/img/icons/back.png" className="icon-back" alt=""/></Link>
          <div className="device-icon"></div>
  
          <div className="device-header-text">
            <div className="device-name">{this.props.id}</div>
            <div className="device-lastseen">
              {this.props.device.status !== 'NotSeen' ?
                <span>Last seen online: {lastSeenDate.toDateString()}</span>
              :
                <span>Never seen online</span>
              }
            </div>
          </div>

          <div className="device-header-status pull-right">
            <div className={"device-status device-status-" + this.props.device.status}>
              <i className="fa fa-circle" aria-hidden="true"></i>
            </div>
            {deviceStatus}
          </div>
          <Link to={`devicedetails/${localStorage.getItem('firstProductionTestDevice')}/synchronising/${this.props.id}`} className="btn-duplicate-device pull-right">
            Duplicate to test device (1)
          </Link>
        </div>
      );
    }
  };

  return ProductionDetailsHeader;
});
