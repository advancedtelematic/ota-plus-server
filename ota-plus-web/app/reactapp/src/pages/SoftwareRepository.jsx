import React, { Component, PropTypes, PureComponent } from 'react';
import Header from '../partials/Header';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { VelocityTransitionGroup } from 'velocity-react';
import StatsBlock from '../components/packages/stats/StatsBlock';

const roles = {
    "root": {
        "expires": "12-12-2018 14:15",
        "keys": [
            "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173",
            "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0",
            "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd",
            "d40aa432398d6ed7a41c6f673ef1a4442eb78139d4f8aa4d7dfbae72818dcb37",
            "c15e364e972e5c2284efa289088ff46c56446a7c89520db45af24ce0190c5ade",
            "d1772ba9645a816b2a35649887905e091b2baabe8c2f0def1496cebea4632116",
            "e28adb4dc47b188d609a67b389a3beb61993737e5509d77fdd1b4009a32707f1"
        ],
        "thresholds": {
            "management": 3,
            "qa": 2
        },
        "warnings": [
            "Warning message 1",
            "Warning message 2"
        ],
        "errors": [
            "Error message 1"
        ],
        "authorises": {
            "timestamp": {},
            "snapshot": {},
            "targets": {
                "authorises": {
                    "bsch": {
                        "authorises": {
                            "connectivity": {
                                "authorises": {
                                    "PL-BT-446 Bluetooth auto-grid TVU": {
                                        "expires": "12-12-2018 14:15",
                                        "keys": [
                                            "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173",
                                            "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0",
                                            "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd",
                                            "d40aa432398d6ed7a41c6f673ef1a4442eb78139d4f8aa4d7dfbae72818dcb37",
                                            "c15e364e972e5c2284efa289088ff46c56446a7c89520db45af24ce0190c5ade",
                                            "d1772ba9645a816b2a35649887905e091b2baabe8c2f0def1496cebea4632116",
                                            "e28adb4dc47b188d609a67b389a3beb61993737e5509d77fdd1b4009a32707f1"
                                        ],
                                        "thresholds": {
                                            "management": 3,
                                            "qa": 2
                                        },
                                        "warnings": [
                                            "Warning message 1",
                                            "Warning message 2"
                                        ],
                                        "errors": [
                                            "Error message 1"
                                        ]
                                    },
                                    "PL-AFS-999 Aftersales low energy beamer mod. 2016-2017": {},
                                    "PL-WF-165 On-board wifi dongle GenII": {}
                                }
                            },
                            "diagnostic": {},
                            "infotainment": {}
                        }
                    },
                    "cntl": {}
                }
            }
        }
    }
}

