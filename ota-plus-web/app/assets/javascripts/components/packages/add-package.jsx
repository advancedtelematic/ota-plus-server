define(function(require) {
  var React = require('react'),
      serializeForm = require('../../mixins/serialize-form'),
      SotaDispatcher = require('sota-dispatcher');
  
  class AddPackage extends React.Component {
    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleSubmit(e) {
      e.preventDefault();
      var payload = serializeForm(this.refs.form);
      payload.id = {name: payload.name, version: payload.version};
      var data = new FormData();
      
      var file = this.props.files[0];
      if($('.file-upload')[0].files[0]) {
        file = $('.file-upload')[0].files[0];
      }
      
      data.append('file', file);
      SotaDispatcher.dispatch({
        actionType: 'create-package',
        package: payload,
        data: data
      });
      this.props.closeForm();
    }
    render() {
      return (
        <div id="modal-new-campaign" className="myModal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" onClick={this.props.closeForm}>&times;</button>
                <h4 className="modal-title">New package</h4>
              </div>
              <div className="modal-body">
                <form ref='form' onSubmit={this.handleSubmit} encType="multipart/form-data">
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
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <button type="submit" className="btn btn-grey pull-right">Add package</button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
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
