define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      SearchBar = require('../searchbar');

  class DevicesHeader extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div id="devices-bar">
          <div className="container">
            <SearchBar class="search-bar pull-left" changeFilter={this.props.changeFilter}/>

            <div className="select-bar select-bar-status pull-left">
              <div className="select-bar-text">Status</div>
              <div className="btn-group">
                <button type="button" className="btn btn-grey dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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

            <div className="select-bar select-bar-sort pull-left">
              <div className="select-bar-text">Sort by</div>
              <div className="btn-group">
                <button type="button" className="btn btn-grey dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span className="pull-left">{this.props.selectedSortName} &nbsp;</span>
                  <span className="fa fa-angle-down pull-right"></span>
                </button>
                <ul className="dropdown-menu">
                  <li><a href="#" onClick={this.props.selectSort.bind(this, 'asc')}>A &gt; Z</a></li>
                  <li><a href="#" onClick={this.props.selectSort.bind(this, 'desc')}>Z &gt; A</a></li>
                </ul>
              </div>
            </div>

            <Link to="newdevice" className="btn btn-add pull-right">
              <i className="fa fa-plus"></i> &nbsp; Add new device
            </Link>
          </div>
        </div>
      );
    }
  };

  return DevicesHeader;
});
