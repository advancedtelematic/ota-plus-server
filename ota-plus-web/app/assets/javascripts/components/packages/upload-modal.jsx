define(function(require) {
  var React = require('react'),
      Cookies = require('js-cookie'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      ProgressBar = require('mixins/react-progressbar'),
      Circle = ProgressBar.Circle,
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      ConfirmationModal = require('../confirmation-modal');
  
  class UploadModal extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: !_.isUndefined(db.postUpload.deref()) ? db.postUpload.deref()['create-package'] : undefined,
        bars: undefined,
        firstDataSet: false,
        lastUpdatedSecondsRemaining: null,
        secondsRemaining: Math.random() * (900 - 600) + 600,
        overallUploadedSize: undefined,
        overallUploadSize: undefined,
        isWholeProcessFinished: false,
        isModalMinimized: Cookies.get('isUploadMinimized') && Cookies.get('isUploadMinimized') === "true" ? true : false,
        prevModalWidth: 0,
        prevModalHeight: 0,
        uploadKeyToCancel: null,
        isUploadCancelModalShown: false
      };
      this.fixModalPosition = this.fixModalPosition.bind(this);
      this.toggleModalSize = this.toggleModalSize.bind(this);
      this.showUploadCancelModal = this.showUploadCancelModal.bind(this);
      this.closeUploadCancelModal = this.closeUploadCancelModal.bind(this);
      this.cancelUpload = this.cancelUpload.bind(this);
      this.removeFromList = this.removeFromList.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.setData = this.setData.bind(this);
      this.convertTimeToUnits = this.convertTimeToUnits.bind(this);
      this.convertBytesToUnits = this.convertBytesToUnits.bind(this);
      this.handleResponse = this.handleResponse.bind(this);
      
      db.postUpload.addWatch("poll-upload-packages-modal", _.bind(this.setData, this, null));
      db.postStatus.addWatch("poll-add-package-modal", _.bind(this.handleResponse, this, null));
    }
    componentDidMount() {
      window.addEventListener("resize", this.fixModalPosition);
      
      var modal = jQuery('#modal-upload');
      var containment = jQuery('#app');
      
      var positions = Cookies.getJSON('positions') || {};
      if(!_.isUndefined(positions["modal-upload"])) {
        modal.css(positions["modal-upload"]);
      }
      
      this.setData();
      this.fixModalPosition();
      
      modal.draggable({
        containment: "#app",
        start: function (event, ui) {
          jQuery(this).css({
            top: "auto",
            right: "auto",
          });
        },
        drag: function(event, ui) {
          jQuery(this).css({
            bottom: containment.height() - ui.position.top - $('#' + this.id).height()
          });
        },
        stop: function (event, ui) {
          jQuery(this).css({
            top: "auto"
          });
          positions[this.id] = {
            left: ui.position.left,
            bottom: (containment.height() - ui.position.top - $('#' + this.id).height())
          };
          Cookies.set('positions', JSON.stringify(positions));
        }
      });
    }
    componentDidUpdate(prevProps, prevState) {
      if(prevState.isModalMinimized !== this.state.isModalMinimized) {
        var modal = jQuery('#modal-upload');
        var positionLeft = parseInt(modal.css('left'));
        var positionBottom = parseInt(modal.css('bottom'));
        positionLeft += this.state.prevModalWidth - modal.width();
        positionBottom += this.state.prevModalHeight - modal.height();
        modal.css({left: positionLeft, bottom: positionBottom});
        this.fixModalPosition();                
      }
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.fixModalPosition);
      db.postUpload.addWatch("poll-upload-packages-modal");
      db.postStatus.addWatch("poll-add-package-modal");
    }
    fixModalPosition() {
      var modal = jQuery('#modal-upload');
      var containment = jQuery('#app');
      var positionLeft = Math.max(Math.min(parseInt(modal.css('left')), containment.width() - modal.width()), 0);
      var positionBottom = Math.max(Math.min(parseInt(modal.css('bottom')), containment.height() - modal.height()), 0);
      var positions = Cookies.getJSON('positions') || {};
      
      modal.css('left', positionLeft);
      modal.css('bottom', positionBottom);
      
      positions["modal-upload"] = {
        left: positionLeft,
        bottom: positionBottom
      };
      Cookies.set('positions', JSON.stringify(positions));
    }
    toggleModalSize(e) {
      e.preventDefault();
      var newValue = !this.state.isModalMinimized;
      this.setState({
        isModalMinimized: newValue,
        prevModalWidth: jQuery('#modal-upload').width(),
        prevModalHeight: jQuery('#modal-upload').height()
      });
      Cookies.set('isUploadMinimized', newValue);
    }
    setData() {
      var postUpload = !_.isUndefined(db.postUpload.deref()) && !_.isUndefined(db.postUpload.deref()['create-package']) ? db.postUpload.deref()['create-package'] : undefined;
      var secondsRemaining = 0;
      var firstUpdatedSecondsRemaining = this.state.firstUpdatedSecondsRemaining;
      var lastUpdatedSecondsRemaining = this.state.lastUpdatedSecondsRemaining;
      var currentTime = new Date().getTime();
      var overallUploadSize = 0;
      var overallUploadedSize = 0;
      var isWholeProcessFinished = true;
            
      if(firstUpdatedSecondsRemaining == null) {
        this.setState({
          firstUpdatedSecondsRemaining: currentTime
        });
      } else {
        if(currentTime - lastUpdatedSecondsRemaining > 15 * 1000) {
          _.each(postUpload, function(upload, uploadKey) {
            var uploadSize = upload.size/(1024*1024);
            var uploadedSize = !isNaN(upload.uploaded) ? upload.uploaded/(1024*1024) : 0;
            var uploadSpeed = !isNaN(upload.upSpeed) ? upload.upSpeed : 100;
            var timeLeft = (upload.size - upload.uploaded) / (1024 * uploadSpeed);
            timeLeft = isFinite(timeLeft) ? timeLeft : this.state.secondsRemaining;
                    
            secondsRemaining = timeLeft > secondsRemaining ? timeLeft : secondsRemaining;
          }, this);
                
          if(isFinite(secondsRemaining)) {
            this.setState({
              secondsRemaining: secondsRemaining,
              lastUpdatedSecondsRemaining: currentTime,
            });
          }
        }
      }
            
      _.each(postUpload, function(upload, uploadKey) {
        if(_.isUndefined(upload.status) || upload.status === 'error')
          isWholeProcessFinished = false,
        overallUploadSize += upload.size;
        overallUploadedSize += upload.uploaded;
      });
                        
      this.setState({
        data: postUpload,
        overallUploadedSize: overallUploadedSize,
        overallUploadSize: overallUploadSize,
        isWholeProcessFinished: isWholeProcessFinished
      });
    }
    showUploadCancelModal(uploadKey, e) {
      if(e) e.preventDefault();
      this.setState({
        isUploadCancelModalShown: true,
        uploadKeyToCancel: !_.isUndefined(uploadKey) ? uploadKey : null
      });
    }
    closeUploadCancelModal() {
      this.setState({
        isUploadCancelModalShown: false,
        uploadKeyToCancel: null
      });
    }
    cancelUpload() {
      var uploadKey = this.state.uploadKeyToCancel;      
      
      if(!_.isUndefined(db.postUpload.deref()) && !_.isUndefined(db.postUpload.deref()['create-package'])) {
        var postUpload = db.postUpload.deref();
        if(uploadKey && !_.isUndefined(postUpload['create-package'][uploadKey])) {
          var uploadReq = !_.isUndefined(postUpload['create-package'][uploadKey].request) ? postUpload['create-package'][uploadKey].request : undefined;
          if(!_.isUndefined(uploadReq) && typeof uploadReq.abort() === 'function')
            uploadReq.abort();
          delete postUpload['create-package'][uploadKey];
        } else if(!uploadKey) {
          _.each(postUpload['create-package'], function(upload) {
            var uploadReq = !_.isUndefined(upload.request) ? upload.request : undefined;
            if(!_.isUndefined(uploadReq) && typeof uploadReq.abort() === 'function')
              uploadReq.abort();
          });
          delete postUpload['create-package'];
        }
        db.postUpload.reset(postUpload);
      }
      this.closeUploadCancelModal();
    }
    removeFromList(uploadKey, e) {
      e.preventDefault();
      if(!_.isUndefined(db.postUpload.deref()) && !_.isUndefined(db.postUpload.deref()['create-package']) && !_.isUndefined(db.postUpload.deref()['create-package'][uploadKey])) {
        var postUpload = db.postUpload.deref();        
        delete postUpload['create-package'][uploadKey];
        db.postUpload.reset(postUpload);
      }
    }
    handleClose(e) {
      e.preventDefault();
      if(!this.state.isWholeProcessFinished) {
        this.showUploadCancelModal(undefined, null);
      } else {
        this.cancelUpload();
      }
    }
    convertTimeToUnits(seconds) {
      if(seconds <= 60)
        return Math.round(seconds) + " Seconds";
      else if(seconds <= 3600)
        return Math.round(seconds/60) + " Minutes";
      else
        return Math.round(seconds/3600) + " Hours";
    }
    convertBytesToUnits(megabytes) {
      megabytes = parseFloat(megabytes);
      if(megabytes <= 1)
        return (megabytes*1024).toFixed(1) + " KB";
      else if(megabytes < 1024)
        return megabytes.toFixed(1) + "MB";
      else
        return (megabytes/1024).toFixed(1) + "GB";
    }
    handleResponse() {
      var postStatus = !_.isUndefined(db.postStatus.deref()) ? db.postStatus.deref()['create-package'] : undefined;
      var postUpload = !_.isUndefined(db.postUpload.deref()) ? db.postUpload.deref() : undefined;
                  
      _.each(this.state.data, function(upload, uploadKey) {
        if(!_.isUndefined(postStatus) && !_.isUndefined(postStatus[uploadKey]) && _.isUndefined(upload.state)) {
          if(postStatus[uploadKey].status === 'success' || postStatus[uploadKey].status === 'error') {
            postUpload['create-package'][uploadKey]['status'] = postStatus[uploadKey].status;
            db.postUpload.reset(postUpload);
          }
        }
      }, this);
    }
    render() {    
      var data = this.state.data;
      var overallUploadedSize = !isNaN(this.state.overallUploadedSize) ? this.state.overallUploadedSize/(1024*1024) : 0;
      var overallUploadSize = this.state.overallUploadSize/(1024*1024);
      var isUploadFinished = this.state.overallUploadSize === this.state.overallUploadedSize;
      var barOptions = {
        strokeWidth: 18,
        easing: 'easeInOut',
        color: '#A7DCD4',
        trailColor: '#eee',
        trailWidth: 18,
        svgStyle: null
      };
      
      var secondsRemaining = this.state.secondsRemaining;
            
      var uploads = _.map(this.state.data, function(upload, uploadKey) {
        var key = "bar-" + uploadKey;
        var uploadSize = upload.size/(1024*1024);
        var uploadedSize = !isNaN(upload.uploaded) ? upload.uploaded/(1024*1024) : 0;
        var uploadSpeed = !isNaN(upload.upSpeed) ? upload.upSpeed : 100;
        var statusShown;
                
        if(upload.progress < 100) {
          statusShown = (
            <Circle
              progress={upload.progress/100}
              options={barOptions}
              initialAnimate={false}
              containerStyle={{width: '30px', height: '30px'}}/>
          );
        } else if(upload.status === 'success') {
          statusShown = (
            <span>
              <i className="fa fa-check-circle green" aria-hidden="true"></i> Success
            </span>
          );
        } else if(upload.status === 'error') {
          statusShown = (
            <span>
              <i className="fa fa-exclamation-triangle red" aria-hidden="true"></i> Error
            </span>
          );
        } else {
          statusShown = (
            <span>
              <i className="fa fa-square-o fa-spin"></i> &nbsp;
              <span className="counting black">Processing</span>
            </span>
          );
        }
        
        return (
          <tr key={key}>
            <td className="col-xs-3">{upload.data.name}</td>
            <td className="col-xs-2">{upload.data.version}</td>
            <td className="col-xs-4">
               {this.convertBytesToUnits(uploadedSize)} of {this.convertBytesToUnits(uploadSize)}
            </td>
            <td className="col-xs-1">
              {statusShown}
            </td>
            <td className="col-xs-2">
              {!_.isUndefined(upload.status) && (upload.status === 'error' || upload.status === 'success') ?
                <a href="#" className="darkgrey" onClick={this.removeFromList.bind(this, uploadKey)}>remove from list</a>
              :
                <a href="#" className="darkgrey" onClick={this.showUploadCancelModal.bind(this, uploadKey)} title="Cancel upload">cancel</a>
              }
            </td>
          </tr>
        );
      }, this);
                        
      return (
        <div>
          <div id="modal-upload" className={"myModal" + (_.isUndefined(uploads) || _.isEmpty(uploads) ? ' hidden': '') + (this.state.isModalMinimized ? ' minimized' : '')}>
            {!_.isUndefined(uploads) && !_.isEmpty(uploads) && !this.state.isWholeProcessFinished ?
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <a href="#" onClick={this.toggleModalSize} title="Toggle upload box size">
                      {this.state.isModalMinimized ? 
                        <i className="fa fa-angle-up fa-3x toggle-modal-size" aria-hidden="true"></i>
                      :
                        <i className="fa fa-angle-down fa-3x toggle-modal-size" aria-hidden="true"></i>
                      }
                    </a>
                    <a href="#" onClick={this.handleClose} title="Close">
                      <span className="fa-stack close-x">
                        <i className="fa fa-angle-down fa-stack-2x"></i>
                        <i className="fa fa-angle-up fa-stack-2x"></i>
                      </span>
                    </a>
                    <h4 className="modal-title">Uploading {Object.keys(this.state.data).length} package{Object.keys(this.state.data).length > 1 ? "s" : ""}</h4>
                  </div>
                  <div className="modal-body">
                    <div className="modal-subheader">
                      <div className="row">
                        <div className="col-md-6">
                          {isUploadFinished ?
                            <span>
                              Upload is finished
                            </span>
                          :
                            <span>
                              {this.convertTimeToUnits(secondsRemaining)} left
                            </span>
                          }
                        </div>
                        <div className="col-md-6 text-right">
                          {this.state.isModalMinimized ? 
                            <span>
                              {this.convertBytesToUnits(overallUploadedSize)} of {this.convertBytesToUnits(overallUploadSize)}
                            </span>
                          : 
                            !this.state.isUploadFinished ?
                              <a href="#" className="black" onClick={this.showUploadCancelModal.bind(this, undefined)} title="Cancel all uploads">Cancel all</a>
                            : null
                          }
                        </div>
                      </div>
                    </div>
                    {!this.state.isModalMinimized ? 
                      <div className="modal-desc">
                        <table className="table table-uploads">
                          <tbody>
                            {uploads}
                          </tbody>
                        </table>
                      </div>
                    : undefined}
                  </div>
                </div>
              </div>
            : undefined}
          </div>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.isUploadCancelModalShown ?
              this.state.uploadKeyToCancel ?
                <ConfirmationModal 
                  title="Cancel upload?"
                  description="Your upload is not complete. Would you like to cancel the upload?"
                  cancelAction={this.closeUploadCancelModal}
                  cancelText="Continue upload"
                  confirmAction={this.cancelUpload}
                  confirmText="Cancel upload"/>
              :
                <ConfirmationModal 
                  title="Cancel all uploads?"
                  description="Your uploads are not complete. Would you like to cancel all ongoing uploads?"
                  cancelAction={this.closeUploadCancelModal}
                  cancelText="Continue uploads"
                  confirmAction={this.cancelUpload}
                  confirmText="Cancel uploads"/>
            : null}
          </VelocityTransitionGroup>
        </div>
      );
    }
  };

  return UploadModal;
});
