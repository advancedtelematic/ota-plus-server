import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import { FlatButton, Popover } from 'material-ui';
import CopyToClipboard from 'react-copy-to-clipboard';
import { VelocityTransitionGroup } from 'velocity-react';
import _ from 'underscore';
import { Loader } from '../../../partials';

@inject("stores")
@observer
class PublicKeyPopover extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        const { device, serial } = this.props;
        const { hardwareStore } = this.props.stores;
        hardwareStore.fetchPublicKey(device.uuid, serial);
    }
    componentWillUnmount() {
        const { hardwareStore } = this.props.stores;
        hardwareStore._resetPublicKey();
    }
    render() {
        const { 
            handleCopy,
            handleRequestClose, 
            popoverShown, 
            anchorEl, 
            copied, 
            serial
        } = this.props;
        const { hardwareStore } = this.props.stores;
        return (
            <Popover
                className="hardware-pk-popover"
                open={popoverShown}
                anchorEl={anchorEl}
                onRequestClose={handleRequestClose}
                useLayerForClickAway={false}
                animated={false}
                style={{'marginTop': '-32px', 'marginLeft': '35px'}}
            >
                {!hardwareStore.hardwarePublicKeyFetchAsync.isFetching && hardwareStore.publicKey.keyval ?
                    <span>
                        <div className="triangle"></div>
                        <div className="heading">
                            <div className="internal">
                                Public key
                            </div>
                        </div>
                        <div className="body">
                            <pre>
                                {hardwareStore.publicKey.keyval.public}
                            </pre>                            
                        </div>
                        <div className="actions">
                            <CopyToClipboard
                                text={hardwareStore.publicKey.keyval.public}
                                onCopy={handleCopy.bind(this, serial)}>
                                <button className="btn-primary">
                                    Copy to clipboard
                                </button>
                            </CopyToClipboard>
                            <VelocityTransitionGroup
                                enter={{
                                    animation: "fadeIn",
                                }}
                                leave={{
                                    animation: "fadeOut"
                                }}>
                                {copied ?
                                    <span className="clipboard-copied">
                                        (Public key copied)
                                    </span>
                                :
                                    null
                                }
                            </VelocityTransitionGroup>
                        </div>
                    </span>
                :
                    null
                }
                {hardwareStore.hardwarePublicKeyFetchAsync.isFetching ?
                    <Loader />
                :
                    null
                }
            </Popover>
        );
    }
}

PublicKeyPopover.propTypes = {
    stores: PropTypes.object,
    handleRequestClose: PropTypes.func.isRequired,
    popoverShown: PropTypes.bool.isRequired,
    anchorEl: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.object,
    ]),
    copied: PropTypes.bool.isRequired,
};

export default PublicKeyPopover;
