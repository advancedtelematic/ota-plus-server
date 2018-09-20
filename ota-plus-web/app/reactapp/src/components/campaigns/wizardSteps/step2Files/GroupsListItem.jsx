import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';
import { observable } from 'mobx';
import { VelocityTransitionGroup } from 'velocity-react';


@inject("stores")
@observer
class GroupsListItem extends Component {
    @observable automaticCampaign = false;

    toggleAutomaticCampaign = () => {
        this.automaticCampaign = !this.automaticCampaign;
    }
    render() {
        const { t, group, setWizardData, isChosen } = this.props;
        const { groupsStore, featuresStore } = this.props.stores;
        const { alphaTestEnabled } = featuresStore;
        return (
            <div>
                <div className={"item" + (isChosen ? " selected" : "")} id={"button-group-" + group.groupName}>
                    <button className={"btn-checkbox" + (isChosen ? " checked" : "")}
                        onClick={setWizardData.bind(this, group.id)}>
                        <i className="fa fa-check" aria-hidden="true"
                        />
                    </button>
                    <div className="element-box group"
                        onClick={setWizardData.bind(this, group.id)}>
                        {group.groupType === 'static' ? < div className="icon icon--default" /> : <div className="icon icon--smart" />}
                        <div className="desc">
                            <div className="title">
                                {group.groupName}
                            </div>
                            <div className="subtitle">
                                {t('common.deviceWithCount', { count: groupsStore._getGroupDevices(group).length })}
                            </div>
                        </div>
                    </div>
                    {alphaTestEnabled &&
                        (group.groupType === 'dynamic' &&
                            <div className="automatic-campaign" onClick={this.toggleAutomaticCampaign}>
                                <div>
                                    automatic campaign
                                <div className={"switch" + (this.automaticCampaign ? " switchOn" : "")} ></div>
                                </div>
                            </div>
                        )
                    }
                </div>

                <VelocityTransitionGroup
                    enter={{
                        animation: "slideDown",
                    }}
                    leave={{
                        animation: "slideUp",
                    }}
                >
                    {
                        this.automaticCampaign &&
                        <div className="automatic-campaign-tip">Automatically publish to new matching devices</div>
                    }
                </VelocityTransitionGroup>
            </div >
        );
    }
}

GroupsListItem.propTypes = {
    group: PropTypes.object.isRequired,
    setWizardData: PropTypes.func.isRequired,
    isChosen: PropTypes.bool.isRequired,
    stores: PropTypes.object,
};

export default translate()(GroupsListItem);

