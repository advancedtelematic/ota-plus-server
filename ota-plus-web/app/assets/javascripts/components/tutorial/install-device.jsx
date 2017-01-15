define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      ModalTooltip = require('../modal-tooltip'),
      UniqueCredentialsTooltip = require('./unique-credentials-tooltip');
        
  class InstallDevice extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        shownTooltipInfoName: null,
        tutorialHeight: 300
      };
      this.showTooltipInfo = this.showTooltipInfo.bind(this);
      this.hideTooltipInfo = this.hideTooltipInfo.bind(this);
      this.setTutorialHeight = this.setTutorialHeight.bind(this);
    }
    componentDidMount() {
      window.addEventListener("resize", this.setTutorialHeight);
      this.setTutorialHeight();
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.setTutorialHeight);
    }
    showTooltipInfo(name, e) {
      if(e) e.preventDefault();
      this.setState({shownTooltipInfoName: name});
    }
    hideTooltipInfo(e) {
      if(e) e.preventDefault();
      this.setState({shownTooltipInfoName: null});
    }
    setTutorialHeight() {
      var windowHeight = jQuery(window).height();
      this.setState({
        tutorialHeight: windowHeight - jQuery('.grey-header').offset().top - jQuery('.grey-header').outerHeight()
      });
    }
    render() {
      var copyProcessTooltipContent = (
        <div className="text-center">
          For debian packages, you can install from the command line with <br />
          <pre>dpkg -i ota-plus-client-[version].deb</pre> <br /><br />
          RPM packages can be installed from the command line with <br />
          <pre>rpm -i ota-plus-client-[version].rpm</pre>
        </div>
      );
      var otherSystemTooltipContent = (
        <div className="text-center">
          The pre-built packages register the OTA Plus Client to start with systemd. <br /><br />
          If you use another init system, you'll need to <a href="http://docs.atsgarage.com/start-manual/install-and-configure-the-ats-garage-client.html">install ota-plus-client manually</a>.
        </div>
      );
      var buildDeviceTooltipContent = (
        <div className="text-center">
          <span className="font-16"><strong>The credentials file should be placed in /sysroot/boot/sota.toml.</strong></span> <br /><br />
          For a step-by-step guide to building your first linux <br />
          distro with Yocto, read the guide <br />
          <a href="http://docs.atsgarage.com/start-yocto/ your-first-ostreeenabled-yocto-project.html">http://docs.atsgarage.com/start-yocto/ your-first-ostreeenabled-yocto-project.html</a>
        </div>
      );
      return (
        <div>
          <div className="tutorial-install-device" style={{height: this.state.tutorialHeight}}>
            <div className="center-xy text-center">
              <div className="font-24 white"><strong>Device never seen online.</strong></div>
              <div className="font-16">You need to install the client on your device.</div>
              
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
                            <div className="margin-top-20">
                              <a href="#" onClick={this.showTooltipInfo.bind(this, 'unique_credentials')} className="btn btn-confirm" target="_blank">Download</a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="step second-step">
                        <div className="step-inner">
                          <div className="step-no">2.</div>
                          <div className="step-desc">
                            Build your device image <br />
                            and add the credentials to it. 
                            <div className="margin-top-20"><a href="#" onClick={this.showTooltipInfo.bind(this, 'build_device')} className="font-12 color-main"><i className="fa fa-cog" aria-hidden="true"></i> How do I do that?</a></div>
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
                            <div className="margin-top-20">
                              <a href={"/api/v1/device_client/" + this.props.deviceUUID + "/deb?package_manager=deb"} className="btn btn-confirm btn-ota-client" target="_blank">DEB Intel 64</a>
                              <a href={"/api/v1/device_client/" + this.props.deviceUUID + "/rpm?package_manager=rpm"} className="btn btn-confirm btn-ota-client" target="_blank">RPM Intel 64</a>
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
                            <div className="margin-top-20"><a href="#" onClick={this.showTooltipInfo.bind(this, 'copy_process')} className="font-12 color-main"><i className="fa fa-cog" aria-hidden="true"></i> How do I do that?</a></div>
                            <div><a href="#" onClick={this.showTooltipInfo.bind(this, 'other_system')} className="font-12 color-main"><i className="fa fa-cog" aria-hidden="true"></i> I use an init system other than systemd.</a></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="last-step">
                  <div className="center-xy">
                    <img src="/assets/img/icons/check.png" alt="" />
                    <div className="margin-top-20">
                      Your new device should now <br />
                      appear online!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.shownTooltipInfoName === 'copy_process' ?
              <ModalTooltip 
                title="How to copy the Package to your device"
                body={copyProcessTooltipContent}
                confirmButtonAction={this.hideTooltipInfo}/>
            : undefined}
          </VelocityTransitionGroup>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.shownTooltipInfoName === 'other_system' ?
              <ModalTooltip 
                title="How to configure other init systems"
                body={otherSystemTooltipContent}
                confirmButtonAction={this.hideTooltipInfo}/>
            : undefined}
          </VelocityTransitionGroup>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.shownTooltipInfoName === 'unique_credentials' ?
              <UniqueCredentialsTooltip 
                deviceUUID={this.props.deviceUUID}
                closeModal={this.hideTooltipInfo}/>
            : undefined}
          </VelocityTransitionGroup>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.shownTooltipInfoName === 'build_device' ?
              <ModalTooltip 
                title="How to build device"
                body={buildDeviceTooltipContent}
                confirmButtonAction={this.hideTooltipInfo}/>
            : undefined}
          </VelocityTransitionGroup>
        </div>
      );
    }
  };
  
  InstallDevice.propTypes = {
    deviceUUID: React.PropTypes.string.isRequired
  };

  return InstallDevice;
});
