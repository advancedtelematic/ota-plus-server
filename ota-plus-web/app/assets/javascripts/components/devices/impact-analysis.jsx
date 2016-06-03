define(function(require) {
  var React = require('react'),
      ReactCSSTransitionGroup = React.addons.CSSTransitionGroup,
      _ = require('underscore'),
      serializeForm = require('../../mixins/serialize-form'),
      BootstrapDatetimepicker = require('bootstrap-datetimepicker'),
      SotaDispatcher = require('sota-dispatcher'),
      ImpactListItem = require('./impact-list-item');
    
  class ImpactAnalysis extends React.Component {
    constructor(props) {
      super(props);
      
      this.updateProgress = this.updateProgress.bind(this);
      
      this.state = {
        progress: 0,
        progressIntervalId: null,
        timeoutId: null,
        devicesCount: '5.334.253',
      };
    }
    componentDidMount() {
      var id = setInterval(this.updateProgress, 350);
      this.setState({
        progressIntervalId: id
      });
    }
    updateProgress() {
      var currentProgress = this.state.progress;
      var newProgress = Math.min(currentProgress + 3, 100);
            
      if(newProgress < 100) {
        this.setState({
          progress: newProgress
        });
      } else if(newProgress == 100 && currentProgress != newProgress) {
        var that = this;
        clearInterval(this.state.progressIntervalId);
        
        var timeoutId = setTimeout(function(){
          that.setState({
           progress: newProgress
          });
        }, 400);
        
        this.setState({
          timeoutId: timeoutId
        });
      }
    }
    componentWillUnmount() {
      clearInterval(this.state.progressIntervalId);
      clearTimeout(this.state.timeoutId);
    }
    render() {
      return (
        <div className="row">
          <div className="col-md-12">
            {this.state.progress != 100 ?
              <div className="row">
                <div className="col-md-7">
                  Impacted devices for {this.props.params.count} package(s): &nbsp; counting ...
                </div>
                <div className="col-md-3">
                  <div className="progress">
                    <div className="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style={{width: this.state.progress + '%'}}></div>
                  </div>
                </div>
              </div>
            :
              <div>
                Impacted devices for {this.props.params.count} package(s):  {this.state.devicesCount} devices
              </div>
            }
          </div>
            
          <div className="col-md-12">
            <div className="fullsize-overflow-hidden">
              <div className="form-subtitle">
                Associated test device(s)
              </div>
            </div>
          </div>
  
          <div className="col-md-12">
            <div className="impacted-devices">
              <ReactCSSTransitionGroup
                transitionAppear={true}
                transactionLeave={false}
                transitionAppearTimeout={500}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}
                transitionName="example">
              {this.state.progress > 30 ?
                <ImpactListItem key={localStorage.getItem('firstProductionTestDevice')} vin={localStorage.getItem('firstProductionTestDevice')} number="1.549.482"/>
              : null}
              {this.state.progress > 50 ?
                <ImpactListItem key={localStorage.getItem('secondProductionTestDevice')} vin={localStorage.getItem('secondProductionTestDevice')} number="2.435.932"/>
              : null}
              {this.state.progress > 80 ?
                <ImpactListItem key={localStorage.getItem('thirdProductionTestDevice')} vin={localStorage.getItem('thirdProductionTestDevice')} number="1.348.839"/>
              : null}
              </ReactCSSTransitionGroup>
            </div>
          </div>
  
          <div className="col-md-12">
            <div className="form-group text-center">
              <button type="submit" className="btn btn-black-big" disabled={this.state.progress != 100 ? true : false}>Create project</button>
            </div>
          </div>
  
        </div>
      );
    }
  };

  ImpactAnalysis.contextTypes = {
    history: React.PropTypes.object.isRequired,
    strings: React.PropTypes.object.isRequired,
  };

  return ImpactAnalysis;
});
