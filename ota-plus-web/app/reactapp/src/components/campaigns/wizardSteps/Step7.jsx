import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Loader, AsyncResponse } from '../../../partials';
import { translate } from 'react-i18next';
import _ from 'underscore';
import moment from 'moment';

@inject("stores")
@observer
class WizardStep7 extends Component {
    render() {
        const { t, wizardData } = this.props;
        const { groupsStore, campaignsStore } = this.props.stores;
        const updates = wizardData[2].versions;
        return (
            <div className="step-inner">
                <AsyncResponse 
                    handledStatus="error"
                    action={campaignsStore.campaignsCreateAsync}
                    errorMsg={(campaignsStore.campaignsCreateAsync.data ? campaignsStore.campaignsCreateAsync.data.description : null)}
                />
                <div className="box-summary">
                    <div className="title">
                        Software & Version
                    </div>
                    <div className="desc">
                        {_.map(updates, (update, packName) => {
                            return (
                                <div className="package-container" key={packName}>
                                    <div className="update-container">
                                        <span className="director-updates">
                                            <div className="update-from">
                                                <div className="text">
                                                    From:
                                                </div>
                                                <div className="value" id={"from-package-name-" + (!_.isEmpty(update.changedPackage) ? update.changedPackage.packageName : update.toPackageName)}>
                                                    {!_.isEmpty(update.changedPackage) ?
                                                        update.changedPackage.packageName
                                                    :
                                                        update.toPackageName
                                                    }
                                                </div>
                                            </div>
                                            <div className="update-to">
                                                <div className="text">
                                                    To:
                                                </div>
                                                <div className="value" id={"to-package-name-" + update.toPackageName}>
                                                    {update.toPackageName}
                                                </div>
                                            </div>
                                        </span>
                                        <span className="director-versions">
                                            <div className="update-from">
                                                <div className="text">
                                                    Version:
                                                </div>
                                                <div className="value" id={"from-package-version-" + update.from}>
                                                    {update.from}
                                                </div>
                                            </div>
                                            <div className="update-to">
                                                <div className="text">
                                                    Version:
                                                </div>
                                                <div className="value" id={"to-package-version-" + update.to}>
                                                    {update.to}
                                                </div>
                                            </div>
                                        </span>
                                    </div>
                                    <div className="hardware-id-container">
                                        <div className="text">
                                            On:
                                        </div>
                                        <div className="value app-label" id={"package-version-" + update.to + '-hardware-id'}>
                                            {update.hardwareId}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="box-summary groups">
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
                    </div>
                </div>
            </div>
        );
    }
}

WizardStep7.propTypes = {
    wizardData: PropTypes.object.isRequired,
    stores: PropTypes.object
}

export default translate()(WizardStep7);