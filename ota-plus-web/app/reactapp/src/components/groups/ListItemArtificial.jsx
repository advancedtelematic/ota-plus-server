import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import { DropTarget } from 'react-dnd';

const groupTarget = {
    drop(props, monitor) {
        const device = monitor.getItem();
        if(props.group.name === 'ungrouped') {
            props.onDeviceDrop(device, null);
        }
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
class ListItemArtificial extends Component {
    render() {
        const { t, group, isSelected, selectGroup, isDND, deviceCount } = this.props;
        const { isOver, canDrop, connectDropTarget } = this.props;
        return (
            connectDropTarget(
                <div 
                    title={group.friendlyName}
                    id={group.identifier}
                    className={"groups-panel__item groups-panel__item--artificial" + (isSelected ? " groups-panel__item--selected" : "") + (isOver ? " groups-panel__item--active" : "")}
                    onClick={() => {
                        selectGroup({type: 'artificial', groupName: group.name, id: group.id});
                    }}
                    key={group.name}>
                        <div className="groups-panel__item-desc">
                            <div className="groups-panel__item-title">
                                {group.friendlyName}
                            </div>
                            <div className="groups-panel__item-subtitle" id={"group-" + group.name + "-devices"}>
                                {t('common.deviceWithCount', {count: deviceCount})}
                            </div>
                        </div>
                </div>
            )
        );
    }
}

ListItemArtificial.propTypes = {
    group: PropTypes.object.isRequired,
    isSelected: PropTypes.bool.isRequired,
    selectGroup: PropTypes.func.isRequired,
    onDeviceDrop: PropTypes.func.isRequired,
    isDND: PropTypes.bool.isRequired,
    deviceCount: PropTypes.number.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
}

export default translate()(DropTarget(props => props.isDND ? 'device' : '', groupTarget, collect)(ListItemArtificial));