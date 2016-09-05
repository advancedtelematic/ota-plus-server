define(function(require) {
  var React = require('react'),
      SotaDispatcher = require('sota-dispatcher'),
      HistoryListItemErrorlog = require('es6!./history-list-item-errorlog'),
      HistoryListItemLog = require('es6!./history-list-item-log'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group');

  class HistoryListItem extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isLogShown: this.props.isLogShown
      }
      this.toggleLog = this.toggleLog.bind(this);
    }
    toggleLog() {
      this.setState({
        isLogShown: !this.state.isLogShown
      });
    }
    componentWillReceiveProps(nextProps) {
      if(nextProps.isLogShown && !this.props.isLogShown) {
        this.setState({
          isLogShown: true
        });
      }
    }
    render() {
      var packageName = this.props.package.packageId.name;
      var completionTime = new Date(this.props.package.completionTime);
      return (
        <li className={'list-group-item grey ' + (this.state.isLogShown ? 'show-log' : '') }>
          <div className="history-item-name pull-left">
            {packageName}
          </div>
          <button onClick={this.toggleLog} className="btn btn-action pull-right">log</button>
  
          <div className="list-group-item-text-right pull-right">
              <span className="fa-stack package-status-icon">
                <i className="fa fa-circle fa-stack-1x"></i>
                {this.props.package.success ? 
                  <i className="fa fa-check-circle fa-stack-1x green" aria-hidden="true"></i>
                :
                  <i className="fa fa-times-circle fa-stack-1x red" aria-hidden="true"></i>
                }
              </span>
            v. {this.props.package.packageId.version} {this.props.package.success ? 'installed' : 'not installed'}
          </div>
  
          {!this.props.package.success ?
            <VelocityTransitionGroup enter={{animation: "fadeIn"}}>
              {this.state.isLogShown ? 
                <HistoryListItemErrorlog 
                  name={this.props.package.packageId.name}
                  completionTime={completionTime}
                  installationLog={this.props.installationLog}/>
              : null}
            </VelocityTransitionGroup>
          :
            <VelocityTransitionGroup enter={{animation: "fadeIn"}}>
              {this.state.isLogShown ? 
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
