export const roles = {
    "root": {
        "expires": "12-12-2018 14:15",
        "keys": ["827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173", "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0", "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd", "d40aa432398d6ed7a41c6f673ef1a4442eb78139d4f8aa4d7dfbae72818dcb37", "c15e364e972e5c2284efa289088ff46c56446a7c89520db45af24ce0190c5ade", "d1772ba9645a816b2a35649887905e091b2baabe8c2f0def1496cebea4632116", "e28adb4dc47b188d609a67b389a3beb61993737e5509d77fdd1b4009a32707f1"],
        "thresholds": {"Management": 5},
        "warnings": [],
        "errors": [],
        "authorises": {
            "timestamp": {
                "expires": "--auto--",
                "keys": ["702f1df94aea175bbefa9792050a483754ab791f6c288fd8975182b72856204a"],
                "thresholds": {"n/d": 1},
                "warnings": [],
                "errors": []
            },
            "snapshot": {
                "expires": "12-12-2018 14:15",
                "keys": ["ca22f6e876e25ac2f6415ec79ec5fb88f18259a4676f4317148a02701eaeb936", "31f0249019697a3d2f8ae97211b6f168aa7b71abc58e06453af83777df69e74d"],
                "thresholds": {"n/d": 1},
                "warnings": [],
                "errors": []
            },
            "targets": {
                "expires": "12-12-2018 14:15",
                "keys": ["827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173", "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0", "c15e364e972e5c2284efa289088ff46c56446a7c89520db45af24ce0190c5ade", "0cf1fd1c0ec856b2a3b63f2c43023737212f717b0f34cff48497d772980d433f"],
                "thresholds": {"Management": 2, "Purchase": 1},
                "warnings": [],
                "errors": [],
                "authorises": {
                    "BSCH": {
                        "expires": "12-12-2018 14:15",
                        "keys": ["e1a84816df7bde2d3f68f66b918d96117355f7c5c4540216a6cdb719251cbb4e", "186a92d443b893b25a7066c81818fee46faabd419122835047579acac800d390"
                        ],
                        "thresholds": {"n/d": 1},
                        "warnings": [],
                        "errors": [],
                        "authorises": {
                            "Connectivity": {
                                "expires": "12-12-2018 14:15",
                                "keys": ["bdaeedc545c02deeb4de7a75f191913ced4f5904bdc2f2c966f019324161a5bc"],
                                "thresholds": {"n/d": 1},
                                "warnings": [],
                                "errors": [],
                                "authorises": {
                                    "PL-BT-446 Bluetooth auto-grid": {
                                        "expires": "18-11-2017 12:00",
                                        "keys": ["z1", "z2", "z3", "z4", "z5"],
                                        "thresholds": {"DEV": 2, "QA": 2},
                                        "warnings": ["Key expires in less than 15 days."],
                                        "errors": []
                                    }, "PL-AS-999 After sales beamer": {}, "PL-WF-165 On-board wifi dongle": {}
                                }
                            },
                            "Diagnostic": {
                                "authorises": {
                                    "PL-D-742 Diag Tools Mobile": {},
                                    "PL-D-637 Diag Tools Desktop": {}
                                }
                            },
                            "Infotainment": {
                                "authorises": {
                                    "PL-IVI-774 Low-end head unit": {},
                                    "PL-IVI-263 High-end head unit": {}
                                }
                            }
                        }
                    },
                    "CNTL": {"authorises": {"connectivity": {}, "diagnostic": {}, "infotainment": {}}},
                    "CONI": {
                        "authorises": {
                            "connectivity": {}, "diagnostic": {}, "infotainment": {}
                        }
                    },
                    "DNSO": {"authorises": {"connectivity": {}, "diagnostic": {}, "infotainment": {}}},
                    "FJTS": {"authorises": {"connectivity": {}, "diagnostic": {}, "infotainment": {}}},
                    "FRCA": {"authorises": {"connectivity": {}, "diagnostic": {}, "infotainment": {}}},
                    "JCAE": {"authorises": {"connectivity": {}, "diagnostic": {}, "infotainment": {}}},
                    "MPAR": {"authorises": {"connectivity": {}, "diagnostic": {}, "infotainment": {}}},
                    "MTSU": {"authorises": {"connectivity": {}, "diagnostic": {}, "infotainment": {}}},
                    "OPAL": {"authorises": {"connectivity": {}, "diagnostic": {}, "infotainment": {}}},
                    "RLES": {"authorises": {"connectivity": {}, "diagnostic": {}, "infotainment": {}}},
                    "SGEM": {
                        "authorises": {
                            "connectivity": {},
                            "diagnostic": {}, "infotainment": {}
                        }
                    },
                    "TTSU": {"authorises": {"connectivity": {}, "diagnostic": {}, "infotainment": {}}},
                    "TRIL": {"authorises": {"connectivity": {}, "diagnostic": {}, "infotainment": {}}},
                    "XUAN": {"authorises": {"connectivity": {}, "diagnostic": {}, "infotainment": {}}}
                }
            }
        }
    }
};

