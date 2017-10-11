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
        "url": "hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp",
        "availability": "99.945%",
        "downtime": "0:12:44.875",
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
            "total": "2,5 GB",
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
        "url": "e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.advancedtelematic.cn",
        "availability": "99.999%",
        "downtime": "0:03:56.827",
        "totalDevices": "98.453",
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
            "total": "2.003.746",
            "provisioning": "-",
            "check": "-",
            "update": "-",
            "trend": "equal",
            "stats": {
              "provisioning": 0,
              "check": 0,
              "update": 0
            }
          },
          "upload": {
            "total": "2,9 GB",
            "provisioning": "-",
            "check": "-",
            "update": "-",
            "trend": "equal",
            "stats": {
              "provisioning": 0,
              "check": 0,
              "update": 0
            }
          },
          "download": {
            "total": "458,2 GB",
            "provisioning": "-",
            "check": "-",
            "update": "-",
            "trend": "equal",
            "stats": {
              "provisioning": 0,
              "check": 0,
              "update": 0
            }
          }
        },
        "connections": {
          "live": {
            "0": 0,
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
            "6": 0,
            "7": 0,
            "8": 0,
            "9": 0,
            "10": 0,
            "11": 0,
            "12": 0,
            "13": 0,
            "14": 0,
            "15": 0,
            "16": 0,
            "17": 0,
            "18": 0,
            "19": 0,
            "20": 0,
            "21": 0,
            "22": 0,
            "23": 0
          },
          "limit": "3.500",
          "max": "2.916",
          "avg": "-",
          "trend": "equal"
        },
        "warnings": [],
        "errors": []
      },
      "Nomad IV  - PROD-42-78-4677 - US - prod. 15.02.2017 >>>>": {
        "url": "e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.com",
        "availability": "99.998%",
        "downtime": "0:02:54.927",
        "totalDevices": "157.928",
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
            "total": "2.234.348",
            "provisioning": "-",
            "check": "-",
            "update": "-",
            "trend": "equal",
            "stats": {
              "provisioning": 0,
              "check": 0,
              "update": 0
            }
          },
          "upload": {
            "total": "3,4 GB",
            "provisioning": "-",
            "check": "-",
            "update": "-",
            "trend": "equal",
            "stats": {
              "provisioning": 0,
              "check": 0,
              "update": 0
            }
          },
          "download": {
            "total": "354,9 GB",
            "provisioning": "-",
            "check": "-",
            "update": "-",
            "trend": "equal",
            "stats": {
              "provisioning": 0,
              "check": 0,
              "update": 0
            }
          }
        },
        "connections": {
          "live": {
            "0": 0,
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
            "6": 0,
            "7": 0,
            "8": 0,
            "9": 0,
            "10": 0,
            "11": 0,
            "12": 0,
            "13": 0,
            "14": 0,
            "15": 0,
            "16": 0,
            "17": 0,
            "18": 0,
            "19": 0,
            "20": 0,
            "21": 0,
            "22": 0,
            "23": 0
          },
          "limit": "4.500",
          "max": "3.209",
          "avg": "-",
          "trend": "down"
        },
        "warnings": [],
        "errors": []
      },
      "Nomad III Phase 2 - PROD-43-88-4424 - EU/US (2012-2014)": {
        "url": "e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.com",
        "availability": "99.989%",
        "downtime": "0:05:29.771",
        "totalDevices": "15.283",
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
            "total": "278.938",
            "provisioning": "-",
            "check": "-",
            "update": "-",
            "trend": "equal",
            "stats": {
              "provisioning": 0,
              "check": 0,
              "update": 0
            }
          },
          "upload": {
            "total": "0,9 GB",
            "provisioning": "-",
            "check": "-",
            "update": "-",
            "trend": "equal",
            "stats": {
              "provisioning": 0,
              "check": 0,
              "update": 0
            }
          },
          "download": {
            "total": "98,7 GB",
            "provisioning": "-",
            "check": "-",
            "update": "-",
            "trend": "equal",
            "stats": {
              "provisioning": 0,
              "check": 0,
              "update": 0
            }
          }
        },
        "connections": {
          "live": {
            "0": 0,
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
            "6": 0,
            "7": 0,
            "8": 0,
            "9": 0,
            "10": 0,
            "11": 0,
            "12": 0,
            "13": 0,
            "14": 0,
            "15": 0,
            "16": 0,
            "17": 0,
            "18": 0,
            "19": 0,
            "20": 0,
            "21": 0,
            "22": 0,
            "23": 0
          },
          "limit": "500",
          "max": "489",
          "avg": "-",
          "trend": "equal"
        },
        "warnings": [],
        "errors": []
      },
      "Nomad III Phase 2 - PROD-43-RR-8492 - CN/JP (2012-2015)": {
        "url": "e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.com",
        "availability": "98.329%",
        "downtime": "0:34:10.632",
        "totalDevices": "130.391",
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
            "total": "2.422.842",
            "provisioning": "-",
            "check": "-",
            "update": "-",
            "trend": "equal",
            "stats": {
              "provisioning": 0,
              "check": 0,
              "update": 0
            }
          },
          "upload": {
            "total": "9,4 GB",
            "provisioning": "-",
            "check": "-",
            "update": "-",
            "trend": "equal",
            "stats": {
              "provisioning": 0,
              "check": 0,
              "update": 0
            }
          },
          "download": {
            "total": "782,3 GB",
            "provisioning": "-",
            "check": "-",
            "update": "-",
            "trend": "down",
            "stats": {
              "provisioning": 0,
              "check": 0,
              "update": 0
            }
          }
        },
        "connections": {
          "live": {
            "0": 0,
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
            "6": 0,
            "7": 0,
            "8": 0,
            "9": 0,
            "10": 0,
            "11": 0,
            "12": 0,
            "13": 0,
            "14": 0,
            "15": 0,
            "16": 0,
            "17": 0,
            "18": 0,
            "19": 0,
            "20": 0,
            "21": 0,
            "22": 0,
            "23": 0
          },
          "limit": "6.000",
          "max": "5.322",
          "avg": "-",
          "trend": "down"
        },
        "warnings": [],
        "errors": []
      },
      "Roamer 6 - PROD-553-8849RT-99282 - ALL (2011-2017>>>>)": {
        "url": "e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.com",
        "availability": "99.129%",
        "downtime": "0:12:43.993",
        "totalDevices": "5.994",
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
            "total": "134.928",
            "provisioning": "-",
            "check": "-",
            "update": "-",
            "trend": "equal",
            "stats": {
              "provisioning": 0,
              "check": 0,
              "update": 0
            }
          },
          "upload": {
            "total": "0,2 GB",
            "provisioning": "-",
            "check": "-",
            "update": "-",
            "trend": "equal",
            "stats": {
              "provisioning": 0,
              "check": 0,
              "update": 0
            }
          },
          "download": {
            "total": "12,6 GB",
            "provisioning": "-",
            "check": "-",
            "update": "-",
            "trend": "equal",
            "stats": {
              "provisioning": 0,
              "check": 0,
              "update": 0
            }
          }
        },
        "connections": {
          "live": {
            "0": 0,
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
            "6": 0,
            "7": 0,
            "8": 0,
            "9": 0,
            "10": 0,
            "11": 0,
            "12": 0,
            "13": 0,
            "14": 0,
            "15": 0,
            "16": 0,
            "17": 0,
            "18": 0,
            "19": 0,
            "20": 0,
            "21": 0,
            "22": 0,
            "23": 0
          },
          "limit": "200",
          "max": "126",
          "avg": "-",
          "trend": "equal"
        },
        "warnings": [],
        "errors": []
      },
      "Colossus X Phase 3 (2010) - PROD-43-CX442-V4NT4 - B2B ASIA (mod. 2010++)": {
        "url": "e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.com",
        "availability": "99.783%",
        "downtime": "0:11:36.637",
        "totalDevices": "9.364",
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
            "total": "926.463",
            "provisioning": "-",
            "check": "-",
            "update": "-",
            "trend": "down",
            "stats": {
              "provisioning": 0,
              "check": 0,
              "update": 0
            }
          },
          "upload": {
            "total": "0,6 GB",
            "provisioning": "-",
            "check": "-",
            "update": "-",
            "trend": "down",
            "stats": {
              "provisioning": 0,
              "check": 0,
              "update": 0
            }
          },
          "download": {
            "total": "10,4 GB",
            "provisioning": "-",
            "check": "-",
            "update": "-",
            "trend": "down",
            "stats": {
              "provisioning": 0,
              "check": 0,
              "update": 0
            }
          }
        },
        "connections": {
          "live": {
            "0": 0,
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
            "6": 0,
            "7": 0,
            "8": 0,
            "9": 0,
            "10": 0,
            "11": 0,
            "12": 0,
            "13": 0,
            "14": 0,
            "15": 0,
            "16": 0,
            "17": 0,
            "18": 0,
            "19": 0,
            "20": 0,
            "21": 0,
            "22": 0,
            "23": 0
          },
          "limit": "300",
          "max": "210",
          "avg": "-",
          "trend": "down"
        },
        "warnings": [],
        "errors": []
      },
      "Colossus X Phase 3 (2010) - PROD-34-CX342-V4NT5 - B2B EURO (mod. 2010++)": {
        "url": "e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.com",
        "availability": "98.427%",
        "downtime": "0:09:42.132",
        "totalDevices": "39.904",
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
            "total": "719.837",
            "provisioning": "-",
            "check": "-",
            "update": "-",
            "trend": "down",
            "stats": {
              "provisioning": 0,
              "check": 0,
              "update": 0
            }
          },
          "upload": {
            "total": "0,9 GB",
            "provisioning": "-",
            "check": "-",
            "update": "-",
            "trend": "down",
            "stats": {
              "provisioning": 0,
              "check": 0,
              "update": 0
            }
          },
          "download": {
            "total": "23,4 GB",
            "provisioning": "-",
            "check": "-",
            "update": "-",
            "trend": "down",
            "stats": {
              "provisioning": 0,
              "check": 0,
              "update": 0
            }
          }
        },
        "connections": {
          "live": {
            "0": 0,
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
            "6": 0,
            "7": 0,
            "8": 0,
            "9": 0,
            "10": 0,
            "11": 0,
            "12": 0,
            "13": 0,
            "14": 0,
            "15": 0,
            "16": 0,
            "17": 0,
            "18": 0,
            "19": 0,
            "20": 0,
            "21": 0,
            "22": 0,
            "23": 0
          },
          "limit": "1.000",
          "max": "251",
          "avg": "-",
          "trend": "down"
        },
        "warnings": [],
        "errors": []
      },
      "Colossus X Phase 3 (2010) - PROD-44-CX656-V4NT3 - B2B AMEC (mod. 2010++)": {
        "url": "e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.com",
        "availability": "98.427%",
        "downtime": "0:09:42.132",
        "totalDevices": "56.371",
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
            "total": "917.463",
            "provisioning": "-",
            "check": "-",
            "update": "-",
            "trend": "equal",
            "stats": {
              "provisioning": 0,
              "check": 0,
              "update": 0
            }
          },
          "upload": {
            "total": "2.4 GB",
            "provisioning": "-",
            "check": "-",
            "update": "-",
            "trend": "down",
            "stats": {
              "provisioning": 0,
              "check": 0,
              "update": 0
            }
          },
          "download": {
            "total": "187,4 GB",
            "provisioning": "-",
            "check": "-",
            "update": "-",
            "trend": "up",
            "stats": {
              "provisioning": 0,
              "check": 0,
              "update": 0
            }
          }
        },
        "connections": {
          "live": {
            "0": 0,
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
            "6": 0,
            "7": 0,
            "8": 0,
            "9": 0,
            "10": 0,
            "11": 0,
            "12": 0,
            "13": 0,
            "14": 0,
            "15": 0,
            "16": 0,
            "17": 0,
            "18": 0,
            "19": 0,
            "20": 0,
            "21": 0,
            "22": 0,
            "23": 0
          },
          "limit": "3.000",
          "max": "1.289",
          "avg": "-",
          "trend": "equal"
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