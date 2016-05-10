define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link;

  var Modal = function Modal(Component, vars) {
    var ModalClass = class ModalClass extends React.Component {
      constructor(props) {
        super(props);
      }
      render() {
        return (
          <div className="myModal" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <Link to="/" type="button" className="close"></Link>
                  <h4 className="modal-title">{this.context.strings[vars.TitleVar]}</h4>
                </div>
                <div className="modal-body">
                  <Component {...this.props} />
                </div>
              </div>
            </div>
          </div>     
        );
      }
    }
    
    ModalClass.contextTypes = {
      strings: React.PropTypes.object.isRequired
    };
    
    return ModalClass;
  };

  return Modal;
});
