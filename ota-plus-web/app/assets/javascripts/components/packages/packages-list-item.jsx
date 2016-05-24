define(function(require) {
  var React = require('react');

  class PackagesListItem extends React.Component {
    constructor(props) {
      super(props);
      this.itemClick = this.itemClick.bind(this);
    }
    itemClick(e) {
      this.props.expandPackage(this.props.name);
    }
    render() {
      return (
        <button type="button" className="list-group-item" onClick={this.itemClick}>
          <div className="pull-left">
            {this.props.name}
          </div>
          <div className="pull-right">
            {this.props.installedPackage ? 
              <span className="package-label package-label-installed pull-right">
                v. {this.props.installedPackage} installed        
                <span className="fa-stack package-status-corner">
                  <i className="fa fa-circle fa-stack-1x"></i>
                  <i className="fa fa-check-circle fa-stack-1x green" aria-hidden="true"></i>
                </span>
              </span>
            : 
              <span className="package-label package-label-uninstalled pull-right">
                Uninstalled        
              </span>
            }
          </div>
          <div className="pull-right">
            {this.props.queuedPackage ? 
              <div className="package-label-queued">
                <i className="fa fa-circle package-circle orange" aria-hidden="true"></i> v. {this.props.queuedPackage} queued
              </div>
            : null }
          </div>
        </button>
      );
    }
  };

  return PackagesListItem;
});
