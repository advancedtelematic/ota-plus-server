define(function(require) {
  var React = require('react');

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
      return (
        <button type="button" className="list-group-item" onClick={this.itemClick}>
          {this.context.location.pathname.toLowerCase().split('/')[1] != 'productiondevicedetails' &&
            (localStorage.getItem('firstProductionTestDevice') == this.props.vin ||
            localStorage.getItem('secondProductionTestDevice') == this.props.vin ||
            localStorage.getItem('thirdProductionTestDevice') == this.props.vin) ? 
            <input type="checkbox" className="checkbox-impact pull-left" onChange={this.checkboxClick}/>
          : null}
          <div className="pull-left">
            <span className="package-name">{this.props.name}</span>
          </div>
          <div className="pull-right package-statuses">
            {this.props.installedPackage ? 
              <span className="pull-right">
                <span className="fa-stack package-status-circle">
                  <i className="fa fa-circle fa-stack-1x"></i>
                  <i className="fa fa-check-circle fa-stack-1x green" aria-hidden="true"></i>
                </span>
                v. {this.props.installedPackage} installed        
              </span>
            : 
              <span className="pull-right package-status-label-uninstalled">
                Uninstalled        
              </span>
            }
          </div>
          <div className="pull-right package-statuses">
            {this.props.queuedPackage ? 
              <span className="pull-right">
                <span className="fa-stack package-status-circle">
                  <i className="fa fa-circle fa-stack-1x"></i>
                  <i className="fa fa-dot-circle-o fa-stack-1x orange" aria-hidden="true"></i>
                </span>
                v. {this.props.queuedPackage} queued        
              </span>
              
            : null }
          </div>
        </button>
      );
    }
  };

  PackagesListItem.contextTypes = {
    location: React.PropTypes.object,
  };

  return PackagesListItem;
});
