define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      Loader = require('../loader'),
      SearchBar = require('../searchbar'),
      CampaignsHeader = require('./campaigns-header'),
      CampaignsList = require('./campaigns-list'),
      CampaignCreate = require('./campaign-create'),
      CampaignWizard = require('./wizard/wizard'),
      CampaignRename = require('./campaign-rename'),
      ModalTooltip = require('../modal-tooltip');
      
  class Campaigns extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        campaignsData: undefined,
        campaignCount: undefined,
        filterValue: '',
        selectedSort: 'asc',
        contentHeight: 300,
        isCreateModalShown: false,
        isWizardShown: false,
        isRenameModalShown: false,
        actionCampaign: null,
        isCampaignTooltipShown: false,
      };
      this.setCampaignsData = this.setCampaignsData.bind(this);
      this.changeFilter = this.changeFilter.bind(this);
      this.setContentHeight = this.setContentHeight.bind(this);
      this.openCreateModal = this.openCreateModal.bind(this);
      this.closeCreateModal = this.closeCreateModal.bind(this);
      this.closeWizard = this.closeWizard.bind(this);
      this.openWizard = this.openWizard.bind(this);
      this.openRenameModal = this.openRenameModal.bind(this);
      this.closeRenameModal = this.closeRenameModal.bind(this);
      this.showCampaignTooltip = this.showCampaignTooltip.bind(this);
      this.hideCampaignTooltip = this.hideCampaignTooltip.bind(this);
      this.handleUpdateSpec = this.handleUpdateSpec.bind(this);
      SotaDispatcher.dispatch({actionType: 'get-campaigns'});
      db.campaigns.addWatch("poll-campaigns", _.bind(this.setCampaignsData, this, null));
      db.updateSpec.addWatch("poll-updatespec-campaigns", _.bind(this.handleUpdateSpec, this, null));
    }
    componentDidMount() {
      window.addEventListener("resize", this.setContentHeight);
      this.setContentHeight();
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.setContentHeight);
      db.campaigns.removeWatch("poll-campaigns");
      db.updateSpec.removeWatch("poll-updatespec-campaigns");
      db.campaigns.reset();
    }
    setCampaignsData(filterValue, selectedSort) {    
      var campaigns = db.campaigns.deref();
      if(!_.isUndefined(campaigns)) {
        if(filterValue) {            
          campaigns = _.filter(campaigns, function(campaign) {
            return campaign.name.indexOf(filterValue) > -1;
          });
        }
        campaigns.sort(function(a, b) {
          var aName = a.name;
          var bName = b.name;
          if(selectedSort !== 'undefined' && selectedSort == 'desc')
            return (aName.charAt(0) % 1 === 0 && bName.charAt(0) % 1 !== 0) ? -1 : bName.localeCompare(aName);
          else
            return (aName.charAt(0) % 1 === 0 && bName.charAt(0) % 1 !== 0) ? 1 : aName.localeCompare(bName);
        });
        var groupedCampaigns = {draft: [], running: [], finished: []};
        _.each(campaigns, function(campaign) {
          if(!campaign.launched) {
            groupedCampaigns.draft.push(campaign); 
          } else {
            var overallDevicesCount = 0;
            var overallUpdatedDevicesCount = 0;
            var overallFailedUpdates = 0;
            var overallSuccessfulUpdates = 0;
            var overallCancelledUpdates = 0;
            _.each(campaign.statistics, function(statistic) {
              overallDevicesCount += statistic.deviceCount;
              overallUpdatedDevicesCount += statistic.updatedDevices;
              overallFailedUpdates += statistic.failedUpdates;
              overallSuccessfulUpdates += statistic.successfulUpdates;
              overallCancelledUpdates += statistic.cancelledUpdates;
            });
            campaign.summary = {
              overallDevicesCount: overallDevicesCount,
              overallUpdatedDevicesCount: overallUpdatedDevicesCount,
              overallFailedUpdates: overallFailedUpdates,
              overallSuccessfulUpdates: overallSuccessfulUpdates,
              overallCancelledUpdates: overallCancelledUpdates
            };
            if(overallUpdatedDevicesCount < overallDevicesCount) {
              groupedCampaigns.running.push(campaign);
            } else {
              groupedCampaigns.finished.push(campaign);
            }
          }
        });
        this.setState({
          campaignsData: groupedCampaigns,
          campaignCount: Object.keys(campaigns).length
        });
      }
    }
    changeFilter(filter) {
      this.setCampaignsData(filter, this.state.selectedSort);
      this.setState({filterValue: filter});
    }
    selectSort(selectedSort, e) {
      e.preventDefault();
      this.setCampaignsData(this.state.filterValue, selectedSort);
      this.setState({selectedSort: selectedSort});
    }
    setContentHeight() {
      var windowHeight = jQuery(window).height();
      this.setState({
        contentHeight: windowHeight - jQuery('.grey-header').offset().top - jQuery('.grey-header').outerHeight()
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
    openWizard(campaign, ifRefreshData = false) {    
      if(ifRefreshData) {
        setTimeout(function() {
          SotaDispatcher.dispatch({actionType: 'get-campaigns'});
        }, 1);
      }
      this.setState({
        isCreateModalShown: false,
        isWizardShown: true,
        actionCampaign: campaign
      });
    }
    closeWizard(ifRefreshData = false) {
      if(ifRefreshData) {
        setTimeout(function() {
          SotaDispatcher.dispatch({actionType: 'get-campaigns'});
        }, 1);
      }
      this.setState({
        isWizardShown: false,
        actionCampaign: null
      });
    }
    openRenameModal(campaign) {
      this.setState({
        isRenameModalShown: true,
        actionCampaign: campaign
      });
    }
    closeRenameModal(ifRefreshData = false) {
      if(ifRefreshData) {
        setTimeout(function() {
          SotaDispatcher.dispatch({actionType: 'get-campaigns'});
        }, 1);
      }
      this.setState({
        isRenameModalShown: false,
        actionCampaign: null
      });
    }
    showCampaignTooltip(e) {
      e.preventDefault();
      this.setState({isCampaignTooltipShown: true});
    }
    hideCampaignTooltip() {
      this.setState({isCampaignTooltipShown: false});
    }
    handleUpdateSpec() {
      var updateSpec = db.updateSpec.deref();
      if(!_.isUndefined(updateSpec)) {
        SotaDispatcher.dispatch({actionType: 'get-campaigns'});
      }
    }
    render() {
      var tooltipContent = (
        <div className="text-center margin-top-20">
          You can install a package on an individual device from the device screen. <br />
          But when you want to push an update out to multiple devices at the same time, <br />
          whether it's 5 devices in the lab or 50,000 devices in the field, you'll <br />
          want to create <strong>update campaigns</strong>. An update campaign delivers one or more packages <br />
          to a specified group of updates. It also lets you track the progress of the campaign, <br />
          seeing how many of your devices successfully updated.<br /><br />
          To create a campaign, you'll need to have at least one <Link to="/packages" className="black"><i className="fa fa-external-link" aria-hidden="true"></i> package</Link>, and at least one <Link to="/devices"  className="black"><i className="fa fa-external-link" aria-hidden="true"></i> group</Link>.
        </div>
      );
    
      return (
        <div>
          <CampaignsHeader 
            campaignCount={this.state.campaignCount}/>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {!_.isUndefined(this.state.campaignCount) ? 
              this.state.campaignCount ?
                <div className="panel panel-ats" style={{height: this.state.contentHeight}}>
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
                    <div id="campaigns-wrapper">
                      <CampaignsList 
                        campaigns={this.state.campaignsData}
                        contentHeight={this.state.contentHeight}
                        selectedSort={this.state.selectedSort}
                        filterValue={this.state.filterValue}
                        openWizard={this.openWizard}
                        openCreateModal={this.openCreateModal}
                        openRenameModal={this.openRenameModal}/>
                    </div>
                  </div>
                </div>
              :
                <div className="campaigns-empty" style={{height: this.state.contentHeight}}>
                  <div className="center-xy padding-15">
                    <div className="font-22 white">You haven't created any update campaigns yet.</div>
                    <div>
                      <button className="btn btn-confirm margin-top-20" onClick={this.openCreateModal}><i className="fa fa-plus"></i> ADD NEW CAMPAIGN</button>
                    </div>
                    <div className="margin-top-10">
                      <a href="#" className="font-18" onClick={this.showCampaignTooltip}>
                        <span className="color-main"><strong>What is this?</strong></span>
                      </a>
                    </div>
                  </div>
                </div>
            : undefined}
          </VelocityTransitionGroup>
          {_.isUndefined(this.state.campaignsData) ? 
            <div className="campaigns-empty" style={{height: this.state.contentHeight}}>
              <div className="center-xy padding-15">
                <Loader />
              </div>
            </div>
          : undefined}
          
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.isCreateModalShown ?
              <CampaignCreate 
                closeModal={this.closeCreateModal}
                openWizard={this.openWizard}/>
            : null}
            {this.state.isWizardShown ?
              <CampaignWizard 
                campaignUUID={this.state.actionCampaign.id}
                closeWizard={this.closeWizard}/>
            : null}
          </VelocityTransitionGroup>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.isRenameModalShown ?
              <CampaignRename 
                closeModal={this.closeRenameModal}
                campaign={this.state.actionCampaign}/>
            : undefined}
          </VelocityTransitionGroup>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.isCampaignTooltipShown ?
              <ModalTooltip
                title="Update campaigns"
                body={tooltipContent}
                confirmButtonAction={this.hideCampaignTooltip}/>
            : undefined}
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
