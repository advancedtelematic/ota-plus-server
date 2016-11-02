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
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleResponse = this.handleResponse.bind(this);
      this.closeModal = this.closeModal.bind(this);
      db.postStatus.addWatch("poll-response-create-new-client", _.bind(this.handleResponse, this, null));
    }
    componentWillUnmount() {
      db.postStatus.removeWatch("poll-response-create-new-client");
    }
    handleSubmit(e) {
      e.preventDefault();
      SotaDispatcher.dispatch({
        actionType: 'create-client',
        data: {client_name: this.refs.clientName.value}
      });
    }
    handleResponse() {        
      var postStatus = !_.isUndefined(db.postStatus.deref()) ? db.postStatus.deref() : undefined;
      if(!_.isUndefined(postStatus['create-client'])) {
        if(postStatus['create-client'].status === 'success') {
          db.postStatus.removeWatch("poll-response-create-new-client");
          delete postStatus['create-client'];
          db.postStatus.reset(postStatus);
          this.props.closeModal(true);
        }
      }
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
                  <Responses action="create-client" handledStatuses="error"/>
                  <div className="form-group">
                    <label htmlFor="clientName">Name</label>
                    <input type="text" className="form-control" name="clientName" ref="clientName"/>
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
