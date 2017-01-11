define(function(require) {
  var React = require('react'),
      ReactI18next = require('reactI18next'),
      Router = require('react-router'),
      Link = Router.Link,
      db = require('stores/db');
      
  class CampaignHeader extends React.Component {
    constructor(props) {
      super(props);
    }
    goBack(e) {
      e.preventDefault();
      this.context.router.goBack();
    }
    render() {
      const { t } = this.props;
      return (
        <div className="col-md-12">
          <a href="#" onClick={this.goBack.bind(this)}><img src="/assets/img/icons/back.png" className="icon-back" alt=""/></a>
          <div className="grey-header-icon"></div>
          <div className="grey-header-text">
            <div className="grey-header-title">Campaign {this.props.name}</div>
            <div className="grey-header-subtitle">
              {t('common.deviceWithCount', {count: this.props.devicesCount})}
            </div>
          </div>
        </div>
      );
    }
  };
  
  CampaignHeader.contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  return ReactI18next.translate()(CampaignHeader);
});
