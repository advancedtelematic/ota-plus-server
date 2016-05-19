define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      db = require('stores/db'),
      ReactCSSTransitionGroup = React.addons.CSSTransitionGroup,
      DevicesList = require('./devices-list');
  
  class Devices extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <ReactCSSTransitionGroup
          transitionAppear={true}
          transactionLeave={false}
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
          transitionName="example">   
        <div id="devices">
          <DevicesList
            Devices={db.searchableDevices}
            PollEventName="searchable-devices"
            DispatchObject={{actionType: 'search-devices-by-regex', regex: this.props.filterValue}}
            filterValue={this.props.filterValue}/>
          {this.props.children}
        </div>
        </ReactCSSTransitionGroup>
      );
    }
  };

  return Devices;
});
