define(function(require) {
  var React = require('react'),
      ReactDOM = require('react-dom');

  class PackagesListItem extends React.Component {
    constructor(props) {
      super(props);
      this.itemClick = this.itemClick.bind(this);
      this.checkboxClick = this.checkboxClick.bind(this);
    }
    itemClick(e) {
      if(e.target.className.indexOf('checkbox-impact') < 0) {
        this.props.expandPackage(this.props.name);
      }
    }
    checkboxClick(e) {
      this.props.selectToAnalyse(this.props.name);

      if($('.checkbox-impact:checked').length < $('.checkbox-impact').length) {
        $('#selectPackages').prop('checked', false);
      } else {
        $('#selectPackages').prop('checked', true);
      }
    }
    render() {
      var packageName = this.props.name;
      packageName = packageName.length > 30 ? packageName.substring(0, 30) + '..' : packageName;
      return (
        <button type="button" className="list-group-item" onClick={this.itemClick} id={"button-package-" + this.props.name}>
          {this.context.location.pathname.toLowerCase().split('/')[1] != 'productiondevicedetails' &&
            (localStorage.getItem('firstProductionTestDevice') == this.props.deviceId ||
            localStorage.getItem('secondProductionTestDevice') == this.props.deviceId ||
            localStorage.getItem('thirdProductionTestDevice') == this.props.deviceId) ?
            <input type="checkbox" className="checkbox-impact pull-left" onChange={this.checkboxClick}/>
          : null}
          <div className="pull-left">
            <span className="package-name">{packageName}</span>
          </div>
          {this.props.isDebOrRpmPackage ? 
            <div>
              <div className="pull-right package-statuses">
                {this.props.installedPackage ?
                  !this.props.selected ?
                    <span className="pull-right">
                      <span className="fa-stack package-status-circle">
                        <i className="fa fa-circle fa-stack-1x"></i>
                        <i className="fa fa-check-circle fa-stack-1x green" aria-hidden="true"></i>
                      </span>
                      v. {this.props.installedPackage} installed
                    </span>
                  : null
                :
                  !this.props.queuedPackage && !this.props.selected ? 
                    <span className="pull-right package-status-label-uninstalled">
                      Uninstalled
                    </span>
                  : null
                }
              </div>
              <div className="pull-right package-statuses">
                {this.props.queuedPackage && !this.props.selected ?
                  <span className="pull-right">
                    <span className="fa-stack package-status-circle">
                      <i className="fa fa-circle fa-stack-1x"></i>
                      <i className="fa fa-dot-circle-o fa-stack-1x orange" aria-hidden="true"></i>
                    </span>
                    v. {this.props.queuedPackage} queued
                  </span>
                : null }
              </div>
            </div>
          : null}
        </button>
      );
    }
  };

  PackagesListItem.contextTypes = {
    location: React.PropTypes.object,
  };

  return PackagesListItem;
});
