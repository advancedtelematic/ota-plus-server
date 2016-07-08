define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link;

  class ImpactListItem extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      const deviceId = this.props.deviceId;
      const deviceName = this.props.deviceName;
      return (
        <Link to={`devicedetails/${this.props.id}`} className="device-box">
          <div className="device-icon"></div>
          <div className="device-desc">
            <div className="device-name">
              {deviceName}
            </div>
            <div className="device-uuid">{deviceId}</div>
          </div>
        </Link>
      );
    }
  };

  return ImpactListItem;
});
