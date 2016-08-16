define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link;
      
  class GroupHeader extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div className="grey-header">      
          <div className="col-md-12">
            <Link to="/"><img src="/assets/img/icons/back.png" className="icon-back" alt=""/></Link>
            <div className="grey-header-icon"></div>
            <div className="grey-header-text">
              <div className="grey-header-title">{this.props.name}</div>
              <div className="grey-header-subtitle">
                {!_.isUndefined(this.props.devicesCount) ? 
                 <span>{this.props.devicesCount} devices in a group</span>
                :
                  <span><i className="fa fa-circle-o-notch fa-spin"></i> counting devices in a group</span>
                }
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return GroupHeader;
});
