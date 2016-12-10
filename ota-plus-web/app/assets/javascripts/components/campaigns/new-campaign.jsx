define(function(require) {
  var React = require('react'),
      _ = require('underscore'),
      serializeForm = require('../../mixins/serialize-form'),
      BootstrapDatetimepicker = require('bootstrap-datetimepicker'),
      SotaDispatcher = require('sota-dispatcher');

  class NewCampaign extends React.Component {
    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.updateProgress = this.updateProgress.bind(this);
      this.pinChange = this.pinChange.bind(this);
      this.jumpToNextInput = this.jumpToNextInput.bind(this);
      this.changeAutoStopSafety = this.changeAutoStopSafety.bind(this);
      this.createCampaign = this.createCampaign.bind(this);
      this.state = {
        devicesCount: 1549482,
        progress: 0,
        progressIntervalId: null,
        showPinPanel: false,
        pin: {},
        correctPin: {"pin0": 0, "pin1": 0, "pin2": 0, "pin3": 0, "pin4": 0, "pin5": 0, "pin6": 0, "pin7": 0},
        autoStopSafety: true,
      };
    }
    componentDidMount() {
      var id = setInterval(this.updateProgress, 150);
      this.setState({
        progressIntervalId: id
      });

      jQuery('#start-date, #end-date').datetimepicker({
         format: 'DD/MM/YYYY',
         defaultDate: new Date()
      });
      jQuery('#start-time, #end-time').datetimepicker({
         format: 'HH:mm',
         defaultDate: new Date()
      });
    }
    componentWillUnmount() {
      clearInterval(this.state.progressIntervalId);
    }
    handleSubmit(e) {
      e.preventDefault();

      this.setState({
        showPinPanel: true
      });
    }
    updateProgress() {
      var currentProgress = this.state.progress;
      var newProgress = Math.min(currentProgress + 3, 100);

      if(newProgress < 100) {
        this.setState({
          progress: newProgress
        });
      } else if(newProgress == 100 && currentProgress != newProgress) {
        var that = this;
        clearInterval(this.state.progressIntervalId);

        setTimeout(function(){
          that.setState({
           progress: newProgress
          });
        }, 400);
      }
    }
    pinChange(e) {
      var target = e.target;
      var name = target.attributes["name"].value;
      var newPin = this.state.pin;

      newPin[name] = parseInt(target.value);

      this.setState({
        pin: newPin
      });

      if(Object.keys(newPin).length == 8) {
        this.createCampaign();
      }

      /*
       * To check if pin is equal to specific one
      if(_.isEqual(newPin, this.state.correctPin)) {
        this.createCampaign();
      }
      */
    }
    createCampaign() {
      var newCampaigns = [];
      var data = serializeForm(this.refs.form);
      if(localStorage.getItem('campaignsData') !== null) {
        newCampaigns = JSON.parse(localStorage.getItem('campaignsData'));
      }

      var campaignData = {};
      campaignData['name'] = Math.random().toString(36).substring(13).toUpperCase() + '-4432' + '-44';
      campaignData['status'] = 'running';
      campaignData['progress'] = 0;
      campaignData['min_battery_level'] = data.min_battery_level;
      campaignData['device_state'] = data.device_state;
      campaignData['installation_policy'] = data.installation_policy;
      campaignData['auto_stop_safety'] = this.state.autoStopSafety;
      campaignData['priority_level'] = data.priority_level;
      campaignData['start_date'] = data.start_date;
      campaignData['start_time'] = data.start_time;
      campaignData['end_date'] = data.end_date;
      campaignData['end_time'] = data.end_time;

      newCampaigns.push(campaignData);

      localStorage.setItem('campaignsData', JSON.stringify(newCampaigns));
      this.context.history.pushState(null, `devicedetails/${this.props.params.id}`);
    }
    jumpToNextInput(e) {
      var target = e.target;
      var maxLength = parseInt(target.attributes["maxlength"].value, 10);
      var myLength = target.value.length;
      if (myLength >= maxLength) {
        var next = target;
        while (next = next.nextElementSibling) {
          if (next == null) break;
          if (next.tagName.toLowerCase() == "input") {
            next.focus();
            break;
          }
        }
      }
    }
    changeAutoStopSafety() {
      this.setState({
        autoStopSafety: !this.state.autoStopSafety
      });
    }
    render() {
      return (
        <form ref="form" onSubmit={this.handleSubmit} id="form-new-campaign">

          <div className="row">
            <div className="col-md-3">
              Targeted devices:
            </div>

            <div className="col-md-9">
              {this.state.progress != 100 ?
                <div className="row">
                  <div className="col-md-5">
                    counting ...
                  </div>
                  <div className="col-md-5">
                    <div className="progress">
                      <div className="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style={{width: this.state.progress + '%'}}></div>
                    </div>
                  </div>
                </div>
              :
                <div>
                  {this.state.devicesCount} devices
                </div>
              }
            </div>
          </div>

          <div className="fullsize-overflow-hidden">
            <div className="form-subtitle">
              Pre-requisites
            </div>
          </div>

          <div className="row">
            <div className="col-md-3">
              <div className="form-row-title">Min battery level:</div>
            </div>
            <div className="col-md-9">
              <select className="form-control" name="min_battery_level">
                <option value="0">N/A</option>
                <option value="25">25%</option>
                <option value="50">50%</option>
                <option value="75">75%</option>
                <option value="100">100%</option>
                <option value="plugged">Plugged in</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-md-3">
              <div className="form-row-title">Device state:</div>
            </div>
            <div className="col-md-9">
              <select className="form-control" name="device_state">
                <option value="look">Look</option>
                <option value="acc">Acc</option>
                <option value="on">On</option>
                <option value="start">Start</option>
              </select>
            </div>
          </div>

          <div className="fullsize-overflow-hidden">
            <div className="form-subtitle">
              Options
            </div>
          </div>
          <div className="row">
            <div className="col-md-3">
              <div className="form-row-title">Installation policy:</div>
            </div>
            <div className="col-md-9">
              <select className="form-control" name="installation_policy">
                <option value="1">Automatic download and install</option>
                <option value="2">Automatic download, opt-in install</option>
                <option value="3">Opt-in download and install</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-md-3">
              <div className="form-row-title">Auto-stop safety:</div>
            </div>
            <div className="col-md-9">

              <div className="btn-group btn-toggle">
                <button className={"btn btn-sm btn-toggle-first " + (this.state.autoStopSafety ? 'btn-success' : 'btn-transparent')} type="button" onClick={this.changeAutoStopSafety}>ON</button>
                <button className={"btn btn-sm " + (this.state.autoStopSafety ? 'btn-transparent' : 'btn-default')} type="button" onClick={this.changeAutoStopSafety}>OFF</button>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-3">
              <div className="form-row-title">Priority level:</div>
            </div>
            <div className="col-md-9">
              <select className="form-control" name="priority_level">
                <option value="lowest">Lowest</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="highest">Highest</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-md-3">
              <div className="form-row-title">Start and end:</div>
            </div>
            <div className="col-md-9">
              <div className="input-group" style={{width: 110}} id="start-date">
                <input type="text" className="form-control form-addon" placeholder="" name="start_date" />
                <span className="input-group-addon">
                  <i className="fa fa-calendar-plus-o" aria-hidden="true"></i>
                </span>
              </div>
              <div className="input-group" style={{width: 80}} id="start-time">
                <input type="text" className="form-control form-addon" placeholder="" name="start_time" />
                <span className="input-group-addon">
                  <i className="fa fa-clock-o" aria-hidden="true"></i>
                </span>
              </div>

              <div className="input-group" style={{width: 110}} id="end-date">
                <input type="text" className="form-control form-addon" placeholder="" name="end_date" />
                <span className="input-group-addon">
                  <i className="fa fa-calendar-plus-o" aria-hidden="true"></i>
                </span>
              </div>
              <div className="input-group" style={{width: 80}} id="start-time">
                <input type="text" className="form-control form-addon" placeholder="" name="end_time" />
                <span className="input-group-addon">
                  <i className="fa fa-clock-o" aria-hidden="true"></i>
                </span>
              </div>

            </div>
          </div>

          {!this.state.showPinPanel ?
            <div className="form-group text-center">
              <button type="submit" className="btn btn-red" disabled={this.state.progress != 100 ? true : false}>Launch campaign</button>
            </div>
          :
            <div className="pin-panel" onKeyUp={this.jumpToNextInput}>
              <input type="text" name="pin0" maxLength={1} placeholder="_" onChange={this.pinChange}/>
              <input type="text" name="pin1" maxLength={1} placeholder="_" maxLength={1} onChange={this.pinChange}/>
              <input type="text" name="pin2" maxLength={1} placeholder="_" maxLength={1} onChange={this.pinChange}/>
              <input type="text" name="pin3" maxLength={1} placeholder="_" maxLength={1} onChange={this.pinChange}/>
              <input type="text" name="pin4" pmaxLength={1} placeholder="_" maxLength={1} className="margin-left-60" onChange={this.pinChange}/>
              <input type="text" name="pin5" maxLength={1} placeholder="_" maxLength={1} onChange={this.pinChange}/>
              <input type="text" name="pin6" maxLength={1} placeholder="_" maxLength={1} onChange={this.pinChange}/>
              <input type="text" name="pin7" maxLength={1} placeholder="_" maxLength={1} onChange={this.pinChange}/>
            </div>
          }
        </form>
      );
    }
  };

  NewCampaign.contextTypes = {
    history: React.PropTypes.object.isRequired,
  };

  return NewCampaign;
});
