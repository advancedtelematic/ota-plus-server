define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      db = require('stores/db');
      
  class CampaignHeader extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div className="col-md-12">
          <Link to="/"><img src="/assets/img/icons/back.png" className="icon-back" alt=""/></Link>
          <div className="grey-header-icon"></div>
          <div className="grey-header-text">
            <div className="grey-header-title">Campaign {this.props.name}</div>
            <div className="grey-header-subtitle">
              {this.props.devicesCount} devices
            </div>
          </div>
        </div>
      );
    }
  };

  return CampaignHeader;
});
