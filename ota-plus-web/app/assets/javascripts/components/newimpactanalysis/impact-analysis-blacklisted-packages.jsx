define(function(require) {
  var React = require('react'),
      ReactDOM = require('react-dom'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      ImpactAnalysisBlacklistedPackagesVersions = require('es6!./impact-analysis-blacklisted-packages-versions');
      
  class ImpactAnalysisBlacklistedPackages extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        blacklistedPackagesData: [
          {
            packageName: 'nano1',
            devicesCount: '20.000',
            groupsCount: '15',
            versions: [
              {
                version: '1.0.0',
                devicesCount: '10.000',
                groupsCount: '10'
              },
              {
                version: '1.0.1',
                devicesCount: '10.000',
                groupsCount: '10'
              }
            ]
          },
          {
            packageName: 'nano2',
            devicesCount: '20.000',
            groupsCount: '15',
            versions: [
              {
                version: '1.0.0',
                devicesCount: '10.000',
                groupsCount: '10'
              },
              {
                version: '1.0.1',
                devicesCount: '10.000',
                groupsCount: '10'
              }
            ]
          }
        ],
        headerTopPosition: 0,
        expandedPackage: null
      };
      this.packagesListScroll = this.packagesListScroll.bind(this);
      this.togglePackage = this.togglePackage.bind(this);
    }
    componentDidMount() {
      ReactDOM.findDOMNode(this.refs.packagesList).addEventListener('scroll', this.packagesListScroll);
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
      var packages = _.map(this.state.blacklistedPackagesData, function(pack) {
        return (
          <li key={"blacklisted-package-" + pack.packageName} className={this.state.expandedPackage == pack.packageName ? 'selected' : null}>
            <button className="list-group-item" onClick={this.togglePackage.bind(this, pack.packageName)}>
              <div className="column column-first">
                {pack.packageName}
              </div>
              <div className="column column-second">
                {pack.devicesCount}
              </div>
              <div className="column column-third">
                {pack.groupsCount}
              </div>
            </button>
            <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
              {this.state.expandedPackage == pack.packageName ?
                <ImpactAnalysisBlacklistedPackagesVersions
                  key={'blacklisted-package-' + pack.packageName + '-versions'}
                  versions={pack.versions}/>
              : null}
            </VelocityTransitionGroup>
          </li>
        );
      }, this);
            
      return (
        <div id="blacklisted-packages" style={{height: this.props.blacklistedPackagesListHeight}} ref="packagesList">     
          <div className="list-header" style={{top: this.state.headerTopPosition}}>
            <div className="column column-first">Package</div>
            <div className="column column-second">Devices</div>
            <div className="column column-third">Groups</div>
          </div>
          <ul>
            {packages}
          </ul>
        </div>
      );
    }
  };

  return ImpactAnalysisBlacklistedPackages;
});
