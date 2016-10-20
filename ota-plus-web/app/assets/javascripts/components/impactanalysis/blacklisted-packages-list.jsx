define(function(require) {
  var React = require('react'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      Loader = require('es6!../loader'),
      BlacklistedPackagesListItem = require('es6!./blacklisted-packages-list-item');

  class BlacklistedPackagesList extends React.Component {
    constructor(props) {
      super(props);
      this.showImpactTooltip = this.showImpactTooltip.bind(this);
    }
    showImpactTooltip(e) {
      e.preventDefault();
      this.props.showImpactTooltip();
    }
    render() {
      var packages = undefined;
      var type = this.props.type;
      
      if(!_.isUndefined(this.props.packages)) {
        var packages = _.map(this.props.packages, function(pack, index) {
          return (
            <BlacklistedPackagesListItem 
              package={pack}
              key={pack.packageId.name + '-' + pack.packageId.version}/>
          );
        });
      }

      return (
        <div className={"col-md-12" + (_.isUndefined(packages) || _.isEmpty(packages) ? ' height-100' : '')}>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {!_.isUndefined(packages) ?
              !_.isUndefined(type) && type == "impacted" ?
                !_.isEmpty(packages) ?
                  <div>
                    <div className="impact-analysis-blacklisted-packages">
                      <div className="title pull-left">
                        with
                      </div>
                        {packages}
                    </div>
                    <hr className="full-line pull-left" />
                  </div>
                : null
              :
                !_.isEmpty(packages) ?
                  <div>
                    <div className="impact-analysis-blacklisted-packages">
                      <div className="title pull-left">
                        Blacklisted packages
                      </div>
                        {packages}
                    </div>
                    <hr className="full-line pull-left" />
                  </div>
                : 
                  <div className="height-100 position-relative text-center">
                    <div className="center-xy padding-15">
                      <div className="font-22">There are no blacklisted packages.</div>
                      <div className="margin-top-10">
                        <a href="#" className="font-22" onClick={this.showImpactTooltip}>
                          <span className="color-main"><strong>What is this?</strong></span>
                        </a>
                      </div>
                    </div>
                  </div>
            : undefined}
          </VelocityTransitionGroup>
        
          {_.isUndefined(packages) ? 
            <Loader />
          : undefined}
          
        </div>
      );
    }
  };

  return BlacklistedPackagesList;
});
