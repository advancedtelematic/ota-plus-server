define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      db = require('stores/db');
      
  class ClientAppsHeader extends React.Component {
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
              <div className="grey-header-title">Client applications</div>
            </div>
    
            <button onClick={this.props.openCreateModal} className="btn btn-main btn-add pull-right" id="button-add-new-client">
              <i className="fa fa-plus"></i> &nbsp; Add new client
            </button>
          </div>
        </div>
      );
    }
  };

  return ClientAppsHeader;
});
