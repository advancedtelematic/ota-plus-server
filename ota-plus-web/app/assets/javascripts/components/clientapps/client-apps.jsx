define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      ClientAppsHeader = require('es6!./client-apps-header'),
      ClientCreate = require('es6!./client-create');

  class ClientsApps extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        clientsListHeight: '300px',
        isCreateModalShown: false,
      };
      
      this.setClientsListHeight = this.setClientsListHeight.bind(this);
      this.openCreateModal = this.openCreateModal.bind(this);
      this.closeCreateModal = this.closeCreateModal.bind(this);
    }
    componentDidMount() {
      window.addEventListener("resize", this.setClientsListHeight);
      this.setClientsListHeight();
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.setClientsListHeight);
    }
    setClientsListHeight() {
      var windowHeight = jQuery(window).height();
      var offsetTop = jQuery('#clients-wrapper').offset().top;
            
      this.setState({
        clientsListHeight: windowHeight - offsetTop
      });
    }
    openCreateModal() {
      this.setState({
        isCreateModalShown: true
      });
    }
    closeCreateModal() {
      this.setState({
        isCreateModalShown: false
      });
    }
    render() {
      return (
        <div>
          <ClientAppsHeader openCreateModal={this.openCreateModal}/>
          <div id="clients-wrapper" style={{height: this.state.clientsListHeight}}>
            <div className="padding-15">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Creation Date</th>
                    <th>Client ID</th>
                    <th>Secret</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Friendly name #1</td>
                    <td>2016-10-29 09:22:33</td>
                    <td>a87ff679a2f3e71d9181a67b7542122c</td>
                    <td>011ecee7d295c066ae68d4396215c3d0</td>
                  </tr>
                  <tr>
                    <td>Friendly name #2</td>
                    <td>2016-08-24 00:34:55</td>
                    <td>cbc4b13a4f1eeaa8dc9b689b793492ec</td>
                    <td>c0a0cf682c1321e4f725f226a63a1133</td>
                  </tr>
                  <tr>
                    <td>Friendly name #3</td>
                    <td>2016-09-21 21:55:33</td>
                    <td>f0f5b781d51b1616f6a150c9cc144ecb</td>
                    <td>a3ea81d6a8f182e546f13805a96fff11</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.isCreateModalShown ?
              <ClientCreate 
                closeModal={this.closeCreateModal}
                openWizard={this.openWizard}/>
            : null}
          </VelocityTransitionGroup>
        </div>
      );
    }
  };

  ClientsApps.contextTypes = {
    location: React.PropTypes.object,
  };

  return ClientsApps;
});
