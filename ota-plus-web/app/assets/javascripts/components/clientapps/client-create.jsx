define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      _ = require('underscore'),
      db = require('stores/db'),
      serializeForm = require('../../mixins/serialize-form'),
      SotaDispatcher = require('sota-dispatcher'),
      Responses = require('../responses');

  class ClientCreate extends React.Component {
    constructor(props) {
      super(props);
      this.closeModal = this.closeModal.bind(this);      
    }
    handleSubmit(e) {
      e.preventDefault();
    }
    closeModal(e) {
      e.preventDefault();
      this.props.closeModal();
    }
    render() {
      return (
        <div id="modal-new-client" className="myModal" role="dialog">
          <div className="modal-dialog center-xy">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" onClick={this.props.closeModal}></button>
                <h4 className="modal-title">
                  <i className="fa fa-plus"></i> &nbsp;
                  Create new Client
                </h4>
              </div>
              <form ref='form' onSubmit={this.handleSubmit}>
                <div className="modal-body">
                  <Responses action="create-campaign" handledStatuses="error"/>
                  <div className="form-group">
                    <label htmlFor="campaignName">Name</label>
                    <input type="text" className="form-control" name="campaignName" ref="campaignName"/>
                  </div>
                </div>
                <div className="modal-footer">
                  <a href="#" onClick={this.closeModal} className="darkgrey margin-top-20 pull-left">close</a>
                  <button type="submit" className="btn btn-confirm pull-right">Confirm</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    }
  };

  ClientCreate.contextTypes = {
    strings: React.PropTypes.object.isRequired
  };

  return ClientCreate;
});
