import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { DashboardList, DashboardFakeSubheader, DashboardSubheader } from '../../components/dashboard';

const data = [
  {
    "systemStatus": {
      "deviceRegistry": {
        "errors": 0,
        "warnings": 0
      },
      "softwareRepository": {
        "errors": 1,
        "warnings": 4
      },
      "campaigns": {
        "errors": 0,
        "warnings": 0
      },
      "connectors": {
        "errors": 0,
        "warnings": 0
      },
      "deviceGateway": {
        "errors": 1,
        "warnings": 3
      },
      "auditor": {
        "errors": 0,
        "warnings": 0
      }
    },
    "liveLogs": {
      "ERR-3728-4473": {
        "type": "Error",
        "log": "Error message here, very long one, with lots of words and things that sound important and really really real."
      },
      "WRN-3728-4473": {
        "type": "Warning",
        "log": "Error message here, very long one, with lots of words and things that sound important and really really real."
      },
      "INF-3728-4473": {
        "type": "Info",
        "log": "Error message here, very long one, with lots of words and things that sound important and really really real."
      },
       "ERR-3728-4474": {
        "type": "Error",
        "log": "Error message here, very long one, with lots of words and things that sound important and really really real."
      },
      "WRN-3728-4474": {
        "type": "Warning",
        "log": "Error message here, very long one, with lots of words and things that sound important and really really real."
      },
      "INF-3728-4474": {
        "type": "Info",
        "log": "Error message here, very long one, with lots of words and things that sound important and really really real."
      },
       "ERR-3728-4475": {
        "type": "Error",
        "log": "Error message here, very long one, with lots of words and things that sound important and really really real."
      },
      "WRN-3728-4475": {
        "type": "Warning",
        "log": "Error message here, very long one, with lots of words and things that sound important and really really real."
      },
      "INF-3728-4475": {
        "type": "Info",
        "log": "Error message here, very long one, with lots of words and things that sound important and really really real."
      }
    }
  }
];

@observer
class Dashboard extends Component {
	@observable filter = '';
    constructor(props) {
        super(props);
        this.changeFilter = this.changeFilter.bind(this);
    }
    changeFilter(filter) {
    }
    render() {
        return (
            <div className="dashboard">
            	<DashboardSubheader />
            	<DashboardFakeSubheader
                    filter={this.filter}
                    changeFilter={this.changeFilter}
                />
            	<div className="content">
            		<DashboardList 
                        data={data[0].liveLogs}
                    />
            	</div>
            </div>
        );
    }
}

export default Dashboard;