const keys = {
    "keys": {
        "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173": {
            "owner": {
                "name": "John",
                    "position": "SSII",
                    "company": "ATS Advanced Telematic Systems",
                    "location": "Kantstrasse 162, 10623 Berlin, Germany",
                    "phone": "+49 123 45 67 89",
                    "email": "john@advancedtelematic.com",
                    "group": "management"
            }
        },
        "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0": {
            "owner": {
                "name": "John",
                    "position": "SSII",
                    "company": "ATS Advanced Telematic Systems",
                    "location": "Kantstrasse 162, 10623 Berlin, Germany",
                    "phone": "+49 123 45 67 89",
                    "email": "john@advancedtelematic.com",
                    "group": "management"
            }
        },
        "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd": {
            "owner": {
                "name": "John",
                    "position": "SSII",
                    "company": "ATS Advanced Telematic Systems",
                    "location": "Kantstrasse 162, 10623 Berlin, Germany",
                    "phone": "+49 123 45 67 89",
                    "email": "john@advancedtelematic.com",
                    "group": "management"
            }
        },
        "d40aa432398d6ed7a41c6f673ef1a4442eb78139d4f8aa4d7dfbae72818dcb37": {
            "owner": {
                "name": "John",
                    "position": "SSII",
                    "company": "ATS Advanced Telematic Systems",
                    "location": "Kantstrasse 162, 10623 Berlin, Germany",
                    "phone": "+49 123 45 67 89",
                    "email": "john@advancedtelematic.com",
                    "group": "developer"
            }
        },
        "c15e364e972e5c2284efa289088ff46c56446a7c89520db45af24ce0190c5ade": {
            "owner": {
                "name": "John",
                    "position": "SSII",
                    "company": "ATS Advanced Telematic Systems",
                    "location": "Kantstrasse 162, 10623 Berlin, Germany",
                    "phone": "+49 123 45 67 89",
                    "email": "john@advancedtelematic.com",
                    "group": "developer"
            }
        },
        "d1772ba9645a816b2a35649887905e091b2baabe8c2f0def1496cebea4632116": {
            "owner": {
                "name": "John",
                    "position": "SSII",
                    "company": "ATS Advanced Telematic Systems",
                    "location": "Kantstrasse 162, 10623 Berlin, Germany",
                    "phone": "+49 123 45 67 89",
                    "email": "john@advancedtelematic.com",
                    "group": "developer"
            }
        },
        "e28adb4dc47b188d609a67b389a3beb61993737e5509d77fdd1b4009a32707f1": {
            "owner": {
                "name": "John",
                    "position": "SSII",
                    "company": "ATS Advanced Telematic Systems",
                    "location": "Kantstrasse 162, 10623 Berlin, Germany",
                    "phone": "+49 123 45 67 89",
                    "email": "john@advancedtelematic.com",
                    "group": "developer"
            }
        },
        "702f1df94aea175bbefa9792050a483754ab791f6c288fd8975182b72856204a": {
            "owner": {
                "name": "John",
                    "position": "SSII",
                    "company": "ATS Advanced Telematic Systems",
                    "location": "Kantstrasse 162, 10623 Berlin, Germany",
                    "phone": "+49 123 45 67 89",
                    "email": "john@advancedtelematic.com",
                    "group": "developer"
            }
        },
        "ca22f6e876e25ac2f6415ec79ec5fb88f18259a4676f4317148a02701eaeb936": {
            "owner": {
                "name": "John",
                    "position": "SSII",
                    "company": "ATS Advanced Telematic Systems",
                    "location": "Kantstrasse 162, 10623 Berlin, Germany",
                    "phone": "+49 123 45 67 89",
                    "email": "john@advancedtelematic.com",
                    "group": "developer"
            }
        },
        "31f0249019697a3d2f8ae97211b6f168aa7b71abc58e06453af83777df69e74d": {
            "owner": {
                "name": "John",
                    "position": "SSII",
                    "company": "ATS Advanced Telematic Systems",
                    "location": "Kantstrasse 162, 10623 Berlin, Germany",
                    "phone": "+49 123 45 67 89",
                    "email": "john@advancedtelematic.com",
                    "group": "qa"
            }
        },
        "0cf1fd1c0ec856b2a3b63f2c43023737212f717b0f34cff48497d772980d433f": {
            "owner": {
                "name": "John",
                    "position": "SSII",
                    "company": "ATS Advanced Telematic Systems",
                    "location": "Kantstrasse 162, 10623 Berlin, Germany",
                    "phone": "+49 123 45 67 89",
                    "email": "john@advancedtelematic.com",
                    "group": "qa"
            }
        },
        "e1a84816df7bde2d3f68f66b918d96117355f7c5c4540216a6cdb719251cbb4e": {
            "owner": {
                "name": "John",
                    "position": "SSII",
                    "company": "ATS Advanced Telematic Systems",
                    "location": "Kantstrasse 162, 10623 Berlin, Germany",
                    "phone": "+49 123 45 67 89",
                    "email": "john@advancedtelematic.com",
                    "group": "purchase"
            }
        },
        "186a92d443b893b25a7066c81818fee46faabd419122835047579acac800d390": {
            "owner": {
                "name": "John",
                    "position": "SSII",
                    "company": "ATS Advanced Telematic Systems",
                    "location": "Kantstrasse 162, 10623 Berlin, Germany",
                    "phone": "+49 123 45 67 89",
                    "email": "john@advancedtelematic.com",
                    "group": "legal"
            }
        },
        "bdaeedc545c02deeb4de7a75f191913ced4f5904bdc2f2c966f019324161a5bc": {
            "owner": {
                "name": "John",
                    "position": "SSII",
                    "company": "ATS Advanced Telematic Systems",
                    "location": "Kantstrasse 162, 10623 Berlin, Germany",
                    "phone": "+49 123 45 67 89",
                    "email": "john@advancedtelematic.com",
                    "group": "safety"
            }
        },
        "7addade044409ef9fd6e2c559c67946148fd344904afc5b48eab6cade496750e": {
            "owner": {
                "name": "John",
                    "position": "SSII",
                    "company": "ATS Advanced Telematic Systems",
                    "location": "Kantstrasse 162, 10623 Berlin, Germany",
                    "phone": "+49 123 45 67 89",
                    "email": "john@advancedtelematic.com",
                    "group": "customer care"
            }
        }
    }
}

