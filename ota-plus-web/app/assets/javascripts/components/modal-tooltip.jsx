define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link;

  class ModalTooltip extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div id={this.props.id} className={"myModal modal-tooltip " + this.props.className}>
          <div className="modal-dialog center-xy">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">{this.props.title}</h4>
              </div>
              <div className="modal-body font-14">
                {this.props.body}
              </div>
              <div className="modal-footer">
                {this.props.isCloseButtonShown ? 
                  <a href="#" className="darkgrey margin-top-20 pull-left" onClick={this.props.closeButtonAction}>{this.props.closeButtonLabel}</a>
                : null}
                <button type="button" className="btn btn-confirm pull-right" onClick={this.props.confirmButtonAction}>{this.props.confirmButtonLabel}</button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  ModalTooltip.propTypes = {
    id: React.PropTypes.string,
    className: React.PropTypes.string,
    title: React.PropTypes.string.isRequired,
    body: React.PropTypes.object.isRequired,
    isCloseButtonShown: React.PropTypes.bool,
    closeButtonLabel: React.PropTypes.string,
    closeButtonAction: React.PropTypes.func,
    confirmButtonLabel: React.PropTypes.string,
    confirmButtonAction: React.PropTypes.func.isRequired,
  };
  
  ModalTooltip.defaultProps = {
    isCloseButtonShown: false,
    closeButtonLabel: 'Cancel',
    confirmButtonLabel: 'Got it'
  };

  return ModalTooltip;
});
