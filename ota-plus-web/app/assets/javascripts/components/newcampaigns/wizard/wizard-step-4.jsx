define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      GroupIcon = require('../../groups/group-icon'),
      Loader = require('../../loader'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group');

  class WizardStep4 extends React.Component {
    constructor(props) {
      super(props);
      SotaDispatcher.dispatch({actionType: 'get-groups'});
      db.groups.addWatch("groups-campaign-summary", _.bind(this.forceUpdate, this, null));
    }
    componentWillUnmount() {
      db.groups.removeWatch("groups-campaign-summary");
    }
    render() {
      var groupsData = db.groups.deref();
            
      if(!_.isUndefined(groupsData)) {
        var chosenGrups = this.props.wizardData[1].chosenGroups;
        var groups = [];
        for(var index in chosenGrups) {
          var foundGroup = _.findWhere(groupsData, {id: chosenGrups[index]});
          groups.push(
            <div className="col-xs-4" key={"chosen-group-" + foundGroup.groupName}>
              <GroupIcon name={foundGroup.groupName} count={Object.keys(foundGroup.devicesUUIDs).length} />
            </div>
          );
        }
      }
      
      return (
        <div>      
          {!_.isUndefined(groupsData) ?
            <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
              <div>
                <div className="width-full pull-left">
                  <div className="box-bordered">
                    <div className="inner">
                      <div><strong>Package</strong></div>
                      <div className="margin-top-20 margin-left-20">
                        <div className="row">
                          <div className="col-xs-5">
                            {this.props.wizardData[0].packageName}
                          </div>
                          <div className="col-xs-5">
                            <strong>v. {this.props.wizardData[0].packageVersion}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="width-full pull-left">
                  <div className="box-bordered">
                    <div className="inner position-relative">
                      <div className="section-header"><strong>Groups & Devices</strong></div>
                      <div className="groups-wrapper-fade groups-wrapper-fade-top"></div>
                      <div className="groups-wrapper margin-top-5">
                        {groups}
                      </div>
                      <div className="groups-wrapper-fade groups-wrapper-fade-bottom"></div>
                    </div>
                  </div>
                </div>
                <div className="width-full margin-top-2 pull-left">
                  <div className="width-half pull-left">
                    <div className="box-bordered">
                      <div className="inner">
                        <div className="row">
                          <div className="col-xs-4">
                            <div><strong>Start Date</strong></div>
                          </div>
                          <div className="col-xs-6">
                            none
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="width-half pull-right">
                    <div className="box-bordered">
                      <div className="inner">
                        <div className="row">
                          <div className="col-xs-4">
                            <div><strong>End Date</strong></div>
                          </div>
                          <div className="col-xs-6">
                            none
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </VelocityTransitionGroup>
          : undefined}
          {_.isUndefined(groupsData) ?
            <Loader />
          : undefined}
        </div>
      );
    }
  }
  return WizardStep4;
});
