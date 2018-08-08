import React, { PropTypes, Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

const Modal = ({ title, topActions, content, actions, shown, className, titleClassName, hideOnClickOutside, onRequestClose }) => {
    return (
        <Dialog
              title={
                <div className="heading">
                    <div className="internal">
                        {title}
                        {topActions}
                    </div>
                </div>}
              actions={actions}
              modal={false}
              open={shown}
              className={"dialog" + (className ? " " + className : "")}
              overlayClassName="overlay"
              titleClassName={"heading" + (titleClassName ? " " + titleClassName : "")}
              contentClassName="content"
              bodyClassName="body"
              actionsContainerClassName="actions"
              autoScrollBodyContent={true}
              repositionOnUpdate={true}
              onRequestClose={onRequestClose}>
          {content}
        </Dialog>
    );
}

Modal.propTypes = {
    title: PropTypes.any,
    topActions: PropTypes.any,
    content: PropTypes.any.isRequired,
    actions: PropTypes.array,
    shown: PropTypes.bool,
    className: PropTypes.string,
    titleClassName: PropTypes.string,
    hideOnClickOutside: PropTypes.bool,
    onRequestClose: PropTypes.func,
}

Modal.defaultProps = {
    actions: [],
    shown: false,
    hideOnClickOutside: false,
    onRequestClose: () => {}
}

export default Modal;