import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observe, observable } from 'mobx';
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

       //  this.uuidChangedHandler = observe(props.packageVersion, (change) => {
       //      console.log('Observing2...');
       //      if(change.name === 'uuid' && change.oldValue !== change.object[change.name]) {

       //      	setTimeout(() => {


       //      	this.version = this.props.packagesStore._getPackageVersionByUuid(props.packageVersion.uuid);
       //      	console.log(JSON.stringify(this.version));

		    	// if(!_.isUndefined(this.version)) {
		    	// 	this.comment = this.version.description;
		     //    	this.commentTmp = this.version.description;

		     //    	let data = {
			    // 		name: this.version.id.name,
			    //         version: this.version.id.version
			    // 	}
			    // 	this.props.packagesStore.fetchBlacklistedPackage(data);
			    // 	console.log('Finished');
		    	// }
		    	// }, 50)
       //      }
       //  });
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
    handleSubmit(name, version) {
        this.comment = this.refs.comment.value;
        this.commentTmp = this.refs.comment.value;
        this.activeEditField = false;
        const data = {
            name: name,
            version: version,
            details: {
                description: this.refs.comment.value
            }
        };
        this.props.packagesStore.updatePackageDetails(data);
    }
    render() {
    	const { packageVersion, showPackageBlacklistModal, packagesStore, installPackage } = this.props;

    	let version = this.props.packagesStore._getPackageVersionByUuid(packageVersion.uuid);

    	let isPackageQueued = false;
    	let isPackageInstalled = false;
    	let isAutoInstallEnabled = false;

    	if(!_.isUndefined(version) && version) {
	    	isPackageQueued = _.find(packagesStore.deviceQueue, (dev) => {
	    		return (dev.packageId.name === version.id.name) && (dev.packageId.version === version.id.version);
	    	});
	    	isPackageInstalled = _.find(packagesStore.devicePackages, (dev) => {
	    		return (dev.name === version.id.name) && (dev.version === version.id.version);
	    	});
	    	isAutoInstallEnabled = _.find(packagesStore.deviceAutoInstalledPackages, (packageName) => {
	    		return packageName === version.id.name;
	    	});
	    }	    

        return (
        	<div className="details-wrapper">
	        	{version ? 
		        	<div className="details">	        	
			        	<div className="top">
			        		<div className="title">{version.id.name}</div>
				        		<div className="status">
				        			{version.isBlackListed && isPackageInstalled ?
				        				<div className="status-container blacklisted-installed">
				        					<img src="/assets/img/icons/red_cross.png" alt="" />
			        			 			<span>Installed</span>	        			 	        		
				        				</div>
				        			: version.isBlackListed ?
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
				        		<span className="value">{version.id.version}</span>
			        		</div>
				            <div className="hash">
								<span className = "sub-title">Hash:</span>
				        		<span className="value">{version.uuid}</span>
			        		</div>
			        		<div className="created">
								<span className = "sub-title">Created:</span>
				        		<span className="value">{version.createdAt}</span>
			        		</div>
				            <div className="vendor">
				            	<span className = "sub-title">Vendor:</span>
				        		<span className="value">{version.vendor}</span>
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
		                            <a href="#" className="accept-button" onClick={this.handleSubmit(this, version.id.name, version.id.version)}>
		                                <img src="/assets/img/icons/accept_icon.png" alt="" />
		                            </a>
		                        </div>
		                      : null}
			        	</div>
			        	<div className={"blacklist" + (version.isBlackListed ? " package-blacklisted" : "")}>
			        		<span className="text">
			        			Blacklist package
			        		</span>
			        		{version.isBlackListed ?
				        		<button className="btn-blacklist edit" 
				        				onClick={showPackageBlacklistModal.bind(this, version.id.name, version.id.version, 'edit' )}>
				        		</button>
			        		:
			        			<button className="btn-blacklist" 
				        				onClick={showPackageBlacklistModal.bind(this, version.id.name, version.id.version, 'add' )}>
				        		</button>
			        		}
			        	</div>
			        	<div className="install">
		                	<button 
	                            className="btn-main btn-install"
	                            label="Install"
	                            title="Install"
	                            id={"button-install-package-" + version.id.name + "-" + version.id.version}
	                            onClick={installPackage.bind(this, {name: version.id.name, version: version.id.version})}
	                            disabled={version.isBlackListed || isPackageQueued || isAutoInstallEnabled || isPackageInstalled}>
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
    packageVersion: PropTypes.object.isRequired,
    packagesStore: PropTypes.object.isRequired
}


export default Details;