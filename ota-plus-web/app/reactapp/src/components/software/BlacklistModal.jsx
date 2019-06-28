/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import serialize from 'form-serialize';
import _ from 'lodash';

import { AsyncStatusCallbackHandler } from '../../utils';
import { OTAModal, AsyncResponse, Loader, FormTextarea, OTAForm } from '../../partials';

@inject('stores')
@observer
class BlacklistModal extends Component {
  @observable submitButtonDisabled = true;

  static propTypes = {
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    blacklistAction: PropTypes.shape({}).isRequired,
    stores: PropTypes.shape({}),
  };

  componentDidMount() {
    const { stores, hide } = this.props;
    const { softwareStore } = stores;
    this.blacklistHandler = AsyncStatusCallbackHandler(softwareStore, 'packagesBlacklistAsync', hide);
    this.updateBlacklistedPackageHandler = AsyncStatusCallbackHandler(
      softwareStore, 'packagesUpdateBlacklistedAsync', hide
    );
    this.removePackageFromBlacklistHandler = AsyncStatusCallbackHandler(
      softwareStore, 'packagesRemoveFromBlacklistAsync', hide
    );
  }

  componentWillReceiveProps(nextProps) {
    const { stores, blacklistAction } = this.props;
    const { softwareStore } = stores;
    const { blacklistAction: newBlacklistAction } = nextProps;
    if (
      newBlacklistAction.name
      && newBlacklistAction.version
      && (newBlacklistAction.name !== blacklistAction.name || newBlacklistAction.version !== blacklistAction.version)
    ) {
      const data = {
        name: newBlacklistAction.name,
        version: newBlacklistAction.version,
      };
      if (newBlacklistAction.mode === 'edit') {
        softwareStore.fetchBlacklist();
        softwareStore.fetchBlacklistedPackage(data);
      } else {
        softwareStore.fetchAffectedDevicesCount(data);
      }
    }
  }

  componentWillUnmount() {
    this.blacklistHandler();
    this.updateBlacklistedPackageHandler();
    this.removePackageFromBlacklistHandler();
  }

  enableButton = () => {
    this.submitButtonDisabled = false;
  };

  disableButton = () => {
    this.submitButtonDisabled = true;
  };

  submitForm = (e) => {
    const { stores, blacklistAction } = this.props;
    const { softwareStore } = stores;
    if (e) e.preventDefault();
    const formData = serialize(document.querySelector('#blacklist-form'), { hash: true });
    const data = {
      packageId: {
        name: blacklistAction.name,
        version: blacklistAction.version,
      },
      comment: formData.comment,
    };
    if (blacklistAction.mode === 'edit') {
      softwareStore.updateBlacklistedPackage(data);
    } else {
      softwareStore.blacklistPackage(data);
    }
  };

  removeFromBlacklist = (e) => {
    if (e) e.preventDefault();
    const { stores, blacklistAction } = this.props;
    const { softwareStore } = stores;
    const data = {
      name: blacklistAction.name,
      version: blacklistAction.version,
    };
    softwareStore.removePackageFromBlacklist(data);
  };

  render() {
    const { stores, shown, hide, blacklistAction } = this.props;
    const { softwareStore } = stores;
    const { packagesUpdateBlacklistedAsync, packagesRemoveFromBlacklistAsync, packagesBlacklistAsync } = softwareStore;
    const content = (
      <OTAForm onSubmit={this.submitForm} id="blacklist-form">
        {blacklistAction.mode === 'edit' ? (
          <div>
            <AsyncResponse
              handledStatus="error"
              action={packagesUpdateBlacklistedAsync}
              errorMsg={packagesUpdateBlacklistedAsync.data && packagesUpdateBlacklistedAsync.data.description}
            />
            <AsyncResponse
              handledStatus="error"
              action={packagesRemoveFromBlacklistAsync}
              errorMsg={packagesRemoveFromBlacklistAsync.data && packagesRemoveFromBlacklistAsync.data.description}
            />
          </div>
        ) : (
          <AsyncResponse
            handledStatus="error"
            action={packagesBlacklistAsync}
            errorMsg={packagesBlacklistAsync.data && packagesBlacklistAsync.data.description}
          />
        )}
        {blacklistAction.mode === 'add' && (
          <div>
            <div className="top-text">
              With HERE OTA Connect, you can
              {' '}
              <strong>blacklist</strong>
              {' '}
              problem packages, ensuring they won’t get installed on any of your devices.
            </div>
            <div className="bottom-text">
              On the
              {' '}
              <strong>Impact analysis tab</strong>
              , you can view which of your devices already have the blacklisted version of the package installed
              , letting you proactivly troubleshoot and
              update those devices to a fixed version, or roll them back to an older version.
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-xs-12">
            {softwareStore.packagesOneBlacklistedFetchAsync.isFetching ? (
              <Loader className="dark" />
            ) : (
              <span>
                <FormTextarea
                  name="comment"
                  defaultValue={
                    !_.isEmpty(softwareStore.blacklistedPackage) ? softwareStore.blacklistedPackage.comment : ''
                  }
                  label="Comment"
                  id="blacklist-comment"
                  onValid={this.enableButton}
                  onInvalid={this.disableButton}
                  rows={5}
                />
                {blacklistAction.mode === 'edit' ? (
                  <div className="subactions">
                    <a className="add-button" onClick={this.removeFromBlacklist}>
                      Remove from Blacklist
                    </a>
                  </div>
                ) : null}
              </span>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <div className="body-actions">
              <button
                type="button"
                className="btn-primary"
                disabled={
                  this.submitButtonDisabled
                  || packagesBlacklistAsync.isFetching
                  || packagesUpdateBlacklistedAsync.isFetching
                  || packagesRemoveFromBlacklistAsync.isFetching
                }
              >
                {blacklistAction.mode === 'edit' ? 'Save Comment' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      </OTAForm>
    );
    return (
      <OTAModal
        title={blacklistAction.mode === 'edit' ? 'Edit blacklisted package' : 'Blacklist'}
        topActions={(
          <div className="top-actions flex-end">
            <div className="modal-close" onClick={hide}>
              <img src="/assets/img/icons/close.svg" alt="Icon" />
            </div>
          </div>
        )}
        content={content}
        visible={shown}
        className="blacklist-modal"
      />
    );
  }
}

export default BlacklistModal;
