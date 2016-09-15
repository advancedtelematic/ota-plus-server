define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      serializeForm = require('../../mixins/serialize-form'),
      SotaDispatcher = require('sota-dispatcher'),
      Responses = require('../responses'),
      Loader = require('es6!../loader');
  
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
      
      if(this.props.mode == 'edit') {
        SotaDispatcher.dispatch({actionType: 'get-blacklisted-package', name: this.props.packageName, version: this.props.packageVersion});
        db.blacklistedPackage.addWatch("poll-blacklisted-package", _.bind(this.setData, this, null));
      } else {
        this.state = {
          comment: null
        };
      }
    }
    componentWillUnmount() {
      var postStatus = _.clone(db.postStatus.deref());
      if(!_.isUndefined(postStatus['add-package-to-blacklist']))
        delete postStatus['add-package-to-blacklist'];
      if(!_.isUndefined(postStatus['update-package-in-blacklist']))
        delete postStatus['update-package-in-blacklist'];
      if(!_.isUndefined(postStatus['remove-package-from-blacklist']))
        delete postStatus['remove-package-from-blacklist'];
      db.postStatus.reset(postStatus);
      
      db.blacklistedPackage.reset();
      db.blacklistedPackage.removeWatch("poll-blacklisted-package");
      db.postStatus.removeWatch("poll-poststatus-blacklist");
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
      this.props.closeForm();
    }
    blacklistListener() {
      var postStatusAddPackageToBlacklist = db.postStatus.deref()['add-package-to-blacklist'];
      var postStatusRemovePackageFromBlacklist = db.postStatus.deref()['remove-package-from-blacklist'];
      if(!_.isUndefined(postStatusAddPackageToBlacklist) && postStatusAddPackageToBlacklist.status === 'success')
        this.props.closeForm();
      else if(!_.isUndefined(postStatusRemovePackageFromBlacklist) && postStatusRemovePackageFromBlacklist.status === 'success')
        this.props.closeForm();
    }
    render() {
      return (
        <div id="modal-blacklist" className="myModal small-margin">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header text-center">
                <h4 className="modal-title">
                  {this.props.mode == 'edit' ?
                    <div>
                      <img src="/assets/img/icons/edit_white.png" className="blacklist-edit-icon" style={{width: '20px'}} alt="" /> &nbsp;
                      Edit Blacklist
                    </div>
                  : 
                    <div>
                      <img src="/assets/img/icons/blacklist_white.png" className="blacklist-icon" style={{width: '20px'}} alt="" /> &nbsp;
                      Blacklist
                    </div>
                  }
                </h4>
              </div>
              <div className="modal-body">
                {!_.isUndefined(this.state.comment) ?
                  <form ref='form' onSubmit={this.handleSubmit} encType="multipart/form-data">
                    <Responses action={this.props.mode === 'edit' ?  'update-package-in-blacklist' : 'add-package-to-blacklist'} handledStatuses="error"/>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <textarea className="form-control" rows="5" name="comment" ref="comment" placeholder="Comment here." defaultValue={this.state.comment}/>
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
                <a href="#" className="darkgrey margin-top-20 pull-left" onClick={this.closeForm}>close</a>
                {!_.isUndefined(this.state.comment) ?
                  <div>
                    <button type="submit" className="btn btn-confirm pull-right" onClick={this.handleSubmit}>{this.props.mode == 'edit' ? 'Save comment' : 'confirm'}</button>
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
    strings: React.PropTypes.object.isRequired,
  };

  return BlacklistForm;
});
