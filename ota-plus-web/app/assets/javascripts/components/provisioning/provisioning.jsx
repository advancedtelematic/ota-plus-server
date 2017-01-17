define(function(require) {
  var React = require('react'),
      SotaDispatcher = require('sota-dispatcher'),
      db = require('stores/db'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      ModalTooltip = require('../modal-tooltip'),
      ProvisioningHeader = require('./provisioning-header'),
      ProvisioningList = require('./provisioning-list'),
      ProvisioningCreate = require('./provisioning-create'),
      NoAccess = require('../noaccess'),
      Loader = require('../loader'),
      SearchBar = require('../searchbar');

  class Provisioning extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isProvisioningActivated: undefined,
        provisioningDetails: undefined,
        contentHeight: 300,
        isCreateModalShown: false,
        isProvisioningTooltipShown: false,
        filterValue: '',
        selectedSort: 'asc',
      };
      this.setContentHeight = this.setContentHeight.bind(this);
      this.showProvisioningTooltip = this.showProvisioningTooltip.bind(this);
      this.hideProvisioningTooltip = this.hideProvisioningTooltip.bind(this);
      this.handleProvisioningStatus = this.handleProvisioningStatus.bind(this);
      this.handleProvisioningDetails = this.handleProvisioningDetails.bind(this);
      this.activateProvisioning = this.activateProvisioning.bind(this);
      this.changeFilter = this.changeFilter.bind(this);
      this.openCreateModal = this.openCreateModal.bind(this);
      this.closeCreateModal = this.closeCreateModal.bind(this);
      SotaDispatcher.dispatch({actionType: 'get-provisioning-status'});
      db.provisioningStatus.addWatch("poll-provisioning-status", _.bind(this.handleProvisioningStatus, this, null));
      db.provisioningDetails.addWatch("poll-provisioning-details", _.bind(this.handleProvisioningDetails, this, null));
    }
    componentDidMount() {
      window.addEventListener("resize", this.setContentHeight);
      this.setContentHeight();
    }
    componentDidUpdate(prevProps, prevState) {
      if(prevProps.hasBetaAccess !== this.props.hasBetaAccess) {
        this.setContentHeight();
      }
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.setContentHeight);
      db.provisioningStatus.removeWatch("poll-provisioning-status");
      db.provisioningDetails.removeWatch("poll-provisioning-details");
      db.provisioningStatus.reset();
      db.provisioningDetails.reset();
    }
    setContentHeight() {
      if(this.props.hasBetaAccess) {
        var windowHeight = jQuery(window).height();
        this.setState({
          contentHeight: windowHeight - jQuery('.grey-header').offset().top - jQuery('.grey-header').outerHeight()
        });
      }
    }
    showProvisioningTooltip(e) {
      if(e) e.preventDefault();
      this.setState({isProvisioningTooltipShown: true});
    }
    hideProvisioningTooltip(e) {
      if(e) e.preventDefault();
      this.setState({isProvisioningTooltipShown: false});
    }
    handleProvisioningStatus() {
      var provisioningStatus = db.provisioningStatus.deref();
      if(!_.isUndefined(provisioningStatus)) {
        this.setState({isProvisioningActivated: provisioningStatus.active});
      }
    }
    handleProvisioningDetails() {
      var provisioningDetails = db.provisioningDetails.deref();
      if(!_.isUndefined(provisioningDetails)) {
        this.setState({provisioningDetails: provisioningDetails});
      }
    }
    activateProvisioning() {
      SotaDispatcher.dispatch({
        actionType: 'activate-provisioning-feature'
      });
    }
    changeFilter(filter) {
      this.setState({filterValue: filter});
    }
    selectSort(selectedSort, e) {
      e.preventDefault();
      this.setState({selectedSort: selectedSort});
    }
    openCreateModal() {
      this.setState({
        isCreateModalShown: true
      });
    }
    closeCreateModal(ifRefreshList = false) {
      if(ifRefreshList) {
        SotaDispatcher.dispatch({actionType: 'get-provisioning-credentials'});
      }
      this.setState({
        isCreateModalShown: false
      });
    }
    render() {
      var tooltipContent = (
        <div className="text-center">
          The provisioning API lets you programmatically add new devices <br />
          to ATS Garage as soon as they come online. You can, for example, <br />
          put the same image on 100 devices, power them on, and have them <br />
          register themselves (and download updates!) the first time they boot.<br /><br />
          If you enable this feature, you'll get an individual URL and API <br />
          credentials for the provisioning endpoints. Read the docs for more details.
        </div>
      );
      return (
        this.props.hasBetaAccess ?
          <div>
            <ProvisioningHeader />
            <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
              {!_.isUndefined(this.state.isProvisioningActivated) && (!this.state.isProvisioningActivated || !_.isUndefined(this.state.provisioningDetails)) ?
                !this.state.isProvisioningActivated ? 
                  <div className="provisioning-disabled" style={{height: this.state.contentHeight}}>
                    <div className="center-xy padding-15">
                      <div className="font-22">Provisioning not activated.</div>
                      <div className="margin-top-10">
                        <a href="#" className="font-18" onClick={this.showProvisioningTooltip}>
                          <span className="color-main"><strong>What is this?</strong></span>
                        </a>
                      </div>
                    </div>
                  </div>
                : 
                  <div className="provisioning-enabled" style={{height: this.state.contentHeight}}>
                    <div className="panel panel-ats">
                      <div className="panel-body">
                        <div className="panel-subheading">
                          <div className="pull-left">
                            <SearchBar class="search-bar pull-left" inputId="search-campaigns-input" changeFilter={this.changeFilter}/>
                          </div>
                          <div className="sort-text pull-left">
                            {this.state.selectedSort == 'asc' ? 
                              <a href="#" onClick={this.selectSort.bind(this, 'desc')} id="link-sort-packages-desc"><i className="fa fa-long-arrow-up" aria-hidden="true"></i> A &gt; Z</a>
                            :
                              <a href="#" onClick={this.selectSort.bind(this, 'asc')} id="link-sort-packages-asc"><i className="fa fa-long-arrow-down" aria-hidden="true"></i> Z &gt; A</a>
                            }
                          </div>
                          <div className="pull-right margin-left-15">
                            <button onClick={this.openCreateModal} className="btn btn-main btn-add pull-right" id="button-add-new-campaign">
                              <i className="fa fa-plus"></i> &nbsp; Add new key
                            </button>
                          </div>
                        </div>
                        <ProvisioningList 
                          contentHeight={this.state.contentHeight}/>
                      </div>
                    </div>
                    <div className="provisioning-footer">
                      My personal server Name: <span className="lightmint">{this.state.provisioningDetails.hostName}</span>       
                    </div>
                  </div>
              : 
                <div className="provisioning-disabled" style={{height: this.state.contentHeight}}>
                  <div className="center-xy padding-15">
                    <Loader />
                  </div>
                </div>
              }
            </VelocityTransitionGroup>
            <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
              {this.state.isCreateModalShown ?
                <ProvisioningCreate 
                  closeModal={this.closeCreateModal}/>
              : null}
            </VelocityTransitionGroup>
            <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
              {this.state.isProvisioningTooltipShown ?
                <ModalTooltip 
                  title="Provisioning"
                  body={tooltipContent}
                  isCloseButtonShown={true}
                  closeButtonLabel="Later"
                  closeButtonAction={this.hideProvisioningTooltip}
                  confirmButtonLabel="Activate Provisioning API"
                  confirmButtonAction={this.activateProvisioning}/>
              : undefined}
            </VelocityTransitionGroup>
          </div>
        :
          <NoAccess />
      );
    }
  }
  return Provisioning;
});
