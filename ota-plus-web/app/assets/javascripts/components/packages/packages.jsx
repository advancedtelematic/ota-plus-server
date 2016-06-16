define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      PackagesList = require('./packages-list'),
      SearchBar = require('../searchbar');
  
  class Packages extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        filterValue: '',
        selectStatus: 'all',
        selectStatusName: 'All',
        selectSort: 'asc',
        selectSortName: 'A > Z'
      }
      
      this.changeFilter = this.changeFilter.bind(this);
      this.setDivsHeight = this.setDivsHeight.bind(this);
    }
    componentDidMount() {
      var that = this;

      jQuery('.close').click(function() {
        setTimeout(function(){
          that.setDivsHeight();
        }, 200);
      });
      
      window.addEventListener("resize", this.setDivsHeight);
      
      setTimeout(function(){
        that.setDivsHeight();
      }, 100);

      var tmpIntervalId = setInterval(function(){
        if(jQuery('#packages-list').length && jQuery('#queue-wrapper').length) {
          that.setDivsHeight();
          clearInterval(tmpIntervalId);
        }
      }, 10);
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.setDivsHeight);
    }
    changeFilter(filter) {
      this.setState({filterValue: filter});  
    }
    selectStatus(status, e) {
      e.preventDefault();
      
      var name = jQuery(e.target).text();
      this.setState({
        selectStatus: status,
        selectStatusName: name
      });
    }
    selectSort(sort, e) {
      e.preventDefault();
      
      var name = jQuery(e.target).text();
      this.setState({
        selectSort: sort,
        selectSortName: name
      });
    }
    setDivsHeight() {
      this.setPackagesListHeight();
      this.setQueueListHeight();
    }
    setPackagesListHeight() {
      var windowHeight = jQuery(window).height();
      var footerHeight = jQuery('.panel-footer').outerHeight();
      var offsetTop = jQuery('#packages-list').offset().top;
      jQuery('#packages-list').height(windowHeight - offsetTop - footerHeight);
    }
    setQueueListHeight() {
      var windowHeight = jQuery(window).height();
      var footerHeight = jQuery('.panel-footer').outerHeight();
      var offsetTop = jQuery('#queue-wrapper').offset().top;
      jQuery('#queue-wrapper').height(windowHeight - offsetTop - footerHeight);
    }
    render() {      
      return (
        <div id="packages">
          <div className="panel-subheading">
            <SearchBar class="search-bar pull-left" changeFilter={this.changeFilter}/>     
            
            <div className="select-bar pull-right margin-left-30">
              <div className="select-bar-text">Sort by</div>
              <div className="btn-group">
                <button type="button" className="btn btn-grey dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {this.state.selectSortName} &nbsp;
                  <span className="fa fa-angle-down"></span>
                </button>
                <ul className="dropdown-menu">
                  <li><a href="#" onClick={this.selectSort.bind(this, 'asc')}>A &gt; Z</a></li>
                  <li><a href="#" onClick={this.selectSort.bind(this, 'desc')}>Z &gt; A</a></li>
                </ul>
              </div>
            </div>
            
            <div className="select-bar pull-right">
              <div className="select-bar-text">Status</div>
              <div className="btn-group">
                <button type="button" className="btn btn-grey dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {this.state.selectStatusName} &nbsp;
                  <span className="fa fa-angle-down"></span>
                </button>
                <ul className="dropdown-menu">
                  <li><a href="#" onClick={this.selectStatus.bind(this, 'all')}>All</a></li>
                  <li><a href="#" onClick={this.selectStatus.bind(this, 'installed')}>Installed</a></li>
                  <li><a href="#" onClick={this.selectStatus.bind(this, 'queued')}>Queued</a></li>
                  <li><a href="#" onClick={this.selectStatus.bind(this, 'uninstalled')}>Uninstalled</a></li>
                </ul>
              </div>
            </div>
          </div>
  
          <div className="alert alert-ats alert-dismissible fade in" role="alert">
            <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true"></span></button>
            <img src="/assets/img/icons/info.png" className="icon-info" alt=""/> 
            Click on the package you want to install and select its version to add it to the queue.
          </div>
          
          <PackagesList
            AllPackages={db.searchablePackages}
            AllPackagesPollEventName="poll-packages"
            AllPackagesDispatchObject={{actionType: 'search-packages-by-regex', regex: this.state.filterValue}}
            InstalledPackages={db.packagesForVin}
            InstalledPackagesPollEventName="poll-installed-packages"
            InstalledPackagesDispatchObject={{actionType: 'get-packages-for-vin', vin: this.props.vin}}
            QueuedPackages={db.packageQueueForVin}
            QueuedPackagesPollEventName="poll-queued-packages"
            QueuedPackagesDispatchObject={{actionType: 'get-package-queue-for-vin', vin: this.props.vin}}
            filterValue={this.state.filterValue}
            selectStatus={this.state.selectStatus}
            selectSort={this.state.selectSort}
            vin={this.props.vin}
            setPackagesStatistics={this.props.setPackagesStatistics}
            lastSeen={this.props.lastSeen}/>            
        </div>
      );
    }
  };

  return Packages;
});
