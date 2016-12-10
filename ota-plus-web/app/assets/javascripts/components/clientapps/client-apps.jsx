define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      Loader = require('../loader'),
      ClientAppsHeader = require('./client-apps-header'),
      ClientCreate = require('./client-create');

  class ClientsApps extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        clientsData: undefined,
        clientsListHeight: '300px',
        isCreateModalShown: false,
      };
      
      this.setClientsListHeight = this.setClientsListHeight.bind(this);
      this.openCreateModal = this.openCreateModal.bind(this);
      this.closeCreateModal = this.closeCreateModal.bind(this);
      SotaDispatcher.dispatch({actionType: 'get-clients'});
      db.clients.addWatch("poll-clients", _.bind(this.setClientsData, this, null));
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
    closeCreateModal(ifRefreshData = false) {
      if(ifRefreshData) {
        setTimeout(function() {
          SotaDispatcher.dispatch({actionType: 'get-clients'});
        }, 1);
      }
      this.setState({
        isCreateModalShown: false
      });
    }
    setClientsData() {
      if(!_.isUndefined(db.clients.deref())) {
        this.setState({clientsData: db.clients.deref()});
      }
    }
    render() {
      var clients = _.map(this.state.clientsData, function(client, i) {
        return (
          <tr key={"client-" + client.client_id}>
            <td>{client.client_name}</td>
            <td>{client.client_id}</td>
            <td>{client.client_secret}</td>
          </tr>
        );
      }, this);
    
      return (
        <div>
          <ClientAppsHeader openCreateModal={this.openCreateModal}/>
          <div id="clients-wrapper" style={{height: this.state.clientsListHeight}}>
            <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
              {!_.isUndefined(this.state.clientsData) ?
                this.state.clientsData.length ?
                  <div className="padding-15">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Client ID</th>
                          <th>Secret</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clients}
                      </tbody>
                    </table>
                  </div>
                :
                  <div className="col-md-12 height-100 position-relative text-center">
                    <div className="center-xy padding-15">
                      <span className="font-24 white">
                        There are no clients.
                      </span>
                    </div>
                  </div>
              : undefined}
            </VelocityTransitionGroup>
            {_.isUndefined(db.clients.deref()) ?
              <Loader className="white" />
            : null}
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
