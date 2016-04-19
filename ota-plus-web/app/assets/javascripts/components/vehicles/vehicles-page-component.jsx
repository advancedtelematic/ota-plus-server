define(function(require) {

  var React = require('react'),
      ListOfVehicles = require('./list-of-vehicles'),
      VehiclesHeaderComponent = require('./vehicles-header-component'),
      db = require('stores/db'),
      Errors = require('../errors'),
      SearchBar = require('../search-bar');

  var VehiclesPageComponent = React.createClass({
    updateDimensions: function() {
      var offset = $('.resizeWrapper').offset().top;
      var divHeight = $(window).height() - offset - 40;
      $('.resizeWrapper').css({'height': divHeight, 'overflow-y': 'auto'});
    },   
    render: function() {
      return (
      <div>
        <div>
          <VehiclesHeaderComponent/>
        </div>
        <div className="row">
          <div className="col-md-12">
            <Errors />
            <SearchBar label="Filter" event="search-vehicles-by-regex"/>
            <ListOfVehicles 
              Vehicles={db.searchableVehicles}
              AllowAssociatedPackagesAction={false}
              PollEventName="poll-vehicles"
              DispatchObject={{actionType: "search-vehicles-by-regex", regex: ""}}
              UpdateDimensions={this.updateDimensions}/>
          </div>
        </div>
      </div>
    );}
  });

  return VehiclesPageComponent;

});
