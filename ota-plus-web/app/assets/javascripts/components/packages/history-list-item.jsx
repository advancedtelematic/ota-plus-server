define(function(require) {
  var React = require('react'),
      ReactCSSTransitionGroup = React.addons.CSSTransitionGroup,
      HistoryListItemErrorlog = require('./history-list-item-errorlog'),
      HistoryListItemLog = require('./history-list-item-log'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group');

  class HistoryListItem extends React.Component {
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
      var completionTime = new Date(this.props.package.completionTime);
      return (
        <li className={'list-group-item grey ' + (this.state.showLog ? 'show-log' : '') }>
          {this.props.package.packageId.name}
          
          <button onClick={this.showLog} className="btn btn-action pull-right">log</button>
  
          <div className="list-group-item-text-right pull-right">
              <span className="fa-stack package-status-icon">
                <i className="fa fa-circle fa-stack-1x"></i>
                {this.props.package.success ? 
                  <i className="fa fa-check-circle fa-stack-1x green" aria-hidden="true"></i>
                :
                  <i className="fa fa-times-circle fa-stack-1x red" aria-hidden="true"></i>
                }
              </span>
            v. {this.props.package.packageId.version} {this.props.package.success ? 'installed successfully' : 'not installed'} on {completionTime.toDateString() + ' ' + completionTime.toLocaleTimeString()}
          </div>
  
          {!this.props.package.success ?
            <VelocityTransitionGroup enter={{animation: "fadeIn"}}>
              {this.state.showLog ? 
                <HistoryListItemErrorlog 
                  name={this.props.package.packageId.name}
                  completionTime={completionTime}
                  installationLog={this.props.installationLog}/>
              : null}
            </VelocityTransitionGroup>
          :
            <VelocityTransitionGroup enter={{animation: "fadeIn"}}>
              {this.state.showLog ? 
                <HistoryListItemLog 
                  name={this.props.package.packageId.name}
                  completionTime={completionTime}
                  installationLog={this.props.installationLog}/>
              : null}
            </VelocityTransitionGroup>      
          }
        </li>
      );
    }
  };

  return HistoryListItem;
});
