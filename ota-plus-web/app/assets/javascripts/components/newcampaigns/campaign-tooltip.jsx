define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link;

  class CampaignTooltip extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div id="campaign-tooltip" className="myModal">
          <div className="modal-dialog center-xy">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Update campaigns</h4>
              </div>
              <div className="modal-body font-14">
                <div className="text-center margin-top-20">
                  You can install a package on an individual device from the device screen. <br />
                  But when you want to push an update out to multiple devices at the same time, <br />
                  whether it's 5 devices in the lab or 50,000 devices in the field, you'll <br />
                  want to create <strong>update campaigns</strong>. An update campaign delivers one or more packages <br />
                  to a specified group of updates. It also lets you track the progress of the campaign, <br />
                  seeing how many of your devices successfully updated.<br /><br />
                  
                  To create a campaign, you'll need to have at least one <Link to="/packages" className="black"><i className="fa fa-external-link" aria-hidden="true"></i> package</Link>, and at least one <Link to="/devices"  className="black"><i className="fa fa-external-link" aria-hidden="true"></i> group</Link>.
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-confirm pull-right" onClick={this.props.hideCampaignTooltip}>Got it</button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return CampaignTooltip;
});
