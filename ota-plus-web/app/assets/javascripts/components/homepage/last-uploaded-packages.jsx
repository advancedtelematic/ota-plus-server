define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      Loader = require('es6!../loader');

  class LastUploadedPackages extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        packagesData: undefined
      };
      this.setPackagesData = this.setPackagesData.bind(this);
      SotaDispatcher.dispatch({actionType: 'get-packages'});
      db.packages.addWatch("homepage-packages", _.bind(this.setPackagesData, this, null));
    }
    componentWillUnmount() {
      db.packages.removeWatch("homepage-packages");
      db.packages.reset();
    }
    setPackagesData() {
      var packages = db.packages.deref();
      if(!_.isUndefined(packages)) {
        packages = _.sortBy(packages, function(pack) {
          return pack.createdAt;
        }).reverse();
        this.setState({
          packagesData: packages.slice(0, 10)
        });
      }
    }
    render() {
      var packages = [];
      if(!_.isUndefined(this.state.packagesData)) {
        packages = _.map(this.state.packagesData, function(pack) {
          var link = 'packages/' + pack.id.name;
          return (
            <Link 
              to={`${link}`} 
              className="element-box" 
              title={pack.id.name + ' v. ' + pack.id.version}
              id={"link-packages-" + pack.uuid} 
              key={"link-packages-" + pack.uuid}>
              <div className="element-icon"></div>
              <div className="element-desc">
                <div className="element-title">{pack.id.name}</div>
                <div className="element-subtitle">
                  {pack.id.version}
                </div>
              </div>
            </Link>
          );
        }, this);
      }
      return (
        <div style={{height: this.props.listHeight}}>
          {!_.isUndefined(this.state.packagesData) ?
            this.state.packagesData.length ?
              packages
            :
              <div className="col-md-12 height-100 position-relative text-center">
                <div className="center-xy padding-15">
                  <button type="submit" className="btn btn-confirm btn-small" onClick={this.props.openNewPackageModal}><i className="fa fa-plus"></i> ADD NEW PACKAGE</button>
                </div>
              </div>
          : undefined}
          {_.isUndefined(this.state.packagesData) ?
            <Loader className="center-xy"/>
          : undefined}
        </div>
      );
    }
  }
  
  LastUploadedPackages.propTypes = {
    listHeight: React.PropTypes.number.isRequired,
  };
  
  return LastUploadedPackages;
});
