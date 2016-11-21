define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      SotaDispatcher = require('sota-dispatcher'),
      db = require('stores/db');

  class NewManualGroupButton extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        overButton: false
      };
      this.onDragOver = this.onDragOver.bind(this);
      this.onDragLeave = this.onDragLeave.bind(this);
      this.onDrop = this.onDrop.bind(this);
    }
    onDragOver(e) {
      e.preventDefault();
      this.setState({overButton: true});
    }
    onDragLeave(e) {
      this.setState({overButton: false});
    }
    onDrop(e) {
      if(e.preventDefault)
        e.preventDefault();
      this.props.openNewManualGroupModal(this.props.draggingDeviceUUID);
    }
    render() {
      var buttonClassName = '';
      if(this.props.draggingDeviceUUID !== null) {
        buttonClassName = this.state.overButton ? ' droppable active' : ' droppable';
      }
      return (
        <button 
          type="button" 
          className={"btn btn-rect" + buttonClassName} 
          onClick={this.props.openNewManualGroupModal}
          onDragOver={this.onDragOver}
          onDragLeave={this.onDragLeave}
          onDrop={this.onDrop}>
          <i className="fa fa-plus"></i> Add new Group
        </button>
      );
    }
  };

  NewManualGroupButton.contextTypes = {
    strings: React.PropTypes.object.isRequired
  };

  return NewManualGroupButton;
});
