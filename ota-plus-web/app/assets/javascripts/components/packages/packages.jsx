define(function(require) {
  var React = require('react'),
      Cookies = require('js-cookie'),
      db = require('stores/db'),
      PackagesList = require('es6!./packages-list'),
      SearchBar = require('es6!../searchbar');

  class Packages extends React.Component {
    constructor(props) {
      super(props);
      
      this.state = {
        selectedStatus: 'all',
        selectedStatusName: 'All',
        selectedSort: 'asc',
        selectedSortName: 'A > Z',
        selectedType: 'managed',
        selectedTypeName: 'Managed by ATS Garage',
        packagesListHeight: '300px',
        alertHidden: false
      }
      
      Cookies.set('alerts', {'packages': 'closed', 'queue': 'closed'});
      
      var alertCookie;
      try {
        alertCookie = JSON.parse(Cookies.get('alerts'));
      } catch (e) {
        alertCookie = {};
      }
      if(!_.isUndefined(alertCookie.packages) && alertCookie.packages === 'closed')
        this.state.alertHidden = true;
            
      this.setPackagesListHeight = this.setPackagesListHeight.bind(this);
    }
    componentDidMount() {
      var that = this;
      jQuery('#packages .close').click(function() {
        var timeoutId = setTimeout(function() {
          var alertCookie;
          try {
            alertCookie = JSON.parse(Cookies.get('alerts'));
          } catch (e) {
            alertCookie = {};
          }
          that.setPackagesListHeight();
          clearTimeout(timeoutId);
          alertCookie.packages = "closed";
          Cookies.set('alerts', alertCookie);
        }, 200);
      });
      window.addEventListener("resize", this.setPackagesListHeight);
      this.setPackagesListHeight();
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.setPackagesListHeight);
    }
    selectStatus(status, e) {
      e.preventDefault();

      var name = jQuery(e.target).text();
      this.setState({
        selectedStatus: status,
        selectedStatusName: name
      });
    }
    selectSort(sort, e) {
      e.preventDefault();

      var name = jQuery(e.target).text();
      this.setState({
        selectedSort: sort,
        selectedSortName: name
      });
    }
    selectType(type, e) {
      e.preventDefault();

      var name = jQuery(e.target).text();
      this.setState({
        selectedType: type,
        selectedTypeName: name
      });
    }
    setPackagesListHeight() {
      var windowHeight = jQuery(window).height();
      var footerHeight = jQuery('.panel-footer').outerHeight();
      var offsetTop = jQuery('#packages-wrapper').offset().top;
            
      this.setState({
        packagesListHeight: windowHeight - offsetTop - footerHeight
      });
    }
    render() {
      return (
        <div id="packages">
          <div className="panel-subheading">
            {!_.isUndefined(this.props.device) ? 
              this.context.location.pathname.toLowerCase().split('/')[1] != 'productiondevicedetails' &&
              (localStorage.getItem('firstProductionTestDevice') == this.props.device.id ||
              localStorage.getItem('secondProductionTestDevice') == this.props.device.id ||
              localStorage.getItem('thirdProductionTestDevice') == this.props.device.id) ?
                <input type="checkbox" id="selectPackages" className="pull-left"/>
              : null
            : undefined}

            <SearchBar class="search-bar pull-left" inputId="search-packages-input" changeFilter={this.props.changeFilter}/>

            <div className="pull-right margin-left-15">
              <button onClick={this.props.openForm} className="btn btn-add pull-right" id="button-add-new-package">
                <i className="fa fa-plus"></i> &nbsp; Add
              </button>
            </div>
    
            <div className="select-bar pull-right margin-left-15">
              <div className="select-bar-text">Status</div>
              <div className="btn-group">
                <button type="button" className="btn btn-grey dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span className="pull-left">{this.state.selectedStatusName} &nbsp;</span>
                  <span className="fa fa-angle-down pull-right"></span>
                </button>
                <ul className="dropdown-menu">
                  <li><a href="#" onClick={this.selectStatus.bind(this, 'all')}>All</a></li>
                  <li><a href="#" onClick={this.selectStatus.bind(this, 'installed')}>Installed</a></li>
                  <li><a href="#" onClick={this.selectStatus.bind(this, 'queued')}>Queued</a></li>
                  <li><a href="#" onClick={this.selectStatus.bind(this, 'uninstalled')}>Uninstalled</a></li>
                </ul>
              </div>
            </div>
    
             <div className="select-bar pull-right margin-left-15">
              <div className="select-bar-text">Type</div>
              <div className="btn-group">
                <button type="button" className="btn btn-grey dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span className="pull-left">{this.state.selectedTypeName} &nbsp;</span>
                  <span className="fa fa-angle-down pull-right"></span>
                </button>
                <ul className="dropdown-menu">
                  <li><a href="#" onClick={this.selectType.bind(this, 'all')}>All</a></li>
                  <li><a href="#" onClick={this.selectType.bind(this, 'managed')}>Managed by ATS Garage</a></li>
                  <li><a href="#" onClick={this.selectType.bind(this, 'unmanaged')}>Unmanaged</a></li>
                </ul>
              </div>
            </div>
            
            <div className="sort-text pull-right">
              {this.state.selectedSort == 'asc' ? 
                <a href="#" onClick={this.selectSort.bind(this, 'desc')} id="link-sort-packages-desc"><i className="fa fa-long-arrow-up" aria-hidden="true"></i> A &gt; Z</a>
              :
                <a href="#" onClick={this.selectSort.bind(this, 'asc')} id="link-sort-packages-asc"><i className="fa fa-long-arrow-down" aria-hidden="true"></i> Z &gt; A</a>
              }
            </div>
          </div>

          <div className={"alert alert-ats alert-dismissible" + (this.state.alertHidden ? " hidden" : '')} role="alert">
            <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true"></span></button>
            <img src="/assets/img/icons/info.png" className="icon-info" alt=""/>
            Click on the package you want to install and select its version to add it to the queue.
          </div>
  
          <div id="packages-wrapper" style={{height: this.state.packagesListHeight}}>
            {!_.isUndefined(this.props.device) ?
              <PackagesList
                packagesListHeight={this.state.packagesListHeight}
                selectedStatus={this.state.selectedStatus}
                selectedSort={this.state.selectedSort}
                selectedType={this.state.selectedType}
                filterValue={this.props.filterValue}
                setPackagesStatistics={this.props.setPackagesStatistics}
                countImpactAnalysisPackages={this.props.countImpactAnalysisPackages}
                device={this.props.device}
                onDrop={this.props.onDrop}
                showBlacklistForm={this.props.showBlacklistForm}
                closeBlacklistForm={this.props.closeBlacklistForm}/>
            : undefined}
          </div>
        </div>
      );
    }
  };

  Packages.contextTypes = {
    location: React.PropTypes.object,
  };

  return Packages;
});
