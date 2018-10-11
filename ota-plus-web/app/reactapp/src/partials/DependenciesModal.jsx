import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
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

@inject("stores")
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
        const { devicesStore, packagesStore, campaignsStore } = props.stores;
        this.devicesFetchHandler = new AsyncStatusCallbackHandler(devicesStore, 'devicesFetchAsync', this.devicesFetched.bind(this));
        this.campaignsFetchHandler = new AsyncStatusCallbackHandler(campaignsStore, 'campaignsSafeFetchAsync', this.campaignsFetched.bind(this));
        this.packagesFetchHandler = new AsyncStatusCallbackHandler(packagesStore, 'packagesFetchAsync', this.packagesFetched.bind(this));
        this.onLinkMouseAction = this.onLinkMouseAction.bind(this);
        this.onLinkClick = this.onLinkClick.bind(this);
        this.getCampaignStatus = this.getCampaignStatus.bind(this);
        this.resizeSankey = this.resizeSankey.bind(this);

        this.sankeyModeHandler = observe(this, (change) => {
            if (change['object'].showOnlyActive === false) {
                this.formatData(true);
            }
        });
    }

    componentDidMount() {
        window.addEventListener("resize", this.resizeSankey);
    }

    componentWillMount() {
        const { devicesStore, campaignsStore, packagesStore } = this.props.stores;
        devicesStore.fetchDevices().then(() => {
            if (window.location.href.indexOf('/packages') > -1) {
                // campaignsStore.fetchCampaigns('campaignsSafeFetchAsync');
            } else {
                packagesStore.fetchPackages();
            }
        });
    }

    resizeSankey() {
        if (window.innerHeight >= 1000) {
            this.sankeyHeight = 700;
        } else if (window.innerHeight < 1000 && window.innerHeight > 870) {
            this.sankeyHeight = 600;
        } else {
            this.sankeyHeight = 500;
        }
    }

    componentWillUnmount() {
        const { devicesStore } = this.props.stores;
        this.devicesFetchHandler();
        this.campaignsFetchHandler();
        this.packagesFetchHandler();
        devicesStore._reset();
        window.removeEventListener("resize", this.resizeSankey);
    }

    showFullGraph() {
        this.showOnlyActive = false;
    }

    onLinkMouseAction(actionType, linkdata, event) {
        let opacity = defaultOpacity;
        if (actionType === 'in') {
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
            if (link.target.sourceLinks) {
                this.highlightTargets(link.target.sourceLinks, opacity);
            }
        });
    }

    highlightSources(data, opacity) {
        let paths = document.querySelectorAll('path');
        _.each(data, (link, index) => {
            let ix = link.index;
            paths[ix].setAttribute("opacity", opacity);
            if (link.source.targetLinks) {
                this.highlightSources(link.source.targetLinks, opacity);
            }
        });
    }

    onLinkClick(linkdata, event) {
        const { hide } = this.props;
        const { campaignsStore } = this.props.stores;
        let clickedItemType = linkdata.target.type;
        switch (clickedItemType) {
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
                hide();
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
        const { devicesStore } = this.props.stores;
        _.each(devicesStore.devices, (device, index) => {
            devicesStore.fetchMultiTargetUpdates(device.uuid);
            devicesStore.fetchPrimaryAndSecondaryFilepaths(device.uuid).then((filepaths) => {
                device.installedFilepaths = filepaths;
            });
        });
    }

    packagesFetched() {
        const { campaignsStore } = this.props.stores;
        // campaignsStore.fetchCampaigns('campaignsSafeFetchAsync');
    }

    campaignsFetched() {
        const { devicesStore, packagesStore } = this.props.stores;
        _.each(devicesStore.multiTargetUpdatesSaved, (mtuUpdate, i) => {
            let packageHash = mtuUpdate.targets[Object.keys(mtuUpdate.targets)[0]].image.fileinfo.hashes.sha256;
            let pack = _.find(packagesStore.packages, (pack) => {
                return pack.packageHash === packageHash;
            });
            this.packages.push(pack);
        });
        _.each(devicesStore.devices, (device, i) => {
            let filepaths = device.installedFilepaths;
            _.each(filepaths, (filepath, index) => {
                let pack = _.find(packagesStore.packages, (pack) => {
                    return pack.filepath === filepath;
                });
                if (!_.isUndefined(pack)) {
                    this.packages.push(pack);
                }
            });
        });
        this.packages = _.uniq(this.packages, pack => pack.filepath);
        this.packages = _.sortBy(this.packages, pack => pack.id.name);
        this.formatData();
    }

    prepareNodesAndLinks(source, highlight = false) {
        const { campaignsStore, devicesStore, packagesStore } = this.props.stores;
        let devicesWithQueue = [];
        let devicesWithInstalled = [];

        _.each(source, (pack, index) => {
            pack.mtus = [];
            _.each(devicesStore.multiTargetUpdatesSaved, (mtu, i) => {
                mtu.type = 'queue';
                let packageHash = mtu.targets[Object.keys(mtu.targets)[0]].image.fileinfo.hashes.sha256;
                if (pack.packageHash === packageHash) {
                    pack.mtus.push(mtu);
                }
            });

            _.each(devicesStore.devices, (device, ind) => {
                let filepaths = device.installedFilepaths;
                _.each(filepaths, (filepath, index) => {
                    if (pack.filepath === filepath) {
                        let mtu = {
                            type: 'history',
                            device: device.uuid
                        };
                        pack.mtus.push(mtu);
                    }
                });
            });

            let pushedCampaigns = [];
            _.each(pack.mtus, (mtu, i) => {
                mtu.campaigns = [];
                mtu.queuedOn = [];
                mtu.installedOn = [];
                _.each(campaignsStore.campaigns, (campaign, ind) => {
                    if (campaign.update === mtu.updateId && pushedCampaigns.indexOf(campaign.update) === -1) {
                        mtu.campaigns.push(campaign);
                        pushedCampaigns.push(campaign.update);
                    }
                });
                _.each(devicesStore.devices, (device, ind) => {
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
                if (mtu.queuedOn.length) {
                    packObj.queuedOn.push(mtu.queuedOn[0]);
                }
                if (mtu.installedOn.length) {
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
            if (node.type === 'pack') {
                packIndexes.push(index);
            }
        });
        let links = [];
        let nextPackIndex = 0;

        if (nodes.length <= 3) {
            this.sankeyHeight = 200;
        } else {
            this.resizeSankey();
        }
        _.map(nodes, (node, index) => {
            switch (node.type) {
                case 'root':
                    _.map(nodes, (nodeInternal, indexInternal) => {
                        if (indexInternal > index && nodeInternal.type === 'pack') {
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
                    if (_.isUndefined(nextPackIndex)) {
                        nextPackIndex = Object.keys(nodes).length;
                    }

                    let queuedOn = node.queuedOn;
                    let installedOn = node.installedOn;
                    let campaign = node.campaign;

                    _.map(queuedOn, (device, i) => {
                        let foundDevice = _.find(nodes, node => node.name === device.deviceName.substring(0, 15) + "(queued on)");
                        if (foundDevice) {
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
                        if (foundDevice) {
                            links.push({
                                source: index,
                                target: nodes.indexOf(foundDevice),
                                value: 1,
                                color: "#B2B2B2",
                                opacity: parseFloat(defaultOpacity)
                            });
                        }
                    });

                    if (campaign) {
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

        if (highlight) {
            let itemsToHighlight = [];
            let activeItemName = this.props.activeItemName;

            _.map(source, (item, index) => {

                if (activeItemName === item.filepath) {
                    itemsToHighlight.push(item);
                }

                _.map(item.mtus, (mtu, i) => {
                    _.map(mtu.campaigns, (campaign, i) => {
                        if (activeItemName === campaign.name) {
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
            switch (node.type) {
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
            if (_.contains(packs, this.unescapeHTML(item.innerHTML))) {
                item.style.transform = "translate(-30px)";
            }
            if (_.contains(campaigns, this.unescapeHTML(item.innerHTML))) {
                item.style.transform = "translate(-5px)";
            }
            if (_.contains(devices, this.unescapeHTML(item.innerHTML))) {
                item.style.transform = "translate(-5px)";
            }
            if (item.innerHTML === 'targets.json') {
                item.style.transform = "translate(10px)";
            }
        });
    }

    formatData(removeHandler = false) {
        const { devicesStore, packagesStore, campaignsStore } = this.props.stores;
        if (removeHandler) {
            this.sankeyModeHandler();
        }
        if (this.showOnlyActive) {
            _.each(this.packages, (pack, index) => {
                pack.mtus = [];
                _.each(devicesStore.multiTargetUpdatesSaved, (mtu, i) => {
                    mtu.type = 'queue';
                    let packageHash = mtu.targets[Object.keys(mtu.targets)[0]].image.fileinfo.hashes.sha256;
                    if (pack.packageHash === packageHash) {
                        pack.mtus.push(mtu);
                    }
                });

                _.each(pack.mtus, (mtu, i) => {
                    mtu.campaigns = [];
                    _.each(campaignsStore.campaigns, (campaign, ind) => {
                        if (campaign.update === mtu.updateId) {
                            mtu.campaigns.push(campaign);
                        }
                    });
                });
            });

            let activePackages = [];
            let activeItemName = this.props.activeItemName;

            _.map(this.packages, (item, index) => {
                if (activeItemName === item.filepath) {
                    activePackages.push(item);
                }

                let pushedPackages = [];
                _.map(item.mtus, (mtu, i) => {
                    _.map(mtu.campaigns, (campaign, i) => {
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

    hightlightActiveItems() {
        let dataToFind = [];

        _.each(this.itemsToHighlight, (pack, ind) => {
            let packName = pack.id.name.substring(0, 15);
            let packVersion = pack.id.version.substring(0, 5);
            let packString = packName + " - " + packVersion;
            dataToFind.push(packString);
            dataToFind.push('targets.json');

            _.each(pack.mtus, (mtu, index) => {
                let deviceStatus = mtu.queuedOn.length ? 'queued on' : 'installed on';
                dataToFind.push(mtu.deviceName.substring(0, 15) + "(" + deviceStatus + ")");

                _.each(mtu.campaigns, (campaign, i) => {
                    dataToFind.push(campaign.name.substring(0, 15) + "(" + this.getCampaignStatus(campaign) + ")");
                })
            });
        });

        let allTextElements = document.querySelectorAll('text');
        _.each(allTextElements, (item, index) => {
            if (_.contains(dataToFind, this.unescapeHTML(item.innerHTML))) {
                item.style.fontSize = '21px';
            } else if (dataToFind.length) {
                item.style.opacity = .5;
            }
        });
    }

    unescapeHTML(html) {
        return html.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    }

    render() {
        const { shown, hide } = this.props;
        const content = (
            this.loaded ?
                <span>
              { this.nodes.length && this.links.length ?
                  <div className={ (this.nodes.length <= 3 ? "sankey-minimized" : "") }>
                      <Sankey
                          align={ sankeyAlign }
                          nodes={ toJS(this.nodes) }
                          links={ toJS(this.links) }
                          width={ this.sankeyWidth }
                          height={ this.sankeyHeight }
                          onLinkMouseOver={ this.onLinkMouseAction.bind(this, 'in') }
                          onLinkMouseOut={ this.onLinkMouseAction.bind(this, 'out') }
                          onLinkClick={ this.onLinkClick.bind(this) }
                          layout={ 1000 }
                          style={ {
                              labels: {},
                              links: {},
                              rects: {
                                  width: '15px',
                              }
                          } }
                      />
                  </div>
                  :
                  <div className="wrapper-center">
                      This item is not on the chart.
                  </div>
              }

                    { this.showOnlyActive ?
                        <div className="body-actions">
                            <button className="btn-primary" onClick={ this.showFullGraph.bind(this) }>
                                Show all
                            </button>
                        </div>
                        :
                        null
                    }
            </span>
                :
                <div className="wrapper-center">
                    <Loader/>
                </div>
        );
        return (
            <Modal
                title={ "Dependencies" }
                topActions={
                    <div className="top-actions flex-end">
                        <div className="modal-close" onClick={ hide }>
                            <img src="/assets/img/icons/close.svg" alt="Icon"/>
                        </div>
                    </div>
                }
                content={ content }
                shown={ shown }
                className="dependencies-modal"
                hideOnClickOutside={ true }
                onRequestClose={ hide }
            />
        );
    }
}

DependenciesModal.propTypes = {
    stores: PropTypes.object
}

DependenciesModal.wrappedComponent.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default DependenciesModal;