define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      SotaDispatcher = require('sota-dispatcher');

  var timeout = undefined;

  class SearchBar extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) {
      var that = this;
      var filterValue = event.target.value || '';
      if(timeout != undefined) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(function() {
        timeout = undefined;
        that.props.changeFilter(filterValue);
      }, 500);
    }
    render() {
      return (
        <div className={this.props.class}>
          <div className="input-group">
            <input type="text" className="form-control" onChange={this.handleChange} value={this.props.filterValue} id={this.props.inputId} disabled={this.props.isDisabled ? "disabled" : null}/>
            <span className="input-group-addon"><i className="fa fa-search"></i></span>
          </div>
        </div>
      );
    }
  };

  return SearchBar;
});
