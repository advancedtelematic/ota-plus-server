define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      SotaDispatcher = require('sota-dispatcher'),
      db = require('stores/db');

  class NewManualGroupButton extends React.Component {
    constructor(props) {
      super(props);
      this.onDragOver = this.onDragOver.bind(this);
      this.onDragLeave = this.onDragLeave.bind(this);
      this.onDrop = this.onDrop.bind(this);
    }
    onDragOver(e) {
      e.preventDefault();
      this.props.toggleDraggingOverButton(true);
    }
    onDragLeave(e) {
      this.props.toggleDraggingOverButton(false);
    }
    onDrop(e) {
      if(e.preventDefault)
        e.preventDefault();
      this.props.openNewManualGroupModal(this.props.draggingDevice.uuid);
    }
    render() {
      var buttonClassName = '';
      if(this.props.draggingDevice && this.props.draggingDevice.uuid !== null) {
        buttonClassName = this.props.isDraggingOverButton ? ' droppable active' : ' droppable';
      }
      return (
        <button 
          type="button" 
          className={"btn btn-rect" + buttonClassName} 
          onClick={this.props.openNewManualGroupModal.bind(this, null)}
          onDragOver={this.onDragOver}
          onDragLeave={this.onDragLeave}
          onDrop={this.onDrop}>
          <i className="fa fa-plus"></i> Add new Group
        </button>
      );
    }
  };

  return NewManualGroupButton;
});
