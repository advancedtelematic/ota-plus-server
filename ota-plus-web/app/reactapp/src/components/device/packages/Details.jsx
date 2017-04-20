import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observe, observable } from 'mobx';
import { FlatButton } from 'material-ui';
import _ from 'underscore';

@observer
class Comment extends Component {
	render() {
		const { comment, changeCommentFieldLength, enableEditField } = this.props;
		return (
			<textarea 
		                        className="input-comment" 
		                        name="comment" 
		                        value={comment} 
		                        type="text" 
		                        placeholder="Comment here." 
		                        onKeyUp={changeCommentFieldLength.bind(this)}
		                        onChange={changeCommentFieldLength.bind(this)}
		                        onFocus={enableEditField.bind(this)}
		                        />
		);
	}
}

@observer
class Details extends Component {
	@observable blacklistedPackage = null;

	@observable activeEditField = false;
    @observable showEditButton = false;
    @observable commentFieldLength = 0;
    @observable commentTmp = '';

    constructor(props) {
        super(props);
        this.enableEditField = this.enableEditField.bind(this);
        this.disableEditField = this.disableEditField.bind(this);
        this.changeCommentFieldLength = this.changeCommentFieldLength.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);        
    }    
   	enableEditField(e) {
   		if (e) e.preventDefault();
        this.activeEditField = true;
        // this.changeCommentFieldLength();
    }
    disableEditField(e) {
    	if (e) e.preventDefault();
        var that = this;
        setTimeout(function(){
            if(document.activeElement.className.indexOf('accept-button') == -1) {
                that.activeEditField = false;
                that.commentTmp = null;
            }
        }, 1);
    }
    changeCommentFieldLength(e) {
        var val = e.target.value;
        this.commentFieldLength = val.length;
        this.commentTmp = val;

        // const data = {
        //     name: 'jq',
        //     version: '0.0-2',
        //     details: {
        //         description: '2341234324123'
        //     }
        // };
        // this.props.packagesStore.updatePackageDetails(data);
    }
    handleSubmit(name, version, e) {
    	if (e) e.preventDefault();
        const data = {
            name: name,
            version: version,
            details: {
                description: this.commentTmp
            }
        };
        this.props.packagesStore.updatePackageDetails(data);
        this.commentTmp = null;
        this.activeEditField = false;
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
	    	console.log('desc', version.description)
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
			        		<Comment
			        			comment={this.commentTmp || version.description}
			        			changeCommentFieldLength={this.changeCommentFieldLength}
			        			enableEditField={this.enableEditField}
			        			key={packageVersion.uuid}
			        		/>
		                    {this.commentFieldLength > 0 && this.activeEditField ?
		                        <div className="action-buttons">
		                            <a href="#" className="cancel-button" onClick={this.disableEditField}>
		                                <img src="/assets/img/icons/close_icon.png" alt="" />
		                            </a>
		                            &nbsp;
		                            <a href="#" className="accept-button" onClick={this.handleSubmit.bind(this, version.id.name, version.id.version)}>
		                                <img src="/assets/img/icons/accept_icon.png" alt="" />
		                            </a>
		                        </div>
		                      : null}
			        	</div>
			        	<div className={"blacklist" + (version.isBlackListed ? " package-blacklisted" : "")}>
			        		<span className="text">			    
			        			{!_.isEmpty(this.props.packagesStore.blacklistedPackage) ? 
			        				this.props.packagesStore.blacklistedPackage.packageId.name === version.id.name 
			        				&& this.props.packagesStore.blacklistedPackage.packageId.version === version.id.version
			        				&& this.props.packagesStore.blacklistedPackage.comment !== '' ? 
				        				this.props.packagesStore.blacklistedPackage.comment
				        			:
				        				"Blacklist package"			        				
		        				:
		        					"Blacklist package"
		        				}
			        			
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