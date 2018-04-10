import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Modal, AsyncResponse, Loader, FormTextarea, Form } from '../../partials';
import { AsyncStatusCallback, AsyncStatusCallbackHandler } from '../../utils';
import { FormsyText } from 'formsy-material-ui/lib';
import { FlatButton } from 'material-ui';
import serialize from 'form-serialize';
import _ from 'underscore';

@observer
class BlacklistModal extends Component {
    @observable submitButtonDisabled = true;

    constructor(props) {
        super(props);
        this.removeFromBlacklist = this.removeFromBlacklist.bind(this);
    }
    componentDidMount() {
        this.blacklistHandler = AsyncStatusCallbackHandler(this.props.packagesStore, 'packagesBlacklistAsync', this.props.hide);
        this.updateBlacklistedPackageHandler = AsyncStatusCallbackHandler(this.props.packagesStore, 'packagesUpdateBlacklistedAsync', this.props.hide);
        this.removePackageFromBlacklistHandler = AsyncStatusCallbackHandler(this.props.packagesStore, 'packagesRemoveFromBlacklistAsync', this.props.hide);
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.blacklistAction.name && nextProps.blacklistAction.version &&
                (nextProps.blacklistAction.name !== this.props.blacklistAction.name ||
                nextProps.blacklistAction.version !== this.props.blacklistAction.version
                )
            ) {
            const data = {
                name: nextProps.blacklistAction.name,
                version: nextProps.blacklistAction.version
            };
            if(nextProps.blacklistAction.mode === 'edit') {
                this.props.packagesStore.fetchBlacklist();
                this.props.packagesStore.fetchBlacklistedPackage(data);
            } else {
                this.props.packagesStore.fetchAffectedDevicesCount(data);
            }
        }
    }
    componentWillUnmount() {
        this.blacklistHandler();
        this.updateBlacklistedPackageHandler();
        this.removePackageFromBlacklistHandler();
    }
    enableButton() {
        this.submitButtonDisabled = false;
    }
    disableButton() {
        this.submitButtonDisabled = true;
    }
    submitForm(e) {
        if(e) e.preventDefault();
        const formData = serialize(document.querySelector('#blacklist-form'), { hash: true });
        const data = {
            packageId: {
                name: this.props.blacklistAction.name,
                version: this.props.blacklistAction.version
            },
            comment: formData.comment
        };
        if(this.props.blacklistAction.mode === "edit") {
            this.props.packagesStore.updateBlacklistedPackage(data);
        } else {
            this.props.packagesStore.blacklistPackage(data);
        }
    }
    removeFromBlacklist(e) {
        if(e) e.preventDefault();
        const data = {
            name: this.props.blacklistAction.name,
            version: this.props.blacklistAction.version
        }
        this.props.packagesStore.removePackageFromBlacklist(data);
    }
    render() {
        const { shown, hide, blacklistAction, packagesStore } = this.props;
        const title = (
            <div className="heading">
                <div className="internal">
                    {blacklistAction.mode === "edit" ? 
                        "Edit blacklisted package" 
                    : 
                        "Blacklist"
                    }
                    <div className="top-actions flex-end">
                        <div className="modal-close" onClick={hide}>
                            <img src="/assets/img/icons/close.svg" alt="Icon" />
                        </div>
                    </div>
                </div>
            </div>
        );
        const content = (
            <Form                
                onSubmit={this.submitForm.bind(this)}
                id="blacklist-form">
                {blacklistAction.mode === "edit" ? 
                    <span>
                        
                        <AsyncResponse 
                            handledStatus="error"
                            action={packagesStore.packagesUpdateBlacklistedAsync}
                            errorMsg={packagesStore.packagesUpdateBlacklistedAsync.data ? packagesStore.packagesUpdateBlacklistedAsync.data.description : null}
                        />
                        <AsyncResponse 
                            handledStatus="error"
                            action={packagesStore.packagesRemoveFromBlacklistAsync}
                            errorMsg={packagesStore.packagesRemoveFromBlacklistAsync.data ? packagesStore.packagesRemoveFromBlacklistAsync.data.description : null}
                        />
                    </span>
                :
                    <AsyncResponse 
                        handledStatus="error"
                        action={packagesStore.packagesBlacklistAsync}
                        errorMsg={packagesStore.packagesBlacklistAsync.data ? packagesStore.packagesBlacklistAsync.data.description : null}
                    />
                }
                {blacklistAction.mode === 'add' ?
                    <span>
                        You're about to <strong>blacklist</strong> the following package version:
                        <div className="name" title={blacklistAction.name}>
                            {blacklistAction.name}
                        </div>
                        <div className="version" title={blacklistAction.version}>
                            {blacklistAction.version}
                        </div>
                        <div className="desc">
                            When you blacklist a package version, you can no longer install it <br />
                            on any devices. It will also appear in the <strong>Impact analysis tab</strong>, <br />
                            showing which devices currently have it installed.
                        </div>
                        {packagesStore.affectedDevicesCount.affected_device_count ?
                            <div className="warning">
                                Warning: the package version you are about to <br />
                                blacklist is queued for installation on {packagesStore.affectedDevicesCount.affected_device_count} devices. <br /> 
                                These updates will be cancelled automatically.
                            </div>
                        : 
                            null
                        }
                    </span>
                : 
                    null
                }

                <div className="row">
                    <div className="col-xs-12">
                        {packagesStore.packagesOneBlacklistedFetchAsync.isFetching ?
                            <Loader 
                                className="dark"
                            />
                        : 
                            <span>
                                <FormTextarea 
                                    name="comment"
                                    defaultValue={!_.isEmpty(packagesStore.blacklistedPackage) ? packagesStore.blacklistedPackage.comment : ''}
                                    label="Comment"
                                    id="blacklist-comment"
                                    onValid={this.enableButton.bind(this)}
                                    onInvalid={this.disableButton.bind(this)}
                                    rows={5}
                                />
                                {blacklistAction.mode === 'edit' ?
                                    <div className="subactions">
                                        <a href="#" className="add-button" onClick={this.removeFromBlacklist}>
                                            Remove from Blacklist
                                        </a>
                                    </div>
                                : 
                                    null
                                }
                            </span>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="body-actions">
                            <a href="#"
                                onClick={hide}
                                className="link-cancel">
                                Cancel
                            </a>
                            <button 
                                className="btn-primary"
                                disabled={
                                    this.submitButtonDisabled || packagesStore.packagesBlacklistAsync.isFetching ||
                                    packagesStore.packagesUpdateBlacklistedAsync.isFetching || packagesStore.packagesRemoveFromBlacklistAsync.isFetching
                                }>
                                {blacklistAction.mode === "edit" ? 
                                    "Save Comment"
                                : 
                                    "Confirm"
                                }
                            </button>
                        </div>
                    </div>
                </div>                
            </Form>
        );
        return (
            <Modal 
                title={title}
                content={content}
                shown={shown}
                className="blacklist-modal"
            />
        );
    }
}

BlacklistModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    blacklistAction: PropTypes.object.isRequired,
    packagesStore: PropTypes.object.isRequired
}

export default BlacklistModal;