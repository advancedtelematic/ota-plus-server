define(function(require) {
  var React = require('react'),
      Router = require('react-router');

  var Modal = function Modal(Component, vars) {
    var ModalClass = class ModalClass extends React.Component {
      constructor(props) {
        super(props);
        this.close = this.close.bind(this);
      }
      close() {
        return Router.History.back();
      }
      render() {
        return (
          <div id={vars.modalId} className="myModal" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" onClick={this.close}></button>
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
