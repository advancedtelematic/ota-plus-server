define(function(require) {
  var React = require('react'),
      SotaDispatcher = require('sota-dispatcher'),
      QueueListItem = require('./queue-list-item');
  
  class QueueList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: []
      }
      this.dragStart = this.dragStart.bind(this);
      this.dragEnd = this.dragEnd.bind(this);
      this.dragOver = this.dragOver.bind(this);
      
      SotaDispatcher.dispatch(this.props.DispatchObject);
      this.props.QueuedPackages.addWatch(this.props.PollEventName, _.bind(this.setData, this, null));
    }
    componentWillUnmount(){
      this.props.QueuedPackages.removeWatch(this.props.PollEventName);
    }
    setData() {
      this.setState({
        data: {packages: this.props.QueuedPackages.deref()}
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
            
      var newOrder = {};   
      
      var packages = _.map(this.state.data.packages, function(pack, i) {
        newOrder[i] = pack.requestId;
      });
      
      var payload = JSON.stringify(newOrder);
      SotaDispatcher.dispatch({
        actionType: 'reorder-queue-for-vin',
        vin: this.props.vin,
        order: payload
      });
    }
    render() { 
      var Packages = (this.state.data) ? this.state.data.packages : null;
        
      if(Packages !== undefined) {
        Packages.sort(function(a, b) {
          return a.installPos - b.installPos;
        });
      }
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
        packages.length > 0 ?
          <ul id="queue-list" className="list-group list-group-dnd"> 
            {packages}
          </ul>
        :
          <div>Queue is empty</div>
      );
    }
  };

  QueueList.contextTypes = {
    strings: React.PropTypes.object.isRequired
  };

  return QueueList;
});
