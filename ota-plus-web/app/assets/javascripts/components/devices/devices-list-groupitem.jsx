define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link;

  class DeviceListGroupItem extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      const link = 'group/' + this.props.name;
      return (
        <Link to={`${link}`} className="group-box" id={"link-group-" + this.props.name} style={{width: this.props.width}}>
          <div className="group-icon"></div>
          <div className="group-desc">
            <div className="group-name">{this.props.name}</div>
          </div>
        </Link>
      );
    }
  };

  return DeviceListGroupItem;
});
