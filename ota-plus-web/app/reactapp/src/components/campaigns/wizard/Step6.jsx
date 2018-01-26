import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Loader, AsyncResponse } from '../../../partials';
import { translate } from 'react-i18next';
import _ from 'underscore';
import moment from 'moment';

@observer
class WizardStep6 extends Component {
    @observable packages = null;

    constructor(props) {
        super(props);
    }
    componentWillMount() {
        const { wizardData } = this.props;
        let packages = wizardData[1].packages;
        let versions = wizardData[2].versions;

        _.each(packages, (pack, index) => {
            pack.updates = [];
            _.each(versions, (version, packageName) => {
                if(pack.packageName === packageName) {
                    pack.updates.push(version);
                }
            });
        });

        this.packages = packages;
    }
    getLegacyCreatedAt(version) {
        let createdAt = null;
        _.each(this.props.packagesStore.packages, (pack, index) => {
            if(pack.id.version === version) {
                createdAt = pack.createdAt;
            }
        });
        return createdAt;
    }
    render() {
        const { t, wizardData, groupsStore, campaignsStore } = this.props;
        return (
            <div className="step-inner">
                <AsyncResponse 
                    handledStatus="error"
                    action={campaignsStore.campaignsLegacyCreateAsync}
                    errorMsg={
                        "Campaign with given name already exists."
                    }
                />
                <AsyncResponse 
                    handledStatus="error"
                    action={campaignsStore.campaignsCreateAsync}
                    errorMsg={
                        "Campaign with given name already exists."
                    }
                />
                <div className="box-bordered">
                    <div className="title">
                        Software & Version
                    </div>
                    <div className="desc">
                        {_.map(this.packages, (pack, index) => {
                            return (
                                <span key={index}>
                                    <div className="package-container">
                                        {_.map(pack.updates, (update, i) => {
                                            return (
                                                <span key={index}>
                                                    <div className="update-container">
                                                        {pack.inDirector ?
                                                            <span>
                                                                <span className="director-updates">
                                                                    <div className="update-from">
                                                                        <div className="text">
                                                                            From:
                                                                        </div>
                                                                        <div className="value">
                                                                            {!_.isEmpty(update.changedPackage) ?
                                                                                update.changedPackage.packageName
                                                                            :
                                                                                update.toPackageName
                                                                            }
                                                                            <span className="in-director">
                                                                                <img src="/assets/img/icons/black/lock.svg" alt="Director" />
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="update-to">
                                                                        <div className="text">
                                                                            To:
                                                                        </div>
                                                                        <div className="value">
                                                                            {update.toPackageName}
                                                                            <span className="in-director">
                                                                                <img src="/assets/img/icons/black/lock.svg" alt="Director" />
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </span>
                                                                <span className="director-versions">
                                                                    <div className="update-from">
                                                                        <div className="text">
                                                                            Version:
                                                                        </div>
                                                                        <div className="value">
                                                                            {update.from}
                                                                        </div>
                                                                    </div>
                                                                    <div className="update-to">
                                                                        <div className="text">
                                                                            Version:
                                                                        </div>
                                                                        <div className="value">
                                                                            {update.to}
                                                                        </div>
                                                                    </div>
                                                                </span>
                                                            </span>
                                                        :
                                                            <span className="legacy-updates">
                                                                <div className="update-to">
                                                                    <div className="text">
                                                                        To:
                                                                    </div>
                                                                    <div className="value">
                                                                        <div className="hash">
                                                                            Hash: {update.to}
                                                                        </div>
                                                                        <div className="createdAt">
                                                                            Created at: {moment(this.getLegacyCreatedAt(update.to)).format("ddd MMM DD YYYY, h:mm:ss A")}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </span>
                                                        }
                                                    </div>
                                                    {pack.inDirector ?
                                                        <div className="hardware-id-container">
                                                            <div className="text">
                                                                On:
                                                            </div>
                                                            <div className="value hardware-label">
                                                                {update.hardwareId}
                                                            </div>
                                                        </div>
                                                    :
                                                        null
                                                    }
                                                </span>
                                            );
                                        })}
                                    </div>
                                </span>
                            );
                        })}
                    </div>
                </div>
                <div className="box-bordered groups">
                    <div className="title">
                        Groups & Devices
                    </div>
                    <div className="desc">
                        <div className="wrapper-groups">
                            {_.map(wizardData[3].groups, (group, index) => {
                                return (
                                    <div className="element-box group" key={index}>
                                        <div className="icon"></div>
                                        <div className="desc">
                                            <div className="title" id="wizard-summary-group-name">
                                                {group.groupName}
                                            </div>
                                            <div className="subtitle" id="wizard-summary-group-devices">
                                                {t('common.deviceWithCount', {count: groupsStore._getGroupDevices(group).length})}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            
                        </div>
                        <div className="fade-wrapper-groups bottom"></div>
                    </div>
                </div>
            </div>
        );
    }
}

WizardStep6.propTypes = {
    wizardData: PropTypes.object.isRequired,
    groupsStore: PropTypes.object.isRequired
}

export default translate()(WizardStep6);

