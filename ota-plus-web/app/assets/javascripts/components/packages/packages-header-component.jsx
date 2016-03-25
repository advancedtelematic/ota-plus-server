define(function(require) {
  var React = require('react'),
      AddPackageComponent = require('./add-package-component');

  var PackagesHeaderComponent = React.createClass({
    render: function() {
      return (
        <div className="row">
          <div className="col-md-6">
            <h1>
              Packages
            </h1>
          </div>
          <div className="col-md-6">
            <AddPackageComponent/>
          </div>
        </div>
      );
    }
  });

  return PackagesHeaderComponent;

});
