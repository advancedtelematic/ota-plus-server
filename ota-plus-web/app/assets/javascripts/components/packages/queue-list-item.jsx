define(function(require) {
  var React = require('react'),
      SotaDispatcher = require('sota-dispatcher'),
      ReactCSSTransitionGroup = React.addons.CSSTransitionGroup,
      Router = require('react-router'),
      Link = Router.Link;

  class QueueListItem extends React.Component {
    constructor(props) {
      super(props);
      this.cancelUpdate = this.cancelUpdate.bind(this);
    }
    cancelUpdate() {
      SotaDispatcher.dispatch({
        actionType: 'cancel-update',
        vin: this.props.vin,
        updateid: this.props.package.requestId
      });
    }
    render() {
      return (
        <li className={'list-group-item ' + this.props.status}>
          <span className="list-group-item-text-left">{this.props.package.packageId.name}</span>
          <span className="drag-bar pull-right"><i className="fa fa-bars"></i></span>
          <button className="btn btn-action pull-right" onClick={this.cancelUpdate}>{this.context.strings.cancel}</button>
          {this.props.status == 'error' ? 
            <button className="btn btn-action pull-right">retry</button>
          : null}
          <div className="pull-right list-group-item-text-right">
            {this.props.status == 'error' ? 
              <span className="fa-stack package-status-icon">
                <i className="fa fa-times-circle fa-stack-1x red" aria-hidden="true"></i>
              </span>
            : null}
            <strong>v. {this.props.package.packageId.version}</strong>
          </div>
        </li>
      );
    }
  };

  QueueListItem.contextTypes = {
    strings: React.PropTypes.object.isRequired,
  };

  return QueueListItem;
});
