define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      SotaDispatcher = require('sota-dispatcher'),
      db = require('stores/db'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      SearchBar = require('../searchbar'),
      PackagesHeader = require('./packages-header'),
      PackagesList = require('./packages-list'),
      AddPackage = require('../packages/add-package'),
      BlacklistForm = require('../packages/blacklist-form'),
      PackageStatusForm = require('./status/status-form'),
      ModalTooltip = require('../modal-tooltip'),
      Dropzone = require('../../mixins/dropzone'),
      Loader = require('../loader');

  class Packages extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.state = {
        areInitPackagesFound: undefined,
        searchablePackagesData: undefined,
        searchablePackagesDataNotChanged: undefined,
        ondevicesPackagesData: undefined,
        filterValue: '',
        selectedSort: 'asc',
        selectedType: 'ingarage',
        contentHeight: 300,
        isCreateModalShown: false,
        isBlacklistModalShown: false,
        isPackageStatusModalShown: false,
        isPackageTooltipShown: false,
        files: null,
        blacklistedPackageName: null,
        blacklistedPackageVersion: null,
        blacklistMode: null,
        chosenStatusPackageName: null,        
        expandedPackageName: null
      };
      this.changeFilter = this.changeFilter.bind(this);
      this.selectType = this.selectType.bind(this);
      this.setContentHeight = this.setContentHeight.bind(this);
      this.refreshSearchablePackagesData = this.refreshSearchablePackagesData.bind(this);
      this.setSearchablePackagesData = this.setSearchablePackagesData.bind(this);
      this.refreshOndevicesPackagesData = this.refreshOndevicesPackagesData.bind(this);
      this.setOndevicesPackagesData = this.setOndevicesPackagesData.bind(this);
      this.groupAndSortPackages = this.groupAndSortPackages.bind(this);
      this.setFakeHeader = this.setFakeHeader.bind(this);
      this.onFileDrop = this.onFileDrop.bind(this);
      this.openCreateModal = this.openCreateModal.bind(this);
      this.closeCreateModal = this.closeCreateModal.bind(this);
      this.showPackageTooltip = this.showPackageTooltip.bind(this);
      this.hidePackageTooltip = this.hidePackageTooltip.bind(this);
      this.showBlacklistModal = this.showBlacklistModal.bind(this);
      this.closeBlacklistModal = this.closeBlacklistModal.bind(this);
      this.showPackageStatusModal = this.showPackageStatusModal.bind(this);
      this.closePackageStatusModal = this.closePackageStatusModal.bind(this);
      this.expandPackage = this.expandPackage.bind(this);
      this.handlePackageCreated = this.handlePackageCreated.bind(this);
      this.handlePackageBlacklisted = this.handlePackageBlacklisted.bind(this);
      this.queryPackagesData = this.queryPackagesData.bind(this);
      SotaDispatcher.dispatch({actionType: 'search-packages-by-regex', regex: ''});
      SotaDispatcher.dispatch({actionType: 'get-ondevices-packages'});
      db.searchablePackages.addWatch("poll-packages", _.bind(this.refreshSearchablePackagesData, this, null));
      db.ondevicesPackages.addWatch("poll-ondevices-packages", _.bind(this.refreshOndevicesPackagesData, this, null));
      db.packageCreated.addWatch("package-created", _.bind(this.handlePackageCreated, this, null));
      db.packageBlacklisted.addWatch("package-blacklisted", _.bind(this.handlePackageBlacklisted, this, null));
    }
    componentDidMount() {
      window.addEventListener("resize", this.setContentHeight);
      this.setContentHeight();
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.setContentHeight);
      db.searchablePackages.reset();
      db.ondevicesPackages.reset();
      db.searchablePackages.removeWatch("poll-packages");
      db.ondevicesPackages.removeWatch("poll-ondevices-packages");
      db.packageCreated.removeWatch("package-created");
      db.packageBlacklisted.removeWatch("package-blacklisted");
      db.postStatus.removeWatch("poll-poststatus-packages-page");
    }
    openCreateModal(files) {
      files = files || null;
      this.setState({
        files: files,
        isCreateModalShown: true
      });
    }
    closeCreateModal() {
      this.setState({
        isCreateModalShown: false
      });
    }
    setContentHeight() {
      var windowHeight = jQuery(window).height();
      this.setState({
        contentHeight: windowHeight - jQuery('.grey-header').offset().top - jQuery('.grey-header').outerHeight()
      });
    }
    changeFilter(filter) {
      this.setState({filterValue: filter});
      SotaDispatcher.dispatch({actionType: 'search-packages-by-regex', regex: filter});
    }
    selectType(type, e) {
      e.preventDefault();
      this.setState({selectedType: type});
    }
    selectSort(sort, e) {
      e.preventDefault();
      this.setState({selectedSort: sort});
      this.setSearchablePackagesData(sort);
      this.setOndevicesPackagesData(sort);
    }
    refreshSearchablePackagesData() {
      this.setSearchablePackagesData();
    }
    setSearchablePackagesData(selectedSort) {
      selectedSort = selectedSort || this.state.selectedSort;
      var searchablePackages = db.searchablePackages.deref();
      if(!_.isUndefined(searchablePackages)) {
        if(_.isUndefined(this.state.searchablePackagesData))
          this.setState({areInitPackagesFound: Object.keys(searchablePackages).length > 0});
      
        searchablePackages = this.groupAndSortPackages(searchablePackages, selectedSort);
        if(this.state.selectedType === 'ingarage' && (_.isUndefined(this.state.searchablePackagesData) || Object.keys(this.state.searchablePackagesData)[0] !== Object.keys(searchablePackages)[0]))
          this.setFakeHeader(Object.keys(searchablePackages)[0]);
      }
      this.setState({
        searchablePackagesData: searchablePackages,
        searchablePackagesDataNotChanged: db.searchablePackages.deref()
      });
    }
    refreshOndevicesPackagesData() {
      this.setOndevicesPackagesData();
    }
    setOndevicesPackagesData(selectedSort) {
      selectedSort = selectedSort || this.state.selectedSort;
      var ondevicesPackages = db.ondevicesPackages.deref();
      if(!_.isUndefined(ondevicesPackages)) {
        ondevicesPackages = this.groupAndSortPackages(ondevicesPackages, selectedSort);
        if(this.state.selectedType === 'ondevices' && (_.isUndefined(this.state.ondevicesPackagesData) || Object.keys(this.state.ondevicesPackagesData)[0] !== Object.keys(ondevicesPackages)[0]))
          this.setFakeHeader(Object.keys(ondevicesPackages)[0]);
      }
      this.setState({
        ondevicesPackagesData: ondevicesPackages,
      });
    }
    groupAndSortPackages(packages, selectedSort) {
      var that = this;
      selectedSort = selectedSort || this.state.selectedSort;
      var groupedPackages = {};
      var sortedPackages = {};
      var installedCount = 0;
      var queuedCount = 0;
            
      _.each(packages, function(obj, index){
        var objKey = obj.id.name+'_'+obj.id.version;
        if(_.isUndefined(groupedPackages[obj.id.name]) || !groupedPackages[obj.id.name] instanceof Array ) {
          groupedPackages[obj.id.name] = new Object();
          groupedPackages[obj.id.name]['elements'] = [];
          groupedPackages[obj.id.name]['packageName'] = obj.id.name;
        }
        groupedPackages[obj.id.name]['elements'].push(packages[index]);
      });

      _.each(groupedPackages, function(obj, index) {
        groupedPackages[index]['elements'] = _.sortBy(obj['elements'], function(pack) {
          return pack.createdAt;
        }).reverse();
      });

      var specialGroup = {'#' : []};
      Object.keys(groupedPackages).sort(function(a, b) {
        if(selectedSort !== 'undefined' && selectedSort == 'desc')
          return b.localeCompare(a);
        else
          return a.localeCompare(b);
      }).forEach(function(key) {
        var firstLetter = key.charAt(0).toUpperCase();
        firstLetter = firstLetter.match(/[A-Z]/) ? firstLetter : '#';
        if(firstLetter != '#' && _.isUndefined(sortedPackages[firstLetter]) || !sortedPackages[firstLetter] instanceof Array ) {
           sortedPackages[firstLetter] = [];
        }
        if(firstLetter != '#')
          sortedPackages[firstLetter].push(groupedPackages[key]);
        else
          specialGroup['#'].push(groupedPackages[key]);
      });
      
      if(!_.isEmpty(specialGroup['#'])) {
        sortedPackages = (selectedSort !== 'undefined' && selectedSort == 'desc' ? Object.assign(specialGroup, sortedPackages) : Object.assign(sortedPackages, specialGroup));
      }
            
      return sortedPackages;
    }
    onFileDrop(files) {
      this.openCreateModal(files);
    }
    setFakeHeader(header) {
      this.setState({fakeHeaderLetter: header});
    }
    showPackageTooltip(e) {
      e.preventDefault();
      this.setState({isPackageTooltipShown: true});
    }
    hidePackageTooltip() {
      this.setState({isPackageTooltipShown: false});
    }
    showBlacklistModal(packageName, packageVersion, mode) {
      this.setState({
        isBlacklistModalShown: true,
        blacklistedPackageName: packageName,
        blacklistedPackageVersion: packageVersion,
        blacklistMode: mode
      });
    }
    closeBlacklistModal(ifRefreshData = false) {
      if(ifRefreshData) {
        var that = this;
        setTimeout(function() {
          SotaDispatcher.dispatch({actionType: 'search-packages-by-regex', regex: that.state.filterValue});
          SotaDispatcher.dispatch({actionType: 'impact-analysis'});
        }, 1);
      }
      this.setState({
        isBlacklistModalShown: false,
        blacklistedPackageName: null,
        blacklistedPackageVersion: null
      });
    }
    showPackageStatusModal(packageName) {
      this.setState({
        isPackageStatusModalShown: true,
        chosenStatusPackageName: packageName
      });
    }
    closePackageStatusModal() {
      this.setState({
        isPackageStatusModalShown: false,
        chosenStatusPackageName: null
      });
    }
    expandPackage(packageName) {
      this.setState({expandedPackageName: this.state.expandedPackageName == packageName ? null : packageName});
    }
    handlePackageCreated() {
      var packageCreated = db.packageCreated.deref();
      if(!_.isUndefined(packageCreated)) {
        var searchablePackagesNotChanged = this.state.searchablePackagesDataNotChanged;
        searchablePackagesNotChanged.push(packageCreated);
        var searchablePackages = this.groupAndSortPackages(searchablePackagesNotChanged, this.state.selectedSort);
        if(_.isUndefined(this.state.searchablePackagesData) || Object.keys(this.state.searchablePackagesData)[0] !== Object.keys(searchablePackages)[0])
          this.setFakeHeader(Object.keys(searchablePackages)[0]);
        this.setState({
          areInitPackagesFound: true,
          searchablePackagesData: searchablePackages,
          searchablePackagesDataNotChanged: searchablePackagesNotChanged
        });
        db.packageCreated.reset();
      }
    }
    handlePackageBlacklisted() {
      var packageBlacklisted = db.packageBlacklisted.deref();
      if(!_.isUndefined(packageBlacklisted)) {
        var searchablePackagesNotChanged = this.state.searchablePackagesDataNotChanged;
        _.each(searchablePackagesNotChanged, function(pack, index) {
          if(pack.id.name === packageBlacklisted.packageId.name && pack.id.version === packageBlacklisted.packageId.version) {
            searchablePackagesNotChanged[index].isBlackListed = true;
          }
        });
        this.setState({
          searchablePackagesData: this.groupAndSortPackages(searchablePackagesNotChanged, this.state.selectedSort),
          searchablePackagesDataNotChanged: searchablePackagesNotChanged
        });
        db.packageBlacklisted.reset();
      }
    }
    queryPackagesData() {
      SotaDispatcher.dispatch({actionType: 'search-packages-by-regex', regex: this.state.filterValue});
    }
    render() {
      var tooltipContent = (
        <div className="text-center margin-top-20">
          <strong>Packages</strong> are how ATS Garage represents software updates. A package might be <br />
          a traditional linux package like a .deb or .rpm, a custom file format passed off to a <br />
          processing script on your device, a simple metadata file informing a target device <br />
          what it should do, or even a complete filesystem image. <br /><br />
          The easiest way to get started is to use deb or rpm packages. <br />
          However, the most powerful features of ATS Garage require a bit more setup. If you want to <br />
          use custom update handlers or do incremental full-filesystem updates, we've got you covered.
        </div>
      );    
      return (
        <div>
          <PackagesHeader 
            packageCount={!_.isUndefined(this.state.searchablePackagesData) ? Object.keys(this.state.searchablePackagesData).length : undefined}/>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {!_.isUndefined(this.state.areInitPackagesFound) ? 
              this.state.areInitPackagesFound ?
                <div className="panel panel-ats">
                  <div className="panel-body">
                    <div className="panel-subheading">
                      <div className="container">
                        <SearchBar class="search-bar pull-left" 
                          inputId="search-packages-input" 
                          changeFilter={this.changeFilter}
                          isDisabled={this.state.selectedType === 'ondevices'}/>
                        <div className="sort-text pull-left">
                          {this.state.selectedSort == 'asc' ? 
                            <a href="#" onClick={this.selectSort.bind(this, 'desc')} id="link-sort-packages-desc"><i className="fa fa-long-arrow-up" aria-hidden="true"></i> A &gt; Z</a>
                          :
                            <a href="#" onClick={this.selectSort.bind(this, 'asc')} id="link-sort-packages-asc"><i className="fa fa-long-arrow-down" aria-hidden="true"></i> Z &gt; A</a>
                          }
                        </div>
                        {0 ?
                            <div className="devices-status-switch">
                              <div className={"switch-text" + (this.state.selectedType === 'ondevices' ? " selected" : "")}>On device</div>
                              <div className={"switch" + (this.state.selectedType === 'ingarage' ? " switchOn" : "")} onClick={this.selectType.bind(this, (this.state.selectedType === 'ingarage' ? 'ondevices' : 'ingarage'))}></div>
                              <div className={"switch-text" + (this.state.selectedType === 'ingarage' ? " selected" : "")}>In Garage</div>
                            </div>
                        : null}
                        <button onClick={this.openCreateModal} className="btn btn-main btn-add pull-right" id="button-add-new-package">
                          <i className="fa fa-plus"></i> &nbsp; Add new package
                        </button>
                      </div>
                    </div>
                    <div id="packages-wrapper" style={{height: this.state.contentHeight}}>
                      {this.state.selectedType === 'ingarage' ?
                        <PackagesList 
                          searchablePackagesData={this.state.searchablePackagesData}
                          contentHeight={this.state.contentHeight}
                          fakeHeaderLetter={this.state.fakeHeaderLetter}
                          selectedSort={this.state.selectedSort}
                          highlightedName={this.props.params.highlightedName}
                          showPackageStatusModal={this.showPackageStatusModal}
                          showBlacklistModal={this.showBlacklistModal}
                          expandedPackageName={this.state.expandedPackageName}
                          expandPackage={this.expandPackage}
                          onFileDrop={this.onFileDrop}
                          queryPackagesData={this.queryPackagesData}
                          isOndevicesList={false}
                          selectedType={this.state.selectedType}/>
                      : 
                        <PackagesList 
                          searchablePackagesData={this.state.ondevicesPackagesData}
                          contentHeight={this.state.contentHeight}
                          fakeHeaderLetter={this.state.fakeHeaderLetter}
                          selectedSort={this.state.selectedSort}
                          expandedPackageName={this.state.expandedPackageName}
                          expandPackage={this.expandPackage}
                          isOndevicesList={true}
                          selectedType={this.state.selectedType}/>
                      }
                    </div>
                  </div>
                </div>
              :
                <div className="packages-empty" style={{height: this.state.contentHeight}}>
                  <Dropzone ref="dropzone" onDrop={this.onFileDrop} multiple={false} disableClick={true} className="dnd-zone" activeClassName="dnd-zone-active">
                    <div className="center-xy padding-15">
                      <div className="font-22 white">You haven't created any packages yet.</div>
                      <div>
                        <button className="btn btn-confirm margin-top-20" onClick={this.openCreateModal}><i className="fa fa-plus"></i> Add new package</button>
                      </div>
                      <div className="margin-top-10">
                        <a href="#" className="font-18" onClick={this.showPackageTooltip}>
                          <span className="color-main"><strong>What is this?</strong></span>
                        </a>
                      </div>
                    </div>
                  </Dropzone>
                </div>
            : undefined}
          </VelocityTransitionGroup>
          {_.isUndefined(db.searchablePackages.deref()) ? 
            <div className="packages-empty" style={{height: this.state.contentHeight}}>
              <div className="center-xy padding-15">
                <Loader />
              </div>
            </div>
          : undefined}
          
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.isCreateModalShown ?
              <AddPackage
                files={this.state.files}
                closeForm={this.closeCreateModal}
                key="add-package"/>
            : null}
          </VelocityTransitionGroup>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.isBlacklistModalShown ?
              <BlacklistForm
                mode={this.state.blacklistMode}
                packageName={this.state.blacklistedPackageName}
                packageVersion={this.state.blacklistedPackageVersion}
                closeForm={this.closeBlacklistModal}/>
            : null}
          </VelocityTransitionGroup>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.isPackageStatusModalShown ?
              <PackageStatusForm 
                packageName={this.state.chosenStatusPackageName}
                closeForm={this.closePackageStatusModal}
                hasBetaAccess={this.props.hasBetaAccess}/>
            : null}
          </VelocityTransitionGroup>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.isPackageTooltipShown ?
              <ModalTooltip 
                title="Packages"
                body={tooltipContent}
                confirmButtonAction={this.hidePackageTooltip}/>
            : undefined}
          </VelocityTransitionGroup>
        </div>
      );
    }
  };

  return Packages;
});
