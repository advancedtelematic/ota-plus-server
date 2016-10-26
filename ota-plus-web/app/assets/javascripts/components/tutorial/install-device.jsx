define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group');
        
  class InstallDevice extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        tutorialHeight: '300px'
      };
      this.setTutorialHeight = this.setTutorialHeight.bind(this);
    }
    componentDidMount() {
      window.addEventListener("resize", this.setTutorialHeight);
      this.setTutorialHeight();
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.setTutorialHeight);
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
        <div id="tutorial-install-device" className="position-relative text-center" style={{height: this.state.tutorialHeight}}>
          <div className="center-xy padding-15">
            <a href={"/api/v1/client/" + this.props.deviceUUID + "/toml/64"} target="_blank">
              <img src={"/assets/img/icons/icon_download_" + theme + ".png"} alt="" /><br /><br />
              <span className="font-22">Download the credentials for this device.</span>
            </a><br /><br />
            Build the ota client from source if you don't have it already. <br />
            Too lazy to build yourself? Check out our pre-built reference-platform.
          </div>
        </div>
      );
    }
  };

  return InstallDevice;
});
