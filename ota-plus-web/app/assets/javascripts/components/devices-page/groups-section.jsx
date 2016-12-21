define(function(require) {
  var React = require('react'),
      DevicesBar = require('./devices-bar'),
      NewManualGroupButton = require('../groups/new-manual-group-button'),
      GroupsArtificial = require('../groups/groups-artificial'),
      GroupsList = require('../groups/groups-list'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group');
        
  class GroupsSection extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        groupsListHeight: this.props.contentHeight,
      };
    }
    componentDidMount() {
      this.setState({groupsListHeight: this.props.contentHeight - jQuery('.add-group-btn-wrapper').outerHeight()});
    }
    componentWillReceiveProps(nextProps) {    
      if(nextProps.contentHeight !== this.props.contentHeight) {
        this.setState({groupsListHeight: nextProps.contentHeight - jQuery('.add-group-btn-wrapper').outerHeight()});
      }
    }
    render() {
      return (
        <div id="groups-column">
          <div className="panel panel-ats">
            <div className="panel-body">
              <div className="groups-wrapper" style={{height: this.props.contentHeight}}>
                <div className="add-group-btn-wrapper">
                  <NewManualGroupButton
                    draggingDevice={this.props.draggingDevice}
                    isDraggingOverButton={this.props.isDraggingOverButton}
                    toggleDraggingOverButton={this.props.toggleDraggingOverButton}
                    openNewManualGroupModal={this.props.openNewManualGroupModal}/>
                </div>
                <div id="groups-list" style={{height: this.state.groupsListHeight}}>
                  <GroupsArtificial
                    groups={this.props.groups}
                    devices={this.props.devices}
                    draggingDevice={this.props.draggingDevice}
                    draggingOverGroup={this.props.draggingOverGroup}
                    isDraggingOverButton={this.props.isDraggingOverButton}
                    selectedGroup={this.props.selectedGroup}
                    onGroupDragOver={this.props.onGroupDragOver}
                    selectGroup={this.props.selectGroup}/>
                  {this.props.groups.length ?
                    <GroupsList 
                      groups={this.props.groups}
                      devices={this.props.devices}
                      draggingDevice={this.props.draggingDevice}
                      draggingOverGroup={this.props.draggingOverGroup}
                      isDraggingOverButton={this.props.isDraggingOverButton}
                      selectedGroup={this.props.selectedGroup}
                      isFiltered={this.props.filterValue != ''}
                      groupsListHeight={this.state.groupsListHeight}
                      selectGroup={this.props.selectGroup}
                      openRenameGroupModal={this.props.openRenameGroupModal}
                      onGroupDragOver={this.props.onGroupDragOver}/>
                  :
                    <span></span>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return GroupsSection;
});
