define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link;

  class PackageTooltip extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div id="package-tooltip" className="myModal">
          <div className="modal-dialog center-xy">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Packages</h4>
              </div>
              <div className="modal-body font-14">
                <div className="text-center margin-top-20">
                  <strong>Packages</strong> are how ATS Garage represents software updates. A package might be <br />
                  a traditional linux package like a .deb or .rpm, a custom file format passed off to a <br />
                  processing script on your device, a simple metadata file informing a target device <br />
                  what it should do, or even a complete filesystem image. <br /><br />
                  
                  The easiest way to get started is to use deb or rpm packages. <br />
                  However, the most powerful features of ATS Garage require a bit more setup. If you want to <br />
                  use custom update handlers or do incremental full-filesystem updates, we've got you covered.
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-confirm pull-right" onClick={this.props.hidePackageTooltip}>Got it</button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return PackageTooltip;
});
