define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Campaigns = require('./campaigns'),
      VelocityComponent = require('mixins/velocity/velocity-component'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group');

  class RightPanel extends React.Component {
      constructor(props) {
        super(props);
        this.close = this.close.bind(this);
      }
      close(e) {
        e.preventDefault();
        this.props.toggleCampaignPanel();
      }
      render() {
        return (
          <div>
            <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
              {this.props.showCampaignPanel ?
              <div className="rightPanel" role="dialog">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <a href="#" type="button" onClick={this.close}>
                        <img src="/assets/img/icons/wireless2.png" className="icon-campaigns pull-right" alt=""/>
                      </a>
                      <h4 className="modal-title">{this.context.strings.ongoingcampaigns}</h4>
                    </div>
                    <div className="modal-body">
                      <Campaigns />
                    </div>
                  </div>
                </div>
              </div>
              : null}
            </VelocityTransitionGroup>
            
            {React.cloneElement(this.props.children, {params: this.props.params, filterValue: this.props.filterValue})}
          </div>
        );
      }
    }
    
    RightPanel.contextTypes = {
      strings: React.PropTypes.object.isRequired
    };

  return RightPanel;
});
