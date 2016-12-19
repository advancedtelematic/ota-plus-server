define(function(require) {
  var React = require('react'),
      ReactI18next = require('reactI18next');
            
  class CampaignsHeader extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      const { t } = this.props;
      return (
        <div className="grey-header">      
          <div className="col-md-12">
            <div className="grey-header-icon"></div>
            <div className="grey-header-text">
              <div className="grey-header-title">Campaigns</div>
              <div className="grey-header-subtitle">
                {!_.isUndefined(this.props.campaignCount) && !_.isUndefined(this.props.campaignCount) ? 
                  <span>{t('common.campaignWithCount', {count: this.props.campaignCount})}</span>
                :
                  <span><i className="fa fa-square-o fa-spin"></i> campaign counting</span>
                }
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return ReactI18next.translate()(CampaignsHeader)
});
