import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import { DropTarget } from 'react-dnd';

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
    constructor(props) {
        super(props);
    }
    render() {
        const { t, group, isSelected, selectGroup, showRenameGroupModal, groupsStore } = this.props;
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
                    <div className="actions">
                        <ul>
                            <li onClick={null} title="Rename group" onClick={() => {
                                showRenameGroupModal(group.id);
                            }}>
                                <img src="/assets/img/icons/edit_white.png" alt="" />
                                <div>Rename</div>
                            </li>
                        </ul>
                    </div>
                    <div className="icon"></div>
                    <div className="desc">
                        <div className="title">
                            {group.groupName}
                        </div>
                        <div className="subtitle">
                            {t('common.deviceWithCount', {count: group.devices.total})}
                        </div>
                    </div>
                    <div className="pointer">
                        <i className="fa fa-angle-right fa-3x"></i>
                    </div>
                </div>
            )
        );
    }
}

ListItem.propTypes = {
    group: PropTypes.object.isRequired,
    isSelected: PropTypes.bool.isRequired,
    selectGroup: PropTypes.func.isRequired,
    showRenameGroupModal: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    onDeviceDrop: PropTypes.func.isRequired,
}

export default translate()(DropTarget('device', groupTarget, collect)(ListItem));