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
	isPackageQueued(version) {
		let isPackageQueued = false;
		let serial = this.props.hardwareStore.activeEcu.serial;
		_.each(this.props.devicesStore.multiTargetUpdates, (update, i) => {
			if(!_.isEmpty(update.targets[serial])) {
				if(version.filepath === update.targets[serial].image.filepath) {
					isPackageQueued = true;
				}
			}
		});
		return isPackageQueued;
	}
	isPackageInstalled(version) {
		const { devicesStore, hardwareStore } = this.props;
		let installed = false;
	    if(hardwareStore.activeEcu.type === 'primary' && this.props.devicesStore._getPrimaryFilepath() === version.filepath) {
		    installed = true;
	    }
	    if(hardwareStore.activeEcu.type === 'secondary') {
	    	let serial = hardwareStore.activeEcu.serial;
	        if(_.includes(this.props.devicesStore._getSecondaryFilepathsBySerial(serial), version.filepath)) {
		        installed = true;
	        }
	    }
		return installed;
	}
	generateIdTag(tagName, obj) {
		return tagName + '-' + obj.id.version.substring(0,8);
	}
    render() {
    	const { 
    		packagesStore, 
    		devicesStore, 
    		showPackageBlacklistModal,
    		installTufPackage, 
    	} = this.props;

    	let isPackageBlacklisted = false;
    	let isPackageQueued = false;
    	let isPackageInstalled = false;
    	let unmanaged = false;

    	const expandedPackage = packagesStore.expandedPackage;
    	if(!expandedPackage.unmanaged) {
	    	isPackageQueued = this.isPackageQueued(expandedPackage);
	    	isPackageInstalled = this.isPackageInstalled(expandedPackage);
    	} else {
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
        	<span>
	        	{!unmanaged ? 
    				<div className="details">
    					<div className="heading">
			        		<div className="title" id={"image-title-" + expandedPackage.id.name}>{expandedPackage.id.name}</div>
				        		<div className="status">
				        			{isPackageBlacklisted && isPackageInstalled ?
				        				<div className="blacklisted-installed">
				        					<span id={this.generateIdTag('blacklisted-and-installed', expandedPackage)}>
			        			 				{installed}
		        			 				</span>
		        			 				<img src="/assets/img/icons/red_cross.png" alt="" id={this.generateIdTag('blacklisted-and-installed-icon', expandedPackage)} /> 			 	        		
				        				</div>
				        			: isPackageBlacklisted ?
				        				<div className="blacklisted">
			        			 			<span id={this.generateIdTag('blacklisted', expandedPackage)}>
			        			 				{blacklisted}
			        			 			</span>
				        					<img src="/assets/img/icons/ban_red.png" alt="" id={this.generateIdTag('blacklisted-icon', expandedPackage)} />
				        				</div>
				        			: isPackageQueued ? 
				        				<div className="queued">
			        						<span id={this.generateIdTag('queued', expandedPackage)}>
			        							{queued}
			        						</span>
			        						<span className="fa-stack queued">
				                                <i className="fa fa-dot-circle-o fa-stack-1x" aria-hidden="true" id={this.generateIdTag('queued-icon', expandedPackage)}></i>
				                            </span>
			        					</div>
			        				: isPackageInstalled ? 
				        				<div className="installed">
				        					<span id={this.generateIdTag('image-installed', expandedPackage)}>
				        						{installed}
				        					</span>
				        					<img src="/assets/img/icons/green_tick.png" alt="" id={this.generateIdTag('installed-icon', expandedPackage)} />
				        				</div>
			        				: 
				        				<div className="not-installed" id={this.generateIdTag('not-installed', expandedPackage)}>
				        					{notInstalled}
				        				</div>
			    					}
				        		</div>
			        	</div>
			        	<div className="data">
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
	                                            <span className="app-label" key={index}>
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
                                            <span className="app-label">
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
                                        target: expandedPackage.filepath,
                                        hash: expandedPackage.packageHash,
                                        targetLength: expandedPackage.targetLength,
                                        targetFormat: expandedPackage.targetFormat,
                                        generateDiff: false
                                    })}
									disabled={
										isPackageQueued || 
										isPackageInstalled || 
										devicesStore.multiTargetUpdates.length
									}>
										{install}
								</button>
	        				</div>
						:
							null
						}
		        	</div>
    			: unmanaged ?
    				unmanagedPackage
    			:
		        	noPackage
                }
            	{isPackageBlacklisted && isPackageInstalled ?
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
    			}
			</span>
        );
    }
}

List.propTypes = {
    packagesStore: PropTypes.object.isRequired,
    devicesStore: PropTypes.object.isRequired,
    showPackageBlacklistModal: PropTypes.func.isRequired,
    installTufPackage: PropTypes.func.isRequired,
}

export default List;