const packages = {
    "groups": {
        "B": {
            "bootable-bluetooth_autogrid_tvu.img": {
                "role": "PL-BT-446 Bluetooth auto-grid TVU",
                "keys": ["827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173", "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0", "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"],
                "warnings": ["Warning message 1", "Warning message 2"],
                "versions": {
                    "5.0-1.123.33129": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": ["bt-x91-64bits", "bt-x91-32bits"]
                    },
                    "4.2-3.775.43998": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": ["bt-x91-64bits", "bt-x91-32bits"]
                    },
                    "4.0-4.887.64663": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": ["bt-x91-64bits", "bt-x91-32bits"]
                    }
                }
            }
        }, "W": {
            "wifi_smartdongle.img": {
                "role": "PL-BT-446 Bluetooth auto-grid TVU",
                "keys": ["827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173", "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0",
                    "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"],
                "warnings": ["Warning message 1", "Warning message 2"],
                "errors": ["Error message 1"],
                "versions": {
                    "5.0-1.123.33129": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": ["bt-x91-64bits", "bt-x91-32bits"]
                    },
                    "4.2-3.775.43998": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": ["bt-x91-64bits", "bt-x91-32bits"]
                    },
                    "4.0-4.887.64663": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": ["bt-x91-64bits", "bt-x91-32bits"]
                    }
                }
            },
            "wireless2car-adapter.img": {
                "role": "PL-BT-446 Bluetooth auto-grid TVU",
                "keys": ["827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173", "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0", "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"],
                "versions": {
                    "5.0-1.123.33129": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": ["bt-x91-64bits", "bt-x91-32bits"]
                    },
                    "4.2-3.775.43998": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": ["bt-x91-64bits", "bt-x91-32bits"]
                    },
                    "4.0-4.887.64663": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": ["bt-x91-64bits", "bt-x91-32bits"]
                    }
                }
            }
        }
    }
}

const campaigns = {
    "groups": {
        "Nomad IV (2017)": {
            "UPD-NM401-X33 Nomad 4 (all) wireless connectivity vulnerability BG7837 fix": {
                "launched": "Mon Oct 02 2017, 12:00:00",
                "started": "Mon Oct 02 2017, 12:00:00",
                "end": "Fri Oct 27 2017, 23:59:59",
                "dynamic": false,
                "autostop": true,
                "ecus": ["bluetooth controller", "wifi manager", "IVI"],
                "packages": ["bootable-bluetooth_autogrid_tvu.img", "wifi_smartdongle.img", "wireless2car-adapter.img"],
                "groups": ["Nomad 4 CC", "Nomad 4 3 doors diesel MT", "Nomad 4 3 doors gasoline AT", "Nomad 4 5 doors diesel MT", "Nomad 4 5 doors diesel AT", "Nomad 4 5 doors gasoline AT", "Nomad 4 SW diesel AT", "Nomad 4 SW gasoline AT"],
                "impacted": 304003,
                "success": 1,
                "failure": 2,
                "queued": 304000,
                "keys": ["827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173", "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0", "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"],
                "warnings": ["Warning message 1", "Warning message 2"],
                "errors": ["Error message 1"]
            },
            "UPD-NM401-X31 Nomad 4 (all) airbag sensor sensibility BG8852 fix": {
                "launched": "Mon Oct 02 2017, 12:00:00",
                "started": "Mon Oct 02 2017, 12:00:00",
                "end": "Fri Oct 27 2017, 23:59:59",
                "dynamic": false,
                "autostop": true,
                "ecus": ["bluetooth controller", "wifi manager", "IVI"],
                "packages": ["bootable-bluetooth_autogrid_tvu.img", "wifi_smartdongle.img", "wireless2car-adapter.img"],
                "groups": ["Nomad 4 CC", "Nomad 4 3 doors diesel MT", "Nomad 4 3 doors gasoline AT", "Nomad 4 5 doors diesel MT", "Nomad 4 5 doors diesel AT", "Nomad 4 5 doors gasoline AT", "Nomad 4 SW diesel AT", "Nomad 4 SW gasoline AT"],
                "impacted": 304003,
                "success": 1,
                "failure": 2,
                "queued": 304000,
                "keys": ["827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173", "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0", "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"],
                "warnings": ["Warning message 1", "Warning message 2"],
                "errors": ["Error message 1"]
            }
        },
        "Nomad III Phase 2 (2012)": {},
        "Roamer 6 (2016)": {},
        "Colossus X Phase 3 (2010)": {}
    }
}

@observer
export default class SoftwareRepository extends Component {
    @observable history = [];
    @observable treeCanvasWidth = 0;
    @observable packagesCanvasWidth = 0;
    @observable canvasHeight = 974;
    @observable mainLineLength = 0;
    @observable rightLineLength = 35;
    @observable lastClickedElementTitle = '';
    @observable selectedDataType = '';
    @observable clickNumber = 0;
    @observable clickCountObj = {};
    @observable multipleExpand = false;
    @observable selectedItemObject = {
        element: '',
    };

    constructor(props) {
        super(props);
        this.showPackageChildren = this.showPackageChildren.bind(this);
        this.drawLines =  this.drawLines.bind(this);
        this.selectPackageWithKeys = this.selectPackageWithKeys.bind(this);
        this.resize =  this.resize.bind(this);
        this.resizeCanvas =  this.resizeCanvas.bind(this);
        this.removeSelectedClasses = this.removeSelectedClasses.bind(this);
        this.scroll =  this.scroll.bind(this);
        this.drawLinesFromAllChilds = this.drawLinesFromAllChilds.bind(this);
        this.handleClickType = this.handleClickType.bind(this);
        this.openTreeNode = this.openTreeNode.bind(this);
        this.drawLineBetweenPackagesAndCampaigns = this.drawLineBetweenPackagesAndCampaigns.bind(this);
        this.drawLineFromCampaign = this.drawLineFromCampaign.bind(this);
        this.showUserInfo = this.showUserInfo.bind(this);
    }

