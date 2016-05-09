define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link;
        
  class DetailsHeader extends React.Component {
    render() {
      var lastSeenDate = new Date(this.props.device.lastSeen);
      var labelClass = 'label-danger';
      switch(this.props.device.status) {
        case 'upToDate':
          labelClass = 'label-success';
        break;
        case 'outOfDate':
          labelClass = 'label-warning';
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
                Device synchronized
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return DetailsHeader;
});
