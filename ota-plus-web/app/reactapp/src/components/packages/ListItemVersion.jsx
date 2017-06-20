import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

@observer
class ListItemVersion extends Component {
    @observable activeEditField = false;
    @observable showEditButton = false;
    @observable commentFieldLength = 0;
    @observable comment = null;
    @observable commentTmp = null;

    constructor(props) {
        super(props);
        this.enableEditField = this.enableEditField.bind(this);
        this.disableEditField = this.disableEditField.bind(this);
        this.changeCommentFieldLength = this.changeCommentFieldLength.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentWillMount() {
        this.comment = this.props.version.description;
        this.commentTmp = this.props.version.description;
    }
    componentWillReceiveProps(nextProps) {
        this.comment = nextProps.version.description;
        this.commentTmp = nextProps.version.description;
    }
    enableEditField(e) {
        e.preventDefault();
        this.activeEditField = true;
        this.changeCommentFieldLength();
    }
    disableEditField(e) {
        e.preventDefault();
        var that = this;
        setTimeout(function(){
            if(document.activeElement.className.indexOf('accept-button') == -1) {
                that.activeEditField = false;
                that.commentTmp = that.comment;
            }
        }, 1);
    }
    changeCommentFieldLength() {
        var val = this.refs.comment.value;
        this.commentFieldLength = val.length;
        this.commentTmp = val;
    }
    handleSubmit(e) {
        e.preventDefault();
        this.comment = this.refs.comment.value;
        this.commentTmp = this.refs.comment.value;
        this.activeEditField = false;
        const data = {
            name: this.props.version.id.name,
            version: this.props.version.id.version,
            details: {
                description: this.refs.comment.value
            }
        };
        this.props.packagesStore.updatePackageDetails(data);
    }
    openBlacklistModal(mode, e) {
        this.props.showBlacklistModal(this.props.version.id.name, this.props.version.id.version, mode);
    }
    render() {
        const { version } = this.props;
        return (
            <li className={version.isBlackListed ? "blacklist" : ""}>
                <div className="left-box">
                    <input 
                        className="input-comment" 
                        name="comment" 
                        value={this.commentTmp} 
                        type="text" 
                        placeholder="Comment here." 
                        ref="comment" 
                        onKeyUp={this.changeCommentFieldLength} 
                        onChange={this.changeCommentFieldLength} 
                        onFocus={this.enableEditField}/>
                    {this.commentFieldLength > 0 && this.activeEditField ?
                        <div className="action-buttons">
                            <a href="#" className="cancel-button" onClick={this.disableEditField}>
                                <img src="/assets/img/icons/close_icon.png" alt="" />
                            </a>
                            &nbsp;
                            <a href="#" className="accept-button" onClick={this.handleSubmit}>
                                <img src="/assets/img/icons/accept_icon.png" alt="" />
                            </a>
                        </div>
                      : null}
                </div>
                <div className="right-box">
                    <span title={version.id.version} className="version-name">
                        {version.id.version}
                    </span>
                    {!version.inDirector ?
                        version.isBlackListed ?
                            <button 
                                className="btn-blacklist edit" 
                                onClick={this.openBlacklistModal.bind(this, 'edit')} 
                                title="Edit blacklisted package version" 
                                id={"button-edit-blacklisted-package-" + version.id.name + "-" + version.id.version}>
                            </button>
                        : 
                            <button 
                                className="btn-blacklist" 
                                onClick={this.openBlacklistModal.bind(this, 'add')} 
                                title="Blacklist package version" 
                                id={"button-blacklist-package-" + version.id.name + "-" + version.id.version}>
                            </button>
                    :
                        null
                    }
                    
                </div>
            </li>
        );
    }
}

ListItemVersion.propTypes = {
    version: PropTypes.object.isRequired,
    showBlacklistModal: PropTypes.func.isRequired,
    packagesStore: PropTypes.object.isRequired
}

export default ListItemVersion;