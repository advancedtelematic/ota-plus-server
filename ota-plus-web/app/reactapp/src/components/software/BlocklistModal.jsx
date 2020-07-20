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
class BlocklistModal extends Component {
  @observable submitButtonDisabled = true;

  static propTypes = {
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    blocklistAction: PropTypes.shape({}).isRequired,
    stores: PropTypes.shape({}),
    t: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { stores, hide } = this.props;
    const { softwareStore } = stores;
    this.blocklistHandler = AsyncStatusCallbackHandler(softwareStore, 'packagesBlocklistAsync', hide);
    this.updateBlocklistedPackageHandler = AsyncStatusCallbackHandler(
      softwareStore, 'packagesUpdateBlocklistedAsync', hide
    );
    this.removePackageFromBlocklistHandler = AsyncStatusCallbackHandler(
      softwareStore, 'packagesRemoveFromBlocklistAsync', hide
    );
  }

  componentWillReceiveProps(nextProps) {
    const { stores, blocklistAction } = this.props;
    const { softwareStore } = stores;
    const { blocklistAction: newBlocklistAction } = nextProps;
    if (
      newBlocklistAction.name
      && newBlocklistAction.version
      && (newBlocklistAction.name !== blocklistAction.name || newBlocklistAction.version !== blocklistAction.version)
    ) {
      const data = {
        name: newBlocklistAction.name,
        version: newBlocklistAction.version,
      };
      if (newBlocklistAction.mode === 'edit') {
        softwareStore.fetchBlocklist();
        softwareStore.fetchBlocklistedPackage(data);
      }
    }
  }

  componentWillUnmount() {
    this.blocklistHandler();
    this.updateBlocklistedPackageHandler();
    this.removePackageFromBlocklistHandler();
  }

  enableButton = () => {
    this.submitButtonDisabled = false;
  };

  disableButton = () => {
    this.submitButtonDisabled = true;
  };

  submitForm = (e) => {
    const { stores, blocklistAction } = this.props;
    const { softwareStore } = stores;
    if (e) e.preventDefault();
    const formData = serialize(document.querySelector('#blocklist-form'), { hash: true });
    const data = {
      packageId: {
        name: blocklistAction.name,
        version: blocklistAction.version,
      },
      comment: formData.comment,
    };
    if (blocklistAction.mode === 'edit') {
      softwareStore.updateBlocklistedPackage(data);
    } else {
      softwareStore.blocklistPackage(data);
    }
  };

  removeFromBlocklist = (e) => {
    if (e) e.preventDefault();
    const { stores, blocklistAction } = this.props;
    const { softwareStore } = stores;
    const data = {
      name: blocklistAction.name,
      version: blocklistAction.version,
    };
    softwareStore.removePackageFromBlocklist(data);
  };

  render() {
    const { stores, shown, hide, blocklistAction, t } = this.props;
    const { softwareStore } = stores;
    const { packagesUpdateBlocklistedAsync, packagesRemoveFromBlocklistAsync, packagesBlocklistAsync } = softwareStore;
    const content = (
      <OTAForm onSubmit={this.submitForm} id="blocklist-form">
        {blocklistAction.mode === 'edit' ? (
          <div>
            <AsyncResponse
              handledStatus="error"
              action={packagesUpdateBlocklistedAsync}
              errorMsg={packagesUpdateBlocklistedAsync.data && packagesUpdateBlocklistedAsync.data.description}
            />
            <AsyncResponse
              handledStatus="error"
              action={packagesRemoveFromBlocklistAsync}
              errorMsg={packagesRemoveFromBlocklistAsync.data && packagesRemoveFromBlocklistAsync.data.description}
            />
          </div>
        ) : (
          <AsyncResponse
            handledStatus="error"
            action={packagesBlocklistAsync}
            errorMsg={packagesBlocklistAsync.data && packagesBlocklistAsync.data.description}
          />
        )}
        {blocklistAction.mode === 'add' && (
          <div>
            <div className="top-text">
              <Trans>
                {t('software.blocklist_modal.top_text')}
              </Trans>
            </div>
            <div className="bottom-text">
              <Trans>
                {t('software.blocklist_modal.bottom_text')}
              </Trans>
            </div>
          </div>
        )}
        <div className="row">
          <div className="col-xs-12">
            {softwareStore.packagesOneBlocklistedFetchAsync.isFetching ? (
              <Loader className="dark" />
            ) : (
              <span>
                <FormTextarea
                  name="comment"
                  defaultValue={
                    !_.isEmpty(softwareStore.blocklistedPackage) ? softwareStore.blocklistedPackage.comment : ''
                  }
                  label="Comment"
                  id="blocklist-comment"
                  onValid={this.enableButton}
                  onInvalid={this.disableButton}
                  rows={5}
                />
                {blocklistAction.mode === 'edit' ? (
                  <div className="subactions">
                    <a className="add-button" onClick={this.removeFromBlocklist}>
                      {t('software.blocklist_modal.remove')}
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
                  || packagesBlocklistAsync.isFetching
                  || packagesUpdateBlocklistedAsync.isFetching
                  || packagesRemoveFromBlocklistAsync.isFetching
                }
              >
                {blocklistAction.mode === 'edit'
                  ? t('software.blocklist_modal.save_comment')
                  : t('software.blocklist_modal.confirm')
                }
              </Button>
            </div>
          </div>
        </div>
      </OTAForm>
    );
    return (
      <OTAModal
        title={blocklistAction.mode === 'edit'
          ? t('software.blocklist_modal.edit_title')
          : t('software.blocklist-modal.title')
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
        className="blocklist-modal"
      />
    );
  }
}

export default withTranslation()(BlocklistModal);
