import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { FlatButton } from 'material-ui';
import { Modal } from '../../partials';
import CredentialsTooltip from './CredentialsTooltip';
import _ from 'underscore';

@observer
class Guide extends Component {
    @observable shownTooltipInfoName = null;
    

    constructor(props) {
        super(props);
        this.showTooltipInfo = this.showTooltipInfo.bind(this);
        this.hideTooltipInfo = this.hideTooltipInfo.bind(this);
        this.downloadClient = this.downloadClient.bind(this);
        this.selectStep = this.selectStep.bind(this);
    }
    showTooltipInfo(name, e) {
        if(e) e.preventDefault();
        this.shownTooltipInfoName = name;
    }
    hideTooltipInfo(e) {
        if(e) e.preventDefault();
        this.shownTooltipInfoName = null;
    }
    componentWillMount() {
        document.body.className = "whitened";
        this.props.devicesStore.addStepToHistory(1);
        if(this.props.device.lastSeen) {
            this.props.devicesStore.addStepToHistory(3);
        }
    }    
    componentWillUnmount() {
        document.body.className = document.body.className.replace("whitened", "");
    }
    downloadClient(e) {
        e.stopPropagation();
        this.props.devicesStore.addStepToHistory(2);
    }
    selectStep(step) {
        if(_.includes(this.props.devicesStore.stepsHistory, step)) {
            this.props.devicesStore.addStepToHistory(step);
        }
    }
    render() {
        const { device, devicesStore } = this.props;        
        let activeStep = _.last(devicesStore.stepsHistory);
        const bodyActions = (
            <div className="body-actions">
                <FlatButton
                    label="Got it!"
                    type="submit"
                    className="btn-main"
                    onClick={this.hideTooltipInfo}
                />
            </div>
        );
        const copyProcessTooltipContent = (
            <div className="text-center">
                For debian packages, you can install from the command line with <br /><br />
                <pre>
                    dpkg -i ota-plus-client-[version].deb
                </pre><br />
                RPM packages can be installed from the command line with <br /><br />
                <pre>
                    rpm -i ota-plus-client-[version].rpm
                </pre>
                {bodyActions}
            </div>
        );
        const otherSystemTooltipContent = (
            <div className="text-center">
                The pre-built packages register the OTA Plus Client to start with systemd. <br /><br />
                If you use another init system, you'll need to 
                <a href="http://docs.atsgarage.com/start-manual/install-and-configure-the-ats-garage-client.html">
                    install ota-plus-client manually
                </a>.
                {bodyActions}
            </div>
        );
        const buildDeviceTooltipContent = (
            <div className="text-center">
                <span>
                    <strong>
                        The credentials file should be placed in /sysroot/boot/sota.toml.
                    </strong>
                </span><br /><br />
                For a step-by-step guide to building your first linux <br />
                distro with Yocto, &nbsp;
                <a href="http://docs.atsgarage.com/start-yocto/your-first-ostreeenabled-yocto-project.html" className="mint" target="_blank">
                    read the guide
                </a>.
                {bodyActions}
            </div>
        );
        return (
            <div className="wrapper-center">
                <div className="guide-install-device">
                    {activeStep !== 3 ?
                        <div className="title">
                            Device never seen online. You need to install the client on your device.
                        </div>
                    :
                        null
                    }
                    <div className={"inner" + (activeStep === 3 ? " online" : " offline")}>
                        <div className={"step first" + (activeStep === 1 ? " active" : activeStep === 2 ? " medium" : activeStep === 3 ? " smallest" : "")} onClick={this.selectStep.bind(this, 1)}>
                            <div className="title">
                                STEP 1
                            </div>
                            <div className="body">
                                { activeStep === 1 ? 
                                    <img src="/assets/img/device_step_one.png" alt="Image" />
                                :
                                    <img src="/assets/img/device_step_one_grey.png" alt="Image" />
                                }
                                <div className="subtitle">
                                    Download the OTA Plus Client for your distro/system architecture.
                                </div>
                                <div className="actions">
                                    <a href={"/api/v1/device_client/" + device.uuid + "/deb?package_manager=deb"} className={"btn-main" + (activeStep !== 1 ? " disabled" : "")} id="deb-download-button" target="_blank" onClick={this.downloadClient}>
                                        DEB Intel 64
                                    </a>
                                    <a href={"/api/v1/device_client/" + device.uuid + "/rpm?package_manager=rpm"} className={"btn-main" + (activeStep !== 1 ? " disabled" : "")} id="rpm-download-button" target="_blank" onClick={this.downloadClient}>
                                        RPM Intel 64
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className={"step second" + (activeStep === 2 ? " active" : activeStep === 1 || activeStep === 3 ? " medium" : "")} onClick={this.selectStep.bind(this, 2)}>
                            <div className="title">
                                STEP 2
                            </div>
                            <div className="body">
                                { activeStep === 2 ? 
                                    <img src="/assets/img/device_step_two.png" alt="Image" />
                                :
                                    <img src="/assets/img/device_step_two_grey.png" alt="Image" />
                                }
                                <div className="subtitle">
                                    Copy the package to your device, and install it using your package manager.
                                </div>
                            </div>
                        </div>
                        <div className={"step third" + (activeStep === 3 ? " active" : activeStep === 2 ? " medium" : activeStep === 1 ? " smallest" : "")} onClick={this.selectStep.bind(this, 3)}>
                            <div className="title">
                                CONGRATULATIONS
                            </div>
                            <div className="body">
                                { activeStep === 3 ? 
                                    <img src="/assets/img/device_step_three.png" alt="Image" />
                                :
                                    <img src="/assets/img/device_step_three_grey.png" alt="Image" />
                                }
                                {activeStep === 3 ?
                                    <div className="subtitle text-online">
                                        Your device is now online!
                                    </div>
                                :
                                    <div className="subtitle">
                                        Your device should now appear online!
                                    </div>
                                }
                                <div className="actions">
                                    <a href="#" className={"btn-main" + (activeStep !== 3 ? " disabled" : "")} id="manage-device-button">
                                        Manage your device
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal 
                    title="How to copy the Package to your device"
                    content={copyProcessTooltipContent}
                    shown={this.shownTooltipInfoName === 'copy_process'}
                />
                <Modal 
                    title="How to configure other init systems"
                    content={otherSystemTooltipContent}
                    shown={this.shownTooltipInfoName === 'other_system'}
                />
                <Modal 
                    title="How to build device"
                    content={buildDeviceTooltipContent}
                    shown={this.shownTooltipInfoName === 'build_device'}
                />
                <CredentialsTooltip 
                    shown={this.shownTooltipInfoName === 'unique_credentials'}
                    hide={this.hideTooltipInfo}
                    deviceId={device.uuid}
                    className="tooltip-credentials"
                />
            </div>
        );
    }
}

Guide.propTypes = {
    device: PropTypes.object.isRequired
}

export default Guide;