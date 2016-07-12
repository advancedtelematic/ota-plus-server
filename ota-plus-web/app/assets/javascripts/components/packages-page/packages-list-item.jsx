define(function(require) {
  var React = require('react'),
      ReactDOM = require('react-dom');

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
            <span className="package-name">{this.props.name}</span>
          </div>
        </button>
      );
    }
  };

  PackagesListItem.contextTypes = {
    location: React.PropTypes.object,
  };

  return PackagesListItem;
});
