define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link;
  
  class DeviceListItem extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      var itemId = 'vin-'+this.props.vin;
      var cutVin = this.props.vin.substring(0, 4);
      return (
        <Link to={`devicedetails/${this.props.vin}`} className="device-box">
          <div className="device-icon"></div>
          <div className="device-desc">
            <div className="device-name">
              <div className={"device-status device-status-" + this.props.status}>
                <i className="fa fa-circle" aria-hidden="true"></i>
              </div>
              {cutVin}
            </div>
            <div className="device-uuid">122.133.110.22</div>
          </div>
        </Link>
      );
    }
  };

  return DeviceListItem;
});
