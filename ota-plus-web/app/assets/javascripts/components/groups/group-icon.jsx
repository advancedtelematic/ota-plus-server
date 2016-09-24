define(function(require) {
  var React = require('react');
  
  class GroupIcon extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div>
          <div className="group-icon"></div>
          <div className="group-text">
            <div className="group-title">{this.props.name}</div>
            <div className="group-subtitle">{this.props.count} devices</div>
          </div>
        </div>
      );
    }
  };

  return GroupIcon;
});
