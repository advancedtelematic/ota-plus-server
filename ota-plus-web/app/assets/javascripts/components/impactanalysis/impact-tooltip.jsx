define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      _ = require('underscore');

  class ImpactTooltip extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div id="impact-tooltip" className="myModal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body font-14">
                <div className="text-center">
                  With ATS Garage, you can <strong>blacklist</strong> problem packages, ensuring they <br />won't get install on any of your devices.
                </div>
                <div className="text-center margin-top-20">
                  On the <strong>Impact analysis tab</strong>, you can view which of your devices already <br /> 
                  have the blacklisted version of the package installed, letting you <br />
                  proactively troubleshoot and update those devices to a fixed version, <br />
                  or roll them back to an older version.
                </div>
                <div className="margin-top-20">
                  <img src="/assets/img/impact_tooltip.jpg" alt="" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-confirm pull-right" onClick={this.props.hideImpactTooltip}>Got it</button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return ImpactTooltip;
});
