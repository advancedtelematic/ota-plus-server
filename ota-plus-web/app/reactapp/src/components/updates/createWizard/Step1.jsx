/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { Form } from 'formsy-antd';
import _ from 'lodash';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';

import { FormInput, FormTextarea, Loader } from '../../../partials';
import { SelectableListItem } from '../../../partials/lists';
import { contains } from '../../../utils/Helpers';
import { DATA_TYPE } from '../../../constants';

@inject('stores')
@observer
class Step1 extends Component {
  componentWillMount() {
    const { stores } = this.props;
    const { hardwareStore } = stores;
    hardwareStore.fetchHardwareIds();
  }

  render() {
    const { wizardData, onStep1DataSelect, stores, showDetails, t } = this.props;
    const { hardwareStore } = stores;

    const hardwareList = [];
    _.each(hardwareStore.hardwareIds, (id) => {
      hardwareList.push({
        type: DATA_TYPE.HARDWARE,
        name: id,
      });
    });

    return (
      <Form id="update-create-form">
        {!showDetails && (
          <>
            <Row>{t('updates.creating.description1')}</Row>
            <Row className="gutter-bottom">{t('updates.creating.description2')}</Row>
          </>
        )}
        <Row className="row name-container">
          <Col span={12}>
            <FormInput
              label={t('updates.creating.wizard.update_list_name')}
              placeholder={t('updates.creating.wizard.update_list_name_placeholder')}
              name="updateName"
              id="create-new-update-name"
              defaultValue={wizardData.name}
              onChange={(e) => {
                onStep1DataSelect('name', e.target.value);
              }}
            />
          </Col>
          <Col span={12}>
            <FormTextarea
              label={t('updates.creating.wizard.description')}
              placeholder={t('updates.creating.wizard.description_placeholder')}
              rows={5}
              name="updateDescription"
              id="create-new-update-description"
              defaultValue={wizardData.description}
              onChange={(e) => {
                onStep1DataSelect('description', e.target.value);
              }}
            />
          </Col>
        </Row>
        <Row className="row hardware-container">
          <Col span={24}>
            <label className="c-form__label">{t('updates.creating.wizard.select_ecu_types')}</label>
            <div>{t('updates.creating.wizard.select_ecu_types_description')}</div>
            <div className="ids-list">
              {hardwareStore.hardwareIdsFetchAsync.isFetching ? (
                <div className="wrapper-center">
                  <Loader />
                </div>
              ) : (
                _.map(hardwareList, (item) => {
                  const { selectedHardwares } = wizardData;
                  const selected = contains(selectedHardwares, item, DATA_TYPE.HARDWARE);
                  // eslint-disable-next-line no-param-reassign
                  item.type = DATA_TYPE.HARDWARE;
                  return (
                    <SelectableListItem
                      key={item.name}
                      item={item}
                      selected={selected}
                      onChange={(listItem) => {
                        onStep1DataSelect('hardwareId', listItem);
                      }}
                    />
                  );
                })
              )}
            </div>
            {hardwareList.length === 1 && (
              <div className="information-text">{t('updates.creating.wizard.information_step1')}</div>
            )}
          </Col>
        </Row>
      </Form>
    );
  }
}

Step1.propTypes = {
  wizardData: PropTypes.shape({}),
  onStep1DataSelect: PropTypes.func,
  showDetails: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.bool
  ]),
  stores: PropTypes.shape({}),
  t: PropTypes.func.isRequired
};

export default withTranslation()(Step1);
