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
        isSecondInfoShown: false
      };
      
      this.toggleFirstInfo = this.toggleFirstInfo.bind(this);
      this.toggleSecondInfo = this.toggleSecondInfo.bind(this);
    }
    toggleFirstInfo(e) {
      e.preventDefault();
      this.setState({isFirstInfoShown: !this.state.isFirstInfoShown}); 
    }
    toggleSecondInfo(e) {
      e.preventDefault();
      this.setState({isSecondInfoShown: !this.state.isSecondInfoShown}); 
    }
    render() {
      console.log(this.props);
      return (
        <div id="tutorial-install-device" className="tutorial-overlay">
          <div className="pull-left width-full">
            <span className="font-24"><strong>Install your device</strong></span>
          </div>
  
          <div className="inner-box pull-left width-full font-16">
            <div className="col-md-4">
              <div className="tutorial-img-box pull-left">
                <img src="/assets/img/icons/1_download.png" className="tutorial-icon pull-left" alt="" />
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
                          <a href={"/api/v1/client/" + this.props.deviceId + "/deb/32"} className="btn btn-orange" target="_blank">intel32</a>
                        </td>
                        <td>
                          <a href={"/api/v1/client/" + this.props.deviceId + "/rpm/32"} className="btn btn-orange" target="_blank">intel32</a>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <a href={"/api/v1/client/" + this.props.deviceId + "/deb/64"} className="btn btn-orange" target="_blank">intel64</a>
                        </td>
                        <td>
                          <a href={"/api/v1/client/" + this.props.deviceId + "/rpm/64"} className="btn btn-orange" target="_blank">intel64</a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
  
            <div className="col-md-4">
              <div className="tutorial-img-box pull-left">
                <img src="/assets/img/icons/1_install.png" className="tutorial-icon pull-left" alt="" />
              </div>
              <div className="tutorial-desc-box pull-left">
                <div className="margin-top-10">
                  <strong>2.</strong> Install the package <br />with your package manager
                </div>
                <div className="margin-top-25 font-12 orange">
                  <i className="fa fa-cog" aria-hidden="true"></i> <a href="#" onClick={this.toggleFirstInfo} className="orange">How do I do that?</a>
                </div>
              
                <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}} runOnMount={true}>
                  {this.state.isFirstInfoShown ? 
                    <div className="font-12 pull-left">
                      For debian packages, you can install from the command line with `dpkg -i ota-plus-client-[version].deb`. <br />
                      RPM packages can be installed from the command line with `rpm -i ota-plus-client-[version].rpm`.
                    </div>
                  : null}
                </VelocityTransitionGroup>
      
                <div className="font-12 orange">
                  <i className="fa fa-cog" aria-hidden="true"></i> <a href="#" onClick={this.toggleSecondInfo} className="orange">I use an init system other than systemd.</a>
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
                <img src="/assets/img/icons/1_success.png" className="tutorial-icon pull-left" alt="" />
              </div>
              <div className="tutorial-desc-box pull-left">
                <div className="margin-top-5">
                  <strong>3.</strong> Your new device should <br />now appear online!
                </div>
              </div>
            </div>
          </div>
  
          <div className="margin-top-20 text-center pull-left width-full">
            <i className="fa fa-cog" aria-hidden="true"></i> Want to automate new device registration? Read the API documentation <a href="#" className="orange">here</a>.
          </div>
        </div>
      );
    }
  };

  return InstallDevice;
});
