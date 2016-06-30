define(function(require) {
  var React = require('react');
        
  class InstallDevice extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div id="tutorial-install-device" className="tutorial-overlay">
          <div className="pull-left width-full">
            <span className="font-24"><strong>Choose the way you start</strong></span>
          </div>
          <div className="pull-left width-full margin-top-40">
            <div className="circle">1</div> <span className="font-20"><strong>Quick start</strong></span>
          </div>
  
          <div className="inner-box pull-left width-full font-16">
            <div className="col-md-4">
              <img src="/assets/img/icons/1_download.png" className="tutorial-icon pull-left" alt="" />
              <strong>1.</strong> Download OTA <br />client for Linux
              <div className="margin-top-5">
                <button className="btn btn-orange">DEBIAN 32</button>
                <span className="or-text">OR</span> 
                <button className="btn btn-orange">DEBIAN 64</button>
              </div>
            </div>
  
            <div className="col-md-4">
              <img src="/assets/img/icons/1_install.png" className="tutorial-icon pull-left" alt="" />
              <div className="margin-top-25">
                <strong>2.</strong> Install <br />debian file
              </div>
            </div>
  
            <div className="col-md-4">
              <img src="/assets/img/icons/1_success.png" className="tutorial-icon pull-left" alt="" />
              <div className="margin-top-5">
                <strong>3.</strong> The device <br />should show-up <br />online here!
              </div>
            </div>
          </div>
  
          <div className="margin-top-20 pull-left width-full">
            <div className="circle">2</div> <span className="font-20"><strong>Advanced</strong></span>
          </div>
  
          <div className="inner-box pull-left width-full font-16">
            <div className="col-md-4">
              <img src="/assets/img/icons/2_download_key.png" className="tutorial-icon pull-left" alt="" />
              <strong>1.</strong> Download the<br /> authentication keys
              <div className="margin-top-5">
                <button className="btn btn-orange">DOWNLOAD KEY</button>
              </div>
            </div>
  
            <div className="col-md-4">
              <img src="/assets/img/icons/2_get_code.png" className="tutorial-icon pull-left" alt="" />
              <div className="margin-top-5">
                <strong>2.</strong> Get the source <br />code and integrate <br />to your device
              </div>
            </div>
  
            <div className="col-md-4">
              <img src="/assets/img/icons/2_success.png" className="tutorial-icon pull-left" alt="" />
              <div className="margin-top-5">
                <strong>3.</strong> The device <br />should show-up<br /> online here!
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return InstallDevice;
});
