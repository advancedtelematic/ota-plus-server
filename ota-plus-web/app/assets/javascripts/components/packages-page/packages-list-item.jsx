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
      this.props.expandPackage(this.props.name);
    }
    showStatus(e) {
      e.preventDefault();
      this.props.showPackageStatusForm(this.props.name);
    }
    render() {
      return (
        <div className="list-group-item-wrapper">
          <button type="button" className="list-group-item" onClick={this.itemClick} id={"button-package-" + this.props.name}>
            <div className="pull-left">
              <span className="package-name">{this.props.name}</span>
            </div>
          </button>
          {this.props.selected ?
            <label className="label label-mint package-stats-button-label">
              <a href="#" onClick={this.showStatus} id={"package-stats-button-" + this.props.name}>Status</a>
            </label>
          : null}
        </div>
      );
    }
  };

  PackagesListItem.contextTypes = {
    location: React.PropTypes.object,
  };

  return PackagesListItem;
});
