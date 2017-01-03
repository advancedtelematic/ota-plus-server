define(function(require) {
  var React = require('react'),
      ReactI18next = require('reactI18next'),
      ReactDOM = require('react-dom');

  class GroupsListItem extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isMouseOverActions: false,
      };
      this.selectGroup = this.selectGroup.bind(this);
      this.actionsMouseEnter = this.actionsMouseEnter.bind(this);
      this.actionsMouseLeave = this.actionsMouseLeave.bind(this);
    }
    selectGroup(e) {
      e.preventDefault();
      var className = e.target.className;
      var tagName = e.target.tagName.toLowerCase();
      if(className.indexOf('fa') === -1 && tagName !== 'li' && tagName !== 'span' && tagName !== 'img')
        this.props.selectGroup({name: this.props.group.groupName, type: 'real', uuid: this.props.group.id});
    }
    actionsMouseEnter() {
      this.setState({
        isMouseOverActions: true
      });
    }
    actionsMouseLeave() {
      this.setState({
        isMouseOverActions: false
      });
    }
    render() {
      const { t } = this.props;
      return (
        <div className={"list-group-item " + this.props.groupClassName + (this.props.isSelected ? " checked" : "") + (this.state.isMouseOverActions ? " actions-active" : "")} onClick={this.selectGroup} id={"button-group-" + this.props.group.groupName}>
          <div className="group-actions" onMouseEnter={this.actionsMouseEnter} onMouseLeave={this.actionsMouseLeave}>
            <ul>
              <li onClick={this.props.renameGroup.bind(this, this.props.group)} title="Rename group">
                <img src="/assets/img/icons/edit_white.png" alt="" />
                <div>Rename</div>
              </li>
            </ul>
          </div>
          <div className="group-icon"></div>
          <div className="group-text">
            <div className="group-title" title={this.props.group.groupName}>{this.props.group.groupName}</div>
            <div className="group-subtitle">{t('common.deviceWithCount', {count: Object.keys(this.props.group.devicesFilteredUUIDs).length})}</div>
          </div>
          {this.props.isSelected ? 
            <div className="group-pointer">
              <i className="fa fa-angle-right fa-3x"></i>
            </div>
          : null}
        </div>
      );
    }
  };

  GroupsListItem.contextTypes = {
    location: React.PropTypes.object,
  };

  return ReactI18next.translate()(GroupsListItem);
});
