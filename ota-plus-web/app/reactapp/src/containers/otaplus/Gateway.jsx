import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { GatewayList } from '../../components/gateway';

const data = {
  "groups": {
    "Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>>": {
      "url": "e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu",
      "availability": "99.999%",
      "downtime": "0:02:34.643",
      "totalDevices": "134.098",
      "certificateRollover": {
        "rotation": "2 years",
        "expireSoon": "0",
        "expired": "0",
        "stats": {
          "valid": 100,
          "soon expired": 0,
          "expired": 0
        }
      },
      "bandwidth": {
        "connections": {
          "total": "2.993.557",
          "provisioning": "22.634",
          "check": "2.630.481",
          "update": "340.442",
          "trend": "up",
          "stats": {
            "provisioning": 1,
            "check": 88,
            "update": 11
          }
        },
        "upload": {
          "total": "3,4 GB",
          "provisioning": "0,1 GB",
          "check": "2,3 GB",
          "update": "1 GB",
          "trend": "up",
          "stats": {
            "provisioning": 3,
            "check": 68,
            "update": 29
          }
        },
        "download": {
          "total": "746,2 GB",
          "provisioning": "0,2 GB",
          "check": "0,6 GB",
          "update": "745,4 GB",
          "trend": "up",
          "stats": {
            "provisioning": 0,
            "check": 0,
            "update": 100
          }
        }
      },
      "connections": {
        "live": {
          "0": 560,
          "1": 300,
          "2": 245,
          "3": 198,
          "4": 237,
          "5": 564,
          "6": 2545,
          "7": 3253,
          "8": 5284,
          "9": 4573,
          "10": 3142,
          "11": 2573,
          "12": 1642,
          "13": 3573,
          "14": 3235,
          "15": 3463,
          "16": 4074,
          "17": 5036,
          "18": 4546,
          "19": 4055,
          "20": 2573,
          "21": 2024,
          "22": 944,
          "23": 553
        },
        "limit": "6.000",
        "max": "5.603",
        "avg": "3.740",
        "trend": "up"
      },
      "warnings": [
        "NMD4.PROD-03-44-2442.EU --- Gateway reached 93% capacity maximum peak --- e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu"
      ],
      "errors": []
    },
    "Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017": {
      "url": "e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.co.jp",
      "availability": "99.945%",
      "downtime": "0:06:44.875",
      "totalDevices": "64.534",
      "certificateRollover": {
        "rotation": "2 years",
        "expireSoon": "0",
        "expired": "0",
        "stats": {
          "valid": 100,
          "soon expired": 0,
          "expired": 0
        }
      },
      "bandwidth": {
        "connections": {
          "total": "1.601.906",
          "provisioning": "12.558",
          "check": "1.388.885",
          "update": "200.463",
          "trend": "equal",
          "stats": {
            "provisioning": 1,
            "check": 87,
            "update": 12
          }
        },
        "upload": {
          "total": "3,4 GB",
          "provisioning": "0,1 GB",
          "check": "2,3 GB",
          "update": "1 GB",
          "trend": "equal",
          "stats": {
            "provisioning": 3,
            "check": 68,
            "update": 29
          }
        },
        "download": {
          "total": "403,9 GB",
          "provisioning": "0,1 GB",
          "check": "0,4 GB",
          "update": "403,4 GB",
          "trend": "up",
          "stats": {
            "provisioning": 0,
            "check": 0,
            "update": 100
          }
        }
      },
      "connections": {
        "live": {
          "0": 2530,
          "1": 2044,
          "2": 2099,
          "3": 2198,
          "4": 2024,
          "5": 944,
          "6": 553,
          "7": 259,
          "8": 156,
          "9": 129,
          "10": 230,
          "11": 237,
          "12": 564,
          "13": 1544,
          "14": 2530,
          "15": 2466,
          "16": 2067,
          "17": 1998,
          "18": 1829,
          "19": 620,
          "20": 302,
          "21": 1533,
          "22": 1823,
          "23": 2546
        },
        "limit": "3.000",
        "max": "2.546",
        "avg": "3.740",
        "trend": "up"
      },
      "warnings": [],
      "errors": []
    },
    "Nomad IV  - PROD-84-99-4342 - CN - prod. 01.04.2017 >>>>": {
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
    "Nomad IV  - PROD-42-78-4677 - US - prod. 15.02.2017 >>>>": {
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
    "Nomad III Phase 2 - PROD-43-88-4424 - EU/US (2012-2014)": {
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
    "Nomad III Phase 2 - PROD-43-RR-8492 - CN/JP (2012-2015)": {
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
    "Roamer 6 - PROD-553-8849RT-99282 - ALL (2011-2017>>>>)": {
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
    "Colossus X Phase 3 (2010) - PROD-43-CX442-V4NT4 - B2B ASIA (mod. 2010++)": {
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
    "Colossus X Phase 3 (2010) - PROD-34-CX342-V4NT5 - B2B EURO (mod. 2010++)": {
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
    "Colossus X Phase 3 (2010) - PROD-44-CX656-V4NT3 - B2B AMEC (mod. 2010++)": {
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
    }
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