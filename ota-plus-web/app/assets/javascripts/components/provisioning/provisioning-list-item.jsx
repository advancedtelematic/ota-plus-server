define(function(require) {
  var React = require('react');

  class ProvisioningListItem extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div className="common-box" style={{width: this.props.width}}>
          <div className="common-box-actions">
            <ul>
              <li title="Rename key" data-toggle="provisioning-tooltip" data-placement="right">
                <img src="/assets/img/icons/edit_white.png" alt="" />
              </li>
            </ul>
          </div>
          <div className="common-box-icon"></div>
          <div className="common-box-desc">
            <div className="common-box-title">Key 01</div>
            <div className="common-box-subtitle">Valid until: 13.04.16</div>
          </div>
        </div>
      );
    }
  };

  return ProvisioningListItem;
});
