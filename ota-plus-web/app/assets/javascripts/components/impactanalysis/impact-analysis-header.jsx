define(function(require) {
  var React = require('react'),
      ReactI18next = require('reactI18next');
      
  class ImpactAnalysisHeader extends React.Component {
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
              <div className="grey-header-title">Impact analyser</div>
              <div className="grey-header-subtitle">
                {!_.isUndefined(this.props.deviceCount) && !_.isUndefined(this.props.groupCount) ? 
                  <span>Impact: {t('common.deviceWithCount', {count: this.props.deviceCount})} in {t('common.groupWithCount', {count: this.props.groupCount})}</span>
                :
                  <span><i className="fa fa-square-o fa-spin"></i> impact analysis</span>
                }
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return ReactI18next.translate()(ImpactAnalysisHeader);
});
