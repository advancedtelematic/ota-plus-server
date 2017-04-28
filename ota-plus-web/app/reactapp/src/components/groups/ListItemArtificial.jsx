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
    constructor(props) {
        super(props);
    }
    render() {
        const { t, group, isSelected, selectGroup, isDND, deviceCount } = this.props;
        const { isOver, canDrop, connectDropTarget } = this.props;
        return (
            connectDropTarget(
                <button 
                    type="button"
                    title={group.friendlyName}
                    id={group.identifier}
                    className={"artificial" + (isDND ? " droppable" : "") + (isSelected ? " selected" : "") + (isOver ? " active" : "")}
                    onClick={() => {
                        selectGroup({type: 'artificial', name: group.name});
                    }}
                    key={group.name}>
                    <div className="desc">
                        <div className="title">
                            {group.friendlyName}
                        </div>
                        <div className="subtitle">
                            {t('common.deviceWithCount', {count: deviceCount})}
                        </div>
                    </div>
                    <div className="pointer">
                        <i className="fa fa-angle-right fa-3x"></i>
                    </div>
                </button>
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