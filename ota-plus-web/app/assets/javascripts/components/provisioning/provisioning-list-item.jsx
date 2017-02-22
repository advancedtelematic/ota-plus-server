define(function(require) {
  var React = require('react'),
      moment = require('moment');

  class ProvisioningListItem extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      const { credential, width } = this.props;
      return (
        <a href={"/api/v1/provisioning/credentials/registration/" + credential.id} className="common-box" style={{width: width}}>
          <div className="common-box-actions">
            <ul>
              <li title="Rename key" data-toggle="provisioning-tooltip" data-placement="right">
                <img src="/assets/img/icons/edit_white.png" alt="" />
              </li>
            </ul>
          </div>
          <div className="common-box-icon"></div>
          <div className="common-box-desc">
            <div className="common-box-title">{credential.description}</div>
            <div className="common-box-subtitle">Valid until: {moment(credential.validUntil, "YYYY-MM-DD").format("DD/MM/YYYY")}</div>
          </div>
        </a>
      );
    }
  };

  ProvisioningListItem.PropTypes = {
    credential: React.PropTypes.object.isRequired,
    width: React.PropTypes.number.isRequired
  }

  return ProvisioningListItem;
});
