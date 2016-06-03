define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link;
  
  class ImpactListItem extends React.Component {
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
              {cutVin}
            </div>
            <div className="device-uuid">{this.props.number}</div>
          </div>
        </Link>
      );
    }
  };

  return ImpactListItem;
});
