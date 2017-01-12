define(function(require) {
  var React = require('react'),
      SotaDispatcher = require('sota-dispatcher'),
      db = require('stores/db');

  class PackagesListItemDetailsVersion extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        activeEditField: false,
        showEditButton: false,
        commentFieldLength: 0,
        comment: this.props.version.description,
        commentTmp: this.props.version.description,
      };
      this.enableEditField = this.enableEditField.bind(this);
      this.disableEditField = this.disableEditField.bind(this);
      this.changeCommentFieldLength = this.changeCommentFieldLength.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleResponse = this.handleResponse.bind(this);
      db.postStatus.addWatch("poll-update-package-details", _.bind(this.handleResponse, this, null));
    }
    componentWillReceiveProps(nextProps) {
      if(nextProps.version.description !== this.props.version.description)
        this.setState({
          comment: nextProps.version.description,
          commentTmp: nextProps.version.description
        });
    }
    componentWillUnmount() {
      db.postStatus.removeWatch("poll-update-package-details");
    }
    enableEditField(e) {
      e.preventDefault();
      this.setState({
        activeEditField: true
      });
      this.changeCommentFieldLength();
    }
    disableEditField(e) {
      e.preventDefault();
      var that = this;
      setTimeout(function(){
        if(document.activeElement.className.indexOf('accept-button') == -1) {
          that.setState({
            activeEditField: false,
            commentTmp: that.state.comment,
          });
        }
      }, 1);
    }
    changeCommentFieldLength() {
      var val = this.refs.comment.value;
      this.setState({
        commentFieldLength: val.length,
        commentTmp: val
      });
    }
    handleSubmit(e) {
      e.preventDefault();
      this.setState({
        comment: this.refs.comment.value,
        commentTmp: this.refs.comment.value,
        activeEditField: false
      });
      SotaDispatcher.dispatch({
        actionType: 'update-package-details',
        name: this.props.version.id.name,
        version: this.props.version.id.version,
        data: {"description": this.refs.comment.value}
      });
    }
    handleResponse() {
      var postStatus = !_.isUndefined(db.postStatus.deref()) ? db.postStatus.deref() : undefined;
      if(!_.isUndefined(postStatus['update-package-details']) && postStatus['update-package-details'].status === 'success') {
        var that = this;
        delete postStatus['update-package-details'];
        db.postStatus.reset(postStatus);
        setTimeout(function() {
          that.props.queryPackagesData();
        }, 1);
      }
    }
    formBlacklist(action, e) {
      this.props.showBlacklistForm(this.props.version.id.name, this.props.version.id.version, action);
    }
    render() {
      return (
        <li className={"package-version " + (this.props.version.isBlackListed ? "package-blacklist" : "")}>
          <div className="package-left-box pull-left">
            <form>
              <fieldset>
                <input className="input-comment" name="comment" value={this.state.commentTmp} type="text" placeholder="Comment here." ref="comment" onKeyUp={this.changeCommentFieldLength} onChange={this.changeCommentFieldLength} onFocus={this.enableEditField} />
                    
                {this.state.commentFieldLength > 0 && this.state.activeEditField ?
                  <div className="pull-right">
                    <a href="#" className="cancel-button pull-right" onClick={this.disableEditField}>
                      <img src="/assets/img/icons/close_icon.png" alt="" />
                    </a>
                    &nbsp;
                    <a href="#" className="accept-button pull-right" onClick={this.handleSubmit}>
                      <img src="/assets/img/icons/accept_icon.png" alt="" />
                    </a>
                  </div>
                : null}
              </fieldset>
            </form>
          </div>
          <div className="package-right-box pull-right text-right">
            {(this.props.version.attributes.status == 'installed' || this.props.version.attributes.status == 'queued') ?
              <div className="package-statuses pull-right">
                <div className="package-version-name pull-left">
                  {!this.props.version.isBlackListed ? 
                    <span className="fa-stack package-status-circle">
                      <i className="fa fa-check-circle fa-stack-1x green" aria-hidden="true"></i>
                      <i className="fa fa-circle fa-stack-1x"></i>
                  
                      {this.props.version.attributes.status == 'installed' ? 
                        <i className="fa fa-check-circle fa-stack-1x green" aria-hidden="true"></i>
                      :
                        <i className="fa fa-dot-circle-o fa-stack-1x orange" aria-hidden="true"></i>
                      }
                    </span>
                  : 
                    <div className="pull-left">
                      <i className="fa fa-exclamation-triangle icon-exclamation"></i>
                    </div>
                  }
                
                  <span title={this.props.version.id.version}>{this.props.version.id.version}</span>
                </div>
                {this.props.version.isBlackListed ?
                  <div className="pull-left">
                    <button className="btn btn-blacklist btn-edit-blacklist" onClick={this.formBlacklist.bind(this, 'edit')} title="Edit blacklisted package version" id={"button-edit-blacklisted-package-" + this.props.version.id.name + "-" + this.props.version.id.version}></button>
                  </div>
                : 
                  <div className="pull-left">
                    <button className="btn btn-blacklist btn-add-blacklist" onClick={this.formBlacklist.bind(this, 'add')} title="Blacklist package version" id={"button-blacklist-package-" + this.props.version.id.name + "-" + this.props.version.id.version}></button>
                  </div>
                }
                
                <div className="package-version-right pull-right">
                  <span className={"package-status-label " + (this.props.version.attributes.status == 'installed' ? 'green' : 'orange')}>
                    {this.props.version.attributes.status}
                  </span>
                </div>
              </div>
            :
              <div className="package-statuses pull-right">
                <div className="package-version-name pull-left">
                  <span title={this.props.version.id.version}>{this.props.version.id.version}</span>
                </div>
                
                <div className="pull-left">
                {this.props.version.isBlackListed ?
                  <div className="pull-left">
                    <button className="btn btn-blacklist btn-edit-blacklist" onClick={this.formBlacklist.bind(this, 'edit')} title="Edit blacklisted package version" id={"button-edit-blacklisted-package-" + this.props.version.id.name + "-" + this.props.version.id.version}></button>
                  </div>
                : 
                  <div className="pull-left">
                    <button className="btn btn-blacklist btn-add-blacklist" onClick={this.formBlacklist.bind(this, 'add')} title="Blacklist package version" id={"button-blacklist-package-" + this.props.version.id.name + "-" + this.props.version.id.version}></button>
                  </div>
                }
                </div>
        
                <div className="package-version-right pull-right">
                  {!this.props.isQueued ? 
                    <button className="btn btn-action btn-install pull-right" id={"button-install-package-" + this.props.version.id.name + "-" + this.props.version.id.version} onClick={this.props.installPackage.bind(this, this.props.version.id.name, this.props.version.id.version)} disabled={this.props.isAutoInstallEnabled || this.props.version.isBlackListed}>
                      {this.props.isAutoInstallEnabled || this.props.version.isBlackListed ? 
                        <span className="text-stroke">Install</span> 
                      :
                        <span>Install</span>
                      }
                    </button>
                  :
                    <button className="btn btn-action btn-install pull-right" id={"button-install-package-" + this.props.version.id.name + "-" + this.props.version.id.version} disabled={true}>Install</button>
                  }
                </div>
              </div>
            }
          </div>
        </li>
      );
    }
  };

  return PackagesListItemDetailsVersion;
});
