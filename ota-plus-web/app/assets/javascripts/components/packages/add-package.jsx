define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      serializeForm = require('../../mixins/serialize-form'),
      SotaDispatcher = require('sota-dispatcher'),
      Responses = require('../responses'),
      ProgressBar = require('../progress-bar');
  
  class AddPackage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        showProgressBar: false,
        isButtonDisabled: false,
      };
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleResponse = this.handleResponse.bind(this);
      this.closeForm = this.closeForm.bind(this);
      
      db.postStatus.addWatch("poll-response-add-package", _.bind(this.handleResponse, this, null));
    }
    componentWillUnmount() {
      db.postProgress.removeWatch("poll-progress");
      db.postStatus.removeWatch("poll-response-add-package");
    }
    handleSubmit(e) {
      e.preventDefault();
    
      if(!this.state.isButtonDisabled) {
        var payload = serializeForm(this.refs.form);
        payload.id = {name: payload.name, version: payload.version};
        var data = new FormData();
      
        var file = this.props.files && !_.isUndefined(this.props.files[0]) ? this.props.files[0] : undefined;
        if(!_.isUndefined($('.file-upload')[0]) && !_.isUndefined($('.file-upload')[0].files) && !_.isUndefined($('.file-upload')[0].files[0])) {
          file = $('.file-upload')[0].files[0];
        }

        data.append('file', file);
        SotaDispatcher.dispatch({
          actionType: 'create-package',
          package: payload,
          data: data
        });
        
        this.setState({isButtonDisabled: true});
      }
    }
    handleResponse() {
      var payload = serializeForm(this.refs.form);
      var postStatus = db.postStatus.deref()['create-package'];
      
      if(!_.isUndefined(postStatus)) {
        if(postStatus.status === 'success') {
          db.postStatus.removeWatch("poll-response-add-package");
          this.props.focusPackage(payload.name);
          this.props.closeForm();
        } else {
          this.setState({isButtonDisabled: false});
        }
      }
    }
    closeForm(e) {
      e.preventDefault();
      db.postResetProgress.reset(true);
      this.props.closeForm();
    }
    render() {    
      return (
        <div id="modal-add-package" className="myModal">
          <div className="modal-dialog">
            <div className="modal-content">
              <form ref='form' onSubmit={this.handleSubmit} encType="multipart/form-data">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" onClick={this.props.closeForm}></button>
                <h4 className="modal-title">New package</h4>
                </div>
                <div className="modal-body">
                  <Responses action="create-package" handledStatuses="error"/>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="name">Package Name</label>
                        <input type="text" className="form-control" name="name" ref="name" placeholder="Package Name"/>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="version">Version</label>
                        <input type="text" className="form-control" name="version" ref="version" placeholder="1.0.0"/>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <input type="text" className="form-control" name="description" ref="description" placeholder="Description text"/>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="vendor">Vendor</label>
                        <input type="text" className="form-control" name="vendor" ref="vendor" placeholder="Vendor name"/>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="binary">Package Binary</label>
                        {this.props.files && this.props.files.length > 0 ? 
                          <div> {this.props.files.map((file) => <div key={file.name}>{file.name} </div> )} </div> 
                        : 
                          <input type="file" className="file-upload" name="file" />
                        }
                      </div>
                      <ProgressBar action="create-package"/>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <a href="#" onClick={this.closeForm} className="darkgrey margin-top-20 pull-left">close</a>
                  <button type="submit" className="btn btn-confirm pull-right" disabled={this.state.isButtonDisabled}>Create package</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    }
  };

  AddPackage.contextTypes = {
    history: React.PropTypes.object.isRequired,
    strings: React.PropTypes.object.isRequired,
  };

  return AddPackage;
});
