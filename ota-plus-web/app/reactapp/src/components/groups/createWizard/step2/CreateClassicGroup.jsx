/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Row, Col } from 'antd';
import { withTranslation } from 'react-i18next';

import { AsyncResponse, OTAForm, FormInput } from '../../../../partials';
import {
  GROUP_DATA_TYPE_FILE,
  GROUP_DATA_TYPE_NAME,
  GROUP_INPUT_FILE_ACCEPT_FILTER
} from '../../../../constants/groupConstants';

@inject('stores')
@observer
class CreateClassicGroup extends Component {
  static propTypes = {
    onStep2DataSelect: PropTypes.func,
    stores: PropTypes.shape({}),
    t: PropTypes.func.isRequired
  };

  handleImportFile = (event) => {
    const { files } = event.target;
    if (files.length !== 1) {
      return;
    }
    const file = files[0];
    // reset value for target - enables selecting the same file one more time on Chrome browser
    event.target.value = ''; // eslint-disable-line no-param-reassign
    const { onStep2DataSelect } = this.props;
    onStep2DataSelect(GROUP_DATA_TYPE_FILE, file);
  };

  render() {
    const { onStep2DataSelect, stores, t } = this.props;
    const { groupsStore } = stores;
    return (
      <OTAForm id="classic-group-create-form">
        <AsyncResponse
          handledStatus="error"
          action={groupsStore.groupsCreateAsync}
          errorMsg={groupsStore.groupsCreateAsync.data ? groupsStore.groupsCreateAsync.data.description : null}
        />
        <Row className="row">
          <Col span={20}>
            <div className="group-name-input">
              <FormInput
                name="groupName"
                className="input-wrapper"
                id="classic-group-name"
                isEditable={!groupsStore.groupsCreateAsync.isFetching}
                title={t('groups.creating.title')}
                label={t('groups.creating.title')}
                placeholder={t('groups.creating.placeholder')}
                statusIconShown
                onChange={(event) => {
                  onStep2DataSelect(GROUP_DATA_TYPE_NAME, event.target.value);
                }}
              />
            </div>
            <div className="file-input-container">
              <div className="file-input-description">
                {t('groups.creating.file_uploading.description')}
              </div>
              <div className="file-input-button">
                {t('groups.creating.file_uploading.button_title')}
              </div>
              <input
                type="file"
                accept={GROUP_INPUT_FILE_ACCEPT_FILTER}
                onChange={this.handleImportFile}
              />

            </div>
          </Col>
        </Row>
      </OTAForm>
    );
  }
}

CreateClassicGroup.propTypes = {
  stores: PropTypes.shape({}),
};

export default withTranslation()(CreateClassicGroup);