export const keys = {
    "keys": {
        "z1": {
            "owner": {
                "name": "Ena Nirmala",
                "position": "Test Coordinator Connectivity",
                "company": "Alpha Plus Cars GmbH",
                "location": "HQ Berlin, Germany",
                "phone": "+49 123 45 67 89",
                "email": "e.nirmala@alphapluscars.com",
                "group": "QA"
            }
        },
        "z2": {
            "owner": {
                "name": "Marina Aibek",
                "position": "System Architect Connectivity",
                "company": "Alpha Plus Cars GmbH",
                "location": "HQ Berlin, Germany",
                "phone": "+49 123 45 67 89",
                "email": "m.aibek@alphapluscars.com",
                "group": "DEV"
            }
        },
        "z3": {
            "owner": {
                "name": "Arash Prakash",
                "position": "Test Manager BT",
                "company": "BSCH",
                "location": "HQ Dresden, Germany",
                "phone": "+49 123 45 67 89",
                "email": "ap@bsch.com",
                "group": "QA"
            }
        },
        "z4": {
            "owner": {
                "name": "Hadley Lennie",
                "position": "System Architect BT",
                "company": "BSCH",
                "location": "HQ Dresden, Germany",
                "phone": "+49 123 45 67 89",
                "email": "hl@bsch.com",
                "group": "DEV"
            }
        },
        "z5": {
            "owner": {
                "name": "Lamech Khasan",
                "position": "System Architect Connectivity",
                "company": "BSCH",
                "location": "HQ Dresden, Germany",
                "phone": "+49 123 45 67 89",
                "email": "lk@bsch.com",
                "group": "DEV"
            }
        },
        "z11": {
            "owner": {
                "name": "Braxton Wenonah",
                "position": "Nomad IV Quality Manager",
                "company": "Alpha Plus Cars GmbH",
                "location": "HQ Berlin, Germany",
                "phone": "+49 123 45 67 89",
                "email": "b.wenonah@alphapluscars.com",
                "group": "QA"
            }
        },
        "z22": {
            "owner": {
                "name": "Rhonda Alcyone",
                "position": "Nomad IV Quality Manager",
                "company": "Alpha Plus Cars GmbH",
                "location": "HQ Berlin, Germany",
                "phone": "+49 123 45 67 89",
                "email": "r.alcyone@alphapluscars.com",
                "group": "QA"
            }
        },
        "z33": {
            "owner": {
                "name": "Pallav Lijsbeth",
                "position": "Nomad III Quality Manager",
                "company": "Alpha Plus Cars GmbH",
                "location": "HQ Berlin, Germany",
                "phone": "+49 123 45 67 89",
                "email": "p.lijsbeth@alphapluscars.com",
                "group": "QA"
            }
        },
        "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173": {
            "owner": {
                "name": "Melanija Pietrina",
                "position": "SSII",
                "company": "Alpha Plus Cars GmbH",
                "location": "HQ Berlin, Germany",
                "phone": "+49 123 45 67 89",
                "email": "m.pietrina@alphapluscars.com",
                "group": "Management"
            }
        },
        "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0": {
            "owner": {
                "name": "Adrienn Paul",
                "position": "Head of Connected Security",
                "company": "Alpha Plus Cars GmbH",
                "location": "HQ Berlin, Germany",
                "phone": "+49 123 45 67 89",
                "email": "a.paul@alphapluscars.com",
                "group": "Management"
            }
        },
        "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd": {
            "owner": {
                "name": "RuadhÃ¡n Augusta",
                "position": "Head of Product",
                "company": "Alpha Plus Cars GmbH",
                "location": "HQ Berlin, Germany",
                "phone": "+49 123 45 67 89",
                "email": "r.augusta@alphapluscars.com",
                "group": "Management"
            }
        },
        "d40aa432398d6ed7a41c6f673ef1a4442eb78139d4f8aa4d7dfbae72818dcb37": {
            "owner": {
                "name": "Ad Iacopo",
                "position": "CPO",
                "company": "Alpha Plus Cars GmbH",
                "location": "HQ Berlin, Germany",
                "phone": "+49 123 45 67 89",
                "email": "a.iapoco@alphapluscars.com",
                "group": "Management"
            }
        },
        "c15e364e972e5c2284efa289088ff46c56446a7c89520db45af24ce0190c5ade": {
            "owner": {
                "name": "Alondra Alison",
                "position": "CTO",
                "company": "Alpha Plus Cars GmbH",
                "location": "HQ Berlin, Germany",
                "phone": "+49 123 45 67 89",
                "email": "a.alison@alphapluscars.com",
                "group": "Management"
            }
        },
        "d1772ba9645a816b2a35649887905e091b2baabe8c2f0def1496cebea4632116": {
            "owner": {
                "name": "Eoforhild Ezekias",
                "position": "Head of QA",
                "company": "Alpha Plus Cars GmbH",
                "location": "HQ Berlin, Germany",
                "phone": "+49 123 45 67 89",
                "email": "e.ezekias@alphapluscars.com",
                "group": "Management"
            }
        },
        "e28adb4dc47b188d609a67b389a3beb61993737e5509d77fdd1b4009a32707f1": {
            "owner": {
                "name": "Kichiro Zeno",
                "position": "Head of Tech",
                "company": "Alpha Plus Cars GmbH",
                "location": "HQ Berlin, Germany",
                "phone": "+49 123 45 67 89",
                "email": "k.zeno@alphapluscars.com",
                "group": "Management"
            }
        },
        "702f1df94aea175bbefa9792050a483754ab791f6c288fd8975182b72856204a": {
            "owner": {
                "name": "n/a",
                "position": "n/a",
                "company": "Alpha Plus Cars GmbH",
                "location": "n/a",
                "phone": "n/a",
                "email": "n/a",
                "group": "n/a"
            }
        },
        "ca22f6e876e25ac2f6415ec79ec5fb88f18259a4676f4317148a02701eaeb936": {
            "owner": {
                "name": "Vladimir Benigna",
                "position": "Release Manager",
                "company": "Alpha Plus Cars GmbH",
                "location": "HQ Berlin, Germany",
                "phone": "+49 123 45 67 89",
                "email": "v.benigna@alphapluscars.com",
                "group": "DevOps"
            }
        },
        "31f0249019697a3d2f8ae97211b6f168aa7b71abc58e06453af83777df69e74d": {
            "owner": {
                "name": "Eduard Timo",
                "position": "Release Quality Manager",
                "company": "Alpha Plus Cars GmbH",
                "location": "HQ Berlin, Germany",
                "phone": "+49 123 45 67 89",
                "email": "e.timo@alphapluscars.com",
                "group": "QA"
            }
        },
        "0cf1fd1c0ec856b2a3b63f2c43023737212f717b0f34cff48497d772980d433f": {
            "owner": {
                "name": "Uma Kattalin",
                "position": "Purchase",
                "company": "Alpha Plus Cars GmbH",
                "location": "HQ Berlin, Germany",
                "phone": "+49 123 45 67 89",
                "email": "u.kattalin@alphapluscars.com",
                "group": "Management/Purchase"
            }
        },
        "e1a84816df7bde2d3f68f66b918d96117355f7c5c4540216a6cdb719251cbb4e": {
            "owner": {
                "name": "Cilla Michael",
                "position": "Product Lines Manager",
                "company": "BSCH",
                "location": "HQ Dresden, Germany",
                "phone": "+49 123 45 67 89",
                "email": "cm@bsch.com",
                "group": "Management"
            }
        },
        "186a92d443b893b25a7066c81818fee46faabd419122835047579acac800d390": {
            "owner": {
                "name": "Johanna Leni",
                "position": "Purchase Manager",
                "company": "BSCH",
                "location": "HQ Dresden, Germany",
                "phone": "+49 123 45 67 89",
                "email": "jl@bsch.com",
                "group": "Management"
            }
        },
        "bdaeedc545c02deeb4de7a75f191913ced4f5904bdc2f2c966f019324161a5bc": {
            "owner": {
                "name": "Giorgi Adam",
                "position": "Director Connectivity",
                "company": "BSCH",
                "location": "HQ Dresden, Germany",
                "phone": "+49 123 45 67 89",
                "email": "ga@bsch.com",
                "group": "Management"
            }
        }
    }
}

