define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      SotaDispatcher = require('sota-dispatcher');

  class SearchBar extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) {
      this.props.changeFilter(event.target.value);
    }
    render() {
      return (
        <div className={this.props.class}>
          <div className="input-group">
            <input type="text" className="form-control" onChange={this.handleChange} value={this.props.filterValue} id={this.props.inputId}/>
            <span className="input-group-addon"><i className="fa fa-search"></i></span>
          </div>
        </div>
      );
    }
  };

  return SearchBar;
});
