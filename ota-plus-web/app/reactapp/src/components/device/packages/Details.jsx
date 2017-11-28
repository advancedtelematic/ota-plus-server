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
		let installedOnPrimary = false;
		let installedOnSecondary = false;
		if(this.props.device.isDirector) {
		    if(this.props.activeEcu.type === 'primary' && this.props.devicesStore._getPrimaryHash() === version.id.version) {
			    installedOnPrimary = true;
		    }
		    if(this.props.activeEcu.type === 'secondary') {
		        if(_.includes(this.props.devicesStore._getSecondaryHashes(), version.id.version)) {
			        installedOnSecondary = true;
		        }
		    }
		}
		return isPackageInstalled || installedOnPrimary || installedOnSecondary;
	}
	isAutoInstallEnabled(version) {
		let isAutoInstallEnabled = _.find(this.props.packagesStore.deviceAutoInstalledPackages, (packageName) => {
			return packageName === version.id.name;
		});
		return isAutoInstallEnabled ? isAutoInstallEnabled : false;
	}
	generateIdTag(tagName, expandedPack) {
		return tagName + '-' + expandedPack.id.version.substring(0,8);
	}
    render() {
    	const { packagesStore, devicesStore, expandedPack, showPackageBlacklistModal, installPackage, multiTargetUpdate, device } = this.props;

    	let blacklistComment = null;
    	let isPackageBlacklisted = false;
    	let isPackageQueued = false;
    	let isPackageInstalled = false;
    	let isAutoInstallEnabled = false;
    	let unmanaged = false;

    	if(expandedPack && !expandedPack.unmanaged) {
	    	blacklistComment = this.getBlacklistComment(expandedPack);
	    	isPackageBlacklisted = this.isPackageBlacklisted(expandedPack);
	    	isPackageQueued = this.isPackageQueued(expandedPack);
	    	isPackageInstalled = this.isPackageInstalled(expandedPack);
	    	isAutoInstallEnabled = this.isAutoInstallEnabled(expandedPack);
    	} else if(expandedPack && expandedPack.unmanaged) {
    		unmanaged = true;
    	}
		const unmanagedPackage = (
			<div className="wrapper-center absolute-position">
                Unmanaged package
            </div>
		);
		const noPackage = (
    		<div className="wrapper-center absolute-position">
                Select the package version to see its details.
            </div>
		);
        return (
        	<div className="details-wrapper">
	        	{expandedPack && !unmanaged ? 
    				<div className="details">
    					<div className="top">
			        		<div className="title" id={"image-title-" + expandedPack.id.name}>{expandedPack.id.name}</div>
				        		<div className="status">
				        			{isPackageBlacklisted && (isPackageInstalled || expandedPack.isInstalled) ?
				        				<div className="status-container blacklisted-installed">
				        					<img src="/assets/img/icons/red_cross.png" alt="" id={this.generateIdTag('blacklisted-and-installed-icon', expandedPack)} />
			        			 			<span id={this.generateIdTag('blacklisted-and-installed', expandedPack)}>
			        			 				Installed
		        			 				</span>	        			 	        		
				        				</div>
				        			: isPackageBlacklisted ?
				        				<div className="status-container blacklisted">
				        					<img src="/assets/img/icons/ban_red.png" alt="" id={this.generateIdTag('blacklisted-icon', expandedPack)} />
			        			 			<span id={this.generateIdTag('blacklisted', expandedPack)}>
			        			 				Blacklisted
			        			 			</span>	        			 	        		
				        				</div>
				        			: isPackageQueued ? 
				        				<div className="status-container queued">
			        						<span className="fa-stack queued">
				                                <i className="fa fa-dot-circle-o fa-stack-1x" aria-hidden="true" id={this.generateIdTag('queued-icon', expandedPack)}></i>
				                            </span>
			        						<span className="status-name" id={this.generateIdTag('queued', expandedPack)}>
			        							Queued
			        						</span>
			        					</div>
			        				: isPackageInstalled || expandedPack.isInstalled ? 
				        				<div className="status-container installed">
				        					<img src="/assets/img/icons/green_tick.png" alt="" id={this.generateIdTag('installed-icon', expandedPack)} />
				        					<span id={this.generateIdTag('image-installed', expandedPack)}>
				        						Installed
				        					</span>
				        				</div>
			        				: 
				        				<div className="status-container not-installed" id={this.generateIdTag('not-installed', expandedPack)}>
				        					Not installed
				        				</div>
			    					}
				        		</div>
			        	</div>
    					{device.isDirector ?
    						<div>
					        	<div className="bottom">
					        		<span>
			        					<div className="name">
							        		<span className = "sub-title">Name:</span>
							        		<span className="value" id={this.generateIdTag('version-name-value', expandedPack)}>
							        			{expandedPack.customExists ? expandedPack.id.name : "Not reported"}
							        		</span>
						        		</div>
						        		<div className="created">
											<span className = "sub-title">Created at:</span>
							        		<span className="value" id={this.generateIdTag('version-created-at-value', expandedPack)}>
							        			{moment(expandedPack.createdAt).format("ddd MMM DD YYYY, h:mm:ss A")}
							        		</span>
						        		</div>
						        		<div className="updated">
											<span className = "sub-title">Updated at:</span>
							        		<span className="value" id={this.generateIdTag('version-updated-at-value', expandedPack)}>
							        			{moment(expandedPack.updatedAt).format("ddd MMM DD YYYY, h:mm:ss A")}
							        		</span>
						        		</div>
							            <div className="version">
							        		<span className = "sub-title">Version:</span>
							        		<span className="value" id={this.generateIdTag('version-value', expandedPack)}>
							        			{expandedPack.customExists ? expandedPack.id.version : "Not reported"}
							        		</span>
						        		</div>
						        		<div className="hash">
							        		<span className = "sub-title">Hash:</span>
							        		<span className="value" id={this.generateIdTag('version-hash-value', expandedPack)}>
							        			{expandedPack.packageHash}
							        		</span>
						        		</div>
						        		<div className="hash-length">
							        		<span className = "sub-title">Length:</span>
							        		<span className="value" id={this.generateIdTag('version-hash-length-value', expandedPack)}>
							        			{expandedPack.targetLength}
							        		</span>
						        		</div>
						        		<div className="hardware-ids">
							        		<span className = "sub-title">Hardware ids:</span>
							        		<span id={this.generateIdTag('version-hardware-ids-value', expandedPack)}>
							        			{_.map(expandedPack.hardwareIds, (hardwareId, index) => {
			                                         return (
			                                            <span className="hardware-label" key={index}>
			                                                {hardwareId}
			                                            </span>
			                                        );
			                                    })}
							        		</span>
						        		</div>
						        		{expandedPack.targetFormat ?
					        				<div className="target-format">
								        		<span className="sub-title">Format:</span>
								        		<span id={this.generateIdTag('version-target-format-value', expandedPack)}>
		                                            <span className="format-label">
		                                            	{expandedPack.targetFormat}
		                                            </span>
								        		</span>
							        		</div>
					        			:
					        				null
					        			}
			        				</span>
					        	</div>
					        	<div className="install multi-target">
									{!isPackageInstalled
										?
										<button
											className="btn-main btn-install"
											label="Install"
											title="Install"
											id={"button-install-package-" + expandedPack.id.name + "-" + expandedPack.id.version}
											onClick={multiTargetUpdate.bind(this, {
                                                target: expandedPack.imageName,
                                                hash: expandedPack.packageHash,
                                                targetLength: expandedPack.targetLength,
                                                targetFormat: expandedPack.targetFormat,
                                                generateDiff: false
                                            })}
											disabled={isPackageBlacklisted || isPackageQueued || isAutoInstallEnabled || isPackageInstalled || expandedPack.isInstalled || devicesStore.multiTargetUpdates.length }>
											Install
										</button>
										: ''
									}
					        	</div>
				        	</div>
						:
							<div>
								<div className="bottom">
					        		<span>
				        				<div className="version">
							        		<span className = "sub-title">Version / hash:</span>
							        		<span className="value" id={this.generateIdTag('version-hash-value', expandedPack)}>
							        			{expandedPack.id.version}
							        		</span>
						        		</div>
							            <div className="hash">
											<span className = "sub-title">Package identifier:</span>
							        		<span className="value" id={this.generateIdTag('package-identifier-value', expandedPack)}>
							        			{expandedPack.uuid}
							        		</span>
						        		</div>
						        		<div className="created">
											<span className = "sub-title">Created at:</span>
							        		<span className="value">
							        			{moment(expandedPack.createdAt).format("ddd MMM DD YYYY, h:mm:ss A")}
							        		</span>
						        		</div>
					        			<div className="vendor">
							            	<span className = "sub-title">Vendor:</span>
							        		<span className="value">
							        			{expandedPack.vendor}
							        		</span>
							            </div>
				        			</span>
					        	</div>
					        	<span>
						        	<div className="comments">
				        				<PackagesComment
				        					version={expandedPack}
				        					packagesStore={packagesStore}
				        					key={expandedPack.uuid}
						        		/>
						        	</div>
						        	<button className={"btn-blacklist blacklist" + (isPackageBlacklisted ? " package-blacklisted" : "")} id={this.generateIdTag('blacklist-button', expandedPack)}
						        		onClick={isPackageBlacklisted ? 
						        			showPackageBlacklistModal.bind(this, expandedPack.id.name, expandedPack.id.version, 'edit')
					        				: 
					        				showPackageBlacklistModal.bind(this, expandedPack.id.name, expandedPack.id.version, 'add')
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
					        	<div className="install">
				                	<button 
			                            className="btn-main btn-install"
			                            label="Install"
			                            title="Install"
			                            id={"button-install-package-" + expandedPack.id.name + "-" + expandedPack.id.version}
			                            onClick={installPackage.bind(this, {name: expandedPack.id.name, version: expandedPack.id.version})}
			                            disabled={isPackageBlacklisted || isPackageQueued || isAutoInstallEnabled || isPackageInstalled || expandedPack.isInstalled}>
			                            Install
			                        </button>
					        	</div>
				        	</div>
						}			        	
		        	</div>
    			: unmanaged ?
    				unmanagedPackage
    			:
		        	noPackage
                }
                {isPackageBlacklisted && (isPackageInstalled || (expandedPack && expandedPack.isInstalled)) ?
					<div className="additional-status bg-green">
						Installed
					</div>
                    : isPackageBlacklisted ?
						<div className="additional-status bg-green">
							Installed
					</div>
					: isPackageQueued ?
						<div className="additional-status bg-orange">
							Queued
						</div>
					: isPackageInstalled || (expandedPack && expandedPack.isInstalled) ?
						<div className="additional-status bg-green">
							Installed
						</div>
					:
					<div className="additional-status bg-grey">
						Not installed
					</div>
                }
			</div>

        );
    }
}

Details.propTypes = {
    packagesStore: PropTypes.object.isRequired,
    devicesStore: PropTypes.object.isRequired,
    expandedPack: PropTypes.object,
    showPackageBlacklistModal: PropTypes.func.isRequired,
    installPackage: PropTypes.func.isRequired,
    multiTargetUpdate: PropTypes.func.isRequired,
    device: PropTypes.object.isRequired,
}

export default Details;