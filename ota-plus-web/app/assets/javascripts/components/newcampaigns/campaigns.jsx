define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SearchBar = require('es6!../searchbar'),
      CampaignsList = require('es6!./campaigns-list');

  class Campaigns extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        filterValue: '',
        campaignsListHeight: '300px',
        isFormShown: false
      };
      
      this.setCampaignsListHeight = this.setCampaignsListHeight.bind(this);
      this.changeFilter = this.changeFilter.bind(this);
      this.openForm = this.openForm.bind(this);
      this.closeForm = this.closeForm.bind(this);
    }
    componentDidMount() {
      window.addEventListener("resize", this.setCampaignsListHeight);
      this.setCampaignsListHeight();
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.setCampaignsListHeight);
    }
    setCampaignsListHeight() {
      var windowHeight = jQuery(window).height();
      var offsetTop = jQuery('#campaigns-wrapper').offset().top;
            
      this.setState({
        campaignsListHeight: windowHeight - offsetTop
      });
    }
    openForm() {
      this.setState({
        isFormShown: true
      });
    }
    closeForm() {
      this.setState({
        isFormShown: false
      });
    }
    changeFilter(filter) {
      this.setState({filterValue: filter});
    }
    render() {
      return (
        <div>
          <div className="panel panel-ats">
            <div className="panel-body">
              <div className="panel-subheading">
                <SearchBar class="search-bar pull-left" inputId="search-campaigns-input" changeFilter={this.changeFilter}/>

                <div className="pull-right margin-left-15">
                  <button onClick={this.openForm} className="btn btn-add pull-right" id="button-add-new-campaign">
                    <i className="fa fa-plus"></i> &nbsp; Create new
                  </button>
                </div>
              </div>
              <div id="campaigns-wrapper" style={{height: this.state.campaignsListHeight}}>
                <CampaignsList 
                  filterValue={this.state.filterValue}
                  isFormShown={this.state.isFormShown}
                  openForm={this.openForm}
                  closeForm={this.closeForm}/>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  Campaigns.contextTypes = {
    location: React.PropTypes.object,
  };

  return Campaigns;
});
