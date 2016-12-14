define(function(require) {
  var React = require('react'),
      SotaDispatcher = require('sota-dispatcher'),
      HistoryListItemLog = require('./history-list-item-log'),
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
      var time = new Date(this.props.package.completionTime);
      var status, iconClass;
      
      if(this.props.package.cancelled) {
        status = 'cancelled';
        iconClass = 'lightgrey';
      } else if(this.props.package.success) {
        status = 'installed';
        iconClass = 'green';
      } else {
        status = 'not installed';
        iconClass = 'red';
      }
      
      return (
        <li className={'list-group-item grey ' + (this.state.isLogShown ? 'show-log' : '') }>
          <div className="history-item-name pull-left">
            {packageName}
          </div>
          <button onClick={this.toggleLog} className="btn btn-action pull-right">log</button>
  
          <div className="list-group-item-text-right pull-right">
            <span className="history-item-status pull-right" title={status}>&nbsp;{status}</span>
            <div className="history-item-version pull-right" title={this.props.package.packageId.version}>{this.props.package.packageId.version}</div>
            <span className="pull-right">v.&nbsp;</span>
            <span className="pull-right">
              <span className="fa-stack package-status-icon">
                <i className="fa fa-circle fa-stack-1x"></i>
                <i className={"fa fa-check-circle fa-stack-1x " + iconClass} aria-hidden="true"></i>
              </span>
            </span>
          </div>
  
          <VelocityTransitionGroup enter={{animation: "fadeIn"}}>
            {this.state.isLogShown ? 
              <HistoryListItemLog 
                time={time}
                status={status}
                installationLog={this.props.installationLog}/>
            : null}
          </VelocityTransitionGroup>
        </li>
      );
    }
  };

  return HistoryListItem;
});
