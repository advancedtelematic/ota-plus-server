define(function(require) {
  var React = require('react');

  var Modal = function Modal(Component, vars) {
    var ModalClass = class ModalClass extends React.Component {
      constructor(props) {
        super(props);
        this.close = this.close.bind(this);
      }
      close() {
        return this.context.router.goBack();
      }
      render() {
        return (
          <div id={vars.modalId} className="myModal" role="dialog">
            <div className="modal-dialog center-xy">
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
      router: React.PropTypes.object.isRequired,
      history: React.PropTypes.object.isRequired,
      strings: React.PropTypes.object.isRequired
    };
    
    return ModalClass;
  };

  return Modal;
});
