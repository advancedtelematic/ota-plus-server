define(function(require) {
  var React = require('react'),
      SotaDispatcher = require('sota-dispatcher'),
      db = require('stores/db'),
      QueueListItem = require('./queue-list-item');

  class QueueList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: []
      }
      this.sort = this.sort.bind(this);
      this.dragStart = this.dragStart.bind(this);
      this.dragEnd = this.dragEnd.bind(this);
      this.dragOver = this.dragOver.bind(this);
      this.setData = this.setData.bind(this);

      db.packageQueueForDevice.addWatch("poll-queued-packages", _.bind(this.setData, this, null));
    }
    componentWillUnmount(){
      db.packageQueueForDevice.removeWatch("poll-queued-packages");
    }
    setData() {
      if (!$('#queue-list .dragging').length) {
        var data = db.packageQueueForDevice.deref();
        data.sort(function(a, b) {
          var installPosCompared = a.installPos - b.installPos;
          return installPosCompared == 0 ? new Date(a.createdAt) - new Date(b.createdAt) : installPosCompared;
        });
        this.setState({
          data: {packages: data}
        });
        this.props.setQueueStatistics(data.length);
      }
    }
    sort(packages, dragging) {
      var data = this.state.data;
      data.packages = packages;
      data.dragging = dragging;
      this.setState({data: data});
    }
    dragStart(e) {
      this.dragged = Number(e.currentTarget.dataset.id);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData("text/html", null);
    }
    dragOver(e) {
      e.preventDefault();
      var over = e.currentTarget;
      var dragging = this.state.data.dragging;
      var from = isFinite(dragging) ? dragging : this.dragged;
      var to = Number(over.dataset.id);
      var items = this.state.data.packages;
      items.splice(to, 0, items.splice(from,1)[0]);
      this.sort(items, to);
    }
    dragEnd() {
      this.sort(this.state.data.packages, undefined);
      this.updatePackagesOrder();
    }
    updatePackagesOrder() {
      var newOrder = {};
      var packages = _.map(this.state.data.packages, function(pack, i) {
        newOrder[i] = pack.requestId;
      });
      SotaDispatcher.dispatch({
        actionType: 'reorder-queue-for-device',
        device: this.props.device,
        order: newOrder
      });
    }
    render() {
      var Packages = this.state.data.packages !== undefined ? this.state.data.packages : [];

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
            <QueueListItem package={pack} status={status} device={this.props.device}/>
          </div>
        );
      }, this);
      return (
        <ul id="queue-list" className="list-group list-group-dnd">
          {packages.length > 0 ?
            packages
          :
            <div>Queue is empty</div>
          }
        </ul>
      );
    }
  };

  QueueList.contextTypes = {
    strings: React.PropTypes.object.isRequired
  };

  return QueueList;
});
