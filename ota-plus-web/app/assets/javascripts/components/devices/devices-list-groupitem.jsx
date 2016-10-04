define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link;

  class DeviceListGroupItem extends React.Component {
    constructor(props) {
      super(props);
      this.expandGroup = this.expandGroup.bind(this);
    }
    expandGroup(e) {
      e.preventDefault();
      this.props.expandGroup(this.props.name);
    }
    render() {
      return (
        <a href="#" className="group-box" id={"link-group-" + this.props.name} style={{width: this.props.width}} onClick={this.expandGroup}>
          <div className="group-icon"></div>
          <div className="group-desc">
            <div className="group-name">{this.props.name}</div>
          </div>
        </a>
      );
    }
  };

  return DeviceListGroupItem;
});
