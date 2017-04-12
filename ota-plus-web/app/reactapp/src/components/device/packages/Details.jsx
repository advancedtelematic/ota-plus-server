import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { FlatButton } from 'material-ui';
import _ from 'underscore';

@observer
class Details extends Component {
	@observable version = null;

	@observable activeEditField = false;
    @observable showEditButton = false;
    @observable commentFieldLength = 0;
    @observable comment = null;
    @observable commentTmp = '';

    constructor(props) {
        super(props);
        this.enableEditField = this.enableEditField.bind(this);
        this.disableEditField = this.disableEditField.bind(this);
        this.changeCommentFieldLength = this.changeCommentFieldLength.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
            name: this.version.id.name,
            version: this.version.id.version,
            details: {
                description: this.refs.comment.value
            }
        };
        this.props.packagesStore.updatePackageDetails(data);
    }
    componentWillReceiveProps(nextProps) {
    	this.version = this.props.packagesStore._getPackageVersionByUuid(nextProps.packageVersionUuid);

    	if(!_.isUndefined(this.version)) {
    		this.comment = this.version.description;
        	this.commentTmp = this.version.description;
    	}
    }
    render() {
    	const { packageVersionUuid, showPackageBlacklistModal, packagesStore, installPackage } = this.props;
    	let isPackageQueued = false;
    	let isPackageInstalled = false;
    	let isAutoInstallEnabled = false;

    	if(!_.isUndefined(this.version) && this.version) {
    		console.log("Is blacklisted: " + this.version.isBlackListed);
	    	isPackageQueued = _.find(packagesStore.deviceQueue, (dev) => {
	    		return (dev.packageId.name === this.version.id.name) && (dev.packageId.version === this.version.id.version);
	    	});
	    	isPackageInstalled = _.find(packagesStore.devicePackages, (dev) => {
	    		return (dev.name === this.version.id.name) && (dev.version === this.version.id.version);
	    	});
	    	isAutoInstallEnabled = _.find(packagesStore.deviceAutoInstalledPackages, (packageName) => {
	    		return packageName === this.version.id.name;
	    	});
	    }

        return (
        	<div className="details-wrapper">
	        	{this.version ? 
		        	<div className="details">	        	
			        	<div className="top">
			        		<div className="title">{this.version.id.name}</div>
				        		<div className="status">
				        			{this.version.isBlackListed && isPackageInstalled ?
				        				<div className="status-container blacklisted-installed">
				        					<img src="/assets/img/icons/red_cross.png" alt="" />
			        			 			<span>Installed</span>	        			 	        		
				        				</div>
				        			: this.version.isBlackListed ?
				        				<div className="status-container blacklisted">
				        					<img src="/assets/img/icons/ban_red.png" alt="" />
			        			 			<span>Blacklisted</span>	        			 	        		
				        				</div>
				        			: isPackageQueued ? 
				        				<div className="status-container queued">
			        						<span className="fa-stack queued">
				                                <i className="fa fa-dot-circle-o fa-stack-1x" aria-hidden="true"></i>
				                            </span>
			        						<span className="status-name">Queued</span>
			        					</div>
			        				: isPackageInstalled ? 
				        				<div className="status-container installed">
				        					<img src="/assets/img/icons/check.png" alt="" />
				        					<span>Installed</span>
				        				</div>
			        				: 
				        				<div className="status-container not-installed">
				        					Not installed
				        				</div>
			    					}
				        		</div>
			        	</div>
			        	<div className="bottom">
				        	<div className="version">
				        		<span className = "sub-title">Version:</span>
				        		<span className="value">{this.version.id.version}</span>
			        		</div>
				            <div className="hash">
								<span className = "sub-title">Hash:</span>
				        		<span className="value">{this.version.uuid}</span>
			        		</div>
			        		<div className="created">
								<span className = "sub-title">Created:</span>
				        		<span className="value">{this.version.createdAt}</span>
			        		</div>
				            <div className="vendor">
				            	<span className = "sub-title">Vendor:</span>
				        		<span className="value">{this.version.vendor}</span>
				            </div>
			        	</div>
			        	<div className="comments">
			        		<textarea 
		                        className="input-comment" 
		                        name="comment" 
		                        value={this.commentTmp} 
		                        type="text" 
		                        placeholder="Comment here." 
		                        ref="comment" 
		                        onKeyUp={this.changeCommentFieldLength}
		                        onChange={this.changeCommentFieldLength}
		                        onFocus={this.enableEditField} />
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
			        	<div className={"blacklist" + (this.version.isBlackListed ? " package-blacklisted" : "")}>
			        		<span className="text">Blacklist package</span>
			        		{this.version.isBlackListed ?
				        		<button className="btn-blacklist edit" 
				        				onClick={showPackageBlacklistModal.bind(this, this.version.id.name, this.version.id.version, 'edit' )}>
				        		</button>
			        		:
			        			<button className="btn-blacklist" 
				        				onClick={showPackageBlacklistModal.bind(this, this.version.id.name, this.version.id.version, 'add' )}>
				        		</button>
			        		}
			        	</div>
			        	<div className="install">
		                	<button 
	                            className="btn-main btn-install"
	                            label="Install"
	                            title="Install"
	                            id={"button-install-package-" + this.version.id.name + "-" + this.version.id.version}
	                            onClick={installPackage.bind(this, {name: this.version.id.name, version: this.version.id.version})}
	                            disabled={this.version.isBlackListed || isPackageQueued || isAutoInstallEnabled || isPackageInstalled}>
	                            Install
	                        </button>
			        	</div>
		        	</div>     
	        	:
	        	<div className="wrapper-center absolute-position">
                    Select the package version to see its details.
                </div>
	        	}
        	</div>

        );
    }
}

Details.propTypes = {
    packageVersionUuid: PropTypes.string,
    packagesStore: PropTypes.object.isRequired
}


export default Details;