import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observe, observable } from 'mobx';
import { FlatButton } from 'material-ui';
import { PackagesComment } from '.';
import _ from 'underscore';
import moment from 'moment';

@observer
class Details extends Component {
    render() {
    	const { packagesStore, devicesStore, packageVersion, showPackageBlacklistModal, installPackage, multiTargetUpdate, device } = this.props;

    	let version = null;
    	if(device.isDirector && packageVersion.version === _.first(device.directorAttributes).image.hash.sha256) {
    		version = packagesStore._getPackageByVersion(packageVersion.version);
    		version.id = version.packageId;
    		delete version.packageId;  		
    	} else {
    		version = packagesStore._getPackageVersionByUuid(packageVersion.uuid);
    	}

       	let blacklistComment = null;
    	let allPackages = packagesStore.packages;
    	let blacklistedPackages = packagesStore.blacklist;
    	let isPackageQueued = false;
    	let isPackageInstalled = false;
    	let isAutoInstallEnabled = false;

    	if(!_.isUndefined(version) && version) {
			blacklistComment = version.blacklistComment;
			isPackageQueued = _.find(packagesStore.deviceQueue, (dev) => {
				return (dev.packageId.name === version.id.name) && (dev.packageId.version === version.id.version);
			});
			isPackageInstalled = _.find(packagesStore.installedPackagesPerDevice[device.uuid], (dev) => {
				return (dev.packageId.name === version.id.name) && (dev.packageId.version === version.id.version);
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
			        		<div className="title" id={"image-title-" + version.id.name}>{version.id.name}</div>
				        		<div className="status">
				        			{version.isBlackListed && (isPackageInstalled || version.isInstalled) ?
				        				<div className="status-container blacklisted-installed">
				        					<img src="/assets/img/icons/red_cross.png" alt="" id={"blacklisted-and-installed-icon-" + version.id.version.substring(0,8)} />
			        			 			<span id={"blacklisted-and-installed-" + version.id.version.substring(0,8)}>Installed</span>	        			 	        		
				        				</div>
				        			: version.isBlackListed ?
				        				<div className="status-container blacklisted">
				        					<img src="/assets/img/icons/ban_red.png" alt="" id={"blacklisted-icon-" + version.id.version.substring(0,8)} />
			        			 			<span id={"blacklisted-" + version.id.version.substring(0,8)}>Blacklisted</span>	        			 	        		
				        				</div>
				        			: isPackageQueued ? 
				        				<div className="status-container queued">
			        						<span className="fa-stack queued">
				                                <i className="fa fa-dot-circle-o fa-stack-1x" aria-hidden="true" id={"queued-icon-" + version.id.version.substring(0,8)}></i>
				                            </span>
			        						<span className="status-name" id={"queued-" + version.id.version.substring(0,8)}>Queued</span>
			        					</div>
			        				: isPackageInstalled || version.isInstalled ? 
				        				<div className="status-container installed">
				        					<img src="/assets/img/icons/check.png" alt="" id={"installed-icon-" + version.id.version.substring(0,8)} />
				        					<span id={"image-installed-" + version.id.version.substring(0,8)}>Installed</span>
				        				</div>
			        				: 
				        				<div className="status-container not-installed" id={"not-installed-" + version.id.version.substring(0,8)}>
				        					Not installed
				        				</div>
			    					}
				        		</div>
			        	</div>
			        	<div className="bottom">
				        	<div className="version">
				        		<span className = "sub-title">Version / hash:</span>
				        		<span className="value" id={"version-hash-value-" + version.id.version.substring(0,8)}>{version.id.version}</span>
			        		</div>
				            <div className="hash">
								<span className = "sub-title">Package identifier:</span>
				        		<span className="value" id={"package-identifier-value-" + version.id.version.substring(0,8)}>{version.uuid}</span>
			        		</div>
			        		<div className="created">
								<span className = "sub-title">Created at:</span>
				        		<span className="value">{moment(version.createdAt).format("ddd MMM DD YYYY, h:mm:ss A")}</span>
			        		</div>
			        		{!device.isDirector ?
			        			<div className="vendor">
					            	<span className = "sub-title">Vendor:</span>
					        		<span className="value">{version.vendor}</span>
					            </div>
		        			:
			        			null
			        		}
			        	</div>
			        	{!device.isDirector ?
				        	<div className="comments">
		        				<PackagesComment
		        					version={version}
		        					packagesStore={packagesStore}
		        					key={version.uuid}
				        		/>
				        	</div>
			        	:
			        		null 
			        	}
			        	<button className={"btn-blacklist blacklist" + (version.isBlackListed ? " package-blacklisted" : "")} id={"blacklist-button-" + version.id.version.substring(0,8)}
			        		onClick={version.isBlackListed ? 
			        			showPackageBlacklistModal.bind(this, version.id.name, version.id.version, 'edit')
		        				: 
		        				showPackageBlacklistModal.bind(this, version.id.name, version.id.version, 'add')
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
			        		{!version.isBlackListed ?
			        			<span className="btn-blacklist">
				        		</span>
			        		:
			        			null
			        		}
			        	</button>

			        	{device.isDirector ?
		        			<div className="install multi-target">
			                	<button 
		                            className="btn-main btn-install"
		                            label="Install"
		                            title="Install"
		                            id={"button-install-package-" + version.id.name + "-" + version.id.version}
		                            onClick={multiTargetUpdate.bind(this, {target: version.imageName, hash: version.checkSum})}
		                            disabled={version.isBlackListed || isPackageQueued || isAutoInstallEnabled || isPackageInstalled || version.isInstalled || Object.keys(devicesStore.multiTargetUpdates[device.uuid]).length}>
		                            Install
		                        </button>
				        	</div>
		        		:
		        			<div className="install">
			                	<button 
		                            className="btn-main btn-install"
		                            label="Install"
		                            title="Install"
		                            id={"button-install-package-" + version.id.name + "-" + version.id.version}
		                            onClick={installPackage.bind(this, {name: version.id.name, version: version.id.version})}
		                            disabled={version.isBlackListed || isPackageQueued || isAutoInstallEnabled || isPackageInstalled || version.isInstalled}>
		                            Install
		                        </button>
				        	</div>
			        	}
			        	
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
    packageVersion: PropTypes.object.isRequired,
    showPackageBlacklistModal: PropTypes.func.isRequired,
    installPackage: PropTypes.func.isRequired,
    multiTargetUpdate: PropTypes.func.isRequired,
    device: PropTypes.object.isRequired,
}

export default Details;