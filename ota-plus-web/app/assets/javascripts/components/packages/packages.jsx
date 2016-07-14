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
        packagesListHeight: '300px',
        showForm: false
      }
      
      this.changeFilter = this.changeFilter.bind(this);
      this.openForm = this.openForm.bind(this);
      this.closeForm = this.closeForm.bind(this);
      this.setPackagesListHeight = this.setPackagesListHeight.bind(this);
    }
    componentDidMount() {
      var that = this;
      jQuery('#packages .close').click(function() {
        var timeoutId = setTimeout(function(){
          that.setPackagesListHeight();
          clearTimeout(timeoutId);
        }, 200);
      });
      window.addEventListener("resize", this.setPackagesListHeight);
      this.setPackagesListHeight();
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.setPackagesListHeight);
    }
    openForm() {
      this.setState({
        showForm: true
      });
    }
    closeForm() {
      this.setState({
        showForm: false
      });
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

            <SearchBar class="search-bar pull-left" changeFilter={this.changeFilter}/>

            <div className="pull-right margin-left-15">
              <button onClick={this.openForm} className="btn btn-add pull-right">
                <i className="fa fa-plus"></i> &nbsp; Add new
              </button>
            </div>
    
            <div className="select-bar pull-right margin-left-15">
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
    
            <div className="sort-text pull-right">
              {this.state.selectSort == 'asc' ? 
                <a href="#" onClick={this.selectSort.bind(this, 'desc')}><i className="fa fa-long-arrow-up" aria-hidden="true"></i> A &gt; Z</a>
              :
                <a href="#" onClick={this.selectSort.bind(this, 'asc')}><i className="fa fa-long-arrow-down" aria-hidden="true"></i> Z &gt; A</a>
              }
            </div>
          </div>

          <div className="alert alert-ats alert-dismissible" role="alert">
            <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true"></span></button>
            <img src="/assets/img/icons/info.png" className="icon-info" alt=""/>
            Click on the package you want to install and select its version to add it to the queue.
          </div>
  
          <div id="packages-wrapper" style={{height: this.state.packagesListHeight}}>
            {!_.isUndefined(this.props.device) ?
              <PackagesList
                packagesListHeight={this.state.packagesListHeight}
                selectStatus={this.state.selectStatus}
                selectSort={this.state.selectSort}
                filterValue={this.state.filterValue}
                setPackagesStatistics={this.props.setPackagesStatistics}
                countImpactAnalysisPackages={this.props.countImpactAnalysisPackages}
                device={this.props.device}
                showForm={this.state.showForm}
                openForm={this.openForm}
                closeForm={this.closeForm}/>
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
