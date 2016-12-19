define(function(require) {
  var React = require('react'),
      ReactI18next = require('reactI18next'),
      Router = require('react-router'),
      Link = Router.Link,
      db = require('stores/db');
      
  class DevicesPageHeader extends React.Component {
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
              <div className="grey-header-title">Devices</div>
              <div className="grey-header-subtitle">
                {!_.isUndefined(this.props.deviceCount) ? 
                  <span>{t('common.deviceWithCount', {count: this.props.deviceCount})}</span>
                :
                  <span><i className="fa fa-square-o fa-spin"></i> devices counting</span>
                }
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return ReactI18next.translate()(DevicesPageHeader);
});
