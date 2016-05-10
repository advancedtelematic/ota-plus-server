define(function(require) {
  var React = require('react'),
      SotaDispatcher = require('sota-dispatcher'),
      QueueListItem = require('./queue-list-item');
  
  class QueueList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: null
      }
      this.dragStart = this.dragStart.bind(this);
      this.dragEnd = this.dragEnd.bind(this);
      this.dragOver = this.dragOver.bind(this);
    }
    componentWillUnmount(){
      this.props.Packages.removeWatch(this.props.PollEventName);
    }
    componentWillMount(){
      SotaDispatcher.dispatch(this.props.DispatchObject);
      this.props.Packages.addWatch(this.props.PollEventName, _.bind(this.forceUpdate, this, null));
    }
    componentDidMount() {
      this.setState({
        data: {packages: this.props.Packages.deref()}
      });
    }
    dragStart(e) {
      this.dragged = Number(e.currentTarget.dataset.id);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData("text/html", null);
    }
    dragEnd() {
      this.sort(this.state.data.packages, undefined);
      this.updatePackagesOrder();
    }
    dragOver(e) {
      e.preventDefault();
      var over = e.currentTarget
      var dragging = this.state.data.dragging;
      var from = isFinite(dragging) ? dragging : this.dragged;
      var to = Number(over.dataset.id);
      var items = this.state.data.packages;
      items.splice(to, 0, items.splice(from,1)[0]);
      this.sort(items, to);
    }
    sort(packages, dragging) {
      var data = this.state.data;
      data.packages = packages;
      data.dragging = dragging;
      this.setState({data: data});
    }
    updatePackagesOrder() {
      console.log('update order with API');
    }
    render() {
      var Packages = (this.state.data) ? this.state.data.packages : null;
        
      var packages = _.map(Packages, function(pack, i) {
        var dragging = (this.state.data.dragging == i) ? "dragging" : "";  
        var status = (pack.name == 'package') ? 'error' : 'success';
        return (
          <div data-id={i}
            className={dragging}
            key={i}
            draggable="true"
            onDragEnd={this.dragEnd}
            onDragOver={this.dragOver}
            onDragStart={this.dragStart}>
            <QueueListItem package={pack} status={status}/>
          </div>
        );
      }, this);       
      return (
        <ul id="queue-list" className="list-group list-group-dnd"> 
          {packages}
        </ul>
      );
    }
  };

  QueueList.contextTypes = {
    strings: React.PropTypes.object.isRequired
  };

  return QueueList;
});
