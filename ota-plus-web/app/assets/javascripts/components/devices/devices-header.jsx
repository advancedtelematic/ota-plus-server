define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      SearchBar = require('es6!../searchbar');
        
  class DevicesHeader extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div id="devices-bar">
          <div className="container">
            <SearchBar class="search-bar pull-left" inputId="search-devices-input" changeFilter={this.props.changeFilter} />

            <div className="sort-text pull-left">
              {this.props.selectedSort == 'asc' ? 
                <a href="#" onClick={this.props.selectSort.bind(this, 'desc')} id="link-sort-devices-desc"><i className="fa fa-long-arrow-up" aria-hidden="true"></i> A &gt; Z</a>
              :
                <a href="#" onClick={this.props.selectSort.bind(this, 'asc')} id="link-sort-devices-asc"><i className="fa fa-long-arrow-down" aria-hidden="true"></i> Z &gt; A</a>
              }
            </div>

            <div className="select-bar select-bar-status pull-left">
              <div className="select-bar-text">Status</div>
              <div className="btn-group">
                <button type="button" className="btn btn-grey dropdown-toggle" id="dropdown-devices-status" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span className="pull-left">{this.props.selectedStatusName} &nbsp;</span>
                  <span className="fa fa-angle-down pull-right"></span>
                </button>
                <ul className="dropdown-menu">
                  <li><a href="#" onClick={this.props.selectStatus.bind(this, 'All')}>All</a></li>
                  <li><a href="#" onClick={this.props.selectStatus.bind(this, 'UpToDate')}>Synchronised</a></li>
                  <li><a href="#" onClick={this.props.selectStatus.bind(this, 'Outdated')}>Not synchronised</a></li>
                  <li><a href="#" onClick={this.props.selectStatus.bind(this, 'NotSeen')}>Never seen online</a></li>
                  <li><a href="#" onClick={this.props.selectStatus.bind(this, 'Error')}>Installation error</a></li>
                </ul>
              </div>
            </div>

            {!this.props.isDevicesListEmpty ?
              <button type="button" onClick={this.props.openNewDeviceModal} className="btn btn-main btn-add pull-right">
                <i className="fa fa-plus"></i> &nbsp; Add new device
              </button>
            : undefined}
          </div>
        </div>
      );
    }
  };

  return DevicesHeader;
});
