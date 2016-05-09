define(function(require) {
  var React = require('react');

  class PackageListItemDetails extends React.Component {
    constructor(props) {
      super(props);
    }
    installPackage(packageName, packageVersion, e) {
      e.preventDefault();
      
      var data = { 
        name: packageName,
        version: packageVersion
      };
      
      sendRequest.doPost('/api/v1/updates/' + this.props.vin, data)
        .success(_.bind(function() {
           this.setState({refreshData: true});
        }, this));
    }
    render() {
      var versions = _.map(this.props.versions, function(version, i) {
        return (
          <div style={{marginRight: 15}}>
            {(version.attributes.status == 'installed' || version.attributes.status == 'queued') ?
                <span className="package-label package-label-installed">
                  {(version.attributes.status == 'installed') ? 
                      <i className="fa fa-circle package-circle green" aria-hidden="true"></i>
                    :
                      <i className="fa fa-circle package-circle orange" aria-hidden="true"></i>
                  }
                  
                  v. {version.id.version} &nbsp;
                  {version.attributes.status}
                </span>
              :
                (!this.props.isQueued) ? 
                  <button className="btn btn-grey btn-install" onClick={this.installPackage.bind(this, version.id.name, version.id.version)}>install v. {version.id.version}</button>
                : 
                  <span className="package-label package-label-installed">      
                    v. {version.id.version}
                  </span>
            }
           
          </div>
        );
      }, this);  
        
      return (
        <div className="package-details">
        <div className="row">
          <div className="col-md-3 col-md-offset-2">
            <br />
            <table className="table">
              <tbody>
                <tr>
                  <th>Version Name:</th>
                  <td>3.561</td>
                </tr>
                <tr>
                  <th>Release Type:</th>
                  <td>Stable (low risk of bugs)</td>
                </tr>
                <tr>
                  <th>Download:</th>
                  <td>com.marz.snapprefs_v23_63dd74.apk (4.01MB)</td>
                </tr>
                <tr>
                  <th>Number of downloads:</th>
                  <td>40,910 in total | 15 in the last 24 hours</td>
                </tr>
                <tr>
                  <th>MD5 Checksum:</th>
                  <td>1b9bc7aadebc50edaf0aee698db2eca4</td>
                </tr>
                <tr>
                  <th>Uploaded on:</th>
                  <td>Sunday, December 6, 2015 - 00:58</td>
                </tr>
                <tr>
                  <th>Changes:</th>
                  <td>
                    Added Visual Filters - You can use Instagram like filters <br />
                    Added Visual Filters v2
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-md-2 col-md-offset-5 text-right">
            <br />
            {versions}
          </div>
        </div>
        </div>
      );
    }
  };

  return PackageListItemDetails;
});
