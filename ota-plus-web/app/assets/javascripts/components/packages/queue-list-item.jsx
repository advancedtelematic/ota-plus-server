define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
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
        device: this.props.deviceId,
        updateid: this.props.package.requestId
      });
    }
    render() {
      var packageName = this.props.package.packageId.name;
      return (
        <li className={'list-group-item ' + this.props.status + ' queue-item-status-' + this.props.package.status}>
          <div className="width-100 pull-left">
            <div className="queue-item-name pull-left">
              {packageName}
            </div>
            {!_.isUndefined(this.props.package.status) && this.props.package.status == 'InFlight' ? 
              <div className="queue-inflight-box pull-right">
                in progress
              </div>
            :
              <span>
                <span className="drag-bar pull-right"><i className="fa fa-bars"></i></span>
                <button className="btn btn-action pull-right" onClick={this.cancelUpdate} id="button-cancel-update">{this.context.strings.cancel}</button>
                {this.props.status == 'error' ?
                  <button className="btn btn-action pull-right">retry</button>
                : null}
              </span>
            }
          
            <div className="pull-right list-group-item-text-right">
              {this.props.status == 'error' ?
                <span className="fa-stack package-status-icon">
                  <i className="fa fa-times-circle fa-stack-1x red" aria-hidden="true"></i>
                </span>
              : null}
              <strong>v. {this.props.package.packageId.version}</strong>
            </div>
          </div>
          
          <div className="width-100 pull-left lightgrey font-10">
            <div>
              Queued on: {new Date(this.props.package.createdAt).toDateString()} {new Date(this.props.package.createdAt).toLocaleTimeString()}
            </div>
            {!_.isUndefined(this.props.package.status) && this.props.package.status == 'InFlight' ? 
              <div className="margin-top-5">
                Installation started on: {new Date(this.props.package.updatedAt).toDateString()} {new Date(this.props.package.updatedAt).toLocaleTimeString()}
              </div>
            : undefined}
            <div className="margin-top-5">
              Update identifier: {this.props.package.requestId}
            </div>
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
