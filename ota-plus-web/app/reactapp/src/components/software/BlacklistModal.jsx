/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Button } from 'antd';
import serialize from 'form-serialize';
import _ from 'lodash';
import { withTranslation, Trans } from 'react-i18next';
import { AsyncStatusCallbackHandler } from '../../utils';
import { OTAModal, AsyncResponse, Loader, FormTextarea, OTAForm } from '../../partials';
import { assets } from '../../config';

@inject('stores')
@observer
class BlacklistModal extends Component {
  @observable submitButtonDisabled = true;

  static propTypes = {
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    blacklistAction: PropTypes.shape({}).isRequired,
    stores: PropTypes.shape({}),
    t: PropTypes.func.isRequired
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
    const { stores, shown, hide, blacklistAction, t } = this.props;
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
              <Trans>
                {t('software.blacklist_modal.top_text')}
              </Trans>
            </div>
            <div className="bottom-text">
              <Trans>
                {t('software.blacklist_modal.bottom_text')}
              </Trans>
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
                      {t('software.blacklist_modal.remove')}
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
              <Button
                htmlType="submit"
                type="button"
                className="btn-primary"
                disabled={
                  this.submitButtonDisabled
                  || packagesBlacklistAsync.isFetching
                  || packagesUpdateBlacklistedAsync.isFetching
                  || packagesRemoveFromBlacklistAsync.isFetching
                }
              >
                {blacklistAction.mode === 'edit'
                  ? t('software.blacklist_modal.save_comment')
                  : t('software.blacklist_modal.confirm')
                }
              </Button>
            </div>
          </div>
        </div>
      </OTAForm>
    );
    return (
      <OTAModal
        title={blacklistAction.mode === 'edit'
          ? t('software.blacklist_modal.edit_title')
          : t('software.blacklist_modal.title')
        }
        topActions={(
          <div className="top-actions flex-end">
            <div className="modal-close" onClick={hide}>
              <img src={assets.DEFAULT_CLOSE_ICON} alt="Icon" />
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

export default withTranslation()(BlacklistModal);
