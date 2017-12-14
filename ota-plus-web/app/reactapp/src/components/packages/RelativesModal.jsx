import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable, toJS } from 'mobx';
import _ from 'underscore';
import { Modal, Loader } from '../../partials';
import { Sankey } from 'react-vis';
import { AsyncStatusCallbackHandler } from '../../utils';

const defaultOpacity = "0.2";
const highlightedOpacity = "0.5";
const sankeyAlign = "left";
const nodeColor = "grey";
const linkColor = "grey";
const sankeyWidth = 1000;
const sankeyHeight = 700;

@observer
class RelativesModal extends Component {
  @observable loaded = false;
  @observable packages = [];
  @observable devices = [];
  @observable nodes = [];
  @observable links = [];

  constructor(props) {
      super(props);
      this.devicesFetchHandler = new AsyncStatusCallbackHandler(props.devicesStore, 'devicesFetchAsync', this.devicesFetched.bind(this));
      this.campaignsFetchHandler = new AsyncStatusCallbackHandler(props.campaignsStore, 'campaignsSafeFetchAsync', this.campaignsFetched.bind(this));
      this.packagesFetchHandler = new AsyncStatusCallbackHandler(props.packagesStore, 'packagesTufFetchAsync', this.packagesFetched.bind(this));
      this.onLinkMouseAction = this.onLinkMouseAction.bind(this);
      this.onLinkClick = this.onLinkClick.bind(this);
      this.getNodeStatus = this.getNodeStatus.bind(this);
  }
  componentWillMount() {
      this.props.devicesStore.fetchDevices();
      if(window.location.href.indexOf('/packages') > -1) {
        this.props.campaignsStore.fetchCampaigns('campaignsSafeFetchAsync');
      } else {
        this.props.packagesStore.fetchTufPackages();
      }
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
      case 'node':
        let campaignName = linkdata.target.originalName;
        let campaign = _.find(campaignsStore.campaigns, campaign => campaign.name === campaignName);
        this.context.router.push(`/campaigns/${campaign.name}`);
        break;
      case 'device':
        let deviceId = linkdata.target.uuid;
        this.context.router.push(`/device/${deviceId}`);
        break;
      default: 
        break;
    }
  }
  getNodeStatus(node) {
    return node.summary.status === 'finished' || node.summary.status === 'cancelled' ? 'finished' : node.summary.status === 'launched' ? 'running' : 'other';
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
  formatData() {
    const { campaignsStore, devicesStore, packagesStore } = this.props;
    let devicesWithQueue = [];
    let devicesWithInstalled = [];
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
        mtu.nodes = [];
        mtu.queuedOn = [];
        mtu.installedOn = [];
        _.each(campaignsStore.campaigns, (campaign, ind) => {
          if(campaign.update === mtu.updateId) {
            mtu.nodes.push(campaign);
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

    _.each(devicesWithQueue, (device, index) => {
      let dev = Object.assign({}, device);
      dev.section = 'queued';
      this.devices.push(dev);
    });
    _.each(devicesWithInstalled, (device, index) => {
      let dev = Object.assign({}, device);
      dev.section = 'installed';
      this.devices.push(dev);
    });

    this.devices = _.sortBy(this.devices, device => device.deviceName);

    let nodes = [{
      name: 'targets.json',
      type: 'root',
      color: "#744FFF"
    }];
    let activePackagesWithRelations = [];

    _.map(this.packages, (item, index) => {
      let activeItemName = this.props.activeItemName;

      if(activeItemName === item.packageHash) {
        activePackagesWithRelations.push(item);
      }

      nodes.push({
        name: item.id.name.substring(0, 15) + " - " + item.id.version.substring(0, 5),
        originalName: item.id.name,
        type: 'pack',
        color: "#62B1FF",
      });

      _.map(item.mtus, (mtu, i) => {
        nodes.push({
          name: mtu.updateId.substring(0, 15),
          deviceName: mtu.deviceName,
          type: 'mtu',
          color: "#FF8A65",
          queuedOn: mtu.queuedOn,
          installedOn: mtu.installedOn
        });
        _.map(mtu.nodes, (node, i) => {

          if(activeItemName === node.name) {
            activePackagesWithRelations.push(item);
          }

          nodes.push({
            name: node.name.substring(0, 15) + "(" + this.getNodeStatus(node) + ")",
            originalName: node.name,
            type: 'node',
            status: this.getNodeStatus(node),
            color: this.getNodeStatus(node) === 'finished' ? "#76FF3E" : '#5B9260',
          });
        });
      });
    });

    _.map(this.devices, (device, index) => {
      nodes.push({
        name: device.deviceName.substring(0, 15) + (device.section === 'queued' ? '(queued on)' : '(installed on)'),
        originalName: device.deviceName,
        uuid: device.uuid,
        section: device.section,
        type: 'device',
        color: device.section === 'queued' ? "#FE9819" : "#DDF96C",
      });
    });

    let packIndexes = [];
    _.each(nodes, (node, index) => {
      if(node.type === 'pack') {
        packIndexes.push(index);
      }
    });

    let mtuIndexes = [];
    _.each(nodes, (node, index) => {
      if(node.type === 'mtu') {
        mtuIndexes.push(index);
      }
    });

    let links = [];
    let nextPackIndex = 0;
    let nextMtuIndex = 0;
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
          _.map(nodes, (nodeInternal, indexInternal) => {
            if(indexInternal > index && indexInternal < nextPackIndex && nodeInternal.type === 'mtu') {
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
        case 'mtu':
          let currentMtuIndex = index;
          let currentMtuIndexIndex = _.indexOf(mtuIndexes, currentMtuIndex);
          nextMtuIndex = mtuIndexes[++currentMtuIndexIndex];
          if(_.isUndefined(nextMtuIndex)) {
            nextMtuIndex = Object.keys(nodes).length;
          }
          _.map(nodes, (nodeInternal, indexInternal) => {
            if(indexInternal > index && indexInternal < nextPackIndex && indexInternal < nextMtuIndex && nodeInternal.type === 'node') {
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
        case 'device':
          _.map(nodes, (nodeInternal, indexInternal) => {
            if(nodeInternal.type === 'mtu') {

              let queuedOn = nodeInternal.queuedOn;
              let installedOn = nodeInternal.installedOn;

              _.each(queuedOn, (device, i) => {
                let nodeDevice = nodes[index];
                if(nodeDevice.originalName === device.deviceName && nodeDevice.section === 'queued') {
                  links.push({
                    source: indexInternal,
                    target: index,
                    value: 1,
                    color: "#B2B2B2",
                    opacity: parseFloat(defaultOpacity)
                  });
                }
              });

              _.each(installedOn, (device, i) => {
                let nodeDevice = nodes[index];
                if(nodeDevice.originalName === device.deviceName && nodeDevice.section === 'installed') {
                  links.push({
                    source: indexInternal,
                    target: index,
                    value: 1,
                    color: "#B2B2B2",
                    opacity: parseFloat(defaultOpacity)
                  });
                }
              });

            }
          });
          break;
        default:
          break;
      }
    });
    this.nodes = nodes;
    this.links = links;
    this.loaded = true;

    this.hightlightActiveItems(activePackagesWithRelations);
  }
  hightlightActiveItems(activePackagesWithRelations) {
    let dataToFind = [];
    
    _.each(activePackagesWithRelations, (pack, ind) => {
      let packName = pack.id.name.substring(0, 15);
      let packVersion = pack.id.version.substring(0, 5);
      let packString = packName + " - " + packVersion;
      dataToFind.push(packString);
      dataToFind.push('targets.json');

      _.each(pack.mtus, (mtu, index) => {
        dataToFind.push(mtu.updateId.substring(0, 15));

        let deviceStatus = mtu.queuedOn.length ? 'queued on' : 'installed on';
        dataToFind.push(mtu.deviceName.substring(0, 15) + "(" + deviceStatus + ")");

        _.each(mtu.nodes, (node, i) => {
          dataToFind.push(node.name.substring(0, 15) + "(" + this.getNodeStatus(node) + ")");
        })
      });
    });

    let allTextElements = document.querySelectorAll('text');
    _.each(allTextElements, (item, index) => {
      if(_.contains(dataToFind, this.unescapeHTML(item.innerHTML))) {
        item.style.fontWeight = 'bold';
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
            <Sankey
              align={sankeyAlign}
              nodes={toJS(this.nodes)}
              links={toJS(this.links)}
              width={sankeyWidth}
              height={sankeyHeight}
              onLinkMouseOver={this.onLinkMouseAction.bind(this, 'in')}
              onLinkMouseOut={this.onLinkMouseAction.bind(this, 'out')}
              onLinkClick={this.onLinkClick.bind(this)}
              layout={1000}
            >
            </Sankey>
          :
            <div className="wrapper-center">
              <Loader />
            </div>  
      );
      return (
        <Modal 
          title="Relatives Modal"
          content={content}
          shown={shown}
          className="relatives-modal"
          hideOnClickOutside={true}
          onRequestClose={hide}
        />
      );
  }
}

RelativesModal.propTypes = {
}

RelativesModal.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default RelativesModal;