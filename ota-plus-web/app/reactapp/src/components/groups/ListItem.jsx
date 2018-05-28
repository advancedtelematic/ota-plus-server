import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { translate } from 'react-i18next';
import { DropTarget } from 'react-dnd';
import CreateModal from './CreateModal';

const groupTarget = {
    drop(props, monitor) {
        const device = monitor.getItem();
        props.onDeviceDrop(device, props.group.id);
    },
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
    };
}

@observer
class ListItem extends Component {
    @observable createModalShown = false;

    constructor(props) {
        super(props);
        this.showCreateModal = this.showCreateModal.bind(this);
        this.hideCreateModal = this.hideCreateModal.bind(this);
    }

    showCreateModal(e) {
        if(e) e.stopPropagation();
        this.createModalShown = true;
    }

    hideCreateModal(e) {
        if(e) e.preventDefault();
        this.createModalShown = false;
    }

    render() {
        const { t, group, isSelected, selectGroup, groupsStore } = this.props;
        const { isOver, canDrop, connectDropTarget } = this.props;
        return (
            connectDropTarget(
                <div
                    title={group.groupName}
                    className={"group-btn droppable" + (isSelected ? " selected" : "") + (isOver ? " active" : "")}
                    id={"button-group-" + group.groupName}
                    onClick={() => {
                        selectGroup({type: 'real', name: group.groupName, id: group.id});
                    }}>
                    {groupsStore.activeFleet ?
                        <div className="icon icon-fleet">
                            {group.groupName.substring(0, 3)}
                        </div>
                    :
                        <div className="icon icon-bg"></div>
                    }
                    <div className="desc">
                        <div className="title">
                            <span>
                                {group.groupName}
                            </span>
                            <img src="../assets/img/icons/white/Rename.svg" alt="Rename" onClick={() => {
                                selectGroup({type: 'real', name: group.groupName, id: group.id});
                                this.showCreateModal();
                            }}/>
                        </div>
                        <div className="subtitle" id={"group-" + group.groupName + '-devices'}>
                            {t('common.deviceWithCount', {count: group.devices.total})}
                        </div>
                    </div>
                    {this.createModalShown ?
                        <CreateModal
                            shown={this.createModalShown}
                            hide={this.hideCreateModal}
                            groupsStore={groupsStore}
                            selectGroup={selectGroup}
                            action="rename"
                            modalTitle="Edit Group"
                            buttonText="Save"
                        />
                        :
                        null
                    }
                </div>
            )
        );
    }
}

ListItem.propTypes = {
    group: PropTypes.object.isRequired,
    isSelected: PropTypes.bool.isRequired,
    selectGroup: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    onDeviceDrop: PropTypes.func.isRequired,
}

export default translate()(DropTarget('device', groupTarget, collect)(ListItem));