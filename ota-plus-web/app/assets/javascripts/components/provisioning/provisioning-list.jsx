define(function(require) {
  var React = require('react'),
      ProvisioningListItem = require('./provisioning-list-item');
      
  class ProvisioningList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        boxWidth: 350,
        provisioningWrapperHeight: this.props.contentHeight
      };
      this.setProvisioningWrapperHeight = this.setProvisioningWrapperHeight.bind(this);
      this.setBoxesWidth = this.setBoxesWidth.bind(this);
    }
    componentDidMount() {
      this.setProvisioningWrapperHeight(this.props.contentHeight);
      this.setBoxesWidth();
      window.addEventListener("resize", this.setBoxesWidth);
    }
    componentWillReceiveProps(nextProps) {
      if(nextProps.contentHeight !== this.props.contentHeight)
        this.setProvisioningWrapperHeight(nextProps.contentHeight);
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.setBoxesWidth);
    }
    setProvisioningWrapperHeight(contentHeight) {
      this.setState({provisioningWrapperHeight: contentHeight - jQuery('.provisioning-footer').outerHeight() - jQuery('.panel-subheading').outerHeight()});
    }
    setBoxesWidth() {
      var containerWidth = $('.intend-container').width();
      var minBoxWidth = 350;
      var howManyBoxesPerRow = Math.floor(containerWidth / minBoxWidth);
      this.setState({
        boxWidth: Math.floor(containerWidth / howManyBoxesPerRow),
      });
    }
    render() {
      return (
        <div id="provisioning-list" style={{height: this.state.provisioningWrapperHeight}}>
          <div className="container intend-container">
            <ProvisioningListItem 
              width={this.state.boxWidth}/>
          </div>
        </div>
      );
    }
  };

  return ProvisioningList;
});
