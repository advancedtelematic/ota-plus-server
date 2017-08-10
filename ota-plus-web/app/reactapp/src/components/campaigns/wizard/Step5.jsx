import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Loader } from '../../../partials';
import { translate } from 'react-i18next';
import _ from 'underscore';

@observer
class WizardStep5 extends Component {
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
    getCreatedAt(version) {
        let createdAt = null;
        _.each(this.props.packagesStore.packages, (pack, index) => {
            if(pack.packageHash === version) {
                createdAt = pack.createdAt;
            }
        });
        return createdAt;
    }
    render() {
        const { t, wizardData, groupsStore } = this.props;
        return (
            <div className="step-inner">
                <div className="box-bordered">
                    <div className="title">
                        Software & Version
                    </div>
                    <div className="desc">
                        {_.map(this.packages, (pack, index) => {
                            return (
                                <span key={index}>
                                    <div className="package-container">
                                        <div className="package-name">
                                            {pack.packageName}
                                        </div>
                                        {_.map(pack.updates, (update, i) => {
                                            return (
                                                <span key={index}>
                                                    <div className="update-container">
                                                        {pack.inDirector ?
                                                            <div className="update-from">
                                                                <div className="text">
                                                                    From:
                                                                </div>
                                                                <div className="createdAt">
                                                                    Created at: {this.getCreatedAt(update.from)}
                                                                </div>
                                                            </div>
                                                        :
                                                            null
                                                        }
                                                        <div className="update-to">
                                                            <div className="text">
                                                                To:
                                                            </div>
                                                            <div className="value">
                                                                <div className="hash">
                                                                    Hash: {update.to}
                                                                </div>
                                                                <div className="createdAt">
                                                                    Created at: {this.getCreatedAt(update.to)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {pack.inDirector ?
                                                        <div className="hardware-id-container">
                                                            <div className="text">
                                                                Hardware id:
                                                            </div>
                                                            <div className="value">
                                                                <div className="hash">
                                                                    {update.hardwareId}
                                                                </div>
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
                                const foundGroup = _.findWhere(groupsStore.groups, {id: group});
                                return (
                                    <div className="element-box group" key={index}>
                                        <div className="icon"></div>
                                        <div className="desc">
                                            <div className="title" id="wizard-summary-group-name">
                                                {foundGroup.groupName}
                                            </div>
                                            <div className="subtitle" id="wizard-summary-group-devices">
                                                {t('common.deviceWithCount', {count: groupsStore._getGroupDevices(foundGroup).length})}
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

WizardStep5.propTypes = {
    wizardData: PropTypes.object.isRequired,
    groupsStore: PropTypes.object.isRequired
}

export default translate()(WizardStep5);

