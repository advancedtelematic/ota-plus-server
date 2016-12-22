define(function(require) {
  var React = require('react'),
      ReactI18next = require('reactI18next'),
      ReactDOM = require('react-dom');

  class GroupsListItem extends React.Component {
    constructor(props) {
      super(props);
      this.selectGroup = this.selectGroup.bind(this);
    }
    selectGroup(e) {
      e.preventDefault();
      if(e.target.className.indexOf('fa') === -1 && e.target.tagName.toLowerCase() !== 'li' && e.target.tagName.toLowerCase() !== 'span')
        this.props.selectGroup({name: this.props.group.groupName, type: 'real', uuid: this.props.group.id});
    }
    render() {
      const { t } = this.props;
      return (
        <button type="button" className={"list-group-item " + this.props.groupClassName + (this.props.isSelected ? " checked" : "")} onClick={this.selectGroup} id={"button-group-" + this.props.group.groupName}>
          <div className="group-actions">
            <ul>
              <li onClick={this.props.renameGroup.bind(this, this.props.group)} title="Rename group">
                <img src="/assets/img/icons/edit_white.png" alt="" />
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
        </button>
      );
    }
  };

  GroupsListItem.contextTypes = {
    location: React.PropTypes.object,
  };

  return ReactI18next.translate()(GroupsListItem);
});
