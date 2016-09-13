define(function(require) {
  var React = require('react'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      Loader = require('es6!../loader'),
      BlacklistedPackagesListItem = require('es6!./blacklisted-packages-list-item');

  class BlacklistedPackagesList extends React.Component {
    constructor(props) {
      super(props);
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
        <div className="col-md-12">
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
                  <div>
                    There are no blacklisted packages
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
