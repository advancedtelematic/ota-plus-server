define(function(require) {
  var React = require('react'),
      ReactDOM = require('react-dom'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      ImpactAnalysisBlacklistedPackagesVersions = require('./impact-analysis-blacklisted-packages-versions');
      
  class ImpactAnalysisBlacklistedPackages extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        blacklistedPackagesWrapperHeight: this.props.contentHeight,
        headerTopPosition: 0,
        expandedPackage: null
      };
      this.packagesListScroll = this.packagesListScroll.bind(this);
      this.togglePackage = this.togglePackage.bind(this);
    }
    componentDidMount() {
      ReactDOM.findDOMNode(this.refs.packagesList).addEventListener('scroll', this.packagesListScroll);
      this.setState({blacklistedPackagesWrapperHeight: this.props.contentHeight - jQuery('.panel-heading').height()});
    }
    componentWillReceiveProps(nextProps) {
      if(nextProps.contentHeight !== this.props.contentHeight)
        this.setState({blacklistedPackagesWrapperHeight: nextProps.contentHeight - jQuery('.panel-heading').height()});
    }
    componentWillUnmount() {
      ReactDOM.findDOMNode(this.refs.packagesList).removeEventListener('scroll', this.packagesListScroll);
    }
    packagesListScroll() {
      this.setState({
        headerTopPosition: this.refs.packagesList.scrollTop
      });
    }
    togglePackage(name) {
      var expandedPackage = this.state.expandedPackage;
      this.setState({
        expandedPackage: this.state.expandedPackage != name ? name : null
      });
    }
    render() {
      var packages = _.map(this.props.packages, function(pack) {
        return (
          <li key={"blacklisted-package-" + pack.packageName} className={this.state.expandedPackage == pack.packageName ? 'selected' : null}>
            <button className="list-group-item" onClick={this.togglePackage.bind(this, pack.packageName)}>
              <div className="column column-first">
                {pack.packageName}
              </div>
              <div className="column column-second">
                {pack.deviceCount}
              </div>
              <div className="column column-third">
                {Object.keys(pack.groupIds).length}
              </div>
            </button>
            <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
              {this.state.expandedPackage == pack.packageName ?
                <ImpactAnalysisBlacklistedPackagesVersions
                  key={'blacklisted-package-' + pack.packageName + '-versions'}
                  versions={pack.elements}/>
              : null}
            </VelocityTransitionGroup>
          </li>
        );
      }, this);
            
      return (
        <div id="packages-column" style={{height: this.state.blacklistedPackagesWrapperHeight}}>
          <div id="blacklisted-packages" className="height-100" ref="packagesList">     
            <div className="list-header" style={{top: this.state.headerTopPosition}}>
              <div className="column column-first">Package</div>
              <div className="column column-second">Devices</div>
              <div className="column column-third">Groups</div>
            </div>
            <ul>
              {packages}
            </ul>
          </div>
        </div>
      );
    }
  };

  return ImpactAnalysisBlacklistedPackages;
});
