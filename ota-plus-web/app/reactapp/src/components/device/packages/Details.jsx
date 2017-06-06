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
    	const { packageVersion, showPackageBlacklistModal, packagesStore, installPackage } = this.props;

    	let version = packagesStore._getPackageVersionByUuid(packageVersion.uuid);
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
	    	isPackageInstalled = _.find(packagesStore.initialDevicePackages, (dev) => {
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
				        		<span className = "sub-title">Version / hash:</span>
				        		<span className="value">{version.id.version}</span>
			        		</div>
				            <div className="hash">
								<span className = "sub-title">Package identifier:</span>
				        		<span className="value">{version.uuid}</span>
			        		</div>
			        		<div className="created">
								<span className = "sub-title">Created at:</span>
				        		<span className="value">{moment(version.createdAt).format("ddd MMM DD YYYY, h:mm:ss A")}</span>
			        		</div>
				            <div className="vendor">
				            	<span className = "sub-title">Vendor:</span>
				        		<span className="value">{version.vendor}</span>
				            </div>
			        	</div>
			        	<div className="comments">
	        				<PackagesComment
	        					version={version}
	        					packagesStore={packagesStore}
	        					key={version.uuid}
			        		/>
			        	</div>
			        	<button className={"btn-blacklist blacklist" + (version.isBlackListed ? " package-blacklisted" : "")}
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