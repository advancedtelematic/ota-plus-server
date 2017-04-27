import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { Loader } from '../../../partials';
import { translate } from 'react-i18next';
import _ from 'underscore';

@observer
class WizardStep4 extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        this.props.groupsStore.fetchGroups();
    }
    render() {
        const { t, wizardData, groupsStore } = this.props;
        return (
            <div className="step-inner">
                {groupsStore.groupsFetchAsync.isFetching ? 
                    <div className="wrapper-center">
                        <Loader />
                    </div>
                :
                    <span>
                        <div className="box-bordered">
                            <div className="title">
                                Package
                            </div>
                            <div className="desc">
                                <div className="wrapper-package-name" id="wizard-summary-package-name">
                                    {wizardData[0].package.name}
                                </div>
                                <div className="wrapper-package-version" id="wizard-summary-package-version">
                                    {wizardData[0].package.version}
                                </div>
                            </div>
                        </div>
                        <div className="box-bordered groups">
                            <div className="title">
                                Groups
                            </div>
                            <div className="desc">
                                <div className="fade-wrapper-groups top"></div>
                                <div className="wrapper-groups">
                                    {_.map(wizardData[1].groups, (group, index) => {
                                        const foundGroup = _.findWhere(groupsStore.groups, {id: group});
                                        return (
                                            <div className="element-box group" key={index}>
                                                <div className="icon"></div>
                                                <div className="desc">
                                                    <div className="title" id="wizard-summary-group-name">
                                                        {foundGroup.groupName}
                                                    </div>
                                                    <div className="subtitle" id="wizard-summary-group-devices">
                                                        {t('common.deviceWithCount', {count: foundGroup.devices.length})}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    
                                </div>
                                <div className="fade-wrapper-groups bottom"></div>
                            </div>
                        </div>
                        <div className="wrapper-box-dates">
                            <div className="box-bordered">
                                <div className="title">
                                    Start date
                                </div>
                                <div className="desc">
                                    none
                                </div>
                            </div>
                            <div className="box-bordered">
                                <div className="title">
                                    End date
                                </div>
                                <div className="desc">
                                    none
                                </div>
                            </div>
                        </div>
                        <div className="box-bordered delta">
                            <div className="title">
                                Delta switch:
                            </div>
                            <div className="desc">
                                {wizardData[2].isActivated ?
                                    <span>Activated</span>
                                :
                                    <span>Not activated</span>
                                }
                            </div>
                        </div>
                    </span>
                }
            </div>
        );
    }
}

WizardStep4.propTypes = {
    wizardData: PropTypes.object.isRequired,
    groupsStore: PropTypes.object.isRequired
}

export default translate()(WizardStep4);

