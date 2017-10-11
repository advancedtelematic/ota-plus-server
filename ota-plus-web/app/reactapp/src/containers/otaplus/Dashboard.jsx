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
        "warnings": 1
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
        "errors": 0,
        "warnings": 1
      },
      "auditor": {
        "errors": 0,
        "warnings": 0
      }
    },
    "liveLogs": {
      "INF-1263-4829": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 365 simultaneous connections."
      },
      "INF-1264-4830": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 366 simultaneous connections."
      },
      "INF-1265-4831": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 367 simultaneous connections."
      },
      "INF-1266-4832": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 368 simultaneous connections."
      },
      "INF-1267-4833": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 369 simultaneous connections."
      },
      "INF-1268-4834": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 370 simultaneous connections."
      },
      "INF-1269-4835": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 371 simultaneous connections."
      },
      "INF-1270-4836": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 372 simultaneous connections."
      },
      "INF-1271-4837": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 373 simultaneous connections."
      },
      "INF-1272-4838": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 374 simultaneous connections."
      },
      "INF-1273-4839": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 375 simultaneous connections."
      },
      "INF-1274-4840": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 376 simultaneous connections."
      },
      "INF-1275-4841": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 377 simultaneous connections."
      },
      "INF-1276-4842": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 378 simultaneous connections."
      },
      "INF-1277-4843": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 379 simultaneous connections."
      },
      "INF-1278-4844": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 380 simultaneous connections."
      },
      "INF-1279-4845": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 381 simultaneous connections."
      },
      "INF-1280-4846": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 382 simultaneous connections."
      },
      "INF-1281-4847": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 383 simultaneous connections."
      },
      "INF-1282-4848": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 384 simultaneous connections."
      },
      "INF-1283-4849": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 385 simultaneous connections."
      },
      "INF-1284-4850": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 386 simultaneous connections."
      },
      "INF-1285-4851": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 387 simultaneous connections."
      },
      "INF-1286-4852": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 388 simultaneous connections."
      },
      "INF-1287-4853": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 389 simultaneous connections."
      },
      "INF-1288-4854": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 390 simultaneous connections."
      },
      "INF-1289-4855": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 391 simultaneous connections."
      },
      "INF-1290-4856": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 392 simultaneous connections."
      },
      "INF-1291-4857": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 393 simultaneous connections."
      },
      "INF-1292-4858": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 394 simultaneous connections."
      },
      "INF-1293-4859": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 395 simultaneous connections."
      },
      "INF-1294-4860": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 396 simultaneous connections."
      },
      "INF-1295-4861": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 397 simultaneous connections."
      },
      "INF-1296-4862": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 398 simultaneous connections."
      },
      "INF-1297-4863": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 399 simultaneous connections."
      },
      "INF-1298-4864": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 400 simultaneous connections."
      },
      "INF-1299-4865": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 401 simultaneous connections."
      },
      "INF-1300-4866": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 402 simultaneous connections."
      },
      "INF-1301-4867": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 403 simultaneous connections."
      },
      "INF-1302-4868": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 404 simultaneous connections."
      },
      "INF-1303-4869": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 405 simultaneous connections."
      },
      "INF-1304-4870": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 406 simultaneous connections."
      },
      "INF-1305-4871": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 407 simultaneous connections."
      },
      "INF-1306-4872": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 408 simultaneous connections."
      },
      "INF-1307-4873": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 409 simultaneous connections."
      },
      "INF-1308-4874": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 410 simultaneous connections."
      },
      "INF-1309-4875": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 411 simultaneous connections."
      },
      "INF-1310-4876": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 412 simultaneous connections."
      },
      "INF-1311-4877": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 413 simultaneous connections."
      },
      "INF-1312-4878": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 414 simultaneous connections."
      },
      "INF-1313-4879": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 415 simultaneous connections."
      },
      "INF-1314-4880": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 416 simultaneous connections."
      },
      "INF-1315-4881": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 417 simultaneous connections."
      },
      "INF-1316-4882": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 418 simultaneous connections."
      },
      "INF-1317-4883": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 419 simultaneous connections."
      },
      "INF-1318-4884": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 420 simultaneous connections."
      },
      "INF-1319-4885": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 421 simultaneous connections."
      },
      "INF-1320-4886": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 422 simultaneous connections."
      },
      "INF-1321-4887": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 423 simultaneous connections."
      },
      "INF-1322-4888": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 424 simultaneous connections."
      },
      "INF-1323-4889": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 425 simultaneous connections."
      },
      "INF-1324-4890": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 426 simultaneous connections."
      },
      "INF-1325-4891": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 427 simultaneous connections."
      },
      "INF-1326-4892": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 428 simultaneous connections."
      },
      "INF-1327-4893": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 429 simultaneous connections."
      },
      "INF-1328-4894": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 430 simultaneous connections."
      },
      "INF-1329-4895": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 431 simultaneous connections."
      },
      "INF-1330-4896": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 432 simultaneous connections."
      },
      "INF-1331-4897": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 433 simultaneous connections."
      },
      "INF-1332-4898": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 434 simultaneous connections."
      },
      "INF-1333-4899": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 435 simultaneous connections."
      },
      "INF-1334-4900": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 436 simultaneous connections."
      },
      "INF-1335-4901": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 437 simultaneous connections."
      },
      "INF-1336-4902": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4385 simultaneous connections."
      },
      "INF-1337-4903": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4394 simultaneous connections."
      },
      "INF-1338-4904": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4403 simultaneous connections."
      },
      "INF-1339-4905": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4412 simultaneous connections."
      },
      "INF-1340-4906": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4421 simultaneous connections."
      },
      "INF-1341-4907": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4430 simultaneous connections."
      },
      "INF-1342-4908": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4439 simultaneous connections."
      },
      "INF-1343-4909": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4448 simultaneous connections."
      },
      "INF-1344-4910": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4457 simultaneous connections."
      },
      "INF-1345-4911": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4466 simultaneous connections."
      },
      "INF-1346-4912": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4475 simultaneous connections."
      },
      "INF-1347-4913": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4484 simultaneous connections."
      },
      "INF-1348-4914": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4493 simultaneous connections."
      },
      "INF-1349-4915": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4502 simultaneous connections."
      },
      "INF-1350-4916": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4511 simultaneous connections."
      },
      "INF-1351-4917": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4520 simultaneous connections."
      },
      "INF-1352-4918": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4529 simultaneous connections."
      },
      "INF-1353-4919": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4538 simultaneous connections."
      },
      "INF-1354-4920": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4547 simultaneous connections."
      },
      "INF-1355-4921": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4556 simultaneous connections."
      },
      "INF-1356-4922": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4565 simultaneous connections."
      },
      "INF-1357-4923": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4574 simultaneous connections."
      },
      "INF-1358-4924": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4583 simultaneous connections."
      },
      "INF-1359-4925": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4592 simultaneous connections."
      },
      "INF-1360-4926": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4601 simultaneous connections."
      },
      "INF-1361-4927": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4610 simultaneous connections."
      },
      "INF-1362-4928": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4619 simultaneous connections."
      },
      "INF-1363-4929": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4628 simultaneous connections."
      },
      "INF-1364-4930": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4637 simultaneous connections."
      },
      "INF-1365-4931": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4646 simultaneous connections."
      },
      "INF-1366-4932": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4655 simultaneous connections."
      },
      "INF-1367-4933": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4664 simultaneous connections."
      },
      "INF-1368-4934": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4673 simultaneous connections."
      },
      "INF-1369-4935": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4682 simultaneous connections."
      },
      "INF-1370-4936": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4691 simultaneous connections."
      },
      "INF-1371-4937": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4700 simultaneous connections."
      },
      "INF-1372-4938": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4709 simultaneous connections."
      },
      "INF-1373-4939": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4718 simultaneous connections."
      },
      "INF-1374-4940": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4727 simultaneous connections."
      },
      "INF-1375-4941": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4736 simultaneous connections."
      },
      "INF-1376-4942": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4745 simultaneous connections."
      },
      "INF-1377-4943": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4754 simultaneous connections."
      },
      "INF-1378-4944": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4763 simultaneous connections."
      },
      "INF-1379-4945": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4772 simultaneous connections."
      },
      "INF-1380-4946": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4781 simultaneous connections."
      },
      "INF-1381-4947": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4790 simultaneous connections."
      },
      "INF-1382-4948": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4799 simultaneous connections."
      },
      "INF-1383-4949": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4808 simultaneous connections."
      },
      "INF-1384-4950": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4817 simultaneous connections."
      },
      "INF-1385-4951": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4826 simultaneous connections."
      },
      "INF-1386-4952": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4835 simultaneous connections."
      },
      "INF-1387-4953": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4844 simultaneous connections."
      },
      "INF-1388-4954": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4853 simultaneous connections."
      },
      "INF-1389-4955": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4862 simultaneous connections."
      },
      "INF-1390-4956": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4871 simultaneous connections."
      },
      "INF-1391-4957": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4880 simultaneous connections."
      },
      "INF-1392-4958": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4889 simultaneous connections."
      },
      "INF-1393-4959": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4898 simultaneous connections."
      },
      "INF-1394-4960": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4907 simultaneous connections."
      },
      "INF-1395-4961": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4916 simultaneous connections."
      },
      "INF-1396-4962": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4925 simultaneous connections."
      },
      "INF-1397-4963": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4934 simultaneous connections."
      },
      "INF-1398-4964": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4943 simultaneous connections."
      },
      "INF-1399-4965": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4952 simultaneous connections."
      },
      "INF-1400-4966": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4961 simultaneous connections."
      },
      "INF-1401-4967": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4970 simultaneous connections."
      },
      "INF-1402-4968": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4979 simultaneous connections."
      },
      "INF-1403-4969": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4988 simultaneous connections."
      },
      "INF-1404-4970": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 4997 simultaneous connections."
      },
      "INF-1405-4971": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5006 simultaneous connections."
      },
      "INF-1406-4972": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5015 simultaneous connections."
      },
      "INF-1407-4973": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5024 simultaneous connections."
      },
      "INF-1408-4974": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5033 simultaneous connections."
      },
      "INF-1409-4975": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5042 simultaneous connections."
      },
      "INF-1410-4976": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5051 simultaneous connections."
      },
      "INF-1411-4977": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5060 simultaneous connections."
      },
      "INF-1412-4978": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5069 simultaneous connections."
      },
      "INF-1413-4979": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5078 simultaneous connections."
      },
      "INF-1414-4980": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5087 simultaneous connections."
      },
      "INF-1415-4981": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5096 simultaneous connections."
      },
      "INF-1416-4982": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5105 simultaneous connections."
      },
      "INF-1417-4983": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5114 simultaneous connections."
      },
      "INF-1418-4984": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5123 simultaneous connections."
      },
      "INF-1419-4985": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5132 simultaneous connections."
      },
      "INF-1420-4986": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5141 simultaneous connections."
      },
      "INF-1421-4987": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5150 simultaneous connections."
      },
      "INF-1422-4988": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5159 simultaneous connections."
      },
      "INF-1423-4989": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5168 simultaneous connections."
      },
      "INF-1424-4990": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5177 simultaneous connections."
      },
      "INF-1425-4991": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5186 simultaneous connections."
      },
      "INF-1426-4992": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5195 simultaneous connections."
      },
      "INF-1427-4993": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5204 simultaneous connections."
      },
      "INF-1428-4994": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5213 simultaneous connections."
      },
      "INF-1429-4995": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5222 simultaneous connections."
      },
      "INF-1430-4996": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5231 simultaneous connections."
      },
      "INF-1431-4997": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5240 simultaneous connections."
      },
      "INF-1432-4998": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5249 simultaneous connections."
      },
      "INF-1433-4999": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5258 simultaneous connections."
      },
      "INF-1434-5000": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5267 simultaneous connections."
      },
      "INF-1435-5001": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5276 simultaneous connections."
      },
      "INF-1436-5002": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5285 simultaneous connections."
      },
      "INF-1437-5003": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5294 simultaneous connections."
      },
      "INF-1438-5004": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5303 simultaneous connections."
      },
      "INF-1439-5005": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5312 simultaneous connections."
      },
      "INF-1440-5006": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5321 simultaneous connections."
      },
      "INF-1441-5007": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5330 simultaneous connections."
      },
      "INF-1442-5008": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5339 simultaneous connections."
      },
      "INF-1443-5009": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5348 simultaneous connections."
      },
      "INF-1444-5010": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5357 simultaneous connections."
      },
      "INF-1445-5011": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5366 simultaneous connections."
      },
      "INF-1446-5012": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5375 simultaneous connections."
      },
      "INF-1447-5013": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5384 simultaneous connections."
      },
      "INF-1448-5014": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5393 simultaneous connections."
      },
      "INF-1449-5015": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5402 simultaneous connections."
      },
      "INF-1450-5016": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5411 simultaneous connections."
      },
      "INF-1451-5017": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5420 simultaneous connections."
      },
      "INF-1452-5018": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5429 simultaneous connections."
      },
      "INF-1453-5019": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5438 simultaneous connections."
      },
      "INF-1454-5020": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5447 simultaneous connections."
      },
      "INF-1455-5021": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5456 simultaneous connections."
      },
      "INF-1456-5022": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5465 simultaneous connections."
      },
      "INF-1457-5023": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5474 simultaneous connections."
      },
      "INF-1458-5024": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5483 simultaneous connections."
      },
      "INF-1459-5025": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5492 simultaneous connections."
      },
      "INF-1460-5026": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5501 simultaneous connections."
      },
      "INF-1461-5027": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5510 simultaneous connections."
      },
      "INF-1462-5028": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5519 simultaneous connections."
      },
      "INF-1463-5029": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5528 simultaneous connections."
      },
      "INF-1464-5030": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5537 simultaneous connections."
      },
      "INF-1465-5031": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5546 simultaneous connections."
      },
      "INF-1466-5032": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5555 simultaneous connections."
      },
      "INF-1467-5033": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5564 simultaneous connections."
      },
      "INF-1468-5034": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5573 simultaneous connections."
      },
      "INF-1469-5035": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5582 simultaneous connections."
      },
      "INF-1470-5036": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5591 simultaneous connections."
      },
      "INF-1471-5037": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5600 simultaneous connections."
      },
      "INF-1472-5038": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5609 simultaneous connections."
      },
      "INF-1473-5039": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5618 simultaneous connections."
      },
      "INF-1474-5040": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5627 simultaneous connections."
      },
      "INF-1475-5041": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5636 simultaneous connections."
      },
      "INF-1476-5042": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5645 simultaneous connections."
      },
      "INF-1477-5043": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5654 simultaneous connections."
      },
      "INF-1478-5044": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5663 simultaneous connections."
      },
      "INF-1479-5045": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5672 simultaneous connections."
      },
      "INF-1480-5046": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5681 simultaneous connections."
      },
      "INF-1481-5047": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5690 simultaneous connections."
      },
      "INF-1482-5048": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5699 simultaneous connections."
      },
      "INF-1483-5049": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5708 simultaneous connections."
      },
      "INF-1484-5050": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5717 simultaneous connections."
      },
      "INF-1485-5051": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5726 simultaneous connections."
      },
      "INF-1486-5052": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5735 simultaneous connections."
      },
      "INF-1487-5053": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5744 simultaneous connections."
      },
      "INF-1488-5054": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5753 simultaneous connections."
      },
      "INF-1489-5055": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5762 simultaneous connections."
      },
      "INF-1490-5056": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5771 simultaneous connections."
      },
      "INF-1491-5057": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5780 simultaneous connections."
      },
      "INF-1492-5058": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5789 simultaneous connections."
      },
      "INF-1493-5059": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5798 simultaneous connections."
      },
      "INF-1494-5060": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5807 simultaneous connections."
      },
      "INF-1495-5061": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5816 simultaneous connections."
      },
      "INF-1496-5062": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5825 simultaneous connections."
      },
      "INF-1497-5063": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5834 simultaneous connections."
      },
      "INF-1498-5064": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5843 simultaneous connections."
      },
      "INF-1499-5065": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5852 simultaneous connections."
      },
      "INF-1500-5066": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5861 simultaneous connections."
      },
      "INF-1501-5067": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5870 simultaneous connections."
      },
      "INF-1502-5068": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5879 simultaneous connections."
      },
      "INF-1503-5069": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5888 simultaneous connections."
      },
      "INF-1504-5070": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5897 simultaneous connections."
      },
      "WRN-1505-5071": {
        "type": "Warning",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5906 simultaneous connections."
      },
      "WRN-1506-5072": {
        "type": "Warning",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5915 simultaneous connections."
      },
      "WRN-1507-5073": {
        "type": "Warning",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5924 simultaneous connections."
      },
      "WRN-1508-5074": {
        "type": "Warning",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5933 simultaneous connections."
      },
      "WRN-1509-5075": {
        "type": "Warning",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5942 simultaneous connections."
      },
      "WRN-1510-5076": {
        "type": "Warning",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5951 simultaneous connections."
      },
      "WRN-1511-5077": {
        "type": "Warning",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5960 simultaneous connections."
      },
      "WRN-1512-5078": {
        "type": "Warning",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5969 simultaneous connections."
      },
      "WRN-1513-5079": {
        "type": "Warning",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5978 simultaneous connections."
      },
      "WRN-1514-5080": {
        "type": "Warning",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5987 simultaneous connections."
      },
      "WRN-1515-5081": {
        "type": "Warning",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5996 simultaneous connections."
      },
      "ERR-1516-5082": {
        "type": "Error",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 6005 simultaneous connections."
      },
      "ERR-1517-5083": {
        "type": "Error",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 6014 simultaneous connections."
      },
      "ERR-1518-5084": {
        "type": "Error",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 6023 simultaneous connections."
      },
      "ERR-1519-5085": {
        "type": "Error",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 6032 simultaneous connections."
      },
      "ERR-1520-5086": {
        "type": "Error",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 6041 simultaneous connections."
      },
      "ERR-1521-5087": {
        "type": "Error",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 6050 simultaneous connections."
      },
      "ERR-1522-5088": {
        "type": "Error",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 6059 simultaneous connections."
      },
      "ERR-1523-5089": {
        "type": "Error",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 6068 simultaneous connections."
      },
      "ERR-1524-5090": {
        "type": "Error",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 6032 simultaneous connections."
      },
      "WRN-1525-5091": {
        "type": "Warning",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5996 simultaneous connections."
      },
      "WRN-1526-5092": {
        "type": "Warning",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5960 simultaneous connections."
      },
      "WRN-1527-5093": {
        "type": "Warning",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5924 simultaneous connections."
      },
      "INF-1528-5094": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5888 simultaneous connections."
      },
      "INF-1529-5095": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5852 simultaneous connections."
      },
      "INF-1530-5096": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5816 simultaneous connections."
      },
      "INF-1531-5097": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5780 simultaneous connections."
      },
      "INF-1532-5098": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5744 simultaneous connections."
      },
      "INF-1533-5099": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5708 simultaneous connections."
      },
      "INF-1534-5100": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5672 simultaneous connections."
      },
      "INF-1535-5101": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5636 simultaneous connections."
      },
      "INF-1536-5102": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5600 simultaneous connections."
      },
      "INF-1537-5103": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5564 simultaneous connections."
      },
      "INF-1538-5104": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5528 simultaneous connections."
      },
      "INF-1539-5105": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5492 simultaneous connections."
      },
      "INF-1540-5106": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5456 simultaneous connections."
      },
      "INF-1541-5107": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5420 simultaneous connections."
      },
      "INF-1542-5108": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5384 simultaneous connections."
      },
      "INF-1543-5109": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5348 simultaneous connections."
      },
      "INF-1544-5110": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5312 simultaneous connections."
      },
      "INF-1545-5111": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5276 simultaneous connections."
      },
      "INF-1546-5112": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5240 simultaneous connections."
      },
      "INF-1547-5113": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5204 simultaneous connections."
      },
      "INF-1548-5114": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5168 simultaneous connections."
      },
      "INF-1549-5115": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5132 simultaneous connections."
      },
      "INF-1550-5116": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5096 simultaneous connections."
      },
      "INF-1551-5117": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-03-44-2442 - EU - prod. 01.01.2017 >>>> e6afb46a-1785-494b-a508-5909f019ff8a.tcpgw.prod01.alphapluscars.eu --- 5060 simultaneous connections."
      },
      "INF-1552-5118": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 5024 simultaneous connections."
      },
      "INF-1553-5119": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 4988 simultaneous connections."
      },
      "INF-1554-5120": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 4952 simultaneous connections."
      },
      "INF-1555-5121": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 4916 simultaneous connections."
      },
      "INF-1556-5122": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 4880 simultaneous connections."
      },
      "INF-1557-5123": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 4844 simultaneous connections."
      },
      "INF-1558-5124": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 4808 simultaneous connections."
      },
      "INF-1559-5125": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 4772 simultaneous connections."
      },
      "INF-1560-5126": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 4736 simultaneous connections."
      },
      "INF-1561-5127": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 4700 simultaneous connections."
      },
      "INF-1562-5128": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 4664 simultaneous connections."
      },
      "INF-1563-5129": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 4628 simultaneous connections."
      },
      "INF-1564-5130": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 4592 simultaneous connections."
      },
      "INF-1565-5131": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 4556 simultaneous connections."
      },
      "INF-1566-5132": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 4520 simultaneous connections."
      },
      "INF-1567-5133": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 4484 simultaneous connections."
      },
      "INF-1568-5134": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 4448 simultaneous connections."
      },
      "INF-1569-5135": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 4412 simultaneous connections."
      },
      "INF-1570-5136": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 4376 simultaneous connections."
      },
      "INF-1571-5137": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 4340 simultaneous connections."
      },
      "INF-1572-5138": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 4304 simultaneous connections."
      },
      "INF-1573-5139": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 4268 simultaneous connections."
      },
      "INF-1574-5140": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 4232 simultaneous connections."
      },
      "INF-1575-5141": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 4196 simultaneous connections."
      },
      "INF-1576-5142": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 4160 simultaneous connections."
      },
      "INF-1577-5143": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 4124 simultaneous connections."
      },
      "INF-1578-5144": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 4088 simultaneous connections."
      },
      "INF-1579-5145": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 4052 simultaneous connections."
      },
      "INF-1580-5146": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 4016 simultaneous connections."
      },
      "INF-1581-5147": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 3980 simultaneous connections."
      },
      "INF-1582-5148": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 3944 simultaneous connections."
      },
      "INF-1583-5149": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 3908 simultaneous connections."
      },
      "INF-1584-5150": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 3872 simultaneous connections."
      },
      "INF-1585-5151": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 3836 simultaneous connections."
      },
      "INF-1586-5152": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 3800 simultaneous connections."
      },
      "INF-1587-5153": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 3764 simultaneous connections."
      },
      "INF-1588-5154": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 3728 simultaneous connections."
      },
      "INF-1589-5155": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 3692 simultaneous connections."
      },
      "INF-1590-5156": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 3656 simultaneous connections."
      },
      "INF-1591-5157": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 3620 simultaneous connections."
      },
      "INF-1592-5158": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 3584 simultaneous connections."
      },
      "INF-1593-5159": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 3548 simultaneous connections."
      },
      "INF-1594-5160": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 3512 simultaneous connections."
      },
      "INF-1595-5161": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 3476 simultaneous connections."
      },
      "INF-1596-5162": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 3440 simultaneous connections."
      },
      "INF-1597-5163": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 3404 simultaneous connections."
      },
      "INF-1598-5164": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 3368 simultaneous connections."
      },
      "INF-1599-5165": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 3332 simultaneous connections."
      },
      "INF-1600-5166": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 3296 simultaneous connections."
      },
      "INF-1601-5167": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 3260 simultaneous connections."
      },
      "INF-1602-5168": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 3224 simultaneous connections."
      },
      "INF-1603-5169": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 3188 simultaneous connections."
      },
      "INF-1604-5170": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 3152 simultaneous connections."
      },
      "INF-1605-5171": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 3116 simultaneous connections."
      },
      "INF-1606-5172": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 3080 simultaneous connections."
      },
      "INF-1607-5173": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 3044 simultaneous connections."
      },
      "INF-1608-5174": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 3008 simultaneous connections."
      },
      "INF-1609-5175": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2972 simultaneous connections."
      },
      "INF-1610-5176": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2936 simultaneous connections."
      },
      "INF-1611-5177": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2900 simultaneous connections."
      },
      "INF-1612-5178": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2864 simultaneous connections."
      },
      "INF-1613-5179": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2828 simultaneous connections."
      },
      "INF-1614-5180": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2792 simultaneous connections."
      },
      "INF-1615-5181": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2756 simultaneous connections."
      },
      "INF-1616-5182": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2720 simultaneous connections."
      },
      "INF-1617-5183": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2684 simultaneous connections."
      },
      "INF-1618-5184": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2648 simultaneous connections."
      },
      "INF-1619-5185": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2612 simultaneous connections."
      },
      "INF-1620-5186": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2576 simultaneous connections."
      },
      "INF-1621-5187": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2540 simultaneous connections."
      },
      "INF-1622-5188": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2504 simultaneous connections."
      },
      "INF-1623-5189": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2468 simultaneous connections."
      },
      "INF-1624-5190": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2432 simultaneous connections."
      },
      "INF-1625-5191": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2396 simultaneous connections."
      },
      "INF-1626-5192": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2360 simultaneous connections."
      },
      "INF-1627-5193": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2324 simultaneous connections."
      },
      "INF-1628-5194": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2288 simultaneous connections."
      },
      "INF-1629-5195": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2252 simultaneous connections."
      },
      "INF-1630-5196": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2351 simultaneous connections."
      },
      "INF-1631-5197": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2110 simultaneous connections."
      },
      "INF-1632-5198": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2119 simultaneous connections."
      },
      "INF-1633-5199": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2128 simultaneous connections."
      },
      "INF-1634-5200": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2137 simultaneous connections."
      },
      "INF-1635-5201": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2146 simultaneous connections."
      },
      "INF-1636-5202": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2155 simultaneous connections."
      },
      "INF-1637-5203": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2164 simultaneous connections."
      },
      "INF-1638-5204": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2173 simultaneous connections."
      },
      "INF-1639-5205": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2182 simultaneous connections."
      },
      "INF-1640-5206": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2191 simultaneous connections."
      },
      "INF-1641-5207": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2200 simultaneous connections."
      },
      "INF-1642-5208": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2209 simultaneous connections."
      },
      "INF-1643-5209": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2218 simultaneous connections."
      },
      "INF-1644-5210": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2227 simultaneous connections."
      },
      "INF-1645-5211": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2236 simultaneous connections."
      },
      "INF-1646-5212": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2245 simultaneous connections."
      },
      "INF-1647-5213": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2254 simultaneous connections."
      },
      "INF-1648-5214": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2263 simultaneous connections."
      },
      "INF-1649-5215": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2272 simultaneous connections."
      },
      "INF-1650-5216": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2281 simultaneous connections."
      },
      "INF-1651-5217": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2290 simultaneous connections."
      },
      "INF-1652-5218": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2299 simultaneous connections."
      },
      "INF-1653-5219": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2308 simultaneous connections."
      },
      "INF-1654-5220": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2317 simultaneous connections."
      },
      "INF-1655-5221": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2326 simultaneous connections."
      },
      "INF-1656-5222": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2335 simultaneous connections."
      },
      "INF-1657-5223": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2344 simultaneous connections."
      },
      "INF-1658-5224": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2353 simultaneous connections."
      },
      "INF-1659-5225": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2362 simultaneous connections."
      },
      "INF-1660-5226": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2371 simultaneous connections."
      },
      "INF-1661-5227": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2380 simultaneous connections."
      },
      "INF-1662-5228": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2389 simultaneous connections."
      },
      "INF-1663-5229": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2398 simultaneous connections."
      },
      "INF-1664-5230": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2407 simultaneous connections."
      },
      "INF-1665-5231": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2416 simultaneous connections."
      },
      "INF-1666-5232": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2425 simultaneous connections."
      },
      "INF-1667-5233": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2434 simultaneous connections."
      },
      "INF-1668-5234": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2443 simultaneous connections."
      },
      "INF-1669-5235": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2452 simultaneous connections."
      },
      "INF-1670-5236": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2461 simultaneous connections."
      },
      "INF-1671-5237": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2470 simultaneous connections."
      },
      "INF-1672-5238": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2479 simultaneous connections."
      },
      "INF-1673-5239": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2488 simultaneous connections."
      },
      "INF-1674-5240": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2497 simultaneous connections."
      },
      "INF-1675-5241": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2506 simultaneous connections."
      },
      "INF-1676-5242": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2515 simultaneous connections."
      },
      "INF-1677-5243": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2524 simultaneous connections."
      },
      "INF-1678-5244": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2533 simultaneous connections."
      },
      "INF-1679-5245": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2542 simultaneous connections."
      },
      "INF-1680-5246": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2551 simultaneous connections."
      },
      "INF-1681-5247": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2560 simultaneous connections."
      },
      "INF-1682-5248": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2569 simultaneous connections."
      },
      "INF-1683-5249": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2578 simultaneous connections."
      },
      "INF-1684-5250": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2587 simultaneous connections."
      },
      "INF-1685-5251": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2596 simultaneous connections."
      },
      "INF-1686-5252": {
        "type": "Info",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2605 simultaneous connections."
      },
      "WRN-1687-5253": {
        "type": "Warning",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2614 simultaneous connections."
      },
      "WRN-1688-5254": {
        "type": "Warning",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2623 simultaneous connections."
      },
      "WRN-1689-5255": {
        "type": "Warning",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2632 simultaneous connections."
      },
      "WRN-1690-5256": {
        "type": "Warning",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2641 simultaneous connections."
      },
      "WRN-1691-5257": {
        "type": "Warning",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2650 simultaneous connections."
      },
      "WRN-1692-5258": {
        "type": "Warning",
        "log": "Device gateway Nomad IV  - PROD-13-92-7615 - JP - prod. 01.01.2017 > 30-06-2017 >>>> hd9ejfsk-4832-kkd9-88ep-0opps3fh5ugp.tcpgw.prod01.alphapluscars.co.jp --- 2659 simultaneous connections."
      }
    }
  }
];

@observer
class Dashboard extends Component {
    @observable filter = '';
	  @observable animationIsPlaying = true;

    constructor(props) {
        super(props);
        this.changeFilter = this.changeFilter.bind(this);
        this.disableAnimation = this.disableAnimation.bind(this);
        this.enableAnimation = this.enableAnimation.bind(this);
    }
    changeFilter(filter) {
    }
    disableAnimation(e) {
      if(e) e.preventDefault();
      this.animationIsPlaying = false;
    }
    enableAnimation(e) {
      if(e) e.preventDefault();
      this.animationIsPlaying = true;
    }
    render() {
        return (
            <div className="dashboard">
            	<DashboardSubheader
                data={data[0].systemStatus}
              />
            	<DashboardFakeSubheader
                    filter={this.filter}
                    changeFilter={this.changeFilter}
                    enableAnimation={this.enableAnimation}
                    disableAnimation={this.disableAnimation}
                />
            	<div className="content">
            		<DashboardList 
                        data={data[0].liveLogs}
                        animationIsPlaying={this.animationIsPlaying}
                    />
            	</div>
            </div>
        );
    }
}

export default Dashboard;