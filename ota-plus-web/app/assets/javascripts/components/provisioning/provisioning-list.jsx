define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      Loader = require('../loader'),
      ProvisioningListItem = require('./provisioning-list-item');
      
  class ProvisioningList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        boxWidth: 350,
        provisioningWrapperHeight: this.props.contentHeight,
        provisioningCredentialsData: undefined
      };
      this.setProvisioningWrapperHeight = this.setProvisioningWrapperHeight.bind(this);
      this.setBoxesWidth = this.setBoxesWidth.bind(this);
      this.handleProvisioningCredentialsData = this.handleProvisioningCredentialsData.bind(this);
      SotaDispatcher.dispatch({actionType: 'get-provisioning-credentials'});
      db.provisioningCredentials.addWatch("poll-provisioning-credentials", _.bind(this.handleProvisioningCredentialsData, this, null));
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
      db.provisioningCredentials.removeWatch("poll-provisioning-credentials");
      db.provisioningCredentials.reset();
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
    handleProvisioningCredentialsData() {
      if(!_.isUndefined(db.provisioningCredentials.deref())) {
        this.setState({provisioningCredentialsData: db.provisioningCredentials.deref()});
      }
    }
    render() {
      var credentialsList = _.map(this.state.provisioningCredentialsData, function(credential) {
        return (
          <ProvisioningListItem 
            key={credential.id}
            credential={credential}
            width={this.state.boxWidth}/>
        );
      }, this);
      return (
        <div id="provisioning-list" style={{height: this.state.provisioningWrapperHeight}}>
          <div className="container intend-container height-100">
            <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}} runOnMount={true}>
              {!_.isUndefined(this.state.provisioningCredentialsData) ?
                credentialsList.length > 0 ? 
                  <span>
                    {credentialsList}
                  </span>
                :
                  <div className="col-md-12 text-center center-xy">
                    <span className="font-24 white">You haven't created any provisioning credentials yet.</span>
                  </div>
              : null}
            </VelocityTransitionGroup>
            {_.isUndefined(this.state.provisioningCredentialsData) ?
              <div className="col-md-12 text-center center-xy">
                <Loader className="white"/>
              </div>
            : undefined}
          </div>
        </div>
      );
    }
  };

  return ProvisioningList;
});
