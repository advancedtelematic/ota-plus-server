define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      SearchBar = require('es6!../searchbar');

  class Status extends React.Component {
    constructor(props, context) {
      super(props, context);
    }
    render() {
      return (
        <div id="modal-package-status" className="myModal">
          <div className="modal-dialog center-xy">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" onClick={this.props.closeForm}></button>
                <h4 className="modal-title">Status</h4>
              </div>
              <div className="modal-body">
               
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  Status.contextTypes = {
    strings: React.PropTypes.object.isRequired
  };

  return Status;
});
