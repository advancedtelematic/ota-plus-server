define(function(require) {

  var React = require('react'),
      SearchBar = require('../search-bar'),
      ListOfPackages = require('./list-of-packages'),
      PackagesHeader = require('./packages-header-component'),
      Errors = require('../errors'),
      db = require('stores/db');

  var PackagesPageComponent = React.createClass({
    updateDimensions: function() {
      var offset = $('.resizeWrapper').offset().top;
      var divHeight = $(window).height() - offset - 40;
      $('.resizeWrapper').css({'height': divHeight, 'overflow-y': 'auto'});
    },  
    render: function() {
      return (
      <div>
        <PackagesHeader/>
        <Errors />
        <SearchBar label="Filter" event="search-packages-by-regex"/>
        <ListOfPackages
          Packages={db.searchablePackages}
          PollEventName="poll-packages"
          DispatchObject={{actionType: 'search-packages-by-regex', regex: "."}}
          DisplayCampaignLink={true}
          AllowAssociatedDevicesAction={false}
          UpdateDimensions={this.updateDimensions}/>
      </div>
    );}
  });

  return PackagesPageComponent;

});