export const packages = {
    "groups": {
        "A": {
            "abs-lock-tier.zip": {
                "role": "XUAN",
                "keys": [
                    "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173",
                    "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0",
                    "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"
                ],
                "warnings": [],
                "errors": [],
                "stats": {
                    "groups": {
                        "Nomad": 70,
                        "Roamer": 20,
                        "Others": 10
                    },
                    "installationResults": {
                        "success": 95,
                        "failure": 5
                    }
                },
                "versions": {
                    "5.0-1.123.33129": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.2-3.775.43998": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.0-4.887.64663": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    }
                }
            },
            "ai-mngr.lib": {
                "role": "XUAN",
                "keys": [
                    "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173",
                    "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0",
                    "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"
                ],
                "warnings": [],
                "errors": [],
                "stats": {
                    "groups": {
                        "Nomad": 70,
                        "Roamer": 20,
                        "Others": 10
                    },
                    "installationResults": {
                        "success": 95,
                        "failure": 5
                    }
                },
                "versions": {
                    "5.0-1.123.33129": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.2-3.775.43998": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.0-4.887.64663": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    }
                }
            },
            "autosr.adapt.lib": {
                "role": "XUAN",
                "keys": [
                    "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173",
                    "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0",
                    "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"
                ],
                "warnings": [],
                "errors": [],
                "stats": {
                    "groups": {
                        "Nomad": 70,
                        "Roamer": 20,
                        "Others": 10
                    },
                    "installationResults": {
                        "success": 95,
                        "failure": 5
                    }
                },
                "versions": {
                    "5.0-1.123.33129": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.2-3.775.43998": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.0-4.887.64663": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    }
                }
            },
            "autosr.static.lib": {
                "role": "XUAN",
                "keys": [
                    "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173",
                    "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0",
                    "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"
                ],
                "warnings": [],
                "errors": [],
                "stats": {
                    "groups": {
                        "Nomad": 70,
                        "Roamer": 20,
                        "Others": 10
                    },
                    "installationResults": {
                        "success": 95,
                        "failure": 5
                    }
                },
                "versions": {
                    "5.0-1.123.33129": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.2-3.775.43998": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.0-4.887.64663": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    }
                }
            },
            "awd-mgr.gw": {
                "role": "XUAN",
                "keys": [
                    "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173",
                    "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0",
                    "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"
                ],
                "warnings": [],
                "errors": [],
                "stats": {
                    "groups": {
                        "Nomad": 70,
                        "Roamer": 20,
                        "Others": 10
                    },
                    "installationResults": {
                        "success": 95,
                        "failure": 5
                    }
                },
                "versions": {
                    "5.0-1.123.33129": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.2-3.775.43998": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.0-4.887.64663": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    }
                }
            }
        },
        "B": {
            "bootable-bluetooth_autogrid_rvu.img": {
                "role": "PL-BT-446 Bluetooth auto-grid",
                "keys": [
                    "z1",
                    "z2",
                    "z3",
                    "z4",
                    "z5"
                ],
                "warnings": [],
                "errors": [
                    "Failure rate >50% -- 1 pending AS-OFF Campaign -- ERR-INST--DPKG \"Not enough space on disk to unarchive image\"."
                ],
                "stats": {
                    "groups": {
                        "Nomad": 70,
                        "Roamer": 20,
                        "Others": 10
                    },
                    "installationResults": {
                        "success": 49,
                        "failure": 51
                    }
                },
                "versions": {
                    "5.0-1.123": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.2-3.775": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.0-4.887": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    }
                }
            },
            "bootable-bluetooth_autogrid_tvu.img": {
                "role": "PL-BT-446 Bluetooth auto-grid",
                "keys": [
                    "z1",
                    "z2",
                    "z3",
                    "z4"
                ],
                "warnings": [
                    "Associated role about to expire. Included in 2 running campaigns."
                ],
                "errors": [],
                "stats": {
                    "groups": {
                        "Nomad": 70,
                        "Roamer": 20,
                        "Others": 10
                    },
                    "installationResults": {
                        "success": 95,
                        "failure": 5
                    }
                },
                "versions": {
                    "5.0-1.123": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.2-3.775": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.0-4.887": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "3.9-3.783": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    }
                }
            }
        },
        "D": {
            "deployr.img": {
                "role": "XUAN",
                "keys": [
                    "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173",
                    "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0",
                    "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"
                ],
                "warnings": [],
                "errors": [],
                "stats": {
                    "groups": {
                        "Nomad": 70,
                        "Roamer": 20,
                        "Others": 10
                    },
                    "installationResults": {
                        "success": 95,
                        "failure": 5
                    }
                },
                "versions": {
                    "5.0-1.123.33129": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.2-3.775.43998": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.0-4.887.64663": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    }
                }
            },
            "dict.lib": {
                "role": "XUAN",
                "keys": [
                    "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173",
                    "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0",
                    "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"
                ],
                "warnings": [],
                "errors": [],
                "stats": {
                    "groups": {
                        "Nomad": 70,
                        "Roamer": 20,
                        "Others": 10
                    },
                    "installationResults": {
                        "success": 95,
                        "failure": 5
                    }
                },
                "versions": {
                    "5.0-1.123.33129": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.2-3.775.43998": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.0-4.887.64663": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    }
                }
            }
        },
        "F": {
            "faceReco.lbt": {
                "role": "XUAN",
                "keys": [
                    "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173",
                    "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0",
                    "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"
                ],
                "warnings": [],
                "errors": [],
                "stats": {
                    "groups": {
                        "Nomad": 70,
                        "Roamer": 20,
                        "Others": 10
                    },
                    "installationResults": {
                        "success": 95,
                        "failure": 5
                    }
                },
                "versions": {
                    "5.0-1.123.33129": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.2-3.775.43998": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.0-4.887.64663": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    }
                }
            }
        },
        "G": {
            "gatewayDongle.ap": {
                "role": "XUAN",
                "keys": [
                    "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173",
                    "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0",
                    "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"
                ],
                "warnings": [],
                "errors": [],
                "stats": {
                    "groups": {
                        "Nomad": 70,
                        "Roamer": 20,
                        "Others": 10
                    },
                    "installationResults": {
                        "success": 95,
                        "failure": 5
                    }
                },
                "versions": {
                    "5.0-1.123.33129": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.2-3.775.43998": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.0-4.887.64663": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    }
                }
            },
            "gatewaymanager--m": {
                "role": "PL-WF-165 On-board wifi dongle",
                "keys": [
                    "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173",
                    "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0",
                    "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"
                ],
                "warnings": [],
                "errors": [],
                "stats": {
                    "groups": {
                        "Nomad": 70,
                        "Roamer": 20,
                        "Others": 10
                    },
                    "installationResults": {
                        "success": 95,
                        "failure": 5
                    }
                },
                "versions": {
                    "5.0-1.123.33129": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.2-3.775.43998": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.0-4.887.64663": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    }
                }
            }
        },
        "I": {
            "imageProcessing.mgr": {
                "role": "PL-AS-999 After sales beamer",
                "keys": [
                    "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173",
                    "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0",
                    "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"
                ],
                "warnings": [],
                "errors": [],
                "stats": {
                    "groups": {
                        "Nomad": 70,
                        "Roamer": 20,
                        "Others": 10
                    },
                    "installationResults": {
                        "success": 95,
                        "failure": 5
                    }
                },
                "versions": {
                    "5.0-1.123.33129": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.2-3.775.43998": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.0-4.887.64663": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    }
                }
            }
        },
        "L": {
            "learningDataSet.2016": {
                "role": "XUAN",
                "keys": [
                    "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173",
                    "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0",
                    "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"
                ],
                "warnings": [],
                "errors": [],
                "stats": {
                    "groups": {
                        "Nomad": 70,
                        "Roamer": 20,
                        "Others": 10
                    },
                    "installationResults": {
                        "success": 95,
                        "failure": 5
                    }
                },
                "versions": {
                    "5.0-1.123.33129": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.2-3.775.43998": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.0-4.887.64663": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    }
                }
            },
            "learningDataSet.2017": {
                "role": "XUAN",
                "keys": [
                    "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173",
                    "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0",
                    "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"
                ],
                "warnings": [],
                "errors": [],
                "stats": {
                    "groups": {
                        "Nomad": 70,
                        "Roamer": 20,
                        "Others": 10
                    },
                    "installationResults": {
                        "success": 95,
                        "failure": 5
                    }
                },
                "versions": {
                    "5.0-1.123.33129": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.2-3.775.43998": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.0-4.887.64663": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    }
                }
            },
            "lowrange-ltu.22.ap": {
                "role": "XUAN",
                "keys": [
                    "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173",
                    "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0",
                    "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"
                ],
                "warnings": [],
                "errors": [],
                "stats": {
                    "groups": {
                        "Nomad": 70,
                        "Roamer": 20,
                        "Others": 10
                    },
                    "installationResults": {
                        "success": 95,
                        "failure": 5
                    }
                },
                "versions": {
                    "5.0-1.123.33129": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.2-3.775.43998": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.0-4.887.64663": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    }
                }
            }
        },
        "M": {
            "map.adaptativescale": {
                "role": "XUAN",
                "keys": [
                    "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173",
                    "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0",
                    "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"
                ],
                "warnings": [],
                "errors": [],
                "stats": {
                    "groups": {
                        "Nomad": 70,
                        "Roamer": 20,
                        "Others": 10
                    },
                    "installationResults": {
                        "success": 95,
                        "failure": 5
                    }
                },
                "versions": {
                    "5.0-1.123.33129": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.2-3.775.43998": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.0-4.887.64663": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    }
                }
            },
            "map-eu-fullscale": {
                "role": "PL-AS-999 After sales beamer",
                "keys": [
                    "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173",
                    "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0",
                    "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"
                ],
                "warnings": [],
                "errors": [],
                "stats": {
                    "groups": {
                        "Nomad": 70,
                        "Roamer": 20,
                        "Others": 10
                    },
                    "installationResults": {
                        "success": 95,
                        "failure": 5
                    }
                },
                "versions": {
                    "5.0-1.123.33129": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.2-3.775.43998": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.0-4.887.64663": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    }
                }
            },
            "map.jp-fullscale": {
                "role": "PL-WF-165 On-board wifi dongle",
                "keys": [
                    "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173",
                    "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0",
                    "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"
                ],
                "warnings": [],
                "errors": [],
                "stats": {
                    "groups": {
                        "Nomad": 70,
                        "Roamer": 20,
                        "Others": 10
                    },
                    "installationResults": {
                        "success": 95,
                        "failure": 5
                    }
                },
                "versions": {
                    "5.0-1.123.33129": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.2-3.775.43998": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.0-4.887.64663": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    }
                }
            },
            "map-part.coreupdate.sh": {
                "role": "XUAN",
                "keys": [
                    "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173",
                    "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0",
                    "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"
                ],
                "warnings": [],
                "errors": [],
                "stats": {
                    "groups": {
                        "Nomad": 70,
                        "Roamer": 20,
                        "Others": 10
                    },
                    "installationResults": {
                        "success": 95,
                        "failure": 5
                    }
                },
                "versions": {
                    "5.0-1.123.33129": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.2-3.775.43998": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.0-4.887.64663": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    }
                }
            },
            "mtid---s": {
                "role": "PL-WF-165 On-board wifi dongle",
                "keys": [
                    "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173",
                    "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0",
                    "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"
                ],
                "warnings": [],
                "errors": [],
                "stats": {
                    "groups": {
                        "Nomad": 70,
                        "Roamer": 20,
                        "Others": 10
                    },
                    "installationResults": {
                        "success": 95,
                        "failure": 5
                    }
                },
                "versions": {
                    "5.0-1.123.33129": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.2-3.775.43998": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.0-4.887.64663": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    }
                }
            }
        },
        "R": {
            "rollover---impl.lt": {
                "role": "XUAN",
                "keys": [
                    "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173",
                    "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0",
                    "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"
                ],
                "warnings": [],
                "errors": [],
                "stats": {
                    "groups": {
                        "Nomad": 70,
                        "Roamer": 20,
                        "Others": 10
                    },
                    "installationResults": {
                        "success": 95,
                        "failure": 5
                    }
                },
                "versions": {
                    "5.0-1.123.33129": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.2-3.775.43998": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.0-4.887.64663": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    }
                }
            },
            "rulr-asm.m": {
                "role": "XUAN",
                "keys": [
                    "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173",
                    "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0",
                    "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"
                ],
                "warnings": [],
                "errors": [],
                "stats": {
                    "groups": {
                        "Nomad": 70,
                        "Roamer": 20,
                        "Others": 10
                    },
                    "installationResults": {
                        "success": 95,
                        "failure": 5
                    }
                },
                "versions": {
                    "5.0-1.123.33129": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.2-3.775.43998": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.0-4.887.64663": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    }
                }
            }
        },
        "S": {
            "spectrum.zip": {
                "role": "PL-AS-999 After sales beamer",
                "keys": [
                    "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173",
                    "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0",
                    "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"
                ],
                "warnings": [],
                "errors": [],
                "stats": {
                    "groups": {
                        "Nomad": 70,
                        "Roamer": 20,
                        "Others": 10
                    },
                    "installationResults": {
                        "success": 95,
                        "failure": 5
                    }
                },
                "versions": {
                    "5.0-1.123.33129": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.2-3.775.43998": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.0-4.887.64663": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    }
                }
            }
        },
        "T": {
            "touch_controler.img": {
                "role": "XUAN",
                "keys": [
                    "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173",
                    "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0",
                    "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"
                ],
                "warnings": [],
                "errors": [],
                "stats": {
                    "groups": {
                        "Nomad": 70,
                        "Roamer": 20,
                        "Others": 10
                    },
                    "installationResults": {
                        "success": 95,
                        "failure": 5
                    }
                },
                "versions": {
                    "5.0-1.123.33129": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.2-3.775.43998": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.0-4.887.64663": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    }
                }
            }
        },
        "V": {
            "voiceReco.lbt": {
                "role": "XUAN",
                "keys": [
                    "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173",
                    "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0",
                    "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"
                ],
                "warnings": [],
                "errors": [],
                "stats": {
                    "groups": {
                        "Nomad": 70,
                        "Roamer": 20,
                        "Others": 10
                    },
                    "installationResults": {
                        "success": 95,
                        "failure": 5
                    }
                },
                "versions": {
                    "5.0-1.123.33129": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.2-3.775.43998": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.0-4.887.64663": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    }
                }
            },
            "voip.adapter": {
                "role": "XUAN",
                "keys": [
                    "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173",
                    "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0",
                    "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"
                ],
                "warnings": [],
                "errors": [],
                "stats": {
                    "groups": {
                        "Nomad": 70,
                        "Roamer": 20,
                        "Others": 10
                    },
                    "installationResults": {
                        "success": 95,
                        "failure": 5
                    }
                },
                "versions": {
                    "5.0-1.123.33129": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.2-3.775.43998": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.0-4.887.64663": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    }
                }
            }
        },
        "W": {
            "wifi_smartdongle.img": {
                "role": "PL-AS-999 After sales beamer",
                "keys": [
                    "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173",
                    "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0",
                    "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"
                ],
                "warnings": [],
                "errors": [],
                "stats": {
                    "groups": {
                        "Nomad": 70,
                        "Roamer": 20,
                        "Others": 10
                    },
                    "installationResults": {
                        "success": 95,
                        "failure": 5
                    }
                },
                "versions": {
                    "5.0-1.123.33129": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.2-3.775.43998": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.0-4.887.64663": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    }
                }
            },
            "wifidongle.9G.img": {
                "role": "XUAN",
                "keys": [
                    "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173",
                    "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0",
                    "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"
                ],
                "warnings": [],
                "errors": [],
                "stats": {
                    "groups": {
                        "Nomad": 70,
                        "Roamer": 20,
                        "Others": 10
                    },
                    "installationResults": {
                        "success": 95,
                        "failure": 5
                    }
                },
                "versions": {
                    "5.0-1.123.33129": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.2-3.775.43998": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.0-4.887.64663": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    }
                }
            },
            "wireless2car-adapter.img": {
                "role": "PL-WF-165 On-board wifi dongle",
                "keys": [
                    "827018f53c8eb899e15d9724e091088dbddf628bd87c81380a10bbb281d1f173",
                    "686f771d7e5993b2895b6180660ab29d2eb12c1815e3be75862eb459ad0bc3c0",
                    "fac3cfbce415443befc88cd8db75d555fab2813fdbda7d1abdb329d91389fffd"
                ],
                "warnings": [],
                "errors": [],
                "stats": {
                    "groups": {
                        "Nomad": 70,
                        "Roamer": 20,
                        "Others": 10
                    },
                    "installationResults": {
                        "success": 95,
                        "failure": 5
                    }
                },
                "versions": {
                    "5.0-1.123.33129": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 130000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.2-3.775.43998": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 15000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    },
                    "4.0-4.887.64663": {
                        "created": "Wed Jul 05 2017, 14:45:33",
                        "updated": "Thu Jul 06 2017, 5:34:56",
                        "hash": "d5385e86b89e0008d06174e3f1985624c09ae1ba6d9f3532452a72213fd688dd",
                        "length": "1,2 MB",
                        "installedOnEcus": 5000,
                        "id": [
                            "bt-x91-64bits",
                            "bt-x91-32bits"
                        ]
                    }
                }
            }
        }
    }
}

