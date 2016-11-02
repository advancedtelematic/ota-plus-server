define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group');
        
  class InstallDevice extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isFirstInfoShown: false,
        isSecondInfoShown: false,
        tutorialHeight: '300px'
      };
      this.toggleFirstInfo = this.toggleFirstInfo.bind(this);
      this.toggleSecondInfo = this.toggleSecondInfo.bind(this);
      this.setTutorialHeight = this.setTutorialHeight.bind(this);
    }
    componentDidMount() {
      window.addEventListener("resize", this.setTutorialHeight);
      this.setTutorialHeight();
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.setTutorialHeight);
    }
    toggleFirstInfo(e) {
      e.preventDefault();
      this.setState({isFirstInfoShown: !this.state.isFirstInfoShown}); 
    }
    toggleSecondInfo(e) {
      e.preventDefault();
      this.setState({isSecondInfoShown: !this.state.isSecondInfoShown}); 
    }
    setTutorialHeight() {
      var windowHeight = jQuery(window).height();
      var offsetTop = jQuery('#tutorial-install-device').offset().top;
            
      this.setState({
        tutorialHeight: windowHeight - offsetTop
      });
    }
    render() {
      var storedThemeMode = localStorage.getItem('themeMode');
      var theme = 'atsgarage';
      switch(storedThemeMode) {
        case 'otaplus': 
          theme = 'otaplus';
        break;
        default:
        break;
      }
      return (
        <div id="tutorial-install-device-wrapper" style={{height: this.state.tutorialHeight}}>
          <div id="tutorial-install-device" className="center-xy">
            <div className="pull-left width-full text-center">
              <span className="font-24 white">Device never seen online. You need to install the client on your device.</span>
            </div>
            <div className="pull-left width-full margin-top-70">
              <span className="font-18"><strong>How to install your device:</strong></span>
            </div>
  
            <div className="inner-box pull-left width-full font-16">
              <div className="col-md-4">
                <div className="tutorial-img-box pull-left">
                  <img src={"/assets/img/icons/icon_download_" + theme + ".png"} className="tutorial-icon pull-left" alt="" />
                </div>
                <div className="tutorial-desc-box pull-left">
                  <strong>1.</strong> Download the OTA Plus Client for your distro/system architecture
                  <div className="margin-top-25">
                    <table className="table table-bordered table-striped table-condensed text-center">
                      <thead>
                        <tr>
                          <th>DEB</th>
                          <th>RPM</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <a href={"/api/v1/client/" + this.props.deviceUUID + "/deb/64"} className="btn btn-main" target="_blank">intel64</a>
                          </td>
                          <td>
                            <a href={"/api/v1/client/" + this.props.deviceUUID + "/rpm/64"} className="btn btn-main" target="_blank">intel64</a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="tutorial-img-box pull-left">
                  <img src={"/assets/img/icons/icon_install_" + theme + ".png"} className="tutorial-icon pull-left" alt="" />
                </div>
                <div className="tutorial-desc-box pull-left">
                  <div className="margin-top-10">
                    <strong>2.</strong> Copy the package to your <br /> device, and install it <br />using your package manager
                  </div>
                  <div className={"margin-top-25 font-12 color-main"}>
                    <i className="fa fa-cog" aria-hidden="true"></i> <a href="#" onClick={this.toggleFirstInfo} className="color-main">How do I do that?</a>
                  </div>
              
                  <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}} runOnMount={true}>
                    {this.state.isFirstInfoShown ? 
                      <div className="font-12 pull-left">
                        For debian packages, you can install from the command line with `dpkg -i ota-plus-client-[version].deb`. <br />
                        RPM packages can be installed from the command line with `rpm -i ota-plus-client-[version].rpm`.
                      </div>
                    : null}
                  </VelocityTransitionGroup>
      
                  <div className={"font-12 color-main"}>
                    <i className="fa fa-cog" aria-hidden="true"></i> <a href="#" onClick={this.toggleSecondInfo} className="color-main">I use an init system other than systemd.</a>
                  </div>
                  <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}} runOnMount={true}>
                    {this.state.isSecondInfoShown ? 
                      <div className="font-12">
                        The pre-built packages register the OTA Plus Client to start with systemd. <br />
                        If you use another init system, you'll need to install ota-plus-client manually.
                      </div>
                    : null}
                  </VelocityTransitionGroup>
                </div>
              </div>
  
              <div className="col-md-4">
                <div className="tutorial-img-box pull-left">
                  <img src={"/assets/img/icons/icon_check_" + theme + ".png"} className="tutorial-icon pull-left" alt="" />
                </div>
                <div className="tutorial-desc-box pull-left">
                  <div className="margin-top-5">
                    <strong>3.</strong> Your new device should <br />now appear online!
                  </div>
                </div>
              </div>
            </div>
  
            <div className="text-center font-20">
              - or -
            </div>
  
            <div className="margin-top-20 text-center pull-left width-full font-16">
              <a href={"/api/v1/client/" + this.props.deviceUUID + "/toml/64"} className="color-main" target="_blank">Download the unique credentials for this device</a>, 
              and then manually <a href="http://advancedtelematic.github.io/rvi_sota_server/cli/building-the-sota-client.html" className="color-main" target="_blank">build</a>&nbsp;
              and <a href="http://advancedtelematic.github.io/rvi_sota_server/cli/client-startup-and-configuration.html" className="color-main" target="_blank">install</a> the&nbsp;
              <a href="https://github.com/advancedtelematic/rvi_sota_client" className="color-main" target="_blank">open source OTA client</a>.
            </div>
          </div>
        </div>
      );
    }
  };

  return InstallDevice;
});
