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
        selectSortName: 'A > Z',
        intervalId: null,
        timeoutId: null
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

      var intervalId = setInterval(function(){
        that.setDivsHeight();
      }, 50);

      var timeoutId = setTimeout(function() {
        clearInterval(intervalId);
      }, 5000);

      this.setState({
        intervalId: intervalId,
        timeoutId: timeoutId
      });
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.setDivsHeight);
      clearInterval(this.state.intervalId);
      clearTimeout(this.state.timeoutId);
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
      document.body.dispatchEvent(new CustomEvent("refreshList"));
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
            {this.context.location.pathname.toLowerCase().split('/')[1] != 'productiondevicedetails' &&
            (localStorage.getItem('firstProductionTestDevice') == this.props.device ||
            localStorage.getItem('secondProductionTestDevice') == this.props.device ||
            localStorage.getItem('thirdProductionTestDevice') == this.props.device) ?
              <input type="checkbox" id="selectPackages" className="pull-left"/>
            : null}

            <SearchBar class="search-bar pull-left" changeFilter={this.changeFilter}/>

            <div className="select-bar pull-right margin-left-30">
              <div className="select-bar-text">Sort by</div>
              <div className="btn-group">
                <button type="button" className="btn btn-grey dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span className="pull-left">{this.state.selectSortName} &nbsp;</span>
                  <span className="fa fa-angle-down pull-right"></span>
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
                  <span className="pull-left">{this.state.selectStatusName} &nbsp;</span>
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
          </div>

          <div className="alert alert-ats alert-dismissible" role="alert">
            <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true"></span></button>
            <img src="/assets/img/icons/info.png" className="icon-info" alt=""/>
            Click on the package you want to install and select its version to add it to the queue.
          </div>

          <PackagesList
            AllPackages={db.searchablePackages}
            AllPackagesPollEventName="poll-packages"
            AllPackagesDispatchObject={{actionType: 'search-packages-by-regex', regex: this.state.filterValue}}
            InstalledPackages={db.packagesForDevice}
            InstalledPackagesPollEventName="poll-installed-packages"
            InstalledPackagesDispatchObject={{actionType: 'get-packages-for-device', device: this.props.device}}
            QueuedPackages={db.packageQueueForDevice}
            QueuedPackagesPollEventName="poll-queued-packages"
            QueuedPackagesDispatchObject={{actionType: 'get-package-queue-for-device', device: this.props.device}}
            filterValue={this.state.filterValue}
            selectStatus={this.state.selectStatus}
            selectSort={this.state.selectSort}
            device={this.props.device}
            setPackagesStatistics={this.props.setPackagesStatistics}
            lastSeen={this.props.lastSeen}
            countImpactAnalysisPackages={this.props.countImpactAnalysisPackages}
            deviceStatus={this.props.deviceStatus}/>       
        </div>
      );
    }
  };

  Packages.contextTypes = {
    location: React.PropTypes.object,
  };

  return Packages;
});
