define(function(require) {
  var React = require('react'),
      ReactI18next = require('reactI18next');
            
  class PackagesHeader extends React.Component {
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
              <div className="grey-header-title">Packages</div>
              <div className="grey-header-subtitle">
                {!_.isUndefined(this.props.packageCount) ? 
                  <span>{t('common.packageWithCount', {count: this.props.packageCount})}</span>
                :
                  <span><i className="fa fa-square-o fa-spin"></i> package counting</span>
                }
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return ReactI18next.translate()(PackagesHeader)
});
