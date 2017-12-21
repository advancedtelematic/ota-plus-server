import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable, toJS, observe } from 'mobx';
import _ from 'underscore';
import Modal from './Modal';
import Loader from './Loader';
import { Sankey } from 'react-vis';
import { AsyncStatusCallbackHandler } from '../utils';

const defaultOpacity = "0.2";
const highlightedOpacity = "0.5";
const sankeyAlign = "left";
const nodeColor = "grey";
const linkColor = "grey";

@observer
class DependenciesModal extends Component {
  @observable loaded = false;
  @observable packages = [];
  @observable devices = [];
  @observable nodes = [];
  @observable links = [];
  @observable itemsToHighlight = [];
  @observable showOnlyActive = true;
  @observable sankeyWidth = 1000;
  @observable sankeyHeight = 700;

  constructor(props) {
      super(props);
      this.devicesFetchHandler = new AsyncStatusCallbackHandler(props.devicesStore, 'devicesFetchAsync', this.devicesFetched.bind(this));
      this.campaignsFetchHandler = new AsyncStatusCallbackHandler(props.campaignsStore, 'campaignsSafeFetchAsync', this.campaignsFetched.bind(this));
      this.packagesFetchHandler = new AsyncStatusCallbackHandler(props.packagesStore, 'packagesTufFetchAsync', this.packagesFetched.bind(this));
      this.onLinkMouseAction = this.onLinkMouseAction.bind(this);
      this.onLinkClick = this.onLinkClick.bind(this);
      this.getCampaignStatus = this.getCampaignStatus.bind(this);
      this.resizeSankey = this.resizeSankey.bind(this);

      this.sankeyModeHandler = observe(this, (change) => {
          if(change['object'].showOnlyActive === false) {
            this.formatData(true);
          }
      });
  }
  componentDidMount() {
    window.addEventListener("resize", this.resizeSankey);
  }
  componentWillMount() {
      this.props.devicesStore.fetchDevices();
      if(window.location.href.indexOf('/packages') > -1) {
        this.props.campaignsStore.fetchCampaigns('campaignsSafeFetchAsync');
      } else {
        this.props.packagesStore.fetchTufPackages();
      }
  }
  resizeSankey() {
    if(window.innerHeight >= 1000) {
      this.sankeyHeight = 700;
    } else if(window.innerHeight < 1000 && window.innerHeight > 870) {
      this.sankeyHeight = 600;
    } else {
      this.sankeyHeight = 500;
    }
  }
  componentWillUnmount() {
    this.devicesFetchHandler();
    this.campaignsFetchHandler();
    this.packagesFetchHandler();
    window.removeEventListener("resize", this.resizeSankey);
  }
  showFullGraph() {
    this.showOnlyActive = false;
  }
  onLinkMouseAction(actionType, linkdata, event) {
    let opacity = defaultOpacity;
    if(actionType === 'in') {
      opacity = highlightedOpacity;
    }
    event.target.setAttribute("opacity", opacity);
    this.highlightTargets(linkdata.target.sourceLinks, opacity);
    this.highlightSources(linkdata.source.targetLinks, opacity);
  }
  highlightTargets(data, opacity) {
      let paths = document.querySelectorAll('path');
     _.each(data, (link, index) => {
        let ix = link.index;
        paths[ix].setAttribute("opacity", opacity);
        if(link.target.sourceLinks) {
          this.highlightTargets(link.target.sourceLinks, opacity);
        }
      });
  }
  highlightSources(data, opacity) {
    let paths = document.querySelectorAll('path');
     _.each(data, (link, index) => {
        let ix = link.index;
        paths[ix].setAttribute("opacity", opacity);
        if(link.source.targetLinks) {
          this.highlightSources(link.source.targetLinks, opacity);
        }
      });
  }
  onLinkClick(linkdata, event) {
    const { packagesStore, campaignsStore, hide } = this.props;
    let clickedItemType = linkdata.target.type;
    switch(clickedItemType) {
      case 'pack':
        let packName = linkdata.target.originalName;
        this.context.router.push(`/packages/${packName}`);
        hide();
        break;
      case 'mtu':
        break;
      case 'campaign':
        let campaignName = linkdata.target.originalName;
        let campaign = _.find(campaignsStore.campaigns, campaign => campaign.name === campaignName);
        this.context.router.push(`/campaigns/${campaign.id}`);
        break;
      case 'device':
        let deviceId = linkdata.target.uuid;
        this.context.router.push(`/device/${deviceId}`);
        break;
      default: 
        break;
    }
  }
  getCampaignStatus(campaign) {
    return campaign.summary.status === 'finished' || campaign.summary.status === 'cancelled' ? 'finished' : campaign.summary.status === 'launched' ? 'running' : 'other';
  }
  devicesFetched() {
    const { devicesStore, packagesStore } = this.props;
    _.each(devicesStore.devices, (device, index) => {
      devicesStore.fetchMultiTargetUpdates(device.uuid);
      packagesStore.fetchDirectorDevicePackagesHistory(device.uuid, packagesStore.directorDevicePackagesFilter, true);
    });
  }
  packagesFetched() {
    this.props.campaignsStore.fetchCampaigns('campaignsSafeFetchAsync');
  }
  campaignsFetched() {
    const { campaignsStore, devicesStore, packagesStore } = this.props;
    _.each(devicesStore.multiTargetUpdates, (mtuUpdate, i) => {
      let packageHash = mtuUpdate.targets[Object.keys(mtuUpdate.targets)[0]].image.fileinfo.hashes.sha256;
      let pack = _.find(packagesStore.directorPackages, (pack) => {
        return pack.packageHash === packageHash;
      });
      this.packages.push(pack);
    });
    _.each(packagesStore.directorDeviceHistory, (historyUpdate, i) => {
      if(!_.isEmpty(historyUpdate.operationResult)) {
        let packageHash = historyUpdate.operationResult[Object.keys(historyUpdate.operationResult)[0]].hashes.sha256;
        let pack = _.find(packagesStore.directorPackages, (pack) => {
          return pack.packageHash === packageHash;
        });
        this.packages.push(pack);
      }
    });
    this.packages = _.uniq(this.packages, pack => pack.packageHash);
    this.packages = _.sortBy(this.packages, pack => pack.id.name);
    this.formatData();
  }
  prepareNodesAndLinks(source, highlight = false) {
    const { campaignsStore, devicesStore, packagesStore } = this.props;
    let devicesWithQueue = [];
    let devicesWithInstalled = [];

    _.each(source, (pack, index) => {
      pack.mtus = [];
      _.each(devicesStore.multiTargetUpdates, (mtu, i) => {
        mtu.type = 'queue';
        let packageHash = mtu.targets[Object.keys(mtu.targets)[0]].image.fileinfo.hashes.sha256;
        if(pack.packageHash === packageHash) {
          pack.mtus.push(mtu);
        }
      });
      _.each(packagesStore.directorDeviceHistory, (mtu, i) => {
        if(!_.isEmpty(mtu.operationResult)) {
          mtu.type = 'history';
          let packageHash = mtu.operationResult[Object.keys(mtu.operationResult)[0]].hashes.sha256;
          if(pack.packageHash === packageHash) {
            pack.mtus.push(mtu);
          }
        }
      });

      _.each(pack.mtus, (mtu, i) => {
        mtu.campaigns = [];
        mtu.queuedOn = [];
        mtu.installedOn = [];
        _.each(campaignsStore.campaigns, (campaign, ind) => {
          if(campaign.update === mtu.updateId) {
            mtu.campaigns.push(campaign);
          }
        });
        _.each(devicesStore.devices, (device, ind) => {          

          if(device.uuid === mtu.device) {            
            mtu.deviceName = device.deviceName;

            switch(mtu.type) {
              case 'queue':
                mtu.queuedOn.push(device);
                devicesWithQueue.push(device);
                break;
              case 'history':
                mtu.installedOn.push(device);
                devicesWithInstalled.push(device);
                break;
              default:
                break;
            }
          }
        })
      });
    });

    devicesWithQueue = _.uniq(devicesWithQueue, device => device.uuid);
    devicesWithInstalled = _.uniq(devicesWithInstalled, device => device.uuid);
    let localDevices = [];
  
    _.each(devicesWithQueue, (device, index) => {
      let dev = Object.assign({}, device);
      dev.section = 'queued';
      localDevices.push(dev);
    });
    _.each(devicesWithInstalled, (device, index) => {
      let dev = Object.assign({}, device);
      dev.section = 'installed';
      localDevices.push(dev);
    });

    this.devices = localDevices;
    this.devices = _.sortBy(this.devices, device => device.deviceName);

    let nodes = [{
      name: 'targets.json',
      type: 'root',
      color: "#8B60A5"
    }];

    _.map(source, (item, index) => {
      let packObj = {
        name: item.id.name.substring(0, 15) + " - " + item.id.version.substring(0, 5),
        originalName: item.id.name,
        type: 'pack',
        color: "#6A9CD3",
        queuedOn: [],
        installedOn: [],
        campaign: null
      };
      _.map(item.mtus, (mtu, i) => {
        if(mtu.queuedOn.length) {
          packObj.queuedOn.push(mtu.queuedOn[0]);
        } 
        if(mtu.installedOn.length) {
          packObj.installedOn.push(mtu.installedOn[0]);
        }
        _.map(mtu.campaigns, (campaign, i) => {      
          nodes.push({
            originalName: campaign.name,
            name: campaign.name.substring(0, 15) + "(" + this.getCampaignStatus(campaign) + ")",
            type: 'campaign',
            status: this.getCampaignStatus(campaign),
            color: this.getCampaignStatus(campaign) === 'finished' ? "#88c062" : '#738771',
          });
          packObj.campaign = campaign;
        });
      });
      packObj.queuedOn = _.uniq(packObj.queuedOn, device => device.uuid);
      packObj.installedOn = _.uniq(packObj.installedOn, device => device.uuid);
      nodes.push(packObj);
    });
    _.map(this.devices, (device, index) => {
      nodes.push({
        name: device.deviceName.substring(0, 15) + (device.section === 'queued' ? '(queued on)' : '(installed on)'),
        originalName: device.deviceName,
        uuid: device.uuid,
        section: device.section,
        type: 'device',
        color: device.section === 'queued' ? "#F6A623" : "#e9e587",
      });
    });
    let packIndexes = [];
    _.each(nodes, (node, index) => {
      if(node.type === 'pack') {
        packIndexes.push(index);
      }
    });
    let links = [];
    let nextPackIndex = 0;

    if(nodes.length <= 3) {
      this.sankeyHeight = 200;
    } else {
      this.resizeSankey();
    }
    _.map(nodes, (node, index) => {
      switch(node.type) {
        case 'root':
          _.map(nodes, (nodeInternal, indexInternal) => {
            if(indexInternal > index && nodeInternal.type === 'pack') {
              links.push({
                source: index,
                target: indexInternal,
                value: 1,
                color: "#B2B2B2",
                opacity: parseFloat(defaultOpacity)
              });
            }
          });
          break;
        case 'pack':
          let currentPackIndex = index;
          let currentPackIndexIndex = _.indexOf(packIndexes, currentPackIndex);
          nextPackIndex = packIndexes[++currentPackIndexIndex];
          if(_.isUndefined(nextPackIndex)) {
            nextPackIndex = Object.keys(nodes).length;
          }

          let queuedOn = node.queuedOn;
          let installedOn = node.installedOn;
          let campaign = node.campaign;

          _.map(queuedOn, (device, i) => {
            let foundDevice = _.find(nodes, node => node.name === device.deviceName.substring(0, 15) + "(queued on)");
            if(foundDevice) {
              links.push({
                source: index,
                target: nodes.indexOf(foundDevice),
                value: 1,
                color: "#B2B2B2",
                opacity: parseFloat(defaultOpacity)
              });
            }
          });

          _.map(installedOn, (device, i) => {
            let foundDevice = _.find(nodes, node => node.name === device.deviceName.substring(0, 15) + "(installed on)");
            if(foundDevice) {
              links.push({
                source: index,
                target: nodes.indexOf(foundDevice),
                value: 1,
                color: "#B2B2B2",
                opacity: parseFloat(defaultOpacity)
              });
            }
          });
          
          if(campaign) {
            let foundCampaign = _.find(nodes, node => node.name === campaign.name.substring(0, 15) + "(" + this.getCampaignStatus(campaign) + ")");
            links.push({
                source: index,
                target: nodes.indexOf(foundCampaign),
                value: 1,
                color: "#B2B2B2",
                opacity: parseFloat(defaultOpacity)
              });
          }

          break;
        default:
          break;
      }
    });
    this.nodes = nodes;
    this.links = links;
    this.loaded = true;

    const that = this;
    setTimeout(() => {
      that.animateChart();
    }, 5);

    if(highlight) {
      let itemsToHighlight = [];
      let activeItemName = this.props.activeItemName;

      _.map(source, (item, index) => {

        if(activeItemName === item.packageHash) {
          itemsToHighlight.push(item);
        }

        _.map(item.mtus, (mtu, i) => {
          _.map(mtu.campaigns, (campaign, i) => {
            if(activeItemName === campaign.name) {
              itemsToHighlight.push(item);
            }
          });
        });
      });
      this.itemsToHighlight = itemsToHighlight;
      setTimeout(() => {
        that.hightlightActiveItems();
      }, 5);
    }
  }
  animateChart() {
    let allTextElements = document.querySelectorAll('text');
    let packs = [];
    let campaigns = [];
    let devices = [];
    _.each(this.nodes, (node, i) => {
      switch(node.type) {
        case 'pack':
          packs.push(node.name);
          break;
        case 'campaign':
          campaigns.push(node.name);
        case 'device':
          devices.push(node.name);
        default:
          break;
      }
    });
    _.each(allTextElements, (item, index) => {
      item.style.transition = "transform 0.5s";
      if(_.contains(packs, this.unescapeHTML(item.innerHTML))) {
        item.style.transform = "translate(-30px)"; 
      }
      if(_.contains(campaigns, this.unescapeHTML(item.innerHTML))) {
        item.style.transform = "translate(-5px)"; 
      }
      if(_.contains(devices, this.unescapeHTML(item.innerHTML))) {
        item.style.transform = "translate(-5px)"; 
      }
      if(item.innerHTML === 'targets.json') {
        item.style.transform = "translate(10px)"; 
      }
    });
  }
  formatData(removeHandler = false) {
    const { devicesStore, packagesStore, campaignsStore } = this.props;
    if(removeHandler) {
      this.sankeyModeHandler();
    }
    if(this.showOnlyActive) {      
      _.each(this.packages, (pack, index) => {
        pack.mtus = [];
        _.each(devicesStore.multiTargetUpdates, (mtu, i) => {
          mtu.type = 'queue';
          let packageHash = mtu.targets[Object.keys(mtu.targets)[0]].image.fileinfo.hashes.sha256;
          if(pack.packageHash === packageHash) {
            pack.mtus.push(mtu);
          }
        });
        _.each(packagesStore.directorDeviceHistory, (mtu, i) => {
          if(!_.isEmpty(mtu.operationResult)) {
            mtu.type = 'history';
            let packageHash = mtu.operationResult[Object.keys(mtu.operationResult)[0]].hashes.sha256;
            if(pack.packageHash === packageHash) {
              pack.mtus.push(mtu);
            }
          }
        });
        _.each(pack.mtus, (mtu, i) => {
          mtu.campaigns = [];
          _.each(campaignsStore.campaigns, (campaign, ind) => {
            if(campaign.update === mtu.updateId) {
              mtu.campaigns.push(campaign);
            }
          });
        });
      });

      let activePackages = [];
      let activeItemName = this.props.activeItemName;

      _.map(this.packages, (item, index) => {
        if(activeItemName === item.packageHash) {
          activePackages.push(item);
        }

        _.map(item.mtus, (mtu, i) => {
          _.map(mtu.campaigns, (campaign, i) => {
            if(activeItemName === campaign.name) {
              activePackages.push(item);
            }
          });
        });
      });

      if(activePackages.length) {
        this.prepareNodesAndLinks(activePackages);
      } else {
        this.nodes = [];
        this.links = [];
        this.loaded = true;
      }
    } else {
      this.prepareNodesAndLinks(this.packages, true);
    }
  }
  hightlightActiveItems() {
    let dataToFind = [];

    _.each(this.itemsToHighlight, (pack, ind) => {
      let packName = pack.id.name.substring(0, 15);
      let packVersion = pack.id.version.substring(0, 5);
      let packString = packName + " - " + packVersion;
      dataToFind.push(packString);
      dataToFind.push('targets.json');

      _.each(pack.mtus, (mtu, index) => {
        dataToFind.push(mtu.updateId.substring(0, 15));

        let deviceStatus = mtu.queuedOn.length ? 'queued on' : 'installed on';
        dataToFind.push(mtu.deviceName.substring(0, 15) + "(" + deviceStatus + ")");

        _.each(mtu.campaigns, (campaign, i) => {
          dataToFind.push(campaign.name.substring(0, 15) + "(" + this.getCampaignStatus(campaign) + ")");
        })
      });
    });

    let allTextElements = document.querySelectorAll('text');
    _.each(allTextElements, (item, index) => {
      if(_.contains(dataToFind, this.unescapeHTML(item.innerHTML))) {
        item.style.fontSize = '21px';
      } else if(dataToFind.length) {
        item.style.opacity = .5;
      }
    });
  }
  unescapeHTML(html) {
    return html.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
  }
  render() {
      const { shown, hide, packagesStore, campaignsStore, devicesStore } = this.props;
      const content = (
          this.loaded ?
            <span>
              <div className="heading">
                <span>Dependencies</span>
                <a href="#" id="close-sankey" className="close-sankey" title="Close sankey" onClick={hide.bind(this)}>
                    <i className="fa fa-times fa-times-thin" aria-hidden="true"></i>
                </a>
              </div>
              {this.nodes.length && this.links.length ?
                <div className={(this.nodes.length <= 3 ? "sankey-minimized" : "")}>
                  <Sankey
                    align={sankeyAlign}
                    nodes={toJS(this.nodes)}
                    links={toJS(this.links)}
                    width={this.sankeyWidth}
                    height={this.sankeyHeight}
                    onLinkMouseOver={this.onLinkMouseAction.bind(this, 'in')}
                    onLinkMouseOut={this.onLinkMouseAction.bind(this, 'out')}
                    onLinkClick={this.onLinkClick.bind(this)}
                    layout={1000}
                    style={{
                      labels: {
                      },
                      links: {
                      },
                      rects: {
                        width: '15px',
                      }
                    }}
                  />
                </div>
              :
                <div className="wrapper-center">
                  This item is not on the chart.
                </div>
              }
              <div className="footer">
                <a href="#" onClick={hide.bind(this)} className="close-modal">Close</a>
                {this.showOnlyActive ?
                  <button className="btn-main" onClick={this.showFullGraph.bind(this)}>
                    Show all
                  </button>
                :
                  null
                }
              </div>
            </span>
          :
            <div className="wrapper-center">
              <Loader />
            </div>  
      );
      return (
        <Modal
          content={content}
          shown={shown}
          className="dependencies-modal"
          hideOnClickOutside={true}
          onRequestClose={hide}
        />
      );
  }
}

DependenciesModal.propTypes = {
}

DependenciesModal.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default DependenciesModal;