/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Row, Col } from 'antd';
import { withTranslation } from 'react-i18next';
import moment from 'moment';

import { AsyncResponse, OTAForm, FormInput, OperationCompletedInfo } from '../../../../partials';
import {
  GROUP_DATA_TYPE_FILE,
  GROUP_DATA_TYPE_NAME,
  GROUP_INPUT_FILE_ACCEPT_EXTENSION,
  GROUP_INPUT_FILE_ACCEPT_FILTER,
} from '../../../../constants/groupConstants';

@inject('stores')
@observer
class CreateClassicGroup extends Component {
  static propTypes = {
    onStep2DataSelect: PropTypes.func,
    stores: PropTypes.shape({}),
    t: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    const { t } = props;
    this.state = {
      errorDescription: '',
      fileName: t('groups.creating.file_uploading.file_not_selected')
    };
  }

  handleImportFile = (event) => {
    const { files } = event.target;
    if (files.length !== 1) {
      return false;
    }
    const file = files[0];
    const { name } = file;
    if (!name.endsWith(GROUP_INPUT_FILE_ACCEPT_EXTENSION)) {
      // reset the native input to do not show invalid file selected
      event.target.value = ''; // eslint-disable-line no-param-reassign
      const { stores, t } = this.props;
      const { groupsStore } = stores;
      // clear the async data to reset errors;
      groupsStore.groupsCreateAsync = {};
      this.setState(
        {
          errorDescription: t('groups.creating.file_uploading.warnings.only_extension_file_description'),
          fileName: '',
          fileUploadedAt: undefined
        }
      );
      return false;
    }
    this.setState({ errorDescription: '', fileName: name, fileUploadedAt: moment().format() });
    const { onStep2DataSelect } = this.props;
    onStep2DataSelect(GROUP_DATA_TYPE_FILE, file);
    return true;
  };

  render() {
    const { onStep2DataSelect, stores, t } = this.props;
    const { groupsStore } = stores;
    const { errorDescription, fileName, fileUploadedAt } = this.state;
    return (
      <OTAForm id="classic-group-create-form">
        <AsyncResponse
          handledStatus="error"
          action={groupsStore.groupsCreateAsync}
          errorMsg={groupsStore.groupsCreateAsync.data ? groupsStore.groupsCreateAsync.data.description : null}
        />
        {errorDescription && (<div>{errorDescription}</div>)}
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
              <div className="file-input-button-container">
                <label className="file-input-button" htmlFor="file-input-group">
                  {t('groups.creating.file_uploading.button_title')}
                </label>
                <div className="file-input-filename">{fileName}</div>
              </div>
              <input
                id="file-input-group"
                name="file-input-group"
                type="file"
                accept={GROUP_INPUT_FILE_ACCEPT_FILTER}
                onChange={this.handleImportFile}
              />
            </div>
          </Col>
        </Row>
        <div className="anim-info-container">
          <OperationCompletedInfo
            info={t(
              'groups.creating.file_uploading.file_selected',
              { file_name: fileName }
            )}
            trigger={
              { name: fileName, createdAt: fileUploadedAt }
            }
          />
        </div>
      </OTAForm>
    );
  }
}

CreateClassicGroup.propTypes = {
  stores: PropTypes.shape({}),
};

export default withTranslation()(CreateClassicGroup);
