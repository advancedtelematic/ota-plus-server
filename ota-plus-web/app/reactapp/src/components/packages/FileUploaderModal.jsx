import React, { Component, PropTypes } from 'react';
import { observer, observable } from 'mobx-react';
import _ from 'underscore';
import { Modal } from '../../partials';
import { FlatButton, RaisedButton } from 'material-ui';
import CopyToClipboard from 'react-copy-to-clipboard';
import { VelocityTransitionGroup } from 'velocity-react';
import { Loader } from '../../partials';

@observer
class FileUploaderModal extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        this.props.featuresStore.fetchClientId();
    }
    render() {
        const { shown, hide, handleCopy, copied, featuresStore } = this.props;
        const content = (
            <span>
                {featuresStore.featuresClientIdFetchAsync.isFetching || !featuresStore.clientId ?
                    <div className="wrapper-center">
                        <Loader />
                    </div>
                :
                    <span>
                        <div className="content">
                            <div className="description">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
                                sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </div>
                            <div className="github">
                                Github: <a href="https://github.com/advancedtelematic/ota-plus-tools/tree/develop" target="_blank">Uploader tool</a>
                            </div>
                            <div className="client-id">
                                Client id:
                                <pre>
                                    {featuresStore.clientId}
                                </pre>
                            </div>
                            <CopyToClipboard
                                text={featuresStore.clientId}
                                onCopy={handleCopy}>
                                <RaisedButton
                                    primary={true}
                                    label="Copy secret to clipboard"
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
                                            (Client id copied)
                                        </span>
                                    :
                                        null
                                    }
                                </VelocityTransitionGroup>
                        </div>
                        <div className="body-actions">
                            <FlatButton
                                label="Got it"
                                type="button"
                                className="btn-main"
                                onClick={hide}
                            />
                        </div>
                    </span>
                }
            </span>
        );

        return (
            <Modal 
                title="File Uploader"
                content={content}
                shown={shown}
                className="file-uploader-modal"
                hideOnClickOutside={true}
                onRequestClose={hide}
            />
        );
    }
}

FileUploaderModal.propTypes = {
}

export default FileUploaderModal;