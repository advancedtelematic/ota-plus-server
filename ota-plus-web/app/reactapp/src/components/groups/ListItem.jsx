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
                    <div className="actions">
                    </div>
                    <div className="icon"></div>
                    <div className="desc">
                        <div className="title font-medium">
                            {group.groupName}
                        </div>
                        <div className="subtitle font-small">
                            {t('common.deviceWithCount', {count: group.devices.total})}
                        </div>
                    </div>
                    <div className="pointer">
                        <i className="fa fa-angle-right fa-2x"/>
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
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    onDeviceDrop: PropTypes.func.isRequired,
}

export default translate()(DropTarget('device', groupTarget, collect)(ListItem));