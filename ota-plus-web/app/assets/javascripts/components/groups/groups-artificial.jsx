define(function(require) {
  var React = require('react'),
      ReactDOM = require('react-dom');

  class GroupsArtificial extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      var selectedArtificialGroupName = (this.props.selectedGroup.type == 'artificial' ? this.props.selectedGroup.name : null);
        
      return (
        <div>
          <button type="button" className={"list-group-item" + (selectedArtificialGroupName == 'all' ? " checked" : "")} onClick={this.props.selectGroup.bind(this, {name: 'all', type: 'artificial'})} id="button-group-all-devices">
            <div className="pull-left">
              <div className="group-text">
                <div className="group-title" title="All devices">All devices</div>
                <div className="group-subtitle">X devices</div>
              </div>
            </div>
          </button>
              
          <button type="button" className={"list-group-item" + (selectedArtificialGroupName == 'ungrouped' ? " checked" : "")} onClick={this.props.selectGroup.bind(this, {name: 'ungrouped', type: 'artificial'})} id="button-group-ungrouped-devices">
            <div className="pull-left">
              <div className="group-text">
                <div className="group-title" title="Ungrouped devices">Ungrouped devices</div>
                <div className="group-subtitle">Y devices</div>
              </div>
            </div>
          </button>
        </div>
      );
    }
  };

  GroupsArtificial.contextTypes = {
    location: React.PropTypes.object,
  };

  return GroupsArtificial;
});
