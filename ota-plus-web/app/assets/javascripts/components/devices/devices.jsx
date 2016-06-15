define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      db = require('stores/db'),
      ReactCSSTransitionGroup = React.addons.CSSTransitionGroup,
      DevicesList = require('./devices-list'),
      DevicesHeader = require('./devices-header');
  
  class Devices extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        filterValue: '',
        selectedStatus: 'All',
        selectedStatusName: 'All',
        selectedSort: 'asc',
        selectedSortName: 'A > Z'
      };
      
      this.changeFilter = this.changeFilter.bind(this);
      this.selectStatus = this.selectStatus.bind(this);
      this.selectSort = this.selectSort.bind(this);
    }
    changeFilter(filter) {
      this.setState({filterValue: filter});
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
    render() {
      return (
        <ReactCSSTransitionGroup
          transitionAppear={true}
          transitionLeave={false}
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
          transitionName="example">   
          <DevicesHeader 
            changeFilter={this.changeFilter} 
            filterValue={this.state.filterValue}
            selectedStatus={this.state.selectedStatus}
            selectedStatusName={this.state.selectedStatusName}
            selectedSort={this.state.selectedSort}
            selectedSortName={this.state.selectedSortName}
            selectStatus={this.selectStatus}
            selectSort={this.selectSort}/>
          <div id="devices">
            <DevicesList
              Devices={db.searchableDevices}
              PollEventName="searchable-devices"
              DispatchObject={{actionType: 'search-devices-by-regex', regex: this.state.filterValue}}
              filterValue={this.state.filterValue}
              selectedStatus={this.state.selectedStatus}
              selectedSort={this.state.selectedSort}/>
            {this.props.children}
          </div>
        </ReactCSSTransitionGroup>
      );
    }
  };

  return Devices;
});
