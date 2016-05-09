define(function(require) {
  var React = require('react');

  class LanguageSelector extends React.Component {
    constructor(props) {
      super(props);
      this.changeLang = this.changeLang.bind(this);
    }
    changeLang(event) {
      this.props.changeLang(event.target.value);
    }
    render() {
      return (
        <div className={this.props.class}>      
          <select value={this.props.currentLang} onChange={this.changeLang}>
            <option value="en">English</option>
            <option value="de">German</option>
            <option value="jp">Japanese</option>
          </select>
        </div>
      );
    }
  };

  return LanguageSelector;
});
