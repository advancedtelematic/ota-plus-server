import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import { AsyncResponse } from '../../../partials';
import { translate } from 'react-i18next';
import _ from 'underscore';

@inject('stores')
@observer
class WizardStep7 extends Component {
    componentWillMount() {
        const { updatesStore } = this.props.stores;
        const { wizardData } = this.props;
        const currentUpdate = _.first(wizardData[2].update);
        updatesStore.fetchUpdate(currentUpdate && currentUpdate.source.id);
    }

    render() {
        const { t, wizardData } = this.props;
        const { campaignsStore, groupsStore, updatesStore } = this.props.stores;
        const { campaignsCreateAsync } = campaignsStore;

        const { data: updateSummary } = updatesStore.currentMtuData;

        return (
            <div className="step-inner">
                <AsyncResponse
                    handledStatus="error"
                    action={ campaignsCreateAsync }
                    errorMsg={ (campaignsCreateAsync.status && campaignsCreateAsync.status !== 200 ? campaignsCreateAsync.data.description : null) }
                />
                <div className="box-summary">
                    <div className="title">{ "Software & Version" }</div>
                    <div className="desc">
                        {   updateSummary &&
                            _.map(updateSummary, (target, hardwareId) => {
                            const noInformation = "No information.";
                            const { target: fromPackage, checksum: fromVersion } = target.from;
                            const { target: toPackage, checksum: toVersion } = target.to;

                            return (
                                <div className="package-container" key={ hardwareId }>
                                    <label className="c-form__label">{ hardwareId }</label>
                                    <div className="update-container">
                                        <span className="director-updates">
                                            <div className="update-from">
                                                <div className="text">{ "From:" }</div>
                                                <div className="value"
                                                     id={ "from-package-name-" + fromPackage }>
                                                    { fromPackage ? fromPackage : noInformation }
                                                </div>
                                            </div>
                                            <div className="update-to">
                                                <div className="text">{ "To:" }</div>
                                                <div className="value" id={ "to-package-name-" + toPackage }>
                                                    { toPackage ? toPackage : noInformation }
                                                </div>
                                            </div>
                                        </span>
                                        <span className="director-versions">
                                            <div className="update-from">
                                                <div className="text">{ "Version:" }</div>
                                                <div className="value" id={ "from-package-version-" + fromVersion }>
                                                    { fromVersion ? fromVersion.hash : noInformation }
                                                </div>
                                            </div>
                                            <div className="update-to">
                                                <div className="text">{ "Version:" }</div>
                                                <div className="value" id={ "to-package-version-" + toVersion }>
                                                    { toVersion ? toVersion.hash : noInformation }
                                                </div>
                                            </div>
                                        </span>
                                    </div>
                                    <div className="hardware-id-container">
                                        <div className="text">{ "On:" }</div>
                                        <div className="value app-label"
                                             id={ "package-version-" + hardwareId }>
                                            { target.targetFormat }
                                        </div>
                                    </div>
                                </div>
                            );
                        }) }
                    </div>
                </div>
                <div className="box-summary groups">
                    <div className="title">{ "Groups & Devices" }</div>
                    <div className="desc">
                        <div className="wrapper-groups">
                            { _.map(wizardData[1].groups, (group, index) => {
                                return (
                                    <div className="element-box group" key={ index }>
                                        <div className="icon" />
                                        <div className="desc">
                                            <div className="title" id="wizard-summary-group-name">
                                                { group.groupName }
                                            </div>
                                            <div className="subtitle" id="wizard-summary-group-devices">
                                                { t('common.deviceWithCount', { count: groupsStore._getGroupDevices(group).length }) }
                                            </div>
                                        </div>
                                    </div>
                                );
                            }) }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

WizardStep7.propTypes = {
    wizardData: PropTypes.object.isRequired,
    stores: PropTypes.object,
};

export default translate()(WizardStep7);