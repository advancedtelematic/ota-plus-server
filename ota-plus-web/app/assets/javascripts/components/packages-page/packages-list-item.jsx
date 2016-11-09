define(function(require) {
  var React = require('react'),
      ReactDOM = require('react-dom');

  class PackagesListItem extends React.Component {
    constructor(props) {
      super(props);
      this.itemClick = this.itemClick.bind(this);
      this.showStatus = this.showStatus.bind(this);
    }
    itemClick(e) {
      if(e.target.tagName.toLowerCase() !== 'a') {
        this.props.expandPackage(this.props.name);
      }
    }
    showStatus(e) {
      e.preventDefault();
      this.props.showPackageStatusForm(this.props.name);
    }
    render() {
      return (
        <button type="button" className="list-group-item" onClick={this.itemClick} id={"button-package-" + this.props.name}>
          <div className="pull-left">
            <span className="package-name">{this.props.name}</span>
          </div>
          {this.props.selected ?
            <label className="label label-mint packagel-status-label">
              <a href="#" onClick={this.showStatus}>Status</a>
            </label>
          : null}
        </button>
      );
    }
  };

  PackagesListItem.contextTypes = {
    location: React.PropTypes.object,
  };

  return PackagesListItem;
});
