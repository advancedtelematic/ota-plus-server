/* eslint-disable no-param-reassign */
/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, toJS, observe } from 'mobx';
import _ from 'lodash';
import { Sankey } from 'react-vis';

import { Button, Tag } from 'antd';
import OTAModal from './OTAModal';
import { AsyncStatusCallbackHandler } from '../utils';
import { getSHA256Hash } from '../utils/Helpers';

import { assets } from '../config';

const defaultOpacity = '0.2';
const highlightedOpacity = '0.5';
const sankeyAlign = 'left';

@inject('stores')
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

  static propTypes = {
    stores: PropTypes.shape({}),
    status: PropTypes.string,
    hide: PropTypes.func,
    activeItemName: PropTypes.string,
    shown: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    const { devicesStore, softwareStore, campaignsStore } = props.stores;
    this.devicesFetchHandler = new AsyncStatusCallbackHandler(
      devicesStore,
      'devicesFetchAsync',
      this.devicesFetched.bind(this)
    );
    this.campaignsFetchHandler = new AsyncStatusCallbackHandler(
      campaignsStore,
      'campaignsSafeFetchAsync',
      this.campaignsFetched.bind(this)
    );
    this.packagesFetchHandler = new AsyncStatusCallbackHandler(
      softwareStore,
      'packagesFetchAsync',
      this.packagesFetched.bind(this)
    );

    this.sankeyModeHandler = observe(this, (change) => {
      if (change.object.showOnlyActive === false) {
        this.formatData(true);
      }
    });
  }

  componentDidMount() {
    const { router } = this.context;
    const { stores, status } = this.props;
    const { devicesStore, campaignsStore, softwareStore } = stores;
    devicesStore.fetchDevices().then(() => {
      if (router.route.location !== '/packages') {
        campaignsStore.fetchCampaigns(status, 'campaignsSafeFetchAsync');
      } else {
        softwareStore.fetchPackages();
      }
    });
    window.addEventListener('resize', this.resizeSankey);
  }

  componentWillUnmount() {
    const { stores } = this.props;
    const { devicesStore } = stores;
    this.devicesFetchHandler();
    this.campaignsFetchHandler();
    this.packagesFetchHandler();
    devicesStore.reset();
    window.removeEventListener('resize', this.resizeSankey);
  }

  resizeSankey = () => {
    if (window.innerHeight >= 1000) {
      this.sankeyHeight = 700;
    } else if (window.innerHeight < 1000 && window.innerHeight > 870) {
      this.sankeyHeight = 600;
    } else {
      this.sankeyHeight = 500;
    }
  };

  onLinkMouseAction = (actionType, linkData, event) => {
    let opacity = defaultOpacity;
    if (actionType === 'in') {
      opacity = highlightedOpacity;
    }
    event.target.setAttribute('opacity', opacity);
    this.highlightTargets(linkData.target.sourceLinks, opacity);
    this.highlightSources(linkData.source.targetLinks, opacity);
  };

  onLinkClick = (linkData) => {
    const { router } = this.context;
    const { stores, hide } = this.props;
    const { campaignsStore } = stores;
    const clickedItemType = linkData.target.type;
    let path = '';
    switch (clickedItemType) {
      case 'pack':
        path = `/packages/${linkData.target.originalName}`;
        hide();
        break;
      case 'mtu':
        break;
      case 'campaign':
        const campaignName = linkData.target.originalName; //eslint-disable-line
        const campaign = _.find(campaignsStore.campaigns, campaign => campaign.name === campaignName); //eslint-disable-line
        path = `/campaigns/${campaign.id}`;
        hide();
        break;
      case 'device':
        path = `/device/${linkData.target.uuid}`;
        break;
      default:
        break;
    }

    router.push(path);
  };

  // eslint-disable-next-line max-len
  getCampaignStatus = campaign => (campaign.summary.status === 'finished' || campaign.summary.status === 'cancelled' ? 'finished' : campaign.summary.status === 'launched' ? 'running' : 'other');

  showFullGraph() {
    this.showOnlyActive = false;
  }

  highlightTargets(data, opacity) {
    const paths = document.querySelectorAll('path');
    _.each(data, (link) => {
      const ix = link.index;
      paths[ix].setAttribute('opacity', opacity);
      if (link.target.sourceLinks) {
        this.highlightTargets(link.target.sourceLinks, opacity);
      }
    });
  }

  highlightSources(data, opacity) {
    const paths = document.querySelectorAll('path');
    _.each(data, (link) => {
      const ix = link.index;
      paths[ix].setAttribute('opacity', opacity);
      if (link.source.targetLinks) {
        this.highlightSources(link.source.targetLinks, opacity);
      }
    });
  }

  devicesFetched() {
    const { stores } = this.props;
    const { devicesStore } = stores;
    _.each(devicesStore.devices, (device) => {
      devicesStore.fetchMultiTargetUpdates(device.uuid);
      devicesStore.fetchPrimaryAndSecondaryFilepaths(device.uuid).then((filepaths) => {
        device.installedFilepaths = filepaths;
      });
    });
  }

  packagesFetched() {
    const { stores, status } = this.props;
    const { campaignsStore } = stores;
    campaignsStore.fetchCampaigns(status, 'campaignsSafeFetchAsync');
  }

  campaignsFetched() {
    const { stores } = this.props;
    const { devicesStore, softwareStore } = stores;
    _.each(devicesStore.multiTargetUpdatesSaved, (mtuUpdate) => {
      const packageHash = getSHA256Hash(mtuUpdate);
      const pack = _.find(softwareStore.packages, singlePack => singlePack.packageHash === packageHash);
      this.packages.push(pack);
    });
    _.each(devicesStore.devices, (device) => {
      const filepaths = device.installedFilepaths;
      _.each(filepaths, (filepath) => {
        const pack = _.find(softwareStore.packages, singlePack => singlePack.filepath === filepath);
        if (!_.isUndefined(pack)) {
          this.packages.push(pack);
        }
      });
    });
    this.packages = _.uniqBy(this.packages, pack => pack.filepath);
    this.packages = _.sortBy(this.packages, pack => pack.id.name);
    this.formatData();
  }

  prepareNodesAndLinks(source, highlight = false) {
    const { stores } = this.props;
    const { campaignsStore, devicesStore } = stores;
    let devicesWithQueue = [];
    let devicesWithInstalled = [];

    _.each(source, (pack) => {
      pack.mtus = [];
      _.each(devicesStore.multiTargetUpdatesSaved, (mtu) => {
        mtu.type = 'queue';
        const packageHash = getSHA256Hash(mtu);
        if (pack.packageHash === packageHash) {
          pack.mtus.push(mtu);
        }
      });

      _.each(devicesStore.devices, (device) => {
        const filepaths = device.installedFilepaths;
        _.each(filepaths, (filepath) => {
          if (pack.filepath === filepath) {
            const mtu = {
              type: 'history',
              device: device.uuid,
            };
            pack.mtus.push(mtu);
          }
        });
      });

      const pushedCampaigns = [];
      _.each(pack.mtus, (mtu) => {
        mtu.campaigns = [];
        mtu.queuedOn = [];
        mtu.installedOn = [];
        _.each(campaignsStore.campaigns, (campaign) => {
          const { updateId } = mtu;
          if (campaign.update === updateId && pushedCampaigns.indexOf(campaign.update) === -1) {
            mtu.campaigns.push(campaign);
            pushedCampaigns.push(campaign.update);
          }
        });
        _.each(devicesStore.devices, (device) => {
          if (device.uuid === mtu.device) {
            mtu.deviceName = device.deviceName;

            switch (mtu.type) {
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
        });
      });
    });

    devicesWithQueue = _.uniqBy(devicesWithQueue, device => device.uuid);
    devicesWithInstalled = _.uniqBy(devicesWithInstalled, device => device.uuid);
    const localDevices = [];

    _.each(devicesWithQueue, (device) => {
      const dev = Object.assign({}, device);
      dev.section = 'queued';
      localDevices.push(dev);
    });
    _.each(devicesWithInstalled, (device) => {
      const dev = Object.assign({}, device);
      dev.section = 'installed';
      localDevices.push(dev);
    });

    this.devices = localDevices;
    this.devices = _.sortBy(this.devices, device => device.deviceName);

    const nodes = [
      {
        name: 'targets.json',
        type: 'root',
        color: '#8B60A5',
      },
    ];

    _.map(source, (item) => {
      const packObj = {
        name: `${item.id.name.substring(0, 15)} - ${item.id.version.substring(0, 5)}`,
        originalName: item.id.name,
        type: 'pack',
        color: '#6A9CD3',
        queuedOn: [],
        installedOn: [],
        campaign: null,
      };
      _.map(item.mtus, (mtu) => {
        if (mtu.queuedOn.length) {
          packObj.queuedOn.push(mtu.queuedOn[0]);
        }
        if (mtu.installedOn.length) {
          packObj.installedOn.push(mtu.installedOn[0]);
        }
        _.map(mtu.campaigns, (campaign) => {
          nodes.push({
            originalName: campaign.name,
            name: `${campaign.name.substring(0, 15)}(${this.getCampaignStatus(campaign)})`,
            type: 'campaign',
            status: this.getCampaignStatus(campaign),
            color: this.getCampaignStatus(campaign) === 'finished' ? '#88c062' : '#738771',
          });
          packObj.campaign = campaign;
        });
      });
      packObj.queuedOn = _.uniqBy(packObj.queuedOn, device => device.uuid);
      packObj.installedOn = _.uniqBy(packObj.installedOn, device => device.uuid);
      nodes.push(packObj);
    });
    _.map(this.devices, (device) => {
      nodes.push({
        name: device.deviceName.substring(0, 15) + (device.section === 'queued' ? '(queued on)' : '(installed on)'),
        originalName: device.deviceName,
        uuid: device.uuid,
        section: device.section,
        type: 'device',
        color: device.section === 'queued' ? '#F6A623' : '#e9e587',
      });
    });
    const packIndexes = [];
    _.each(nodes, (node, index) => {
      if (node.type === 'pack') {
        packIndexes.push(index);
      }
    });
    const links = [];
    let nextPackIndex = 0;

    if (nodes.length <= 3) {
      this.sankeyHeight = 200;
    } else {
      this.resizeSankey();
    }

    let currentPackIndex = 0;
    _.map(nodes, (node, index) => {
      switch (node.type) {
        case 'root':
          _.map(nodes, (nodeInternal, indexInternal) => {
            if (indexInternal > index && nodeInternal.type === 'pack') {
              links.push({
                source: index,
                target: indexInternal,
                value: 1,
                color: '#B2B2B2',
                opacity: parseFloat(defaultOpacity),
              });
            }
          });
          break;
        case 'pack':
          currentPackIndex = _.indexOf(packIndexes, index);
          currentPackIndex += 1;
          nextPackIndex = packIndexes[currentPackIndex];
          if (_.isUndefined(nextPackIndex)) {
            nextPackIndex = Object.keys(nodes).length;
          }

          const queuedOn = node.queuedOn; //eslint-disable-line
          const installedOn = node.installedOn; //eslint-disable-line
          const campaign = node.campaign; //eslint-disable-line

          _.map(queuedOn, (device) => {
            const foundDevice = _.find(nodes, singleNode => singleNode.name === `${device.deviceName.substring(0, 15)}(queued on)`);
            if (foundDevice) {
              links.push({
                source: index,
                target: nodes.indexOf(foundDevice),
                value: 1,
                color: '#B2B2B2',
                opacity: parseFloat(defaultOpacity),
              });
            }
          });

          _.map(installedOn, (device) => {
            const foundDevice = _.find(nodes, singleNode => singleNode.name === `${device.deviceName.substring(0, 15)}(installed on)`);
            if (foundDevice) {
              links.push({
                source: index,
                target: nodes.indexOf(foundDevice),
                value: 1,
                color: '#B2B2B2',
                opacity: parseFloat(defaultOpacity),
              });
            }
          });

          if (campaign) {
            const foundCampaign = _.find(nodes, singleNode => singleNode.name === `${campaign.name.substring(0, 15)}(${this.getCampaignStatus(campaign)})`);
            links.push({
              source: index,
              target: nodes.indexOf(foundCampaign),
              value: 1,
              color: '#B2B2B2',
              opacity: parseFloat(defaultOpacity),
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

    if (highlight) {
      const itemsToHighlight = [];
      const { activeItemName } = this.props;

      _.map(source, (item) => {
        if (activeItemName === item.filepath) {
          itemsToHighlight.push(item);
        }

        _.map(item.mtus, (mtu) => {
          _.map(mtu.campaigns, (campaign) => {
            if (activeItemName === campaign.name) {
              itemsToHighlight.push(item);
            }
          });
        });
      });
      this.itemsToHighlight = itemsToHighlight;
      setTimeout(() => {
        that.highlightActiveItems();
      }, 5);
    }
  }

  animateChart() {
    const allTextElements = document.querySelectorAll('text');
    const packs = [];
    const campaigns = [];
    const devices = [];
    _.each(this.nodes, (node) => {
      switch (node.type) {
        case 'pack':
          packs.push(node.name);
          break;
        case 'campaign':
          campaigns.push(node.name);
          break;
        case 'device':
          devices.push(node.name);
          break;
        default:
          break;
      }
    });
    _.each(allTextElements, (item) => {
      item.style.transition = 'transform 0.5s';
      if (_.includes(packs, decodeURI(item.innerHTML))) {
        item.style.transform = 'translate(-30px)';
      }
      if (_.includes(campaigns, decodeURI(item.innerHTML))) {
        item.style.transform = 'translate(-5px)';
      }
      if (_.includes(devices, decodeURI(item.innerHTML))) {
        item.style.transform = 'translate(-5px)';
      }
      if (item.innerHTML === 'targets.json') {
        item.style.transform = 'translate(10px)';
      }
    });
  }

  formatData(removeHandler = false) {
    const { stores } = this.props;
    const { devicesStore, campaignsStore } = stores;
    if (removeHandler) {
      this.sankeyModeHandler();
    }
    if (this.showOnlyActive) {
      _.each(this.packages, (pack) => {
        pack.mtus = [];
        _.each(devicesStore.multiTargetUpdatesSaved, (mtu) => {
          mtu.type = 'queue';
          const packageHash = getSHA256Hash(mtu);
          if (pack.packageHash === packageHash) {
            pack.mtus.push(mtu);
          }
        });

        _.each(pack.mtus, (mtu) => {
          mtu.campaigns = [];
          _.each(campaignsStore.campaigns, (campaign) => {
            const { updateId } = mtu;
            if (campaign.update === updateId) {
              mtu.campaigns.push(campaign);
            }
          });
        });
      });

      const activePackages = [];
      const { activeItemName } = this.props;

      _.map(this.packages, (item) => {
        if (activeItemName === item.filepath) {
          activePackages.push(item);
        }

        const pushedPackages = [];
        _.map(item.mtus, (mtu) => {
          _.map(mtu.campaigns, (campaign) => {
            if (activeItemName === campaign.name && pushedPackages.indexOf(item.filepath) === -1) {
              activePackages.push(item);
              pushedPackages.push(item.filepath);
            }
          });
        });
      });

      if (activePackages.length) {
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

  highlightActiveItems() {
    const dataToFind = [];

    _.each(this.itemsToHighlight, (pack) => {
      const packName = pack.id.name.substring(0, 15);
      const packVersion = pack.id.version.substring(0, 5);
      const packString = `${packName} - ${packVersion}`;
      dataToFind.push(packString);
      dataToFind.push('targets.json');

      _.each(pack.mtus, (mtu) => {
        const deviceStatus = mtu.queuedOn.length ? 'queued on' : 'installed on';
        dataToFind.push(`${mtu.deviceName.substring(0, 15)}(${deviceStatus})`);

        _.each(mtu.campaigns, (campaign) => {
          dataToFind.push(`${campaign.name.substring(0, 15)}(${this.getCampaignStatus(campaign)})`);
        });
      });
    });

    const allTextElements = document.querySelectorAll('text');
    _.each(allTextElements, (item) => {
      if (_.includes(dataToFind, decodeURI(item.innerHTML))) {
        item.style.fontSize = '21px';
      } else if (dataToFind.length) {
        item.style.opacity = 0.5;
      }
    });
  }

  render() {
    const { shown, hide } = this.props;

    const content = this.loaded ? (
      <span>
        {this.nodes.length && this.links.length ? (
          <div className={this.nodes.length <= 3 ? 'sankey-minimized' : ''}>
            <Sankey
              align={sankeyAlign}
              nodes={toJS(this.nodes)}
              links={toJS(this.links)}
              width={this.sankeyWidth}
              height={this.sankeyHeight}
              onLinkMouseOver={(e) => {
                this.onLinkMouseAction(this, 'in', e);
              }}
              onLinkMouseOut={(e) => {
                this.onLinkMouseAction(this, 'out', e);
              }}
              onLinkClick={() => {
                this.onLinkClick(this);
              }}
              layout={1000}
              style={{
                labels: {},
                links: {},
                rects: {
                  width: '15px',
                },
              }}
            />
          </div>
        ) : (
          <div className="wrapper-center">This item is not on the chart.</div>
        )}

        {this.showOnlyActive && (
          <div className="body-actions">
            <Button htmlType="button" className="btn-primary" onClick={this.showFullGraph}>
              Show all
            </Button>
          </div>
        ) }
      </span>
    ) : (
      <div className="wrapper-center">
        Currently no dependency conflicts.
      </div>
    );

    return (
      <OTAModal
        title={(
          <span>
            {'Dependencies'}
            <Tag color="#48dad0" className="alpha-tag alpha-tag--gutter-horizontal">
              {'ALPHA'}
            </Tag>
          </span>
        )}
        topActions={(
          <div className="top-actions flex-end">
            <div className="modal-close" onClick={hide}>
              <img src={assets.DEFAULT_CLOSE_ICON} alt="Icon" />
            </div>
          </div>
        )}
        content={content}
        visible={shown}
        className="dependencies-modal"
        hideOnClickOutside
        onRequestClose={hide}
      />
    );
  }
}

DependenciesModal.propTypes = {
  stores: PropTypes.shape({}),
};

DependenciesModal.wrappedComponent.contextTypes = {
  router: PropTypes.shape({}).isRequired,
};

export default DependenciesModal;
