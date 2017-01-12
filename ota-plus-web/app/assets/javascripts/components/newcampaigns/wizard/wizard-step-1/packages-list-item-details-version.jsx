define(function(require) {
  var React = require('react'),
      SotaDispatcher = require('sota-dispatcher');

  class PackagesListItemDetailsVersion extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <li className={"package-version " + (this.props.version.isBlackListed ? "package-blacklist" : "")}>
          <div className="row">
            <div className="col-xs-6 pull-left">
              {this.props.version.id.name}
            </div>
            <div className="col-xs-6 pull-right text-right">
              {this.props.version.isBlackListed ?
                <div>
                  <div className="pull-right">
                    <button className="btn btn-blacklist btn-edit-blacklist" title="You can't select blacklisted package."></button>
                  </div>
                </div>
              : 
                <div>
                  <div className="pull-right">
                    <button className={"btn btn-checkbox" + (this.props.isChosen ? " checked" : "")} title="Select package for campaign." onClick={this.props.choosePackage.bind(this, this.props.version.id.name, this.props.version.id.version)}>
                      {this.props.isChosen ? 
                        <i className="fa fa-check" aria-hidden="true"></i>
                      : null}
                    </button>
                  </div>
                </div>
              }
              <div className="pull-right">
                <span title={this.props.version.id.version}>{this.props.version.id.version}</span>
              </div>
            </div>
          </div>
        </li>
      );
    }
  };

  return PackagesListItemDetailsVersion;
});