export const campaigns = {
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
                "groups": {
                    "Nomad 4 CC": {"total": "10.000", "processed": 90},
                    "Nomad 4 3 doors diesel MT": {"total": "10.000", "processed": 90},
                    "Nomad 4 3 doors gasoline AT": {"total": "10.000", "processed": 90}
                },
                "processed": "90.000",
                "affected": "80.000",
                "success": "70.000",
                "failure": "5.000",
                "queued": "5.000",
                "notImpacted": "10.000",
                "notProcessed": "10.000",
                "keys": ["z11", "z22"],
                "warnings": ["Includes 1 package about to expire."],
                "errors": []
            }, "UPD-NM401-X31 Nomad 4 (all) airbag sensor sensibility BG8852 fix": {
                "launched": "Mon Oct 02 2017, 12:00:00",
                "started": "Mon Oct 02 2017, 12:00:00",
                "end": "Fri Oct 27 2017, 23:59:59",
                "dynamic": false,
                "autostop": true,
                "ecus": ["airbag sensor", "bluetooth controller"],
                "packages": ["lowrange-ltu.22.ap", "bootable-bluetooth_autogrid_tvu.img"
                ],
                "groups": {
                    "Nomad 4 CC": {"total": "10.000", "processed": 90},
                    "Nomad 4 3 doors diesel MT": {"total": "10.000", "processed": 90},
                    "Nomad 4 3 doors gasoline AT": {"total": "10.000", "processed": 90}
                },
                "processed": "90.000",
                "affected": "80.000",
                "success": "70.000",
                "failure": "5.000",
                "queued": "5.000",
                "notImpacted": "10.000",
                "notProcessed": "10.000",
                "keys": ["z11", "z22"],
                "warnings": ["Includes 1 package about to expire."],
                "errors": []
            }
        }, "Nomad III Phase 2 (2012)": {
            "UPD-TST01-Y42 Nomad 3 BT TVU BG5592 update": {
                "launched": "Mon Oct 02 2017, 12:00:00",
                "started": "Mon Oct 02 2017, 12:00:00",
                "end": "Fri Oct 27 2017, 23:59:59",
                "dynamic": true,
                "autostop": false,
                "ecus": ["bluetooth controller"],
                "packages": ["bootable-bluetooth_autogrid_rvu.img"],
                "groups": {
                    "Nomad 4 CC": {"total": "10.000", "processed": 90},
                    "Nomad 4 3 doors diesel MT": {"total": "10.000", "processed": 90},
                    "Nomad 4 3 doors gasoline AT": {"total": "10.000", "processed": 90}
                },
                "processed": "50.000",
                "affected": "45.000",
                "success": "20.000",
                "failure": "10.000",
                "queued": "15.000",
                "notImpacted": "5.000",
                "notProcessed": "30.000",
                "keys": ["z33"],
                "warnings": [],
                "errors": ["Failure rate >50% -- ERR-INST--DPKG \"Not enough space on disk to unarchive image\"."]
            }
        }, "Roamer 6 (2016)": {}, "Colossus X Phase 3 (2010)": {}
    }
}