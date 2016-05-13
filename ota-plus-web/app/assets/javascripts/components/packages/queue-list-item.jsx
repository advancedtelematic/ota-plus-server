define(function(require) {
  var React = require('react'),
      ReactCSSTransitionGroup = React.addons.CSSTransitionGroup,
      Router = require('react-router'),
      Link = Router.Link,
      QueueListItemErrorlog = require('./queue-list-item-errorlog'),
      QueueListItemLog = require('./queue-list-item-log');

  class QueueListItem extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        showLog: false
      }
      this.showLog = this.showLog.bind(this);
    }
    showLog() {
      this.setState({
        showLog: !this.state.showLog
      });
    }
    render() {
      return (
        <li className={'list-group-item ' + (this.state.showLog ? 'show-log ' : '') + this.props.status}>
          <span className="list-group-item-text-left">{this.props.package.packageId.name}</span>
          <span className="drag-bar pull-right"><i className="fa fa-bars"></i></span>
          <button className="btn btn-action pull-right">{this.context.strings.cancel}</button>
          <button className="btn btn-action pull-right" onClick={this.showLog}>{this.context.strings.log}</button>
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
  
          <ReactCSSTransitionGroup
            transitionAppear={true}
            transactionLeave={false}
            transitionAppearTimeout={500}
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}
            transitionName="example">
            {this.state.showLog ? 
              (this.props.status == 'error') ?
                <QueueListItemErrorlog name={this.props.package.name}/>
              :
                <QueueListItemLog name={this.props.package.name}/>
            : null}
          </ReactCSSTransitionGroup>
        </li>
      );
    }
  };

  QueueListItem.contextTypes = {
    strings: React.PropTypes.object.isRequired
  };

  return QueueListItem;
});
