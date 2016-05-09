define(function(require) {
  var React = require('react'),
      ReactDOM = require('react-dom'),
      Router = require('react-router'),
      RouteHandler = Router.RouteHandler,
      Link = Router.Link,
      db = require('stores/db'),
      DevicesList = require('./devices-list');
  
  class Devices extends React.Component {
    render() {
      return (
        <div id="devices">
          <DevicesList
            Devices={db.searchableDevices}
            PollEventName="searchable-devices"
            DispatchObject={{actionType: 'search-devices-by-regex', regex: this.props.filterValue}}
            filterValue={this.props.filterValue}/>
          <RouteHandler />
        </div>
      );
    }
  };

  return Devices;
});
