define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      serializeForm = require('../../mixins/serialize-form'),
      SotaDispatcher = require('sota-dispatcher'),
      Responses = require('../responses'),
      Loader = require('../loader');
  
  class BlacklistForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
      
      this.setData = this.setData.bind(this);
      this.closeForm = this.closeForm.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.removeFromBlacklist = this.removeFromBlacklist.bind(this);
      this.blacklistListener = this.blacklistListener.bind(this);
      
      db.postStatus.addWatch("poll-poststatus-blacklist", _.bind(this.blacklistListener, this, null));
      db.impactedDevicesCount.addWatch("poll-impacted-devices-count-blacklist", _.bind(this.forceUpdate, this, null));
            
      if(this.props.mode == 'edit') {
        db.blacklistedPackage.addWatch("poll-blacklisted-package", _.bind(this.setData, this, null));
      } else {
        this.state = {
          comment: null
        };
      }
    }
    componentDidMount() {
      SotaDispatcher.dispatch({actionType: 'get-impacted-devices-count', name: this.props.packageName, version: this.props.packageVersion});
      if(this.props.mode == 'edit') {
        SotaDispatcher.dispatch({actionType: 'get-blacklisted-package', name: this.props.packageName, version: this.props.packageVersion});
      }
    }
    componentWillUnmount() {
      db.blacklistedPackage.reset();
      db.impactedDevicesCount.reset();
      db.blacklistedPackage.removeWatch("poll-blacklisted-package");
      db.postStatus.removeWatch("poll-poststatus-blacklist");
      db.impactedDevicesCount.removeWatch("poll-impacted-devices-count-blacklist");
    }
    setData() {
      if(!_.isUndefined(db.blacklistedPackage.deref()))
        this.setState({
          comment: db.blacklistedPackage.deref().comment
        })
    }
    closeForm(e) {
      e.preventDefault();
      this.props.closeForm();
    }
    handleSubmit(e) {
      e.preventDefault();
      var payload = {};
      
      var data = {
          "packageId": {
              "name": this.props.packageName,
              "version": this.props.packageVersion
          },
          "comment": this.refs.comment.value
      };
      
      SotaDispatcher.dispatch({
        actionType: this.props.mode === 'edit' ?  'update-package-in-blacklist' : 'add-package-to-blacklist',
        name: this.props.packageName,
        version: this.props.packageVersion,
        data: data
      });
    }
    removeFromBlacklist(e) {
      e.preventDefault();
      SotaDispatcher.dispatch({actionType: 'remove-package-from-blacklist', name: this.props.packageName, version: this.props.packageVersion});
    }
    blacklistListener() {
      var postStatus = db.postStatus.deref();
      var postStatusAddPackageToBlacklist = postStatus['add-package-to-blacklist'];
      var postStatusRemovePackageFromBlacklist = postStatus['remove-package-from-blacklist'];
      var postStatusUpdatePackageInBlacklist = postStatus['update-package-in-blacklist'];
      if(!_.isUndefined(postStatusAddPackageToBlacklist) && postStatusAddPackageToBlacklist.status === 'success' ||
         !_.isUndefined(postStatusRemovePackageFromBlacklist) && postStatusRemovePackageFromBlacklist.status === 'success' ||
         !_.isUndefined(postStatusUpdatePackageInBlacklist) && postStatusUpdatePackageInBlacklist.status === 'success') {
        if(!_.isUndefined(postStatus['add-package-to-blacklist']))
          delete postStatus['add-package-to-blacklist'];
        if(!_.isUndefined(postStatus['remove-package-from-blacklist']))
          delete postStatus['remove-package-from-blacklist'];
        if(!_.isUndefined(postStatus['update-package-in-blacklist']))
          delete postStatus['update-package-in-blacklist'];
         
        db.postStatus.reset(postStatus);
        this.props.closeForm(true);
      }
    }
    render() {
      var impactedDevicesCount = db.impactedDevicesCount.deref();
            
      return (
        <div id="modal-blacklist" className="myModal">
          <div className="modal-dialog center-xy">
            <div className="modal-content">
              <div className={"modal-header text-center" + (this.props.mode == 'add' ? ' modal-header-red' : '')}>
                <h4 className="modal-title">
                  {this.props.mode == 'edit' ?
                    <div>
                      <img src="/assets/img/icons/edit_white.png" className="blacklist-edit-icon" style={{width: '30px'}} alt="" />&nbsp;
                      Edit blacklisted package
                    </div>
                  : 
                    <div>
                      <img src="/assets/img/icons/ban_white.png" className="blacklist-icon" style={{width: '30px'}} alt="" />&nbsp;
                      Blacklist
                    </div>
                  }
                </h4>
              </div>
              <div className="modal-body">
                {!_.isUndefined(this.state.comment) && !_.isUndefined(impactedDevicesCount) ?
                  <form ref='form' onSubmit={this.handleSubmit} encType="multipart/form-data">
                    <Responses action={this.props.mode === 'edit' ?  'update-package-in-blacklist' : 'add-package-to-blacklist'} handledStatuses="error"/>
                    
                    {this.props.mode === 'add' ?
                      <div className="row text-center">
                        <div className="col-md-12">
                          <p>You're about to <strong>blacklist</strong> the following package version:</p>
                          <div className="font-20">{this.props.packageName}</div>
                          <div className="font-20"><strong>{this.props.packageVersion}</strong></div>
                          <p className="lightgrey margin-top-25">
                            When you blacklist a package version, you can no longer install it on any devices. 
                            It will also appear in the <strong>Impact analysis tab</strong>, showing which devices currently have it installed.
                          </p>
                          
                          {impactedDevicesCount.affected_device_count ? 
                            <p className="red font-14">
                              <strong>
                                Warning: the package version you are about to <br />
                                blacklist is queued for installation on {impactedDevicesCount.affected_device_count} devices. <br />
                                These updates will be cancelled automatically.
                              </strong>
                            </p>
                          : null}
                        </div>
                      </div>
                    : null}
                    
                    <div className="row margin-top-15">
                      <div className="col-md-12">
                        <div className="form-group">
                          <input className="form-control" rows="5" name="comment" ref="comment" placeholder="Comment here." defaultValue={this.state.comment}/>
                        </div>
                      </div>
                    </div>
                  </form>
                : undefined}
                {_.isUndefined(this.state.comment) ? 
                  <Loader />
                : undefined}
              </div>
              <div className="modal-footer">
                <a href="#" className="darkgrey margin-top-20 pull-left" onClick={this.closeForm}>Cancel</a>
                {!_.isUndefined(this.state.comment) ?
                  <div>
                    <button type="submit" className="btn btn-confirm pull-right" onClick={this.handleSubmit}>{this.props.mode == 'edit' ? 'Save Comment' : 'Confirm'}</button>
                    {this.props.mode == 'edit' ?
                      <div className="pull-right width-full margin-top-15">
                        or <strong><a href="#" className="blue font-14" onClick={this.removeFromBlacklist}>Remove from Blacklist</a></strong>
                      </div>
                    : undefined}
                  </div>
                : null}
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  BlacklistForm.contextTypes = {
    history: React.PropTypes.object.isRequired,
    
  };

  return BlacklistForm;
});
