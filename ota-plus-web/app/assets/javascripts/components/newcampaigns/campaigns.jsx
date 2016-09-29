define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      SearchBar = require('es6!../searchbar'),
      CampaignsList = require('es6!./campaigns-list'),
      CampaignCreate = require('es6!./campaign-create'),
      CampaignWizard = require('es6!./wizard/wizard');

  class Campaigns extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        filterValue: '',
        campaignsListHeight: '300px',
        isCreateModalShown: false,
        isWizardShown: false
      };
      
      this.setCampaignsListHeight = this.setCampaignsListHeight.bind(this);
      this.changeFilter = this.changeFilter.bind(this);
      this.openCreateModal = this.openCreateModal.bind(this);
      this.closeCreateModal = this.closeCreateModal.bind(this);
      this.openWizard = this.openWizard.bind(this);
      this.closeWizard = this.closeWizard.bind(this);
      this.switchToWizard = this.switchToWizard.bind(this);
    }
    componentDidMount() {
      window.addEventListener("resize", this.setCampaignsListHeight);
      this.setCampaignsListHeight();
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.setCampaignsListHeight);
    }
    setCampaignsListHeight() {
      var windowHeight = jQuery(window).height();
      var offsetTop = jQuery('#campaigns-wrapper').offset().top;
            
      this.setState({
        campaignsListHeight: windowHeight - offsetTop
      });
    }
    openCreateModal() {
      this.setState({
        isCreateModalShown: true
      });
    }
    closeCreateModal() {
      this.setState({
        isCreateModalShown: false
      });
    }
    openWizard() {
      this.setState({
        isWizardShown: true
      });
    }
    closeWizard() {
      this.setState({
        isWizardShown: false
      });
    }
    switchToWizard() {
      this.setState({
        isCreateModalShown: false,
        isWizardShown: true
      });
    }
    changeFilter(filter) {
      this.setState({filterValue: filter});
    }
    render() {
      return (
        <div>
          <div className="panel panel-ats">
            <div className="panel-body">
              <div className="panel-subheading">
                <SearchBar class="search-bar pull-left" inputId="search-campaigns-input" changeFilter={this.changeFilter}/>

                <div className="pull-right margin-left-15">
                  <button onClick={this.openCreateModal} className="btn btn-add pull-right" id="button-add-new-campaign">
                    <i className="fa fa-plus"></i> &nbsp; Create new
                  </button>
                </div>
              </div>
              <div id="campaigns-wrapper" style={{height: this.state.campaignsListHeight}}>
                <CampaignsList 
                  filterValue={this.state.filterValue}/>
              </div>
            </div>
          </div>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.isCreateModalShown ?
              <CampaignCreate 
                closeModal={this.closeCreateModal}
                switchToWizard={this.switchToWizard}/>
            : null}
            {this.state.isWizardShown ?
              <CampaignWizard 
                closeWizard={this.closeWizard}/>
            : null}
          </VelocityTransitionGroup>
        </div>
      );
    }
  };

  Campaigns.contextTypes = {
    location: React.PropTypes.object,
  };

  return Campaigns;
});
