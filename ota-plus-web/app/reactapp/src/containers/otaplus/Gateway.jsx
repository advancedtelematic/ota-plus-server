import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { GatewayList } from '../../components/gateway';

const data = {
  "groups": {
      "Nomad IV  - PROD-03-44-2442 - EU - (01.01.2017 to 30-06-2017) with Error": {
        "url": "e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.advancedtelematic.com",
        "availability": "99.999%",
        "downtime": "0:02:34.643",
        "totalDevices": "134.000",
        "certificateRollover": {
          "rotation": "2 years",
          "expireSoon": "2.900",
          "expired": "1.400",
          "stats": {
            "valid": 80,
            "soon expired": 11,
            "expired": 9
          }
        },
        "bandwidth": {
          "connections": {
            "total": "69.000",
            "provisioning": "22.000",
            "check": "23.000",
            "update": "24.000",
            "trend": "up",
            "stats": {
              "provisioning": 70,
              "check": 20,
              "update": 10
            }
          },
          "upload": {
            "total": "3,6 kB",
            "provisioning": "1,1 kB",
            "check": "1,2 kB",
            "update": "1,3 kB",
            "trend": "equal",
            "stats": {
              "provisioning": 5,
              "check": 15,
              "update": 80
            }
          },
          "download": {
            "total": "4,5 GB",
            "provisioning": "1,4 GB",
            "check": "1,5 GB",
            "update": "1,6 GB",
            "trend": "down",
            "stats": {
              "provisioning": 3,
              "check": 17,
              "update": 80
            }
          }
        },
        "connections": {
          "live": {
            "0": 10,
            "1": 6,
            "2": 5,
            "3": 7,
            "4": 9,
            "5": 50,
            "6": 250,
            "7": 320,
            "8": 520,
            "9": 450,
            "10": 312,
            "11": 250,
            "12": 160,
            "13": 350,
            "14": 320,
            "15": 340,
            "16": 400,
            "17": 500,
            "18": 450,
            "19": 400,
            "20": 250,
            "21": 200,
            "22": 90,
            "23": 50
          },
          "limit": "600",
          "max": "560",
          "avg": "340",
          "trend": "up"
        },
        "warnings": [
          "Warning message 1",
          "Warning message 2"
        ],
        "errors": [
          "Error message 1"
        ]
      },
      "Nomad IV  - PROD-03-44-2442 - EU - (01.01.2017 to 30-06-2017) with warning": {
        "url": "e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.advancedtelematic.com",
        "availability": "99.999%",
        "downtime": "0:02:34.643",
        "totalDevices": "134.000",
        "certificateRollover": {
          "rotation": "2 years",
          "expireSoon": "2.900",
          "expired": "1.400",
          "stats": {
            "valid": 80,
            "soon expired": 11,
            "expired": 9
          }
        },
        "bandwidth": {
          "connections": {
            "total": "69.000",
            "provisioning": "22.000",
            "check": "23.000",
            "update": "24.000",
            "trend": "up",
            "stats": {
              "provisioning": 70,
              "check": 20,
              "update": 10
            }
          },
          "upload": {
            "total": "3,6 kB",
            "provisioning": "1,1 kB",
            "check": "1,2 kB",
            "update": "1,3 kB",
            "trend": "equal",
            "stats": {
              "provisioning": 5,
              "check": 15,
              "update": 80
            }
          },
          "download": {
            "total": "4,5 GB",
            "provisioning": "1,4 GB",
            "check": "1,5 GB",
            "update": "1,6 GB",
            "trend": "down",
            "stats": {
              "provisioning": 3,
              "check": 17,
              "update": 80
            }
          }
        },
        "connections": {
          "live": {
            "0": 10,
            "1": 6,
            "2": 5,
            "3": 7,
            "4": 9,
            "5": 50,
            "6": 250,
            "7": 320,
            "8": 520,
            "9": 450,
            "10": 312,
            "11": 250,
            "12": 160,
            "13": 350,
            "14": 320,
            "15": 340,
            "16": 400,
            "17": 500,
            "18": 450,
            "19": 400,
            "20": 250,
            "21": 200,
            "22": 90,
            "23": 50
          },
          "limit": "600",
          "max": "560",
          "avg": "340",
          "trend": "up"
        },
        "warnings": [
          "Warning message 1",
          "Warning message 2"
        ],
        "errors": []
      },
      "Nomad IV  - PROD-03-44-2442 - EU - (01.01.2017 to 30-06-2017) with no errors/warning": {
        "url": "e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.advancedtelematic.com",
        "availability": "99.999%",
        "downtime": "0:02:34.643",
        "totalDevices": "134.000",
        "certificateRollover": {
          "rotation": "2 years",
          "expireSoon": "2.900",
          "expired": "1.400",
          "stats": {
            "valid": 80,
            "soon expired": 11,
            "expired": 9
          }
        },
        "bandwidth": {
          "connections": {
            "total": "69.000",
            "provisioning": "22.000",
            "check": "23.000",
            "update": "24.000",
            "trend": "up",
            "stats": {
              "provisioning": 70,
              "check": 20,
              "update": 10
            }
          },
          "upload": {
            "total": "3,6 kB",
            "provisioning": "1,1 kB",
            "check": "1,2 kB",
            "update": "1,3 kB",
            "trend": "equal",
            "stats": {
              "provisioning": 5,
              "check": 15,
              "update": 80
            }
          },
          "download": {
            "total": "4,5 GB",
            "provisioning": "1,4 GB",
            "check": "1,5 GB",
            "update": "1,6 GB",
            "trend": "down",
            "stats": {
              "provisioning": 3,
              "check": 17,
              "update": 80
            }
          }
        },
        "connections": {
          "live": {
            "0": 10,
            "1": 6,
            "2": 5,
            "3": 7,
            "4": 9,
            "5": 50,
            "6": 250,
            "7": 320,
            "8": 520,
            "9": 450,
            "10": 312,
            "11": 250,
            "12": 160,
            "13": 350,
            "14": 320,
            "15": 340,
            "16": 400,
            "17": 500,
            "18": 450,
            "19": 400,
            "20": 250,
            "21": 200,
            "22": 90,
            "23": 50
          },
          "limit": "600",
          "max": "560",
          "avg": "340",
          "trend": "up"
        },
        "warnings": [],
        "errors": []
      },
      "Nomad III Phase 2 (2012)": {},
      "Roamer 6 (2016)": {},
      "Colossus X Phase 3 (2010)": {}
    }
}
@observer
class Gateway extends Component {
    constructor(props) {
        super(props);
    }
    render() {
		return (
			<span>
				<div className="head">
					<div className="col">
						Gateway
	                </div>
	                <div className="col">
	                	Associated devices
	                </div>
	                <div className="col">
	                	Simultaneous connections
	                </div>
	                <div className="col">
	                	Total connections
	                </div>
	                <div className="col">
	                	Upload
	                </div>
	                <div className="col">
	                	Download
	                </div>
	                <div className="col">
	                	Downtime
	                </div>
	                <div className="col">
	                	Availability
	                </div>
	                <div className="col">
	                	Alerts
	                </div>
				</div>
				<GatewayList
					data={data}
				/>
			</span>
        );
    }
}

export default Gateway;