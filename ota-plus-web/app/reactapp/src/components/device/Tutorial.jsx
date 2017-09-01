import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { FlatButton } from 'material-ui';
import { Modal } from '../../partials';
import CredentialsTooltip from './CredentialsTooltip';

@observer
class Tutorial extends Component {
    @observable shownTooltipInfoName = null;

    constructor(props) {
        super(props);
        this.showTooltipInfo = this.showTooltipInfo.bind(this);
        this.hideTooltipInfo = this.hideTooltipInfo.bind(this);
    }
    showTooltipInfo(name, e) {
        if(e) e.preventDefault();
        this.shownTooltipInfoName = name;
    }
    hideTooltipInfo(e) {
        if(e) e.preventDefault();
        this.shownTooltipInfoName = null;
    }
    render() {
        const { device } = this.props;
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
                <div className="tutorial-install-device">
                    <div className="title">
                        Device never seen online.
                    </div>
                    <div className="subtitle">
                        You need to install the client on your device.
                    </div>
                    <div className="inner">
                        <div className="common-steps">
                            <div className="steps-row">
                                <div className="lane first-lane">
                                    <div className="step first-step">
                                        <div className="lane-name">
                                            Yocto + TreeHub
                                        </div>
                                        <div className="step-inner">
                                            <div className="step-no">1.</div>
                                            <div className="step-desc">
                                                Download the unique<br />
                                                credentials for this device.
                                                <div className="wrapper-btn">
                                                    <FlatButton
                                                        label="Download"
                                                        type="submit"
                                                        className="btn-main"
                                                        id="yocto-download-button"
                                                        onClick={this.showTooltipInfo.bind(this, 'unique_credentials')}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="step second-step">
                                        <div className="step-inner">
                                            <div className="step-no">2.</div>
                                            <div className="step-desc">
                                                Build your device image <br />
                                                and add the credentials to it. <br /><br />
                                                <a href="#" className="link" onClick={this.showTooltipInfo.bind(this, 'build_device')}>
                                                    <i className="fa fa-cog" aria-hidden="true"></i> How do I do that?
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="step-divider">
                                or
                            </div>
                            <div className="steps-row">
                                <div className="lane second-lane">
                                    <div className="step first-step">
                                        <div className="lane-name">
                                            Quickstart
                                        </div>
                                        <div className="step-inner">
                                            <div className="step-no">1.</div>
                                            <div className="step-desc">
                                                Download the OTA Plus Client for<br />
                                                your distro/system architecture.
                                                <div className="buttons-ota-client">
                                                    <a href={"/api/v1/device_client/" + device.uuid + "/deb?package_manager=deb"} className="btn-main" id="deb-download-button" target="_blank">
                                                        DEB Intel 64
                                                    </a>
                                                    <a href={"/api/v1/device_client/" + device.uuid + "/rpm?package_manager=rpm"} className="btn-main" id="rpm-download-button" target="_blank">
                                                        RPM Intel 64
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="step second-step">
                                        <div className="step-inner">
                                            <div className="step-no">2.</div>
                                            <div className="step-desc">
                                                Copy the Package to your device, and  <br />
                                                install it using your package manager.
                                                <div>
                                                    <a href="#" className="link" onClick={this.showTooltipInfo.bind(this, 'copy_process')}>
                                                        <i className="fa fa-cog" aria-hidden="true"></i> How do I do that?
                                                    </a>
                                                </div>
                                                <div>
                                                    <a href="#" className="link" onClick={this.showTooltipInfo.bind(this, 'other_system')}>
                                                        <i className="fa fa-cog" aria-hidden="true"></i> I use an init system other than systemd.
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="last-step">
                            <div className="wrapper-center">
                                <div>
                                    <img src="/assets/img/icons/green_tick.png" alt="" />
                                    <br /><br />
                                    Your new device should now <br />
                                    appear online!
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

Tutorial.propTypes = {
    device: PropTypes.object.isRequired
}

export default Tutorial;