define(function(require) {
  var React = require('react'),
      ReactDOM = require('react-dom');

  class GroupsListItem extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <button type="button" className={"list-group-item" + (this.props.isSelected ? " checked" : "")} onClick={this.props.toggleGroup.bind(this, this.props.group.id)} id={"button-group-" + this.props.group.groupName}>
          <div className="pull-left">
            <div className={"btn-checkbox" + (this.props.isSelected ? " checked" : "")}>
              {this.props.isSelected ? 
                <i className="fa fa-check" aria-hidden="true"></i>
              : null}
            </div>
          </div>
          <div className="pull-left">
            <div className="group-icon"></div>
            <div className="group-text">
              <div className="group-title" title={this.props.group.groupName}>{this.props.group.groupName}</div>
              <div className="group-subtitle">{Object.keys(this.props.group.devicesUUIDs).length} devices</div>
            </div>
          </div>
        </button>
      );
    }
  };

  GroupsListItem.contextTypes = {
    location: React.PropTypes.object,
  };

  return GroupsListItem;
});
