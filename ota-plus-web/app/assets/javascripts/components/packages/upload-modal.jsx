define(function(require) {
  var React = require('react'),
      Cookies = require('js-cookie'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      ProgressBar = require('mixins/react-progressbar'),
      Circle = ProgressBar.Circle;
  
  class UploadModal extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: !_.isUndefined(db.postUpload.deref()) ? db.postUpload.deref()['create-package'] : undefined,
        bars: undefined,
        firstDataSet: false,
        lastUpdatedSecondsRemaining: null,
        secondsRemaining: 600
      };
      this.closeModal = this.closeModal.bind(this);
      this.cancelUpload = this.cancelUpload.bind(this);
      this.removeFromList = this.removeFromList.bind(this);
      this.setData = this.setData.bind(this);
      this.handleResponse = this.handleResponse.bind(this);
      
      db.postUpload.addWatch("poll-upload-packages", _.bind(this.setData, this, null));
      db.postStatus.addWatch("poll-response-add-package-modal", _.bind(this.handleResponse, this, null));
    }
    componentDidMount() {
      var positions = Cookies.getJSON('positions') || {};
      if(!_.isUndefined(positions["modal-upload"])) {          
        jQuery('#modal-upload').css(positions["modal-upload"]);
      }
      jQuery('#modal-upload').draggable({
        containment: "#app",
        start: function (event, ui) {
          jQuery(this).css({
            right: "auto",
            bottom: "auto"
          });
        },
        stop: function (event, ui) {
          positions[this.id] = ui.position;
          Cookies.set('positions', JSON.stringify(positions));
        }
      });
    }
    componentWillUnmount() {
      db.postUpload.removeWatch("poll-upload-packages");
    }
    setData() {
      var postUpload = !_.isUndefined(db.postUpload.deref()) && !_.isUndefined(db.postUpload.deref()['create-package']) ? db.postUpload.deref()['create-package'] : undefined;
      var secondsRemaining = 0;
      var firstUpdatedSecondsRemaining = this.state.firstUpdatedSecondsRemaining;
      var lastUpdatedSecondsRemaining = this.state.lastUpdatedSecondsRemaining;
      var currentTime = new Date().getTime();
      
      if(firstUpdatedSecondsRemaining == null) {
        this.setState({
          firstUpdatedSecondsRemaining: currentTime
        });
      } else {
        if(currentTime - lastUpdatedSecondsRemaining > 15 * 1000 || 1) {
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
      
      this.setState({
        data: postUpload
      });
    }
    closeModal(e) {
      this.props.closeModal();
    }
    cancelUpload(uploadKey, e) {
      e.preventDefault();
      if(!_.isUndefined(db.postUpload.deref()) && !_.isUndefined(db.postUpload.deref()['create-package']) && !_.isUndefined(db.postUpload.deref()['create-package'][uploadKey])) {
        var postUpload = db.postUpload.deref();
        var uploadReq = !_.isUndefined(postUpload['create-package'][uploadKey].request) ? postUpload['create-package'][uploadKey].request : undefined;
        if(!_.isUndefined(uploadReq) && typeof uploadReq.abort() === 'function')
          uploadReq.abort();
        
        delete postUpload['create-package'][uploadKey];
        
        db.postUpload.reset(postUpload);
      }
    }
    removeFromList(uploadKey, e) {
      e.preventDefault();
      if(!_.isUndefined(db.postUpload.deref()) && !_.isUndefined(db.postUpload.deref()['create-package']) && !_.isUndefined(db.postUpload.deref()['create-package'][uploadKey])) {
        var postUpload = db.postUpload.deref();        
        delete postUpload['create-package'][uploadKey];
        db.postUpload.reset(postUpload);
      }
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
      var barOptions = {
        strokeWidth: 16,
        easing: 'easeInOut',
        color: '#C5E5E2',
        trailColor: '#eee',
        trailWidth: 16,
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
              <i className="fa fa-circle-o-notch fa-spin"></i> &nbsp;
              <span className="counting black">Processing</span>
            </span>
          );
        }
        
        return (
          <tr key={key}>
            <td>{upload.data.name}</td>
            <td>{upload.data.version}</td>
            <td>{uploadedSize.toFixed(1)} MB of {uploadSize.toFixed(1)} MB</td>
            <td>
              {statusShown}
            </td>
            <td>
              {!_.isUndefined(upload.status) && (upload.status === 'error' || upload.status === 'success') ?
                <a href="#" className="darkgrey" onClick={this.removeFromList.bind(this, uploadKey)}>remove from list</a>
              :
                <a href="#" className="darkgrey" onClick={this.cancelUpload.bind(this, uploadKey)}>cancel</a>
              }
            </td>
          </tr>
        );
      }, this);
                        
      return (
        <div id="modal-upload" className={"myModal" + (_.isUndefined(uploads) || _.isEmpty(uploads) ? ' hidden': '')}>
          {!_.isUndefined(uploads) && !_.isEmpty(uploads) ?
            <div className="modal-dialog center-xy">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" onClick={this.props.closeModal}></button>
                  <h4 className="modal-title">Uploading {Object.keys(this.state.data).length} package{Object.keys(this.state.data).length > 1 ? "s" : ""}</h4>
                </div>
                <div className="modal-body">
                  <div className="modal-subheader">
                    {secondsRemaining > 60 ? 
                      <span>
                        {Math.round(secondsRemaining/60)} Minutes left
                      </span>
                    : 
                      secondsRemaining > 0 ?
                        <span>
                          {Math.round(secondsRemaining)} Seconds left
                        </span>
                      :
                        <span>
                          Upload is finished
                        </span>
                    }
                  </div>
        
                  <div className="modal-desc">
                    <table className="table table-uploads">
                      <tbody>
                        {uploads}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          : undefined}
         </div>
      );
    }
  };

  return UploadModal;
});
