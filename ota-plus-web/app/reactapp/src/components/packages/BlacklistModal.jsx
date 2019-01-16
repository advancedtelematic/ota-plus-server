/** @format */

import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Modal, AsyncResponse, Loader, FormTextarea, Form } from '../../partials';
import { AsyncStatusCallback, AsyncStatusCallbackHandler } from '../../utils';
import { FormsyText } from 'formsy-material-ui/lib';
import { FlatButton } from 'material-ui';
import serialize from 'form-serialize';
import _ from 'underscore';

@inject('stores')
@observer
class BlacklistModal extends Component {
  @observable submitButtonDisabled = true;

  constructor(props) {
    super(props);
    this.removeFromBlacklist = this.removeFromBlacklist.bind(this);
  }
  componentDidMount() {
    const { packagesStore } = this.props.stores;
    this.blacklistHandler = AsyncStatusCallbackHandler(packagesStore, 'packagesBlacklistAsync', this.props.hide);
    this.updateBlacklistedPackageHandler = AsyncStatusCallbackHandler(packagesStore, 'packagesUpdateBlacklistedAsync', this.props.hide);
    this.removePackageFromBlacklistHandler = AsyncStatusCallbackHandler(packagesStore, 'packagesRemoveFromBlacklistAsync', this.props.hide);
  }
  componentWillReceiveProps(nextProps) {
    const { packagesStore } = this.props.stores;
    if (
      nextProps.blacklistAction.name &&
      nextProps.blacklistAction.version &&
      (nextProps.blacklistAction.name !== this.props.blacklistAction.name || nextProps.blacklistAction.version !== this.props.blacklistAction.version)
    ) {
      const data = {
        name: nextProps.blacklistAction.name,
        version: nextProps.blacklistAction.version,
      };
      if (nextProps.blacklistAction.mode === 'edit') {
        packagesStore.fetchBlacklist();
        packagesStore.fetchBlacklistedPackage(data);
      } else {
        packagesStore.fetchAffectedDevicesCount(data);
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
    const { packagesStore } = this.props.stores;
    if (e) e.preventDefault();
    const formData = serialize(document.querySelector('#blacklist-form'), { hash: true });
    const data = {
      packageId: {
        name: this.props.blacklistAction.name,
        version: this.props.blacklistAction.version,
      },
      comment: formData.comment,
    };
    if (this.props.blacklistAction.mode === 'edit') {
      packagesStore.updateBlacklistedPackage(data);
    } else {
      packagesStore.blacklistPackage(data);
    }
  }
  removeFromBlacklist(e) {
    if (e) e.preventDefault();
    const { packagesStore } = this.props.stores;
    const data = {
      name: this.props.blacklistAction.name,
      version: this.props.blacklistAction.version,
    };
    packagesStore.removePackageFromBlacklist(data);
  }
  render() {
    const { shown, hide, blacklistAction } = this.props;
    const { packagesStore } = this.props.stores;
    const content = (
      <Form onSubmit={this.submitForm.bind(this)} id='blacklist-form'>
        {blacklistAction.mode === 'edit' ? (
          <span>
            <AsyncResponse
              handledStatus='error'
              action={packagesStore.packagesUpdateBlacklistedAsync}
              errorMsg={packagesStore.packagesUpdateBlacklistedAsync.data ? packagesStore.packagesUpdateBlacklistedAsync.data.description : null}
            />
            <AsyncResponse
              handledStatus='error'
              action={packagesStore.packagesRemoveFromBlacklistAsync}
              errorMsg={packagesStore.packagesRemoveFromBlacklistAsync.data ? packagesStore.packagesRemoveFromBlacklistAsync.data.description : null}
            />
          </span>
        ) : (
          <AsyncResponse
            handledStatus='error'
            action={packagesStore.packagesBlacklistAsync}
            errorMsg={packagesStore.packagesBlacklistAsync.data ? packagesStore.packagesBlacklistAsync.data.description : null}
          />
        )}
        {blacklistAction.mode === 'add' ? (
          <span>
            <div className='top-text'>
              With HERE OTA Connect, you can <strong>blacklist</strong> problem packages, ensuring they won’t get installed on any of your devices.
            </div>
            <div className='bottom-text'>
              On the <strong>Impact analysis tab</strong>, you can view which of your devices already have the blacklisted version of the package installed, letting you proactivly troubleshoot and
              update those devices to a fixed version, or roll them back to an older version.
            </div>
          </span>
        ) : null}

        <div className='row'>
          <div className='col-xs-12'>
            {packagesStore.packagesOneBlacklistedFetchAsync.isFetching ? (
              <Loader className='dark' />
            ) : (
              <span>
                <FormTextarea
                  name='comment'
                  defaultValue={!_.isEmpty(packagesStore.blacklistedPackage) ? packagesStore.blacklistedPackage.comment : ''}
                  label='Comment'
                  id='blacklist-comment'
                  onValid={this.enableButton.bind(this)}
                  onInvalid={this.disableButton.bind(this)}
                  rows={5}
                />
                {blacklistAction.mode === 'edit' ? (
                  <div className='subactions'>
                    <a href='#' className='add-button' onClick={this.removeFromBlacklist}>
                      Remove from Blacklist
                    </a>
                  </div>
                ) : null}
              </span>
            )}
          </div>
        </div>
        <div className='row'>
          <div className='col-xs-12'>
            <div className='body-actions'>
              <button
                className='btn-primary'
                disabled={
                  this.submitButtonDisabled ||
                  packagesStore.packagesBlacklistAsync.isFetching ||
                  packagesStore.packagesUpdateBlacklistedAsync.isFetching ||
                  packagesStore.packagesRemoveFromBlacklistAsync.isFetching
                }
              >
                {blacklistAction.mode === 'edit' ? 'Save Comment' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      </Form>
    );
    return (
      <Modal
        title={blacklistAction.mode === 'edit' ? 'Edit blacklisted package' : 'Blacklist'}
        topActions={
          <div className='top-actions flex-end'>
            <div className='modal-close' onClick={hide}>
              <img src='/assets/img/icons/close.svg' alt='Icon' />
            </div>
          </div>
        }
        content={content}
        shown={shown}
        className='blacklist-modal'
      />
    );
  }
}

BlacklistModal.propTypes = {
  shown: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,
  blacklistAction: PropTypes.object.isRequired,
  stores: PropTypes.object,
};

export default BlacklistModal;
