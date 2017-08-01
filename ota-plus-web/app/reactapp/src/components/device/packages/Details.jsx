import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observe, observable } from 'mobx';
import { FlatButton } from 'material-ui';
import { PackagesComment } from '.';
import _ from 'underscore';
import moment from 'moment';

@observer
class Details extends Component {
	constructor(props) {
		super(props);
	}
	getBlacklistComment(version) {
		let blacklisted = _.find(this.props.packagesStore.blacklist, (dev) => {
			return (dev.packageId.name === version.id.name) && (dev.packageId.version === version.id.version);
		});
		if(blacklisted) {
			return blacklisted.comment;
		}
		return null;
	}
	isPackageBlacklisted(version) {
		let isPackageBlacklisted = _.find(this.props.packagesStore.blacklist, (dev) => {
			return (dev.packageId.name === version.id.name) && (dev.packageId.version === version.id.version);
		});
		return isPackageBlacklisted ? isPackageBlacklisted : false;
	}
	isPackageQueued(version) {
		let isPackageQueued = _.find(this.props.packagesStore.deviceQueue, (dev) => {
			return (dev.packageId.name === version.id.name) && (dev.packageId.version === version.id.version);
		});
		return isPackageQueued ? isPackageQueued : false;
	}
	isPackageInstalled(version) {
		let isPackageInstalled = _.find(this.props.packagesStore.installedPackagesPerDevice[this.props.device.uuid], (dev) => {
			return (dev.packageId.name === version.id.name) && (dev.packageId.version === version.id.version);
		});
		return isPackageInstalled ? isPackageInstalled : false;
	}
	isAutoInstallEnabled(version) {
		let isAutoInstallEnabled = _.find(this.props.packagesStore.deviceAutoInstalledPackages, (packageName) => {
			return packageName === version.id.name;
		});
		return isAutoInstallEnabled ? isAutoInstallEnabled : false;
	}
	generateIdTag(tagName, expandedVersion) {
		return tagName + '-' + expandedVersion.id.version.substring(0,8);
	}
    render() {
    	const { packagesStore, devicesStore, expandedVersion, showPackageBlacklistModal, installPackage, multiTargetUpdate, device } = this.props;

    	let blacklistComment = null;
    	let isPackageBlacklisted = false;
    	let isPackageQueued = false;
    	let isPackageInstalled = false;
    	let isAutoInstallEnabled = false;
    	let unmanaged = false;

    	if(expandedVersion && !expandedVersion.unmanaged) {
	    	blacklistComment = this.getBlacklistComment(expandedVersion);
	    	isPackageBlacklisted = this.isPackageBlacklisted(expandedVersion);
	    	isPackageQueued = this.isPackageQueued(expandedVersion);
	    	isPackageInstalled = this.isPackageInstalled(expandedVersion);
	    	isAutoInstallEnabled = this.isAutoInstallEnabled(expandedVersion);
    	} else if(expandedVersion && expandedVersion.unmanaged) {
    		unmanaged = true;
    	}

        return (
        	<div className="details-wrapper">
	        	{expandedVersion && !unmanaged ? 
    				<div className="details">	        	
			        	<div className="top">
			        		<div className="title" id={"image-title-" + expandedVersion.id.name}>{expandedVersion.id.name}</div>
				        		<div className="status">
				        			{isPackageBlacklisted && (isPackageInstalled || expandedVersion.isInstalled) ?
				        				<div className="status-container blacklisted-installed">
				        					<img src="/assets/img/icons/red_cross.png" alt="" id={this.generateIdTag('blacklisted-and-installed-icon', expandedVersion)} />
			        			 			<span id={this.generateIdTag('blacklisted-and-installed', expandedVersion)}>
			        			 				Installed
		        			 				</span>	        			 	        		
				        				</div>
				        			: isPackageBlacklisted ?
				        				<div className="status-container blacklisted">
				        					<img src="/assets/img/icons/ban_red.png" alt="" id={this.generateIdTag('blacklisted-icon', expandedVersion)} />
			        			 			<span id={this.generateIdTag('blacklisted', expandedVersion)}>
			        			 				Blacklisted
			        			 			</span>	        			 	        		
				        				</div>
				        			: isPackageQueued ? 
				        				<div className="status-container queued">
			        						<span className="fa-stack queued">
				                                <i className="fa fa-dot-circle-o fa-stack-1x" aria-hidden="true" id={this.generateIdTag('queued-icon', expandedVersion)}></i>
				                            </span>
			        						<span className="status-name" id={this.generateIdTag('queued', expandedVersion)}>
			        							Queued
			        						</span>
			        					</div>
			        				: isPackageInstalled || expandedVersion.isInstalled ? 
				        				<div className="status-container installed">
				        					<img src="/assets/img/icons/check.png" alt="" id={this.generateIdTag('installed-icon', expandedVersion)} />
				        					<span id={this.generateIdTag('image-installed', expandedVersion)}>
				        						Installed
				        					</span>
				        				</div>
			        				: 
				        				<div className="status-container not-installed" id={this.generateIdTag('not-installed', expandedVersion)}>
				        					Not installed
				        				</div>
			    					}
				        		</div>
			        	</div>
			        	<div className="bottom">
			        		{!device.isDirector ? 
			        			<span>
			        				<div className="version">
						        		<span className = "sub-title">Version / hash:</span>
						        		<span className="value" id={this.generateIdTag('version-hash-value', expandedVersion)}>
						        			{expandedVersion.id.version}
						        		</span>
					        		</div>
						            <div className="hash">
										<span className = "sub-title">Package identifier:</span>
						        		<span className="value" id={this.generateIdTag('package-identifier-value', expandedVersion)}>
						        			{expandedVersion.uuid}
						        		</span>
					        		</div>
					        		<div className="created">
										<span className = "sub-title">Created at:</span>
						        		<span className="value">
						        			{moment(expandedVersion.createdAt).format("ddd MMM DD YYYY, h:mm:ss A")}
						        		</span>
					        		</div>
				        			<div className="vendor">
						            	<span className = "sub-title">Vendor:</span>
						        		<span className="value">
						        			{expandedVersion.vendor}
						        		</span>
						            </div>
			        			</span>
		        			:
		        				<span>
		        					<div className="name">
						        		<span className = "sub-title">Name:</span>
						        		<span className="value" id={this.generateIdTag('version-name-value', expandedVersion)}>
						        			{expandedVersion.customExists ? expandedVersion.id.name : "Not reported"}
						        		</span>
					        		</div>
					        		<div className="created">
										<span className = "sub-title">Created at:</span>
						        		<span className="value" id={this.generateIdTag('version-created-at-value', expandedVersion)}>
						        			{moment(expandedVersion.createdAt).format("ddd MMM DD YYYY, h:mm:ss A")}
						        		</span>
					        		</div>
					        		<div className="updated">
										<span className = "sub-title">Updated at:</span>
						        		<span className="value" id={this.generateIdTag('version-updated-at-value', expandedVersion)}>
						        			{moment(expandedVersion.updatedAt).format("ddd MMM DD YYYY, h:mm:ss A")}
						        		</span>
					        		</div>
						            <div className="version">
						        		<span className = "sub-title">Version:</span>
						        		<span className="value" id={this.generateIdTag('version-value', expandedVersion)}>
						        			{expandedVersion.customExists ? expandedVersion.id.version : "Not reported"}
						        		</span>
					        		</div>
					        		<div className="hash">
						        		<span className = "sub-title">Hash:</span>
						        		<span className="value" id={this.generateIdTag('version-hash-value', expandedVersion)}>
						        			{expandedVersion.packageHash}
						        		</span>
					        		</div>
					        		<div className="hash-length">
						        		<span className = "sub-title">Length:</span>
						        		<span className="value" id={this.generateIdTag('version-hash-length-value', expandedVersion)}>
						        			{expandedVersion.targetLength}
						        		</span>
					        		</div>
					        		<div className="hardware-ids">
						        		<span className = "sub-title">Hardware ids:</span>
						        		<span className="value" id={this.generateIdTag('version-hardware-ids-value', expandedVersion)}>
						        			{_.map(expandedVersion.hardwareIds, (hardwareId, index) => {
		                                         return (
		                                            <span className="hardware-label" key={index}>
		                                                {hardwareId}
		                                            </span>
		                                        );
		                                    })}
						        		</span>
					        		</div>
		        				</span>
		        			}				        	
			        	</div>
			        	{!device.isDirector ?
			        		<span>
					        	<div className="comments">
			        				<PackagesComment
			        					version={expandedVersion}
			        					packagesStore={packagesStore}
			        					key={expandedVersion.uuid}
					        		/>
					        	</div>
					        	<button className={"btn-blacklist blacklist" + (isPackageBlacklisted ? " package-blacklisted" : "")} id={this.generateIdTag('blacklist-button', expandedVersion)}
					        		onClick={isPackageBlacklisted ? 
					        			showPackageBlacklistModal.bind(this, expandedVersion.id.name, expandedVersion.id.version, 'edit')
				        				: 
				        				showPackageBlacklistModal.bind(this, expandedVersion.id.name, expandedVersion.id.version, 'add')
				        			}>
					        		<span className="text">			    
					        			{blacklistComment ?
					        				blacklistComment
				        				:
				        					!packagesStore.packagesBlacklistAsync.isFetching ?
				        						"Blacklist Package"
			        						:
			        							""
				        				}
					        		</span>
					        		{!isPackageBlacklisted ?
					        			<span className="btn-blacklist">
						        		</span>
					        		:
					        			null
					        		}
					        	</button>
				        	</span>
			        	:
			        		null 
			        	}
			        	{device.isDirector ?
		        			<div className="install multi-target">
			                	<button 
		                            className="btn-main btn-install"
		                            label="Install"
		                            title="Install"
		                            id={"button-install-package-" + expandedVersion.id.name + "-" + expandedVersion.id.version}
		                            onClick={multiTargetUpdate.bind(this, {
		                            	target: expandedVersion.imageName, 
		                            	hash: expandedVersion.packageHash, 
		                            	targetLength: expandedVersion.targetLength,
		                            	targetFormat: expandedVersion.targetFormat, 
		                            	generateDiff: false 
		                            })}
		                            disabled={isPackageBlacklisted || isPackageQueued || isAutoInstallEnabled || isPackageInstalled || expandedVersion.isInstalled || Object.keys(devicesStore.multiTargetUpdates[device.uuid]).length }>
		                            Install
		                        </button>
				        	</div>
		        		:
		        			<div className="install">
			                	<button 
		                            className="btn-main btn-install"
		                            label="Install"
		                            title="Install"
		                            id={"button-install-package-" + expandedVersion.id.name + "-" + expandedVersion.id.version}
		                            onClick={installPackage.bind(this, {name: expandedVersion.id.name, version: expandedVersion.id.version})}
		                            disabled={isPackageBlacklisted || isPackageQueued || isAutoInstallEnabled || isPackageInstalled || expandedVersion.isInstalled}>
		                            Install
		                        </button>
				        	</div>
			        	}
			        	
		        	</div>
    			: unmanaged ?
    				<div className="wrapper-center absolute-position">
	                    Unmanaged package
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
    packagesStore: PropTypes.object.isRequired,
    devicesStore: PropTypes.object.isRequired,
    expandedVersion: PropTypes.object,
    showPackageBlacklistModal: PropTypes.func.isRequired,
    installPackage: PropTypes.func.isRequired,
    multiTargetUpdate: PropTypes.func.isRequired,
    device: PropTypes.object.isRequired,
}

export default Details;