    componentDidMount() {
        this.resizeCanvas();
        window.addEventListener("resize", this.resize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resize);
    }

    _getCanvasContext(id = 'tree-canvas') {
        const canvas = document.getElementById(id);
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#fa9872';
        ctx.lineCap="round";
        return {
            ctx,
            canvas
        }
    }

    resize() {
        this.resizeCanvas();
        this.scroll();
    }

    scroll() {
        try {
            const { ctx, canvas } = this._getCanvasContext('packages-canvas');
            if (this.selectedDataType === 'package') {
                let element = document.querySelectorAll('li[data-keys].selected span.item');
                this.selectPackageWithKeys(element[0], true)
            } else if (this.selectedDataType === 'campaign') {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                this.drawLineFromCampaign(this.lastClickedElementTitle);
            } else {
                let element = document.querySelectorAll(`div[title*=${this.lastClickedElementTitle}`);
                element.target = element[0];
                if (this.multipleExpand) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    this.drawLinesFromAllChilds(element.target);
                } else {
                    this.drawLines(element);
                }
            }
        } catch (e) {
        }
    }

    showUserInfo(e) {
        const alreadySelectedElements = document.querySelectorAll('i.selected-user');
        const parent = e.target.parentNode.parentNode.nextSibling;
        alreadySelectedElements.forEach(el => {
            el.classList.remove('selected-user');
        });
        parent.classList.toggle('hide');
        if (parent.classList[1] === 'hide') {
            e.target.classList.remove('selected-user');
        } else {
            e.target.classList.add('selected-user');
        }
    }

    resizeCanvas() {
        let windowWidth = window.innerWidth;
        let relativeElWidth = document.getElementById('keys').offsetWidth;
        let packagesElWidth = document.getElementById('packages').offsetWidth;
        this.treeCanvasWidth = relativeElWidth;
        this.packagesCanvasWidth = window.innerWidth - relativeElWidth;
        this.mainLineLength = relativeElWidth - this.rightLineLength;
    }

    getParentsUntil (elem, parent, selector) {
        if (!Element.prototype.matches) {
            Element.prototype.matches =
                Element.prototype.matchesSelector ||
                Element.prototype.mozMatchesSelector ||
                Element.prototype.msMatchesSelector ||
                Element.prototype.oMatchesSelector ||
                Element.prototype.webkitMatchesSelector ||
                function(s) {
                    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                        i = matches.length;
                    while (--i >= 0 && matches.item(i) !== this) {}
                    return i > -1;
                };
        }

        var parents = [];

        for ( ; elem && elem !== document; elem = elem.parentNode ) {
            if ( parent ) {
                if ( elem.matches( parent ) ) break;
            }
            if ( selector ) {
                if ( elem.matches( selector ) ) {
                    parents.push( elem );
                }
                break;
            }
            parents.push( elem );
        }
        return parents;
    }

    handleClickType(e) {
        let element = document.querySelectorAll(`div[title=${e.target.parentNode.title}`)[0];
        this.clickNumber++;
        this.clickCountObj = {
            ...this.clickCountObj,
            [this.clickNumber]: {
                element
            }
        };

        if (this.clickCountObj['2'] && this.clickCountObj['1'].element.title === this.clickCountObj['2'].element.title ) {
            this.selectedDataType = 'key';
            this.multipleExpand = true;
            this.clickNumber = 0;
            this.clickCountObj = {};
            this.drawLinesFromAllChilds(element);
        } else {
            if (this.clickCountObj['2']) {
                this.clickNumber = 0;
                this.clickCountObj = {};
            }
            this.multipleExpand = false;
            this.drawLines(element);
            this.showPackageChildren(element);
        }
    }

    showPackageChildren(e) {
        if (e[0] && e[0].parentNode) {
            const ulList = this.getParentsUntil(e[0].parentNode);
            ulList.forEach(ul => {
                this.openTreeNode(e[0].parentNode);
                if (ul.className === 'hidden') {
                    ul.classList.remove('hidden');
                    ul.classList.add('shown');
                }
            }) ;
        }
    }

    openTreeNode(e) {
        if(e.currentTarget && e.currentTarget.parentNode.nextSibling) {
            const { ctx, canvas } = this._getCanvasContext();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.removeSelectedClasses();
            e.stopPropagation();
            e.currentTarget.parentNode.nextSibling.classList.toggle('hidden');
            e.currentTarget.parentNode.nextSibling.classList.toggle('shown');
            e.currentTarget.classList.toggle('fa-angle-down');
            e.currentTarget.classList.toggle('fa-angle-right');
        } else {
            const ulList = this.getParentsUntil(e[0], 'ul.tree');
            ulList.forEach(ul => {
                if (ul.className === 'shown') {
                    ul.parentNode.children[0].children[0].classList.add('fa-angle-down');
                    ul.parentNode.children[0].children[0].classList.remove('fa-angle-right');
                }
            }) ;
        }
    }

    drawLineFromCampaign(e, clear = false) {
        this.removeSelectedClasses('campaigns');
        this.lastClickedElementTitle = e.target || e;
        this.selectedDataType = 'campaign';

        if (!e.target) {
            e.target = e;
        }
        e.target.classList.add('selected');

        const { ctx, canvas } = this._getCanvasContext('packages-canvas');
        const elementCoordinates = e.target.getBoundingClientRect();
        let packages = e.target.dataset.packages.split(',');

        if (clear) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        const treeCanvas = this._getCanvasContext('tree-canvas');
        treeCanvas.ctx.clearRect(0, 0, treeCanvas.canvas.width, treeCanvas.canvas.height)

        this.removeSelectedClasses('packages');

        packages.forEach(packageTitle => {
            let packageItem = document.querySelector(`li[title*=${packageTitle}`);
            let packageCoordinates = packageItem.getBoundingClientRect();

            this.selectPackageWithKeys(packageItem, false, false, false, false);

            ctx.beginPath();
            ctx.moveTo(window.innerWidth - e.target.offsetWidth, elementCoordinates.top - 150 + e.target.offsetHeight / 2);

            let x = window.innerWidth - this.treeCanvasWidth - e.target.offsetWidth;

            if (elementCoordinates.top === packageCoordinates.top) {
                ctx.lineTo(x - 200,elementCoordinates.top - 150 + e.target.offsetHeight / 2);
            } else {
                ctx.lineTo(x - 50,elementCoordinates.top - 150 + e.target.offsetHeight / 2);
                ctx.lineTo(x - 50,packageCoordinates.top - 150 + packageItem.offsetHeight / 2);
                ctx.lineTo(x - 150,packageCoordinates.top - 150 + packageItem.offsetHeight / 2);
            }

            ctx.stroke();
        });
    }

    drawLineBetweenPackagesAndCampaigns(e, clear = true ) {
        if (!e.target) {
            e.target = e;
        }
        const { ctx, canvas } = this._getCanvasContext('packages-canvas');

        if (clear) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        const allCampaigns = document.querySelectorAll(`li[data-packages*=${e.target.title}`);
        const elementCoordinates = e.target.getBoundingClientRect();

        allCampaigns.forEach(campaign => {
            campaign.classList.add('selected');
            const campaignCoordinates = campaign.getBoundingClientRect();
            ctx.beginPath();

            ctx.moveTo(elementCoordinates.left - this.treeCanvasWidth + e.target.offsetWidth, elementCoordinates.top - 150 + e.target.offsetHeight / 2)

            if (elementCoordinates.top === campaignCoordinates.top) {
                ctx.lineTo(elementCoordinates.left - this.treeCanvasWidth + e.target.offsetWidth + 200,elementCoordinates.top - 150 + e.target.offsetHeight / 2);
            } else {
                let x = elementCoordinates.left - this.treeCanvasWidth + e.target.offsetWidth + 50;
                ctx.lineTo(x, elementCoordinates.top - 150 + e.target.offsetHeight / 2);
                ctx.lineTo(x, campaignCoordinates.top - 150 + campaign.offsetHeight / 2)
                ctx.lineTo(x + 150, campaignCoordinates.top - 150 + campaign.offsetHeight / 2)
            }
            ctx.stroke();
        })
    }

    selectPackageWithKeys(e, clear = true, drawLinesToCampaigns = true, removeSelectedClass = true, changeDataType = true) {

        if (!e.target) {
            e.target = e;
        }

        if (changeDataType) {
            this.selectedDataType = 'package';
            if (e.target.parentNode.title) {
                e.target = e.target.parentNode;
            }
            if (e.target.title.length !== 0 && e.target !== this.selectedItemObject.element && e.target.title !== this.selectedItemObject.element.title) {
                this.selectedItemObject = {
                    element: e.target,
                }
            }
        }

        if (removeSelectedClass) {
            this.removeSelectedClasses();
        }

        e.target.classList.add('selected');
        const { ctx, canvas } = this._getCanvasContext();
        const elementCoordinates = e.target.getBoundingClientRect();

        let keys = e.target.dataset.keys.split(',');

        if (drawLinesToCampaigns) {
            this.drawLineBetweenPackagesAndCampaigns(e,true);
        }

        if (clear) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        keys.forEach(keyTitle => {
            let key = [];

            if (e.target.dataset.keys) {
                const iconWithKey = document.querySelectorAll(`i[title*="${keyTitle}"`);
                const parentElements = this.getParentsUntil(iconWithKey[0],'li');
                key.push(parentElements.pop());
            } else {
                key = document.querySelectorAll(`li[title*="${keyTitle}"`);
            }

            this.showPackageChildren(key);
            const keyCoordinates = key[0].getBoundingClientRect();
            ctx.beginPath();
            ctx.moveTo(elementCoordinates.right, elementCoordinates.top - 150 + e.target.offsetHeight / 2);

            ctx.lineTo(this.mainLineLength,elementCoordinates.top - 150 + e.target.offsetHeight / 2);
            ctx.lineTo(this.mainLineLength,keyCoordinates.top - 150 + key[0].offsetHeight / 2);
            ctx.lineTo(keyCoordinates.left + key[0].offsetWidth ,keyCoordinates.top - 150 + key[0].offsetHeight / 2);

            ctx.stroke();
            ctx.beginPath();
        });
    }

    removeSelectedClasses(section = 'all') {
        let packagesArray = [];
        if (section === 'all') {
            packagesArray = document.querySelectorAll(`li.selected`);
        } else {
            packagesArray = document.querySelectorAll(`.${section} li.selected`);
        }
        packagesArray.forEach(packageItem => {
            packageItem.classList.remove('selected');
        });
    }

    drawLinesFromAllChilds(e) {
        let allChilds = e.target.parentNode.querySelectorAll('div[title]');
        this.lastClickedElementTitle = e.target.title;

        if (this.multipleExpand) {
            const canvas = document.getElementById('tree-canvas');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        allChilds.forEach(el => {
            el.classList.add('selected');
            this.showPackageChildren([el]);
            this.drawLines(el ,false, false, 'key', false);
        })
    }

    drawLines(e, clear = true, removeClasses = true, selectedDataType = 'key', clearPackagesCanvas = true) {
        if (!e.target) {
            e.target = e;
        }
        this.selectedDataType = selectedDataType;

        let elementsArray = [];
        const { ctx, canvas } = this._getCanvasContext();
        const elementCoordinates = e.target.getBoundingClientRect();
        this.showPackageChildren(e);

        if (removeClasses) {
            this.removeSelectedClasses();
        }

        if (e.target.title.length > 0) {

            if (!this.multipleExpand) {
                this.lastClickedElementTitle = e.target.title;
            }

            const titles = e.target.querySelectorAll('i[title]');
            titles.forEach((element) => {
                elementsArray.push(document.querySelectorAll(`li[data-keys*="${element.title}"]`))
            });

            if (clear) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            if (clearPackagesCanvas) {
                const packages = this._getCanvasContext('packages-canvas');
                packages.ctx.clearRect(0, 0, packages.canvas.width, packages.canvas.height)
            }

            elementsArray.forEach(elements => {
                elements.forEach(element => {
                    this.drawLineBetweenPackagesAndCampaigns(element, false);
                    element.classList.add('selected');

                    ctx.beginPath();

                    ctx.moveTo(elementCoordinates.left + e.target.offsetWidth, elementCoordinates.top - 150 + e.target.offsetHeight / 2);
                    ctx.lineTo(this.mainLineLength,elementCoordinates.top - 150 + e.target.offsetHeight / 2);
                    let itemOffset = element.getBoundingClientRect().top - 150 + element.offsetHeight / 2;

                    ctx.lineTo(this.mainLineLength, itemOffset);
                    ctx.lineTo(this.mainLineLength + this.rightLineLength, itemOffset);
                    ctx.stroke();
                    ctx.beginPath();
                })
            });
        }

    }

    render() {
        const packagesList = Object.keys(packages.groups).map((group, groupKey) => {
            return (
                <li key={Math.floor((Math.random() * 300) + groupKey)}>
                    <span className="title">{group}</span>
                    <ul className="second-level">
                        {Object.keys(packages.groups[group]).map((item, itemKey) => {
                            const groupItem = packages.groups[group][item];
                            const itemTitle = item.replace(/[&\/\\#,+()$~%_.'":*?<>{}]/g, '');
                            let person = null;

                            const errorWarningIcon = () => {
                                if (groupItem.errors || (groupItem.errors && groupItem.warnings)) {
                                    return <i key={Math.floor((Math.random() * 10000))} className="fa fa-error" aria-hidden="true" onClick={e => {e.stopPropagation()}}/>
                                } else if (groupItem.warnings) {
                                    return <i key={Math.floor((Math.random() * 10000))} className="fa fa-exclamation-triangle" aria-hidden="true" onClick={e => {e.stopPropagation()}}/>
                                } else {
                                    return null
                                }
                            };
                            return (
                                <li
                                    key={Math.floor((Math.random() * 10000) + itemKey)}
                                    className={this.selectedItemObject.element.title === itemTitle ? 'selected' : ''}
                                    onClick={(e) => {
                                        if (this.selectedItemObject.element && this.selectedItemObject.element.title === itemTitle) {
                                            this.selectedItemObject.element = '';
                                        } else {
                                            this.selectPackageWithKeys(e);
                                        }
                                    }}
                                    title={itemTitle}
                                    data-keys={groupItem.keys}>
                                    <span className="item">
                                        {item}
                                        {errorWarningIcon()}
                                    </span>
                                    <div className="info" onClick={e => {e.stopPropagation()}}>
                                        <div className="owners">
                                            {_.map(groupItem.keys, (key, i) => {
                                                person = keys.keys[key].owner;
                                                return <i title={key} key={i} className="fa fa-user-o" aria-hidden="true" onClick={this.showUserInfo.bind(this)}/>
                                            })}
                                        </div>
                                    </div>
                                    <div className="user-info hide">
                                        <ul>
                                            <li>Name: {person.name}</li>
                                            <li>Company: {person.company}</li>
                                            <li>Email: {person.email}</li>
                                            <li>Telephone: {person.phone}</li>
                                        </ul>
                                    </div>
                                    {this.selectedItemObject.element.title === itemTitle ? <ItemVersions groupItem={groupItem} /> : ''}
                                </li>
                            )
                        })}
                    </ul>
                </li>
            )
        });
        return (
            <div className="software-repository" >
                <Header title="Software repository" backButtonShown={true}/>
                <div className="wrapper-full">
                    <div className="container">
                        <div className="row" >
                            <div className="col-xs-3 keys" id="keys">
                                <div className="section-header">Metadata</div>
                                <canvas id="tree-canvas" width={this.treeCanvasWidth} height={this.canvasHeight}/>
                                <div className="wrapper-software" onScroll={this.scroll}>
                                    <TreeUl
                                        data={roles}
                                        shown={true}
                                        drawLinesFromKeys={this.handleClickType}
                                        openTreeNode={this.openTreeNode}
                                    />
                                </div>
                            </div>
                            <div className="col-xs-6 packages" id="packages" onScroll={this.scroll}>
                                <div className="section-header">Software</div>
                                <canvas id="packages-canvas" width={this.packagesCanvasWidth} height={this.canvasHeight}/>
                                <ul className="first-level">
                                    {packagesList}
                                </ul>
                            </div>
                            <div className="col-xs-3 campaigns" onScroll={this.scroll}>
                                <div className="section-header">Campaigns</div>
                                <ul className="first-level">
                                    <List
                                        data={campaigns}
                                        clickHandler={this.drawLineFromCampaign}
                                        dataType="campaigns"/>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

@observer
class TreeUl extends PureComponent {
    @observable showUserInfo = false;
    @observable userInfo = {};
    constructor(props) {
        super(props);
    }

    showInfo(e) {
        e.stopPropagation();
        e.target.nextSibling.classList.toggle('hide');
    }

    getUserInfo(object,e) {
        if (this.userInfo.email && object.email === this.userInfo.email) {
            this.showUserInfo = !this.showUserInfo;
        } else {
            this.showUserInfo = true;
        }
        this.userInfo = {
            ...object,
            element: e.target
        };
    }

    render() {
        const { data, shown, drawLinesFromKeys, openTreeNode } = this.props;
        return (
            <CSSTransitionGroup
                transitionName="slide"
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionEnterTimeout={300}
                transitionLeaveTimeout={300}
                component={"ul"}
                className={this.props.shown ? "tree shown" : "hidden"}
            >
                {_.map(data, (items, key) => {
                    return (
                        <li key={key}>
                            <div title={key.replace(/[&\/\\#,+()$~%_.' ":*?<>{}]/g, '')} onClick={drawLinesFromKeys}>
                                {Object.keys(items).length
                                    ? <i className="fa fa-angle-right" aria-hidden="true" onClick={openTreeNode}/>
                                    : null}
                                <span>{key}</span>
                                <i onClick={this.showInfo.bind(this)} className="fa fa-bars" aria-hidden="true"/>
                                <div className="info hide" onClick={(e) => {e.stopPropagation()}}>
                                    <div className="owners">
                                        {_.map(items.keys, (key, i) => {
                                            const person = keys.keys[key].owner;
                                            return <i title={key} className={`fa fa-owner ${this.userInfo.element && this.showUserInfo  && this.userInfo.element.title === key ? 'selected-user' : ''}`} aria-hidden="true" onClick={this.getUserInfo.bind(this,person)}/>
                                        })}
                                    </div>
                                    {this.showUserInfo ?
                                        <div className="user-info">
                                            <ul>
                                                <li>Name: {this.userInfo.name}</li>
                                                <li>Company: {this.userInfo.company}</li>
                                                <li>Email: {this.userInfo.email}</li>
                                                <li>Telephone: {this.userInfo.phone}</li>
                                            </ul>
                                        </div>
                                    : ''}
                                    {items.thresholds ?
                                        <div className="thresholds">
                                            <div>
                                                <span className="total">{items.thresholds.qa + items.thresholds.management}</span>
                                                {items.thresholds.qa} QA | {items.thresholds.management} DEV
                                            </div>
                                            <div className="expires">
                                                Expire date: {items.expires}
                                            </div>
                                        </div>
                                    : ''}
                                    <div className="warnings">
                                        {_.map(items.warnings, (warning, key) => {
                                            return <p><i className="fa fa-exclamation-triangle" aria-hidden="true"/>{warning}</p>
                                        })}
                                        {_.map(items.errors, (error, key) => {
                                            return <p><i className="fa fa-error" aria-hidden="true"/>{error}</p>
                                        })}
                                    </div>
                                </div>
                            </div>
                            <TreeUl
                                data={items.authorises}
                                shown={false}
                                openTreeNode={openTreeNode}
                                drawLinesFromKeys={drawLinesFromKeys}
                            />
                        </li>
                    );
                })}
            </CSSTransitionGroup>
        );
    }
}

@observer
class List extends PureComponent {

    render() {
        const {data, clickHandler, dataType, selectedItemsList} = this.props;
        const list = Object.keys(data.groups).map((group, groupKey) => {
            return (
                <li key={Math.floor((Math.random() * 30) + groupKey)}>
                    <span className="title">{group}</span>
                    <ul className="second-level">
                        {Object.keys(data.groups[group]).map((item, itemKey) => {
                            const groupItem = data.groups[group][item];
                            if (dataType === 'keys') {
                                return (
                                    <li
                                        key={Math.floor((Math.random() * 1000) + itemKey)}
                                        className={_.includes(selectedItemsList, item) ? 'selected' : ''}
                                        onClick={clickHandler}
                                        title={item}
                                        data-keys={groupItem.keys}><span className="item">{item}</span>
                                        {_.includes(selectedItemsList, item) ? <ItemVersions groupItem={groupItem} /> : ''}
                                    </li>
                                )
                            } else {
                                let packages = [];
                                groupItem.packages.map(packageItem => {
                                    packages.push(packageItem.replace(/[&\/\\#,+()$~%_.'":*?<>{}]/g, ''))
                                })
                                return (
                                    <li
                                        key={Math.floor((Math.random() * 1000) + itemKey)}
                                        onClick={clickHandler}
                                        data-packages={packages}>{item}</li>
                                )
                            }
                        })}
                    </ul>
                </li>
            )
        });

        return (
            <div>
                {list}
            </div>
        )
    }
}

class ItemVersions extends Component {
    render () {
        const {groupItem} = this.props;
        return (
            <VelocityTransitionGroup
                enter={{
                    animation: "slideDown",
                }}
                leave={{
                    animation: "slideUp",
                }}
            >
                <div className='row versions-details' onClick={(e) => {e.stopPropagation()}}>
                    {groupItem.warnings || groupItem.errors ?
                        <div className="col-xs-12">
                            <div className="warnings">
                                {_.map(groupItem.warnings, (warning, key) => {
                                    return <p><i key={key} className="fa fa-exclamation-triangle" aria-hidden="true"/>{warning}</p>
                                })}
                                {_.map(groupItem.errors, (error, key) => {
                                    return <p><i key={key} className="fa fa-error" aria-hidden="true"/>{error}</p>
                                })}
                            </div>
                        </div>
                    : ""}
                    <div className="director-details col-xs-5">
                        <p>Distribution by devices</p>
                        {groupItem.versions ? <StatsBlock pack={groupItem}/> : ''}
                    </div>
                    <div className="col-xs-6">
                        <p>All versions</p>
                        <ul className="versions">

                            {groupItem.versions && Object.keys(groupItem.versions).map((version, versionKey) => {
                                const versionItem = groupItem.versions[version];
                                return (

                                    <li key={versionKey}>
                                        <div className="left-box">
                                            <div className="version-info">
                                                <span className="bold">Version: {version}</span>
                                                <p>Created at: {versionItem.created}</p>
                                                <p>Updated at: {versionItem.updated}</p>
                                                <p>Hash: {versionItem.hash}</p>
                                                <p>Length: {versionItem.length}</p>
                                            </div>
                                        </div>
                                        <div className="right-box">
                                            <span className="bold">Installed on {versionItem.installedOnEcus} ECU(s)</span>
                                            <span className="bold">Hardware ids: {_.map(versionItem.id, (id, key) => {
                                                return <span key={key} className="hardware-label">{id}</span>
                                            })}</span>
                                        </div>
                                    </li>

                                )
                            })}
                        </ul>
                    </div>
                </div>
            </VelocityTransitionGroup>
        )
    }
}