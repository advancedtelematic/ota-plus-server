import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observe, observable } from 'mobx';
import { FlatButton } from 'material-ui';
import { PackagesComment } from '../packages';
import { Sequencer } from '../../../partials';
import _ from 'underscore';
import moment from 'moment';

const install = "Install";
const installed = "Installed";
const notInstalled = "Not Installed";
const blacklisted = "Blacklisted";
const queued = "Queued";

@observer
class List extends Component {
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
		let isPackageQueued = false;
		let serial = this.props.hardwareStore.activeEcu.serial;
		_.each(this.props.devicesStore.multiTargetUpdates, (update, i) => {
			if(!_.isEmpty(update.targets[serial])) {
				if(version.imageName === update.targets[serial].image.filepath) {
					isPackageQueued = true;
				}
			}
		});
		return isPackageQueued;
	}
	isPackageInstalled(version) {
		const { devicesStore, hardwareStore } = this.props;
		let installed = false;
		if(devicesStore.device.isDirector) {
		    if(hardwareStore.activeEcu.type === 'primary' && this.props.devicesStore._getPrimaryFilepath() === version.imageName) {
			    installed = true;
		    }
		    if(hardwareStore.activeEcu.type === 'secondary') {
		    	let serial = hardwareStore.activeEcu.serial;
		        if(_.includes(this.props.devicesStore._getSecondaryFilepathsBySerial(serial), version.imageName)) {
			        installed = true;
		        }
		    }
		}
		return installed;
	}
	isAutoInstallEnabled(version) {
		let isAutoInstallEnabled = _.find(this.props.packagesStore.deviceAutoInstalledPackages, (packageName) => {
			return packageName === version.id.name;
		});
		return isAutoInstallEnabled ? isAutoInstallEnabled : false;
	}
	generateIdTag(tagName, obj) {
		return tagName + '-' + obj.id.version.substring(0,8);
	}
    render() {
    	const { 
    		packagesStore, 
    		devicesStore, 
    		showPackageBlacklistModal,
    		installPackage, 
    		installTufPackage, 
    		showSequencer,
    		alphaPlusEnabled,
    	} = this.props;

    	let blacklistComment = null;
    	let isPackageBlacklisted = false;
    	let isPackageQueued = false;
    	let isPackageInstalled = false;
    	let isAutoInstallEnabled = false;
    	let unmanaged = false;
    	const expandedPackage = packagesStore.expandedPackage;
    	const device = devicesStore.device;

    	if(expandedPackage && !expandedPackage.unmanaged) {
	    	blacklistComment = this.getBlacklistComment(expandedPackage);
	    	isPackageBlacklisted = this.isPackageBlacklisted(expandedPackage);
	    	isPackageQueued = this.isPackageQueued(expandedPackage);
	    	isPackageInstalled = this.isPackageInstalled(expandedPackage);
	    	isAutoInstallEnabled = this.isAutoInstallEnabled(expandedPackage);
    	} else if(expandedPackage && expandedPackage.unmanaged) {
    		unmanaged = true;
    		isPackageInstalled = true;
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
	        	{expandedPackage && !unmanaged ? 
    				<div className="details">
    					<div className="top">
			        		<div className="title font-medium" id={"image-title-" + expandedPackage.id.name}>{expandedPackage.id.name}</div>
				        		<div className="status">
				        			{isPackageBlacklisted && isPackageInstalled ?
				        				<div className="status-container blacklisted-installed">
				        					<img src="/assets/img/icons/red_cross.png" alt="" id={this.generateIdTag('blacklisted-and-installed-icon', expandedPackage)} />
			        			 			<span id={this.generateIdTag('blacklisted-and-installed', expandedPackage)}>
			        			 				{installed}
		        			 				</span>	        			 	        		
				        				</div>
				        			: isPackageBlacklisted ?
				        				<div className="status-container blacklisted">
				        					<img src="/assets/img/icons/ban_red.png" alt="" id={this.generateIdTag('blacklisted-icon', expandedPackage)} />
			        			 			<span id={this.generateIdTag('blacklisted', expandedPackage)}>
			        			 				{blacklisted}
			        			 			</span>	        			 	        		
				        				</div>
				        			: isPackageQueued ? 
				        				<div className="status-container queued">
			        						<span className="fa-stack queued">
				                                <i className="fa fa-dot-circle-o fa-stack-1x" aria-hidden="true" id={this.generateIdTag('queued-icon', expandedPackage)}></i>
				                            </span>
			        						<span className="status-name" id={this.generateIdTag('queued', expandedPackage)}>
			        							{queued}
			        						</span>
			        					</div>
			        				: isPackageInstalled ? 
				        				<div className="status-container installed">
				        					<img src="/assets/img/icons/green_tick.png" alt="" id={this.generateIdTag('installed-icon', expandedPackage)} />
				        					<span id={this.generateIdTag('image-installed', expandedPackage)}>
				        						{installed}
				        					</span>
				        				</div>
			        				: 
				        				<div className="status-container not-installed" id={this.generateIdTag('not-installed', expandedPackage)}>
				        					{notInstalled}
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
							        		<span className="value" id={this.generateIdTag('version-name-value', expandedPackage)}>
							        			{expandedPackage.customExists ? expandedPackage.id.name : "Not reported"}
							        		</span>
						        		</div>
						        		<div className="created">
											<span className = "sub-title">Created at:</span>
							        		<span className="value" id={this.generateIdTag('version-created-at-value', expandedPackage)}>
							        			{moment(expandedPackage.createdAt).format("ddd MMM DD YYYY, h:mm:ss A")}
							        		</span>
						        		</div>
						        		<div className="updated">
											<span className = "sub-title">Updated at:</span>
							        		<span className="value" id={this.generateIdTag('version-updated-at-value', expandedPackage)}>
							        			{moment(expandedPackage.updatedAt).format("ddd MMM DD YYYY, h:mm:ss A")}
							        		</span>
						        		</div>
							            <div className="version">
							        		<span className = "sub-title">Version:</span>
							        		<span className="value" id={this.generateIdTag('version-value', expandedPackage)}>
							        			{expandedPackage.customExists ? expandedPackage.id.version : "Not reported"}
							        		</span>
						        		</div>
						        		<div className="hash">
							        		<span className = "sub-title">Hash:</span>
							        		<span className="value" id={this.generateIdTag('version-hash-value', expandedPackage)}>
							        			{expandedPackage.packageHash}
							        		</span>
						        		</div>
						        		<div className="hash-length">
							        		<span className = "sub-title">Length:</span>
							        		<span className="value" id={this.generateIdTag('version-hash-length-value', expandedPackage)}>
							        			{expandedPackage.targetLength}
							        		</span>
						        		</div>
						        		<div className="hardware-ids">
							        		<span className = "sub-title">Hardware ids:</span>
							        		<span id={this.generateIdTag('version-hardware-ids-value', expandedPackage)}>
							        			{_.map(expandedPackage.hardwareIds, (hardwareId, index) => {
			                                         return (
			                                            <span className="hardware-label" key={index}>
			                                                {hardwareId}
			                                            </span>
			                                        );
			                                    })}
							        		</span>
						        		</div>
						        		{expandedPackage.targetFormat ?
					        				<div className="target-format">
								        		<span className="sub-title">Format:</span>
								        		<span id={this.generateIdTag('version-target-format-value', expandedPackage)}>
		                                            <span className="format-label">
		                                            	{expandedPackage.targetFormat}
		                                            </span>
								        		</span>
							        		</div>
					        			:
					        				null
					        			}
			        				</span>
					        	</div>
								{!isPackageInstalled ?
									<div className="install multi-target">
										<button
											className="btn-main btn-install"
											label="Install"
											title="Install"
											id={"button-install-package-" + expandedPackage.id.name + "-" + expandedPackage.id.version}
											onClick={installTufPackage.bind(this, {
                                                target: expandedPackage.imageName,
                                                hash: expandedPackage.packageHash,
                                                targetLength: expandedPackage.targetLength,
                                                targetFormat: expandedPackage.targetFormat,
                                                generateDiff: false
                                            })}
											disabled={
												isPackageBlacklisted || 
												isPackageQueued || 
												isAutoInstallEnabled || 
												isPackageInstalled || 
												devicesStore.multiTargetUpdates.length
											}>
												{install}
										</button>
			        				</div>
								:
									null
								}
								{alphaPlusEnabled ?
									<div className="open-sequencer" onClick={showSequencer.bind(this)}>
										Show sequencer(click here)
									</div>
								:
									null
								}
								
				        	</div>
						:
							<div>
								<div className="bottom">
					        		<span>
				        				<div className="version">
							        		<span className = "sub-title">Version / hash:</span>
							        		<span className="value" id={this.generateIdTag('version-hash-value', expandedPackage)}>
							        			{expandedPackage.id.version}
							        		</span>
						        		</div>
							            <div className="hash">
											<span className = "sub-title">Package identifier:</span>
							        		<span className="value" id={this.generateIdTag('package-identifier-value', expandedPackage)}>
							        			{expandedPackage.uuid}
							        		</span>
						        		</div>
						        		<div className="created">
											<span className = "sub-title">Created at:</span>
							        		<span className="value">
							        			{moment(expandedPackage.createdAt).format("ddd MMM DD YYYY, h:mm:ss A")}
							        		</span>
						        		</div>
					        			<div className="vendor">
							            	<span className = "sub-title">Vendor:</span>
							        		<span className="value">
							        			{expandedPackage.vendor}
							        		</span>
							            </div>
				        			</span>
					        	</div>
					        	<span>
						        	<div className="comments">
				        				<PackagesComment
				        					version={expandedPackage}
				        					packagesStore={packagesStore}
				        					key={expandedPackage.uuid}
						        		/>
						        	</div>
						        	<button className={"btn-blacklist blacklist" + (isPackageBlacklisted ? " package-blacklisted" : "")} id={this.generateIdTag('blacklist-button', expandedPackage)}
						        		onClick={isPackageBlacklisted ? 
						        			showPackageBlacklistModal.bind(this, expandedPackage.id.name, expandedPackage.id.version, 'edit')
					        				: 
					        				showPackageBlacklistModal.bind(this, expandedPackage.id.name, expandedPackage.id.version, 'add')
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
			                            id={"button-install-package-" + expandedPackage.id.name + "-" + expandedPackage.id.version}
			                            onClick={installPackage.bind(this, {
			                            	name: expandedPackage.id.name, 
			                            	version: expandedPackage.id.version
			                            })}
			                            disabled={
			                            	isPackageBlacklisted || 
			                            	isPackageQueued || 
			                            	isAutoInstallEnabled || 
			                            	isPackageInstalled
			                            }>
			                            {install}
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
            	{expandedPackage ?
            		isPackageBlacklisted && isPackageInstalled ?
						<div className="additional-status bg-red">
							{installed}
						</div>
                    : isPackageBlacklisted ?
						<div className="additional-status bg-red">
							{blacklisted}
						</div>
					: isPackageQueued ?
						<div className="additional-status bg-orange">
							{queued}
						</div>
					: isPackageInstalled ?
						<div className="additional-status bg-green">
							{installed}
						</div>
					:
						<div className="additional-status bg-grey">
							{notInstalled}
						</div>
        		:
        			null
    			}
			</div>

        );
    }
}

List.propTypes = {
    packagesStore: PropTypes.object.isRequired,
    devicesStore: PropTypes.object.isRequired,
    showPackageBlacklistModal: PropTypes.func.isRequired,
    installPackage: PropTypes.func.isRequired,
    installTufPackage: PropTypes.func.isRequired,
}

export default List;