define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      SearchBar = require('../searchbar'),
      CampaignsList = require('./campaigns-list'),
      CampaignCreate = require('./campaign-create'),
      CampaignWizard = require('./wizard/wizard');
      
  class Campaigns extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        filterValue: '',
        selectedSort: 'asc',
        campaignsListHeight: '300px',
        isCreateModalShown: false,
        isWizardShown: false,
        campaignUUID: null
      };
      
      this.changeFilter = this.changeFilter.bind(this);
      this.setCampaignsListHeight = this.setCampaignsListHeight.bind(this);
      this.openCreateModal = this.openCreateModal.bind(this);
      this.closeCreateModal = this.closeCreateModal.bind(this);
      this.closeWizard = this.closeWizard.bind(this);
      this.openWizard = this.openWizard.bind(this);
    }
    componentDidMount() {
      window.addEventListener("resize", this.setCampaignsListHeight);
      this.setCampaignsListHeight();
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.setCampaignsListHeight);
    }
    changeFilter(filter) {
      this.setState({filterValue: filter});
    }
    selectSort(sort, e) {
      e.preventDefault();

      var name = jQuery(e.target).text();
      this.setState({
        selectedSort: sort
      });
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
    openWizard(campaignUUID, ifRefreshData = false) {
      if(ifRefreshData) {
        setTimeout(function() {
          SotaDispatcher.dispatch({actionType: 'get-campaigns'});
        }, 1);
      }
      this.setState({
        isCreateModalShown: false,
        isWizardShown: true,
        campaignUUID: campaignUUID
      });
    }
    closeWizard(ifRefreshData = false) {
      if(ifRefreshData) {
        setTimeout(function() {
          SotaDispatcher.dispatch({actionType: 'get-campaigns'});
        }, 1);
      }
      this.setState({
        isWizardShown: false
      });
    }
    render() {
      return (
        <div>
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
                    <i className="fa fa-plus"></i> &nbsp; Add new campaign
                  </button>
                </div>
              </div>
              <div id="campaigns-wrapper" style={{height: this.state.campaignsListHeight}}>
                <CampaignsList 
                  openWizard={this.openWizard}
                  filterValue={this.state.filterValue}
                  selectedSort={this.state.selectedSort}/>
              </div>
            </div>
          </div>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.isCreateModalShown ?
              <CampaignCreate 
                closeModal={this.closeCreateModal}
                openWizard={this.openWizard}/>
            : null}
            {this.state.isWizardShown ?
              <CampaignWizard 
                campaignUUID={this.state.campaignUUID}
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
