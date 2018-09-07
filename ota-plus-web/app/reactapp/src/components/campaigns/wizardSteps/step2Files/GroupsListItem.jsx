import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';

@inject("stores")
@observer
class GroupsListItem extends Component {
    render() {
        const { t, group, setWizardData, isChosen } = this.props;
        const { groupsStore } = this.props.stores;
        return (
            <button className={"item" + (isChosen ? " selected" : "")} id={"button-group-" + group.groupName} onClick={setWizardData.bind(this, group.id)}>
                <div className={"btn-checkbox" + (isChosen ? " checked" : "")}>
                    <i className="fa fa-check" aria-hidden="true"/>
                </div>
                <div className="element-box group">
                    <div className="icon"/>
                    <div className="desc">
                        <div className="title">
                            {group.groupName}
                        </div>
                        <div className="subtitle">
                            {t('common.deviceWithCount', {count: groupsStore._getGroupDevices(group).length})}
                        </div>
                    </div>
                </div>
            </button>
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

