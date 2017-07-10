import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { RaisedButton, Popover } from 'material-ui';
import CopyToClipboard from 'react-copy-to-clipboard';
import { VelocityTransitionGroup } from 'velocity-react';
import _ from 'underscore';
import { Loader } from '../../../partials';

@observer
class PublicKeyPopover extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { hardwareStore, handleCopy, handleRequestClose, handleTouchTap, popoverShown, anchorEl, copied } = this.props;
        return (
            <Popover
                className="hardware-pk-popover"
                open={popoverShown}
                anchorEl={anchorEl}
                anchorOrigin={{horizontal: 'right', vertical: 'center'}}
                targetOrigin={{horizontal: 'left', vertical: 'center'}}
                onRequestClose={handleRequestClose}
                useLayerForClickAway={false}
            >
                {!hardwareStore.hardwarePublicKeyFetchAsync.isFetching && hardwareStore.publicKey.keyval ?
                    <span>
                        <pre>
                            {hardwareStore.publicKey.keyval.public}
                        </pre>
                        <CopyToClipboard
                            text={hardwareStore.publicKey.keyval.public}
                            onCopy={handleCopy}>
                            <RaisedButton
                                primary={true}
                                label="Copy to clipboard"
                                type="button"
                                className="btn-small"
                            />
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
    hardwareStore: PropTypes.object.isRequired,
    handleRequestClose: PropTypes.func.isRequired,
    handleTouchTap: PropTypes.func.isRequired,
    popoverShown: PropTypes.bool.isRequired,
    anchorEl: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.object,
    ]),
    copied: PropTypes.bool.isRequired,
};

export default PublicKeyPopover;
