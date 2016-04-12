define(function(require) {

  var React = require('react');

  var Dashboard = React.createClass({
    render: function() {
      return (
        <iframe src="https://advancedtelematic.bime.io/dashboard/AC5A5A1C6C7448CC92B1FEC28505A747A94522B290D0C5D255AC4193C563DC4F" className="dashboard-frame"></iframe>
      );
    }
  });

  return Dashboard;
});
