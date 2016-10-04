define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link;

  class DeviceListGroupItem extends React.Component {
    constructor(props) {
      super(props);
      this.expandGroup = this.expandGroup.bind(this);
      this.renameGroup = this.renameGroup.bind(this);
    }
    expandGroup(e) {
      e.preventDefault();
      if(e.target.className.indexOf('fa') === -1)
        this.props.expandGroup(this.props.name);      
    }
    renameGroup(e) {
      e.preventDefault();
      e.stopPropagation();
      this.props.openRenameGroupModal(this.props.name);
    }
    render() {
      return (
        <a href="#" className="group-box" id={"link-group-" + this.props.name} style={{width: this.props.width}} onClick={this.expandGroup}>
          <div className="group-icon"></div>
          <div className="group-desc">
            <div className="group-name">{this.props.name}</div>
          </div>
        
          <div className="dropdown device-menu-dropdown pull-right">
            <div data-toggle="dropdown">
              <i className="fa fa-chevron-down" aria-hidden="true"></i>
            </div>
            <ul className="dropdown-menu">
              <li onClick={this.renameGroup}>
                <img src="/assets/img/icons/edit_black.png" alt="" style={{width: '15px'}}/> Rename
              </li>
            </ul>
          </div>
        </a>
      );
    }
  };

  return DeviceListGroupItem;
});
