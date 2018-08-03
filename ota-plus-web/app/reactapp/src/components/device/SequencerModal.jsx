import React, { Component, PropTypes } from 'react';
import { observer, observable, inject } from 'mobx-react';
import _ from 'underscore';
import { Modal, Sequencer } from '../../partials';

@inject("stores")
@observer
class SequencerModal extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        const { campaignsStore } = this.props.stores;
        campaignsStore._showFullScreen();
    }
    componentWillUnmount() {
        const { campaignsStore } = this.props.stores;
        campaignsStore._resetFullScreen();
    }
    render() {
        const { shown, hide } = this.props;
        const { campaignsStore, devicesStore } = this.props.stores;
        const content = (
            <div className="sequencer-wrapper">
                <div className="actions">
                    <a href="#" id="close-sequencer" title="Close sequencer" onClick={hide.bind(this)}>
                        <img src="/assets/img/icons/white/cross.svg" alt="Icon" />
                    </a>
                </div>
                {devicesStore.multiTargetUpdates.length ?
                    <Sequencer
                        wizardIdentifier={devicesStore.multiTargetUpdates[0].updateId}
                        data={null}
                        entity={"device"}
                        readOnly={true}
                    />
                :
                    <div className="wrapper-center">
                        Seems like there is no update.
                    </div>
                }
            </div>
        );

        return (
            <Modal 
                title="Programming sequencer"
                content={content}
                shown={shown}
                hideOnClickOutside={true}
                onRequestClose={hide}
                className={"sequencer-modal " + (campaignsStore.fullScreenMode ? "full-screen" : "") + (campaignsStore.transitionsEnabled ? "" : " disable-transitions")}
            />
        );
    }
}

SequencerModal.propTypes = {
}

export default SequencerModal;