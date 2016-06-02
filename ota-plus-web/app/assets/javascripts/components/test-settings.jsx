define(function(require) {
  var React = require('react'),
      serializeForm = require('../mixins/serialize-form'),
      Router = require('react-router');
	
  class TestSettings extends React.Component {
    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(e) {
      e.preventDefault();
      var data = serializeForm(this.refs.form);
      
      localStorage.setItem('firstProductionTestDevice', data.first_production_test_device);
      localStorage.setItem('secondProductionTestDevice', data.second_production_test_device);
      localStorage.setItem('thirdProductionTestDevice', data.third_production_test_device);
    }
    render() {
      return (
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-12">
                  <h3>Test Settings</h3>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <form ref='form' onSubmit={this.handleSubmit}>
                    <div className="form-group">
                      <label>1st test production device VIN</label>
                      <input type="text" className="form-control" name="first_production_test_device" placeholder="1st test production device VIN" defaultValue={localStorage.getItem('firstProductionTestDevice')}/>
                    </div>
                    <div className="form-group">
                      <label>2nd test production device VIN</label>
                      <input type="text" className="form-control" name="second_production_test_device" placeholder="2nd test production device VIN" defaultValue={localStorage.getItem('secondProductionTestDevice')}/>
                    </div>
                    <div className="form-group">
                      <label>3rd test production device VIN</label>
                      <input type="text" className="form-control" name="third_production_test_device" placeholder="3rd test production device VIN" defaultValue={localStorage.getItem('thirdProductionTestDevice')}/>
                    </div>
                    <div className="form-group">
                      <button type="submit" className="btn btn-grey pull-right">Save changes</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  TestSettings.contextTypes = {
    strings: React.PropTypes.object.isRequired
  };

  return TestSettings;
});
