define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link;
        
  class DetailsHeader extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {        
      var lastSeenDate = new Date(this.props.device.lastSeen);
      var labelClass = 'label-danger';
      var deviceStatus = 'Never seen online';
      switch(this.props.device.status) {
        case 'UpToDate':
          labelClass = 'label-success';
          deviceStatus = 'Device synchronized';
        break;
        case 'Outdated':
          labelClass = 'label-warning';
          deviceStatus = 'Device unsynchronized'
        default:
        break;
      }
      return (
        <div className="row">
          <div className="device-header">
            <div className="col-md-12">
              <Link to="/"><img src="/assets/img/icons/back.png" className="icon-back" alt=""/></Link>
            
              <div className="device-box">
                <div className="device-icon"></div>
              </div>
            
              <div className="device-header-text">
                <div className="device-name">{this.props.device.vin}</div>
                <div className="device-uuid">113.223.232.123</div>
              </div>
      
              <div className="device-header-status pull-right">
                <div className={"device-status device-status-" + this.props.device.status}>
                  <i className="fa fa-circle" aria-hidden="true"></i>
                </div>
                {deviceStatus}
              </div>
              <Link to={`devicedetails/${this.props.device.vin}/newcampaign`} className="btn-new-campaign pull-right">
                Campaign wizard
              </Link>
            </div>
          </div>
        </div>
      );
    }
  };

  return DetailsHeader;
});
