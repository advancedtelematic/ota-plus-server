define(function(require) {
  var React = require('react'),
      ReactDOM = require('react-dom');

  class GroupsListItem extends React.Component {
    constructor(props) {
      super(props);
      this.toggleGroup = this.toggleGroup.bind(this);
    }
    toggleGroup(e) {
      this.props.toggleGroup(this.props.group.groupName);
    }
    render() {
      return (
        <button type="button" className={"list-group-item" + (this.props.isChosen ? " checked" : "")} onClick={this.toggleGroup} id={"button-group-" + this.props.group.groupName}>
          <div className="pull-left">
            <div className={"btn-checkbox" + (this.props.isChosen ? " checked" : "")}>
              {this.props.isChosen ? 
                <i className="fa fa-check" aria-hidden="true"></i>
              : null}
            </div>
          </div>
          <div className="pull-left">
            <div className="group-icon"></div>
            <div className="group-text">
              <div className="group-title">{this.props.group.groupName}</div>
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
