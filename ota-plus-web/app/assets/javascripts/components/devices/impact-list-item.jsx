define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link;

  class ImpactListItem extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      var deviceUuid = this.props.deviceId;
      deviceUuid = deviceUuid.substring(0, 8);
      return (
        <Link to={`devicedetails/${this.props.deviceId}`} className="common-box device-box">
          <div className="common-box-icon"></div>
          <div className="device-desc">
            <div className="device-name">
              {deviceUuid}
            </div>
            <div className="device-uuid">
              {this.props.number}
            </div>
          </div>
        </Link>
      );
    }
  };

  return ImpactListItem;
});
