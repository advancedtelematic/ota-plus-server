import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';
import EcusListItem from './EcusListItem';
import { PopoverWrapper } from '../../../partials';

@observer
class EcusList extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { hardwareStore, ecus, selectedEcuId, selectEcu, deviceId } = this.props;
        return (
            <ul>
                {_.map(ecus, (ecu, index) => {
                    return (
                        <li key={index}>
                            <PopoverWrapper
                                onOpen={() => {
                                    hardwareStore.fetchPublicKey(deviceId, ecu.id);
                                }}
                                onClose={() => {
                                    hardwareStore._resetPublicKey();
                                }}
                            >
                                <EcusListItem
                                    hardwareStore={hardwareStore}
                                    ecu={ecu}
                                    selectedEcuId={selectedEcuId}
                                    selectEcu={selectEcu}
                                    deviceId={deviceId}
                                />
                            </PopoverWrapper>
                        </li>
                    );
                })}
            </ul>
        );
    }
}

EcusList.propTypes = {
    hardwareStore: PropTypes.object.isRequired,
    ecus: PropTypes.array.isRequired,
    selectedEcuId: PropTypes.string,
    selectEcu: PropTypes.func.isRequired,
    deviceId: PropTypes.string.isRequired,
};

export default EcusList;