define(function(require) {
  var React = require('react'),
      SotaDispatcher = require('sota-dispatcher'),
      db = require('stores/db'),
      QueueListItem = require('es6!./queue-list-item'),
      Loader = require('es6!../loader'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      TutorialAddPackageThirdStep = require('es6!../tutorial/add-package-third-step');
  
  class QueueList extends React.Component {
    constructor(props) {
      super(props); 
      this.state = {
        data: undefined,
      }
     
      this.sort = this.sort.bind(this);
      this.dragStart = this.dragStart.bind(this);
      this.dragEnd = this.dragEnd.bind(this);
      this.dragOver = this.dragOver.bind(this);
      this.setData = this.setData.bind(this);
      
      db.packageQueueForDevice.addWatch("poll-queued-packages-queue-list", _.bind(this.setData, this, null));
    }
    componentWillUnmount() {
      db.packageQueueForDevice.removeWatch("poll-queued-packages-queue-list");
    }
    setData() {
      if (!$('#queue-list .dragging').length) {
        var data = db.packageQueueForDevice.deref();
        if(!_.isUndefined(data)) {
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
        device: this.props.deviceId,
        order: newOrder
      });
    }
    render() {
      if(!_.isUndefined(this.state.data) && !_.isUndefined(this.state.data.packages)) {
        var packages = _.map(this.state.data.packages, function(pack, i) {
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
              <QueueListItem package={pack} status={status} deviceId={this.props.deviceId}/>
            </div>
          );
        }, this);
      }
      return (
        <div>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {!_.isUndefined(packages) ?
              <ul id="queue-list" className="list-group list-group-dnd height-100">
                {packages.length ?
                  <span>
                    {packages}
                  </span>
                :
                  <div className="text-center center-xy">
                    Installation queue is empty. <br />
                    Click on a package you want to install and select a version to add it to the queue.
                  </div>
                }
              </ul>
            : undefined}
          </VelocityTransitionGroup>
          {_.isUndefined(packages) ? 
            <Loader />
          : undefined}
        </div>
      );
    }
  };

  QueueList.contextTypes = {
    strings: React.PropTypes.object.isRequired
  };

  return QueueList;
});
